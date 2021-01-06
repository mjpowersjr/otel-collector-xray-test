const api = require("@opentelemetry/api");
const tracer = require('./tracer')('otel-collector-xray-test');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createChildSpan(props) {
    const span = tracer.startSpan(props.name);
    await sleep(props.wait);
    span.end();
}


async function main() {

    // give collector a chance to spin up...
    console.log(`sleeping...`)
    await sleep(10 * 1000);

    for (let i = 1; i++;) {

        await sleep(10);

        // create new trace context
        api.context.with(api.ROOT_CONTEXT, async () => {

            const rootSpan = tracer.startSpan('rootSpan', {
                parent: null,
                kind: api.SpanKind.SERVER
            });

            // create a few child spans
            await createChildSpan({ name: 'op1', wait: 10 });
            await createChildSpan({ name: 'op2', wait: 20 });
            await createChildSpan({ name: 'op3', wait: 30 });

            rootSpan.end();
        });

        if (i % 10 === 1) {
            console.log(`[${new Date()}] created trace #${i}`);
        }

    }

}

main().catch(console.error);

