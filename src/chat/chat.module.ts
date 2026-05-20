import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MenuModule } from '../menu/menu.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [SessionModule, MenuModule, OrdersModule, PaymentModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
