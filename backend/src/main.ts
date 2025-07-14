import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from './http-exception.filter';
import { setupTracing } from './tracing';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    const logger = app.get(Logger);
    app.useLogger(logger);

    const config = new DocumentBuilder()
        .setTitle('Meli Challenge API')
        .setDescription(
            'API of Meli Challenge for managing product information',
        )
        .setVersion('1.0')
        .addServer('/api/v1')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.setGlobalPrefix('api/v1', {
        exclude: [
            { path: 'healthz', method: RequestMethod.GET },
            { path: '', method: RequestMethod.GET },
        ],
    });

    setupTracing(logger);
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    app.enableCors();

    const server = await app.listen(3000);

    const shutdown = async (signal: string) => {
        logger.warn(`Recebido sinal ${signal}. Encerrando...`);

        await app.close();

        server.close(() => {
            logger.log(
                'Conexões HTTP finalizadas. Aplicação encerrada com sucesso.',
            );
            process.exit(0);
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}
bootstrap();
