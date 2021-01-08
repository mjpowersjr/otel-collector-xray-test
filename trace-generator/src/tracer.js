// const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter: CollectorTraceExporterGrpc } = require('@opentelemetry/exporter-collector-grpc');
const { CollectorTraceExporter: CollectorTraceExporterHttp } = require('@opentelemetry/exporter-collector');
const { AWSXRayPropagator } = require('@aws/otel-aws-xray-propagator');
const { AwsXRayIdGenerator } = require('@aws/otel-aws-xray-id-generator');
const { propagation, trace } = require("@opentelemetry/api");

// Use HTTP
const otelCollectorEndpoint = process.env.OTEL_COLLECTOR_HTTP;
const CollectorTraceExporter = CollectorTraceExporterHttp;

// Use GRPC
// const otelCollectorEndpoint = process.env.OTEL_COLLECTOR_GRPC;
// const CollectorTraceExporter = CollectorTraceExporterGrpc;

module.exports = (serviceName) => {
    propagation.setGlobalPropagator(new AWSXRayPropagator());

    const tracerProvider = new NodeTracerProvider({
        idGenerator: new AwsXRayIdGenerator(),
        plugins: {},
        resources: {},
    });

    console.log(`settings up ${CollectorTraceExporter.name}(url: ${otelCollectorEndpoint})`)
    const otlpExporter = new CollectorTraceExporter({
        serviceName,
        url: otelCollectorEndpoint,
        // protocolNode: 2,
        // httpAgentOptions: {
        //     keepAlive: false
        // }
        // logger: console
    });

    tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));
    // tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

    tracerProvider.register();

    return trace.getTracer("sample-instrumentation");
}
