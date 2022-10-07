/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import splitActionName from '../share/split-action-name.js';

export default async function ({ listAliases, openapiBaseSpecification }) {
  const { broker } = this;

  const [aliases, services, actions] = await Promise.all([
    broker.call(listAliases),
    broker.call('$node.services', { skipInternal: true }),
    broker.call('$node.actions', { skipInternal: true }),
  ]);

  const [paths, tags, schemas, parameters] = Promise.all([
    // @see https://spec.openapis.org/oas/v3.1.0#paths-object
    getPaths({ aliases, services, actions }),
    // https://spec.openapis.org/oas/v3.1.0#tag-object
    getTags({ aliases, services, actions }),
    // https://spec.openapis.org/oas/v3.1.0#schema-object-examples
    getSchemas({ aliases, services, actions }),
    // https://spec.openapis.org/oas/v3.1.0#parameter-object
    getComponentsParameters({ aliases, services, actions }),
  ]);
  return {
    info: openapiBaseSpecification.info,
    servers: openapiBaseSpecification.servers,
    security: {}, // TODO
    paths,
    tags,
    // @see https://spec.openapis.org/oas/v3.1.0#components-object
    components: {
      schemas,
      parameters,
    },
  };
}

const getPaths = async ({ aliases, services, actions }) => {
  const paths = [];
  for (const { actionName: actionFullName, fullPath, methods: method } of aliases) {
    const { serviceName, actionName } = splitActionName(actionFullName);

    const { summary = 'MISSING SUMMARY', description = 'MISSING DESCRIPTION' } =
      // we trust the moleculer registry
      // eslint-disable-next-line security/detect-object-injection
      actions[actionName]?.metadata?.$openapi || {};

    paths.push({
      path: moleculerPathToOpenapiPath(fullPath),
      method,

      tags: [serviceName],
      summary,
      description,
      operationId: actionName,
      parameters: getParameters({ fullPath, method, parameters: actions[actionName]?.params }),
    });
  }
  return paths;
};

const getParameters = ({ fullPath, method, parameters }) => {
  const pathParameters = getPathParameters(fullPath);
  for (const [parameterName, parameter] of Object.entries(parameters))
    return {
      parameters,
      requestBody,
    };
};

const getTags = ({ aliases, services, actions }) => ({ listAliases });

const getSchemas = ({ aliases, services, actions }) => ({});

const getComponentsParameters = ({ aliases, services, actions }) => ({});

const moleculerPathToOpenapiPath = (path) => path.replace(/:([^/]+)/g, '{$1}');

const getPathParameters = (path) => (path.match(/:[^/]+/g) || []).map((pathParameter) => pathParameter.slice(1));
