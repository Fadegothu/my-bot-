const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsDir = path.join(__dirname, "..", "events");

  if (!fs.existsSync(eventsDir)) return;

  for (const entry of fs.readdirSync(eventsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

    try {
      const event = require(path.join(eventsDir, entry.name));
      if (!event || typeof event.execute !== "function") continue;

      const eventName = event.name || event.event || entry.name.replace(/\.js$/, "");
      const handler = async (...args) => {
        try {
          await event.execute(client, ...args);
        } catch (error) {
          console.error(`[event] ${eventName} failed:`, error);
        }
      };

      if (event.once) {
        client.once(eventName, handler);
      } else {
        client.on(eventName, handler);
      }
    } catch (error) {
      console.error(`[loader] Failed to load event ${entry.name}:`, error);
    }
  }
};
