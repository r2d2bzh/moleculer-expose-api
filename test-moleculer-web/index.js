import { ServiceBroker } from 'moleculer';
import ApiService from 'moleculer-web';

const broker = new ServiceBroker({});

broker.createService({
  name: 'gateway',
  mixins: [ApiService],
  settings: {
    routes: [
      {
        path: '/',
        autoAliases: true,
      },
    ],
  },
});

broker.createService({
  name: 'test',
  actions: {
    get: {
      rest: {
        method: 'GET',
        path: '/:key3',
      },
      params: {
        key: { type: 'string' },
        key2: { type: 'string' },
        key3: 'string|min:3|max:255',
      },
      handler: () => {
        return 'ok';
      },
    },
  },
});

broker.start();
