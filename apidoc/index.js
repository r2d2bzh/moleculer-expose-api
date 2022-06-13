import { ServiceBroker } from 'moleculer';
import HealthCheck from '@r2d2bzh/moleculer-healthcheck-middleware';
import StartCheck from '@r2d2bzh/moleculer-start-checker-middleware';
import yac from '@r2d2bzh/yac';
import stopNodeHook from './share/stop-node-hook.js';
import apidoc from './apidoc.js';

const config = yac('./config/config.yaml');

const broker = new ServiceBroker({
  transporter: {
    type: 'NATS',
    options: {
      servers: config.get('natsServers'),
    },
  },
  middlewares: [HealthCheck(), StartCheck()],
});

stopNodeHook(broker);

broker.createService(
  apidoc({
    name: config.get('serviceName'),
    changeEvent: config.get('apiChangeEvent'),
    getSearchableDocumentsAction: config.get('getSearchableDocumentsAction'),
    getLogger: broker.getLogger.bind(broker),
    openapiURL: config.get('openapiURL'),
  })
);

broker.start();
