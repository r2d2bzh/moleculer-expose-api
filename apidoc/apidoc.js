import MiniSearch from 'minisearch';
import getHtml from './actions/get-html.js';
import getSearchPage from './actions/get-search-page.js';
import getStaticContent from './actions/get-static-content.js';

export default ({ name, changeEvent, getSearchableDocumentsAction, getLogger, openapiURL }) => {
  const logger = getLogger('apidoc');
  return {
    name,
    actions: {
      'get-html': {
        handler: function (context) {
          return getHtml({
            openapiURL,
            hasApi: (api) => this.apiList.has(api),
          })(context);
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
      'redirect-search-page': {
        handler: (context) => {
          context.meta.$statusCode = 302;
          context.meta.$location = 'index.html';
        },
        rest: {
          method: 'GET',
          path: '/',
        },
      },
      'get-search-page': {
        handler: getSearchPage({
          title: 'Search page',
        }),
        rest: {
          method: 'GET',
          path: '/index.html',
        },
      },
      'get-static-js': {
        handler: getStaticContent({
          type: 'text/javascript',
          checkName: (name) => name.endsWith('.js'),
          getLogger,
        }),
        rest: {
          method: 'GET',
          path: '/js/:name',
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
      [changeEvent]: {
        context: true,
        handler() {
          this.updateSearchIndex(); // no need to await
        },
      },
    },
    methods: {
      async updateSearchIndex() {
        try {
          const searchableDocuments = await this.broker.call(getSearchableDocumentsAction);
          this.apiList = new Set(
            searchableDocuments.filter((document) => document.type === 'api').map((document) => document.name)
          );
          this.searcher.removeAll();
          await this.searcher.addAllAsync(searchableDocuments);
        } catch (error) {
          logger.warn(`Unable to update the search index (${error.message})`);
        }
      },
    },
    async started() {
      this.searcher = new MiniSearch({
        fields: ['name', 'summary', 'description'],
        storeFields: ['name', 'summary', 'description', 'location'],
      });
      this.apiList = new Set();
      this.updateSearchIndex(); // no need to await
    },
  };
};
