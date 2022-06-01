export default ({ title }) =>
  (context) => {
    context.meta.$responseType = 'text/html';
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <script type="module" src="https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js"></script>
  </head>
  <body>
  </body>
</html>
`;
  };
