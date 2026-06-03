import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
    constructor(private supabase: SupabaseService) {}

    async createPendingOrder(sessionId: string) {
        const { data, error } = await this.supabase
            .getClient()
            .from('orders')
            .insert({ session_id: sessionId, status: 'pending' })
            .select()
            .single();

        if (error) throw new Error(`Failed to create order: ${error.message}`);
        return data;
    }

    async getCurrentOrder(sessionId: string) {
        const { data } = await this.supabase
            .getClient()
            .from('orders')
            .select('*, order_items(*, menu_items(*))')
            .eq('session_id', sessionId)
            .eq('status', 'pending')
            .single();

        return data;
    }

    async addItem(orderId: string, menuItemId: string) {
        const { data: existing } = await this.supabase
            .getClient()
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)
            .eq('menu_item_id', menuItemId)
            .single();

        if (existing) {
            const { error } = await this.supabase
                .getClient()
                .from('order_items')
                .update({ quantity: existing.quantity + 1 })
                .eq('id', existing.id);

            if (error)
                throw new Error(`Failed to update item quantity:
                ${error.message}`);
        } else {
            const { error } = await this.supabase
                .getClient()
                .from('order_items')
                .insert({ order_id: orderId, menu_item_id: menuItemId });

            if (error) throw new Error(`Failed to add item: ${error.message}`);
        }
    }

    async cancelOrder(sessionId: string) {
        const order = await this.getCurrentOrder(sessionId);
        if (!order) return null;

        const { error } = await this.supabase
            .getClient()
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', order.id);

        if (error) throw new Error(`Failed to cancel order: ${error.message}`);
        return order;
    }

    async getHistory(sessionId: string) {
        const { data, error } = await this.supabase
            .getClient()
            .from('orders')
            .select('*, order_items(*, menu_items(*))')
            .eq('session_id', sessionId)
            .neq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to fetch history: ${error.message}`);
        return data;
    }

    async markAsPlaced(orderId: string) {
        const { error } = await this.supabase
            .getClient()
            .from('orders')
            .update({ status: 'placed' })
            .eq('id', orderId);

        if (error) throw new Error(`Failed to place order: ${error.message}`);
    }

    formatOrder(order: any): string {
        if (!order?.order_items?.length) return 'Your order is empty.';

        const items = order.order_items
            .map(
                (oi: any) =>
                    `- ${oi.menu_items.name} x${oi.quantity} (NGN ${oi.menu_items.price * oi.quantity})`,
            )
            .join('\n');

        const total = order.order_items.reduce(
            (sum: number, oi: any) => sum + oi.menu_items.price * oi.quantity,
            0,
        );

        return `Current order:\n${items}\n\nTotal: NGN ${total}`;
    }
}
