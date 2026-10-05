function format(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

module.exports = {
  info(message) {
    format("INFO", message);
  },
  warn(message) {
    format("WARN", message);
  },
  error(message) {
    format("ERROR", message);
  },
  custom(message) {
    format("CUSTOM", message);
  },
};
