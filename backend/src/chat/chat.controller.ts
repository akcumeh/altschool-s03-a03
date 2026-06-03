import { Body, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChatService } from './chat.service';

class ChatMessageDto {
    @IsString()
    @IsNotEmpty()
    deviceId!: string;

    @IsString()
    @IsNotEmpty()
    option!: string;
}

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async sendMessage(@Body() dto: ChatMessageDto) {
        const message = await this.chatService.processMessage(
            dto.deviceId,
            dto.option,
        );
        return { message };
    }

    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-paystack-signature') signature: string,
    ) {
        await this.chatService.handleWebhook(req.rawBody!, signature);
        return { received: true };
    }
}
