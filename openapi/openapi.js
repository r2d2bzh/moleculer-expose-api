import { debounce } from 'lodash-es';
import MiniSearch from 'minisearch';
import {
  create as newApiDetails,
  gather as gatherApiDetails,
  toSearchable as apiDetailsToSearchable,
} from './api-details.js';
import splitActionName from './share/split-action-name.js';
import getYaml from './actions/get-yaml.js';

export default ({ name, listAliases, getLogger }) => {
  const logger = getLogger('openapi');
  return {
    name,
    dependencies: [splitActionName(listAliases).serviceName],
    actions: {
      'get-yaml': {
        handler: function (context) {
          return getYaml(apiGetter(this.apiDetails.apis))(context);
        },
        params: {
          api: {
            type: 'string',
          },
        },
        rest: {
          method: 'GET',
          path: '/yaml/:api',
        },
      },
      'get-searchable': async function () {
        return apiDetailsToSearchable(this.apiDetails);
      },
    },
    events: {
      '$services.changed': {
        context: true,
        handler() {
          this.updateApiDetails(); // no need to await
        },
      },
    },
    methods: {
      updateApiDetails: debounce(async function () {
        try {
          this.apiDetails = await gatherApiDetails({ broker: this.broker, listAliases });
          this.broker.broadcast(`${name}.changed`);
        } catch (error) {
          logger.warn(`Unable to update API details (${error.message})`);
        }
      }, 2000),
    },
    async started() {
      this.apiDetails = newApiDetails();
      this.searcher = new MiniSearch({ fields: ['name', 'summary', 'description'] });
      this.updateApiDetails(); // no need to await
    },
  };
};

const apiGetter = (apis) => ({
  hasApi(api) {
    return apis.has(api);
  },
  getApi(api) {
    return apis.get(api);
  },
});
