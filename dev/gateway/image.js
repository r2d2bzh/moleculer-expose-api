const handler = (context) => context;

export default {
  name: 'image',
  metadata: {
    $description: 'service in charge of managing images',
  },
  actions: {
    upload: {
      metadata: {
        $description: 'upload a new image',
      },
      handler,
      rest: {
        method: 'POST',
        path: '/',
        type: 'multipart',
      },
    },
    find: {
      metadata: {
        $description: 'find images',
      },
      handler,
      rest: {
        method: 'GET',
        path: '/',
      },
      params: {
        query: {
          metadata: {
            $description: 'a query to match the images with',
          },
          type: 'string',
          optional: true,
        },
      },
    },
    download: {
      metadata: {
        $description: 'download an image',
      },
      handler,
      rest: {
        method: 'GET',
        path: '/:id',
      },
      params: {
        format: {
          metadata: {
            $description: 'image format to return',
          },
          type: 'enum',
          values: ['gif', 'png'],
        },
      },
    },
  },
};
