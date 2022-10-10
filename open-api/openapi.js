import generateOpenAPISpecification from './openapi/generate-specification.js';

export default ({ name, listAliases, openapiBaseSpecification }) => ({
  name,

  // This is necessary because the started lidecycle hook needs listAliases.
  dependencies: [listAliases.split('.')[0]],

  started() {
    return this.generateOpenAPISpecification(this.broker);
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
      handler(context) {
        this.generateOpenAPISpecification(context); // no need to await
      },
    },
  },

  methods: {
    async generateOpenAPISpecification(caller) {
      this.specification = await generateOpenAPISpecification({ caller, listAliases, openapiBaseSpecification });
      caller.emit(`${name}.changed`);
    },
  },
});
