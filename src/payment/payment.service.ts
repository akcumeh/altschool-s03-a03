import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PaymentService {
    private readonly secretKey: string;

    constructor(
        private config: ConfigService,
        private supabase: SupabaseService,
    ) {
        this.secretKey = this.config.getOrThrow('PAYSTACK_SECRET_KEY');
    }

    async initializeTransaction(
        email: string,
        amountNGN: number,
        orderId: string,
    ) {
        const response = await fetch(
            'https://api.paystack.co/transaction/initialize',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    amount: amountNGN * 100, // Paystack amounts are in kobo
                    metadata: { orderId },
                    callback_url: this.config.get('PAYSTACK_CALLBACK_URL'),
                }),
            },
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Paystack error: ${err}`);
        }

        const data = (await response.json()) as {
            data: { authorization_url: string; reference: string };
        };
        return data.data;
    }

    verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
        const hash = crypto
            .createHmac('sha512', this.secretKey)
            .update(rawBody)
            .digest('hex');
        return hash === signature;
    }

    async handleChargeSuccess(orderId: string) {
        const { error } = await this.supabase
            .getClient()
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId);

        if (error)
            throw new Error(`Failed to mark order paid: ${error.message}`);
    }
}
