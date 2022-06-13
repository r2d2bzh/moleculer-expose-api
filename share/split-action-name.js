export default (actionName) => {
  const lastDotIndex = actionName.lastIndexOf('.');
  return {
    serviceName: actionName.slice(0, lastDotIndex),
    actionName: actionName.slice(lastDotIndex + 1),
  };
};
