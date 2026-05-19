import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { SessionModule } from './session/session.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), SupabaseModule, SessionModule, MenuModule, OrdersModule, PaymentModule, ChatModule],
})
export class AppModule { }
