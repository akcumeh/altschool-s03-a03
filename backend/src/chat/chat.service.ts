import { Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { MenuService } from '../menu/menu.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentService } from '../payment/payment.service';
import { SessionService } from '../session/session.service';

const MAIN_MENU =
    'What would you like to do?\n\n1 - Place an order\n99 - Checkout\n98 - Order history\n97 - Current order\n0 - Cancel order';

@Injectable()
export class ChatService {
    constructor(
        private sessions: SessionService,
        private menu: MenuService,
        private orders: OrdersService,
        private payment: PaymentService,
    ) {}

    async processMessage(deviceId: string, option: string): Promise<string> {
        const session = await this.sessions.getOrCreate(deviceId);
        const trimmed = option.trim();

        if (session.state === 'awaiting_email') {
            return this.handleEmail(session, trimmed);
        }

        // These four always work regardless of state — they are escape commands
        switch (trimmed) {
            case '99':
                return this.handleCheckout(session);
            case '98':
                return this.handleHistory(session);
            case '97':
                return this.handleCurrentOrder(session);
            case '0':
                return this.handleCancel(session);
        }

        // When ordering, every number (including 1) is a menu item selection
        if (session.state === 'ordering') {
            return this.handleMenuSelection(session, trimmed);
        }

        // Only at idle does 1 mean "show me the menu"
        if (trimmed === '1') {
            return this.handlePlaceOrder(session);
        }

        return `Invalid option.\n\n${MAIN_MENU}`;
    }

    private async handlePlaceOrder(session: any): Promise<string> {
        const items = await this.menu.getAll();
        await this.sessions.updateState(session.id, 'ordering');
        return this.menu.formatMenu(items);
    }

    private async handleMenuSelection(
        session: any,
        option: string,
    ): Promise<string> {
        const items = await this.menu.getAll();
        const index = parseInt(option, 10) - 1;

        if (isNaN(index) || index < 0 || index >= items.length) {
            return `Invalid selection.\n\n${this.menu.formatMenu(items)}`;
        }

        const selectedItem = items[index];
        let order = await this.orders.getCurrentOrder(session.id);
        if (!order) order = await this.orders.createPendingOrder(session.id);

        await this.orders.addItem(order.id, selectedItem.id);

        return `Added ${selectedItem.name} to your order.\n\nSend another number to add more, or:\n99 - Checkout\n97 - View current order\n0 - Cancel`;
    }

    private async handleCheckout(session: any): Promise<string> {
        const order = await this.orders.getCurrentOrder(session.id);
        if (!order?.order_items?.length) {
            return `No order to place.\n\nSend 1 to start a new order.`;
        }

        await this.sessions.updateState(session.id, 'awaiting_email');
        const summary = this.orders.formatOrder(order);
        return `${summary}\n\nTo complete payment, please reply with your email address.`;
    }

    private async handleEmail(session: any, email: string): Promise<string> {
        if (!isEmail(email)) {
            return `That doesn't look like a valid email. Please reply with your email address.`;
        }

        const order = await this.orders.getCurrentOrder(session.id);
        if (!order?.order_items?.length) {
            await this.sessions.updateState(session.id, 'idle');
            return `Your order is empty. Send 1 to start a new order.`;
        }

        const total = order.order_items.reduce(
            (sum: number, oi: any) => sum + oi.menu_items.price * oi.quantity,
            0,
        );

        const { authorization_url } = await this.payment.initializeTransaction(
            email,
            total,
            order.id,
        );

        await this.orders.markAsPlaced(order.id);
        await this.sessions.updateState(session.id, 'idle');

        return `Order placed! Complete your payment here:\n${authorization_url}\n\nSend 1 to start a new order after payment.`;
    }

    private async handleHistory(session: any): Promise<string> {
        const history = await this.orders.getHistory(session.id);
        if (!history?.length)
            return `You have no past orders.\n\nSend 1 to place one.`;

        const lines = history.map((o: any, i: number) => {
            const total = o.order_items.reduce(
                (sum: number, oi: any) =>
                    sum + oi.menu_items.price * oi.quantity,
                0,
            );
            return `${i + 1}. ${o.status.toUpperCase()} - NGN ${total} [${new Date(o.created_at).toLocaleDateString()}]`;
        });

        return `Order history:\n\n${lines.join('\n')}\n\nSend 1 to place a new order.`;
    }

    private async handleCurrentOrder(session: any): Promise<string> {
        const order = await this.orders.getCurrentOrder(session.id);
        if (!order) return `No active order.\n\nSend 1 to start one.`;
        return this.orders.formatOrder(order);
    }

    private async handleCancel(session: any): Promise<string> {
        const cancelled = await this.orders.cancelOrder(session.id);
        await this.sessions.updateState(session.id, 'idle');
        if (!cancelled)
            return `No active order to cancel.\n\nSend 1 to start a new order.`;
        return `Order cancelled.\n\nSend 1 to place a new order.`;
    }

    async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
        const isValid = this.payment.verifyWebhookSignature(rawBody, signature);
        if (!isValid) throw new Error('Invalid webhook signature');

        const event = JSON.parse(rawBody.toString()) as {
            event: string;
            data: { metadata: { orderId: string } };
        };

        if (event.event === 'charge.success') {
            const { orderId } = event.data.metadata;
            await this.payment.handleChargeSuccess(orderId);
        }
    }
}
