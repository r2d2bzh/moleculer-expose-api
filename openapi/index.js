import { ServiceBroker } from 'moleculer';
import HealthCheck from '@r2d2bzh/moleculer-healthcheck-middleware';
import StartCheck from '@r2d2bzh/moleculer-start-checker-middleware';
import yac from '@r2d2bzh/yac';
import { stopNodeHook } from './utils.js';
import openapi from './openapi.js';

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
  openapi({
    name: config.get('serviceName'),
    title: config.get('openapiTitle'),
    listAliases: config.get('listAliases'),
    getLogger: broker.getLogger.bind(broker),
  })
);

broker.start();
