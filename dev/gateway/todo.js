const handler = (context) => context;

export default {
  name: 'todo',
  metadata: {
    $description: 'service in charge of managing todo notes',
  },
  actions: {
    add: {
      metadata: {
        $description: 'adds a todo note',
      },
      handler,
      rest: {
        method: 'POST',
        path: '/',
      },
      params: {
        content: {
          metadata: {
            $description: 'a description of the task to do',
          },
          type: 'string',
        },
      },
    },
    find: {
      metadata: {
        $description: 'find todo notes',
      },
      handler,
      rest: {
        method: 'GET',
        path: '/',
      },
      params: {
        query: {
          metadata: {
            $description: 'a query to match the todo notes with',
          },
          type: 'string',
          optional: true,
        },
      },
    },
    get: {
      metadata: {
        $description: 'get the content of a todo note',
      },
      handler,
      rest: {
        method: 'GET',
        path: '/:id',
      },
      params: {
        id: {
          metadata: {
            $description: 'identifier of the todo note to retrieve',
          },
          type: 'string',
        },
      },
    },
  },
};
