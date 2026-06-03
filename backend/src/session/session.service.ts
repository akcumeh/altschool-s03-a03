import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SessionService {
    constructor(private supabase: SupabaseService) {}

    async getOrCreate(deviceId: string) {
        const client = this.supabase.getClient();

        const { data: existing } = await client
            .from('sessions')
            .select('*')
            .eq('device_id', deviceId)
            .single();

        if (existing) return existing;

        const { data: created, error } = await client
            .from('sessions')
            .insert({ device_id: deviceId })
            .select()
            .single();

        if (error)
            throw new Error(`Failed to create session: ${error.message}`);
        return created;
    }

    async updateState(
        sessionId: string,
        state: 'idle' | 'ordering' | 'awaiting_email',
    ) {
        const { error } = await this.supabase
            .getClient()
            .from('sessions')
            .update({ state })
            .eq('id', sessionId);

        if (error)
            throw new Error(`Failed to update session state: ${error.message}`);
    }
}
