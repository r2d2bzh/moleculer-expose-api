/* eslint-disable security/detect-object-injection */
import { splitActionName } from './utils.js';
import getOperationExtractor from './operation-extractor.js';
import realignSection from './realign-section.js';

export const create = () => ({
  apis: new Map(),
});

export const gather = async ({ broker, listAliases }) => {
  const logger = broker.getLogger('api-details');
  const apiDetails = create();
  const [aliases, initializeApi, extractOperation] = await Promise.all([
    broker.call(listAliases),
    broker.call('$node.services', { skipInternal: true }).then(indexBy('name')),
    broker.call('$node.actions', { skipInternal: true }).then(indexBy('name')),
  ]).then(([aliases, services, actions]) => [aliases, getApiInitializer(services), getOperationExtractor(actions)]);

  for (const { actionName, fullPath, methods } of aliases) {
    const { serviceName } = splitActionName(actionName);
    const api = getObjectFrom(apiDetails.apis, serviceName, initializeApi(serviceName));
    try {
      mergeInValue(api.paths, moleculerPathToOpenapiPath(fullPath), extractOperation(actionName, methods));
    } catch (error) {
      logger.error(`Unable to merge ${fullPath} (${error.message})`);
    }
  }

  return apiDetails;
};

export const toSearchable = (details) => {
  const searchable = [];
  const type = 'api';
  for (const [
    id,
    {
      info: { title: name, summary, description },
      paths,
    },
  ] of details.apis.entries()) {
    searchable.push({ id, name, type, summary, description, location: `${name}#overview` });
    addPathsToSearchable(searchable, name, paths);
  }
  return searchable;
};

const addPathsToSearchable = (searchable, apiName, paths) => {
  const type = 'operation';
  for (const [path, operations] of Object.entries(paths)) {
    for (const [operation, { operationId: name, summary, description }] of Object.entries(operations)) {
      searchable.push({
        id: `${apiName}~${path}~${operation}`,
        name,
        type,
        summary,
        description,
        location: `${apiName}#${operation}-${path.replace(/[{}]/g, '-')}`,
      });
    }
  }
};

const getApiInitializer = (services) => (serviceName) => () => ({
  openapi: '3.1.0',
  info: {
    title: serviceName,
    summary: services?.[serviceName]?.metadata?.$summary || 'MISSING SUMMARY',
    description: realignSection(services?.[serviceName]?.metadata?.$description || 'MISSING DESCRIPTION'),
    version: services?.[serviceName]?.version || services?.[serviceName]?.metadata?.$version || 'MISSING VERSION',
  },
  paths: {},
});

const getObjectFrom = (map, key, initializer) => {
  let value = map.get(key);
  if (!value) {
    value = initializer();
    map.set(key, value);
  }
  return value;
};

const mergeInValue = (object, key, toMerge) => {
  object[key] = {
    ...object[key],
    ...toMerge,
  };
};

const indexBy = (key) => (array) => {
  const result = {};
  for (const { [key]: index, ...element } of array) {
    // eslint-disable-next-line security/detect-object-injection
    result[index] = element;
  }
  return result;
};

const moleculerPathToOpenapiPath = (path) => path.replace(/:([^/]+)/g, '{$1}');
