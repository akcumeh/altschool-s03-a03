import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { SessionModule } from './session/session.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SupabaseModule,
        SessionModule,
        MenuModule,
        OrdersModule,
        PaymentModule,
        ChatModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
