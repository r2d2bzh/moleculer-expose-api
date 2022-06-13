const handler = (context) => context;

export default {
  name: 'todo',
  metadata: {
    $summary: 'Service in charge of managing todo notes',
    $description: `
    This service records todo notes, the following api calls are available:

    * adding a todo notes
    * listing/finding todo notes
    * getting the details of a todo note
    `,
  },
  actions: {
    add: {
      metadata: {
        $summary: 'Adds a todo note',
        $description: `
        Will add a todo note through providing its content.
        `,
      },
      handler,
      rest: {
        method: 'POST',
        path: '/',
      },
      params: {
        content: {
          metadata: {
            $summary: 'A description of the task to do',
            $description: `
            The description can be multiline.
            `,
          },
          type: 'string',
        },
      },
    },
    find: {
      metadata: {
        $summary: 'Find todo notes',
        $description: `
        Lists todo notes matching a query string passed as the only argument.
        `,
      },
      handler,
      rest: {
        method: 'GET',
        path: '/',
      },
      params: {
        query: {
          metadata: {
            $summary: 'A query to match the todo notes with',
            $description: `
            The query string to match may contain multiple words separated by whitespaces.
            The list will return first the notes matching most of these words.
            `,
          },
          type: 'string',
          optional: true,
        },
      },
    },
    get: {
      metadata: {
        $summary: 'Get the content of a todo note',
        $description: `
        Returns the content of a particular todo notes as a string.
        `,
      },
      handler,
      rest: {
        method: 'GET',
        path: '/:id',
      },
      params: {
        id: {
          metadata: {
            $summary: 'Identifier of the todo note to retrieve',
            $description: `
            Todo notes are all identified by a UUID.
            The UUID used must comply with [https://tools.ietf.org/html/rfc4122](RFC 4122).
            `,
          },
          type: 'string',
        },
      },
    },
  },
};
