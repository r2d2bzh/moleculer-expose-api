const defaultStopSignals = [
  'SIGHUP', //   1
  'SIGINT', //   2
  'SIGQUIT', //  3
  'SIGILL', //   4
  'SIGTRAP', //  5
  'SIGABRT', //  6
  'SIGBUS', //   7
  'SIGFPE', //   8
  'SIGUSR1', // 10
  'SIGSEGV', // 11
  'SIGUSR2', // 12
  'SIGTERM', // 15
];

export const stopNodeHook = (broker, stopSignals = defaultStopSignals) => {
  for (const signal of stopSignals) {
    process.on(signal, async () => {
      await broker.stop();
      process.exit(0);
    });
  }
};

export const splitActionName = (actionName) => {
  const lastDotIndex = actionName.lastIndexOf('.');
  return {
    serviceName: actionName.slice(0, lastDotIndex),
    actionName: actionName.slice(lastDotIndex + 1),
  };
};
