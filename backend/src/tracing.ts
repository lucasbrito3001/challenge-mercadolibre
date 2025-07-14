import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Logger } from 'nestjs-pino';

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: `${process.env.TEMPO_URL}/v1/traces`,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    serviceName: 'backend-meli',
});

export function setupTracing(logger: Logger) {
    try {
        sdk.start();
        logger.log('OpenTelemetry initialized');
    } catch (error) {
        logger.error('Error initializing OpenTelemetry:', error);
    }

    process.on('SIGTERM', async () => {
        await sdk.shutdown();
        logger.log('Tracing terminated');
    });
}
