import { ServiceBroker } from 'moleculer';
import ApiService from 'moleculer-web';
import todo from './todo.js';
import image from './image.js';

const broker = new ServiceBroker({
  transporter: {
    type: 'NATS',
    options: {
      servers: 'nats:4222',
    },
  },
});

broker.createService({
  mixins: [ApiService],
  settings: {
    routes: [
      {
        path: '/',
        autoAliases: true,
        aliases: {
          'POST /todo': 'todo.get', // erroneous edge case
        },
      },
    ],
  },
});

const services = { todo, image };
const serviceControlParameters = {
  params: {
    name: {
      type: 'enum',
      values: Object.keys(services),
    },
  },
};

broker.createService({
  name: 'launcher',
  actions: {
    start: {
      handler: function (context) {
        if (!this.startedServices[context.params.name]) {
          this.startedServices[context.params.name] = broker.createService(services[context.params.name]);
        }
      },
      ...serviceControlParameters,
    },
    stop: {
      handler: function (context) {
        const started = this.startedServices[context.params.name];
        if (started) {
          broker.destroyService(started);
          delete this.startedServices[context.params.name];
        }
      },
      ...serviceControlParameters,
    },
  },
  created() {
    this.startedServices = {};
  },
});

broker.start();
