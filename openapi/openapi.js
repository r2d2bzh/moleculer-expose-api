import { debounce } from 'lodash-es';
import MiniSearch from 'minisearch';
import {
  create as newApiDetails,
  gather as gatherApiDetails,
  toSearchable as apiDetailsToSearchable,
} from './api-details.js';
import { splitActionName } from './utils.js';
import getHtml from './actions/get-html.js';
import getYaml from './actions/get-yaml.js';
import getSearchPage from './actions/get-search-page.js';

export default ({ name, listAliases, getLogger }) => {
  const logger = getLogger('openapi');
  return {
    name,
    dependencies: [splitActionName(listAliases).serviceName],
    actions: {
      test: async function () {
        return apiDetailsToSearchable(this.apiDetails);
      },
      'get-html': {
        handler: function (context) {
          return getHtml(apiGetter(this.apiDetails.apis))(context);
        },
        params: {
          api: {
            type: 'string',
          },
        },
        rest: {
          method: 'GET',
          path: '/html/:api',
        },
      },
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
      'get-search-page': {
        handler: getSearchPage({
          title: 'Search page',
        }),
        rest: {
          method: 'GET',
          path: '/',
        },
      },
      search: {
        handler: function (context) {
          return this.searcher.search(context.params.input, {
            fuzzy: true,
            prefix: true,
          });
        },
        params: {
          input: {
            type: 'string',
          },
        },
        rest: {
          method: 'GET',
          path: '/search',
        },
      },
      suggest: {
        handler: function (context) {
          return this.searcher.autoSuggest(context.params.input, {
            fuzzy: true,
            prefix: true,
          });
        },
        params: {
          input: {
            type: 'string',
          },
        },
        rest: {
          method: 'GET',
          path: '/suggest',
        },
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
          this.searcher.removeAll();
          await this.searcher.addAllAsync(apiDetailsToSearchable(this.apiDetails));
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
