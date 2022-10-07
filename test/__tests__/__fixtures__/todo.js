const handler = (context) => context;

export default () => ({
  name: 'todo',
  metadata: {
    $openapi: {
      summary: 'Service in charge of managing todo notes',
      description: `
      This service records todo notes, the following api calls are available:

      * adding a todo notes
      * listing/finding todo notes
      * getting the details of a todo note
      `,
    },
  },
  actions: {
    add: {
      metadata: {
        $openapi: {
          summary: 'Adds a todo note',
          description: `
          Will add a todo note through providing its content.
          `,
        },
      },
      handler,
      rest: {
        method: 'POST',
        path: '/',
        authorization: true,
        authentication: true,
      },
      params: {
        content: {
          metadata: {
            $openapi: {
              summary: 'A description of the task to do',
              description: `
              The description can be multiline.
              `,
            },
          },
          type: 'string',
        },
      },
    },
    find: {
      metadata: {
        $openapi: {
          summary: 'Find todo notes',
          description: `
          Lists todo notes matching a query string passed as the only argument.
          `,
        },
      },
      handler,
      rest: {
        method: 'GET',
        path: '/',
        authorization: false,
        authentication: true,
      },
      params: {
        query: {
          metadata: {
            $openapi: {
              description: `
              A query to match the todo notes with.
              The query string to match may contain multiple words separated by white spaces.
              The list will return first the notes matching most of these words.
              `,
            },
          },
          type: 'string',
          optional: true,
        },
      },
    },
    get: {
      metadata: {
        $openapi: {
          summary: 'Get the content of a todo note',
          description: `
          Returns the content of a particular todo notes as a string.
          `,
        },
      },
      handler,
      rest: {
        method: 'GET',
        path: '/:id',
      },
      params: {
        id: {
          metadata: {
            $openapi: {
              description: `
              Identifier of the todo note to retrieve.
              Todo notes are all identified by a UUID.
              The UUID used must comply with [https://tools.ietf.org/html/rfc4122](RFC 4122).
              `,
            },
          },
          type: 'string',
        },
      },
    },
  },
});
