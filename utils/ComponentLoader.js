const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

function loadDirectory(directoryPath, collection, type) {
  if (!fs.existsSync(directoryPath)) return;

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      loadDirectory(fullPath, collection, type);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

    try {
      const component = require(fullPath);
      if (!component || typeof component.execute !== "function") continue;

      const key = component.customID || component.name || component.data?.name || path.basename(entry.name, ".js");
      collection.set(key, component);
    } catch (error) {
      console.error(`[loader] Failed to load ${type} ${entry.name}:`, error);
    }
  }
}

module.exports = (client) => {
  client.commands = new Collection();
  client.buttons = new Collection();
  client.menus = new Collection();
  client.modals = new Collection();
  client.messages = new Collection();

  const baseDir = path.join(__dirname, "..");
  loadDirectory(path.join(baseDir, "commands"), client.commands, "command");
  loadDirectory(path.join(baseDir, "buttons"), client.buttons, "button");
  loadDirectory(path.join(baseDir, "menus"), client.menus, "menu");
  loadDirectory(path.join(baseDir, "modals"), client.modals, "modal");
  loadDirectory(path.join(baseDir, "messages"), client.messages, "message");
};
