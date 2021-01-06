// const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require('@opentelemetry/node');
// const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { AWSXRayPropagator } = require('@aws/otel-aws-xray-propagator');
const { AwsXRayIdGenerator } = require('@aws/otel-aws-xray-id-generator');
const { propagation, trace } = require("@opentelemetry/api");

const otelCollectorEndpoint = process.env.OTEL_COLLECTOR

module.exports = (serviceName) => {
    propagation.setGlobalPropagator(new AWSXRayPropagator());

    const tracerProvider = new NodeTracerProvider({
        idGenerator: new AwsXRayIdGenerator(),
        plugins: {},
        resources: {},
    });

    console.log(`settings up otlpExporter(url: ${otelCollectorEndpoint})`)
    const otlpExporter = new CollectorTraceExporter({
        serviceName,
        url: otelCollectorEndpoint,
        protocolNode: 2,
        // logger: console
    });
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));
    // tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

    tracerProvider.register();

    return trace.getTracer("sample-instrumentation");
}
