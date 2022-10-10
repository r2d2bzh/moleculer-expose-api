import { EventEmitter } from 'node:events';
import test from 'ava';
import { ServiceBroker } from 'moleculer';

import gateway from './__fixtures__/gateway.js';
import todo from './__fixtures__/todo.js';
import openapi from '../../open-api/openapi.js';

const todoService = todo();
const gatewayService = gateway();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test.beforeEach(async (t) => {
  t.context.broker = new ServiceBroker({});
  t.context.broker.createService(gatewayService);
  t.context.broker.createService(todoService);
  await t.context.broker.start();
  await t.context.broker.waitForServices([todoService.name]);
});

test.afterEach.always((t) => {
  return t.context.broker.stop();
});

test('whatever', async (t) => {
  // an eventEmitter is needed instead of using directly a Promise
  // because a changed event is also emitted on broker stop
  const testResult = new EventEmitter();
  const testEnd = new Promise((resolve) => testResult.once('testResult', resolve));
  const openapiService = openapi({
    name: 'openapi-service',
    listAliases: `${gatewayService.name}.listAliases`,
  });

  t.context.broker.createService({
    name: 'test',
    events: {
      [`${openapiService.name}.changed`]: async () => {
        try {
          // the local broker registry is updated after the changed event is emitted,
          // wait for a NodeJS event loop cycle
          await wait(0);
          testResult.emit('testResult', await t.context.broker.call(`${openapiService.name}.get-specification`));
        } catch (error) {
          testResult.emit('testResult', error);
        }
      },
    },
  });

  t.context.broker.createService(openapiService);
  t.snapshot(await testEnd);
});
