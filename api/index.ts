import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { Request, Response } from 'express';

const server = express();
let initialized = false;

async function bootstrap() {
    if (initialized) return;
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        { rawBody: true },
    );
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    initialized = true;
}

export default async (req: Request, res: Response) => {
    await bootstrap();
    server(req, res);
};