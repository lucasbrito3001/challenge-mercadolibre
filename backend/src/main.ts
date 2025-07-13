import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
    await app.listen(3000);
}
bootstrap();
