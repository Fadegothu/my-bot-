module.exports = function () {
  const logSignal = (signal) => console.log(`[process] Received ${signal}`);

  process.on("SIGINT", () => logSignal("SIGINT"));
  process.on("SIGTERM", () => logSignal("SIGTERM"));
};
