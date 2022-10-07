import ApiService from 'moleculer-web';

export default () => ({
  name: 'gateway',
  mixins: [ApiService],
  settings: {
    routes: [
      {
        path: '/',
        autoAliases: true,
        aliases: {
          'POST /todo': 'todo.get', // erroneous edge case
        },
      },
    ],
  },
});
