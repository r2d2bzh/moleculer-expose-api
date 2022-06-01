import { Errors } from 'moleculer';

export default ({ hasApi }) =>
  (context) => {
    if (hasApi(context.params.api)) {
      context.meta.$responseType = 'text/html';
      return `
<!doctype html> <!-- Important: must specify -->
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url = "../yaml/${context.params.api}"> </rapi-doc>
  </body>
</html>
`;
    } else {
      throw new Errors.MoleculerClientError('No such API', 404, 'UNKNOWN_API', {});
    }
  };
