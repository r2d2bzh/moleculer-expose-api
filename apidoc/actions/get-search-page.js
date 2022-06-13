export default ({ title }) =>
  (context) => {
    context.meta.$responseType = 'text/html';
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <script type="module" src="js/autocomplete-search.js"></script>
    <style>
      body {
        min-height: 100vh;
        margin: 0;
      }
      autocomplete-search {
        min-height: 100vh;
      }
    </style
  </head>
  <body>
    <autocomplete-search></autocomplete-search>
  </body>
</html>
`;
  };
