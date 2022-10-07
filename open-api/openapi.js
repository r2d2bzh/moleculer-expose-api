import generateOpenAPISpecification from './openapi/generate-specification.js';

export default ({ name, listAliases, openapiBaseSpecification }) => ({
  name,
  started() {
    return this.generateOpenAPISpecification();
  },

  actions: {
    'get-specification': {
      handler() {
        return this.specification;
      },
    },
  },

  events: {
    '$services.changed': {
      context: true,
      handler() {
        this.generateOpenAPISpecification(); // no need to await
      },
    },
  },

  methods: {
    async generateOpenAPISpecification() {
      this.specification = await generateOpenAPISpecification({ listAliases, openapiBaseSpecification });
    },
  },
});
