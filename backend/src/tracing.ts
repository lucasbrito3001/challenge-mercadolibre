import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: `${process.env.TEMPO_URL}/v1/traces`,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    serviceName: 'backend-meli',
});

function setupTracing() {
    try {
        sdk.start();
        console.log('✅ OpenTelemetry initialized');
    } catch (error) {
        console.error('Error initializing OpenTelemetry:', error);
    }
}

setupTracing();

process.on('SIGTERM', async () => {
    await sdk.shutdown();
    console.log('Tracing terminated');
});
