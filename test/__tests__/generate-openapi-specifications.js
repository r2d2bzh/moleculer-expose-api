import test from 'ava';
import { ServiceBroker } from 'moleculer';

import gateway from './__fixtures__/gateway.js';
import todo from './__fixtures__/todo.js';
import openapi from '../../openapi/openapi.js';

const todoService = todo();
const gatewayService = gateway();

test('whatever', async (t) => {
  t.plan(1);
  const broker = new ServiceBroker({});
  const openapiService = openapi({
    name: 'openapi-service',
    title: 'OpenAPI specifications',
    listAliases: `${gatewayService.name}.listAliases`,
    getLogger: broker.getLogger.bind(broker),
  });

  broker.createService(todoService);
  broker.createService(openapiService);
  broker.createService(gatewayService);
  broker.createService({
    name: 'test',
    events: {
      [`${openapiService.name}.changed`]: async () =>
        t.snapshot(await broker.call(`${openapiService.name}.get-yaml`, { api: todoService.name })),
    },
  });

  await broker.start();
  await broker.waitForServices([gatewayService.name, openapiService.name, todoService.name]);

  await new Promise((resolve) => setTimeout(resolve, 5000));
});
