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
    ) {}

    async processMessage(deviceId: string, option: string): Promise<string> {
        const session = await this.sessions.getOrCreate(deviceId);

        if (session.state === 'awaiting_email') {
            return this.handleEmail(session, option.trim());
        }

        switch (option.trim()) {
            case '1':
                return this.handlePlaceOrder(session);
            case '99':
                return this.handleCheckout(session);
            case '98':
                return this.handleHistory(session);
            case '97':
                return this.handleCurrentOrder(session);
            case '0':
                return this.handleCancel(session);
        }

        if (session.state === 'ordering') {
            return this.handleMenuSelection(session, option.trim());
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

}
