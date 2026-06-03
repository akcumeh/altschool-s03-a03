import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('health')
    health() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }

    @Get()
    paymentCallback(@Query('reference') reference: string) {
        if (reference) {
            return {
                message: 'Payment successful! Your order has been confirmed. Return to the chatbot to place another order.',
                reference,
            };
        }
        return { message: 'Kay\'s Kitchen Chatbot API is running.' };
    }
}
