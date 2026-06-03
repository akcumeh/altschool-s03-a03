import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MenuService {
    constructor(private supabase: SupabaseService) {}

    async getAll() {
        const { data, error } = await this.supabase
            .getClient()
            .from('menu_items')
            .select('*')
            .order('name');

        if (error) throw new Error(`Failed to fetch menu: ${error.message}`);
        return data;
    }

    formatMenu(items: any[]): string {
        const list = items
            .map(
                (item, i) =>
                    `${i + 1}. ${item.name} - NGN ${item.price}\n   ${item.description}`,
            )
            .join('\n\n');
        return `Here's our menu:\n\n${list}\n\nReply with the number to add it to your order.`;
    }
}
