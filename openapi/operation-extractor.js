/* eslint-disable security/detect-object-injection */
import realignSection from './realign-section.js';

export default (actions) => {
  const extractParameters = getParametersExtractor(actions);
  return (actionName, methods) => {
    const operation = {
      summary: actions?.[actionName]?.action?.metadata?.$summary || 'MISSING SUMMARY',
      description: realignSection(actions?.[actionName]?.action?.metadata?.$description || 'MISSING DESCRIPTION'),
      operationId: actionName,
      ...extractParameters(actionName),
    };
    const operations = methods !== '*' ? [checkOperation(methods.toLowerCase())] : Object.keys(openapiOperations);
    return Object.fromEntries(operations.map((key) => [key, operation]));
  };
};

const getParametersExtractor = (actions) => (actionName) => {
  const moleculerParameters = actions?.[actionName]?.action?.params;
  if (!moleculerParameters) return {};
  const parameters = [];
  const requestBodySchema = {};
  for (const name in moleculerParameters) {
    parameters.push({
      name,
      in: extractParameterInputType(),
    });
  }
  return {
    ...(parameters.length > 0 ? { parameters } : {}),
    ...(Object.keys(requestBodySchema) > 0
      ? {
          // Only support JSON body for now
          description: 'The request body as a JSON document',
          content: {
            'application/json': {
              schema: requestBodySchema,
            },
          },
        }
      : {}),
  };
};

const checkOperation = (operation) => {
  if (operation in openapiOperations) {
    return operation;
  }
  throw new RangeError(`${operation} is not a valid OpenAPI operation`);
};

const openapiOperations = {
  get: {
    defaultParameterInputType: 'query',
  },
  put: {
    defaultParameterInputType: 'requestBody',
  },
  post: {
    defaultParameterInputType: 'requestBody',
  },
  delete: {
    defaultParameterInputType: 'query',
  },
  options: {
    defaultParameterInputType: 'requestBody',
  },
  head: {
    defaultParameterInputType: 'query',
  },
  patch: {
    defaultParameterInputType: 'requestBody',
  },
  trace: {
    defaultParameterInputType: 'requestBody',
  },
};

const extractParameterInputType = () => {};
