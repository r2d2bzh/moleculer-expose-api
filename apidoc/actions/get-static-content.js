import { open } from 'node:fs/promises';
import { Errors } from 'moleculer';

export default ({ type, checkName, getLogger }) => {
  const logger = getLogger('actions-get-static-content');
  return async (context) => {
    if (!checkName(context.params.name)) {
      throw new Errors.MoleculerClientError('Name mismatch', 400, 'NAME_MISMATCH', {});
    }
    try {
      const fileHandle = await open(`./static/${context.params.name}`);
      context.meta.$responseType = type;
      return fileHandle.createReadStream();
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Errors.MoleculerClientError('No such content', 404, 'UNKNOWN_CONTENT', {});
      } else {
        logger.error(error);
        throw new Errors.MoleculerClientError('Unable to deliver content', 500, 'CONTENT_FAILURE', {});
      }
    }
  };
};
