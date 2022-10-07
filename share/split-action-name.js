export default (actionFullName) => {
  const lastDotIndex = actionFullName.lastIndexOf('.');
  return {
    serviceName: actionFullName.slice(0, lastDotIndex),
    actionName: actionFullName.slice(lastDotIndex + 1),
  };
};
