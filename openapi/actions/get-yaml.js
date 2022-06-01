import yaml from 'js-yaml';
import { Errors } from 'moleculer';

export default ({ hasApi, getApi }) =>
  (context) => {
    if (hasApi(context.params.api)) {
      context.meta.$responseType = 'text/x-yaml';
      return yaml.dump(getApi(context.params.api));
    } else {
      throw new Errors.MoleculerClientError('No such API', 404, 'UNKNOWN_API', {});
    }
  };
