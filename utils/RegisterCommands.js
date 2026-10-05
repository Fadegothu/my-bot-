const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

module.exports = async (client) => {
  const commandsDir = path.join(__dirname, "..", "commands");
  if (!fs.existsSync(commandsDir)) return;

  const disabledCommands = new Set(["eval.js", "group.js", "hire.js", "ssu.js", "ssuvote.js", "ssd.js"]);
  const commands = [];

  for (const entry of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".js") ||
      disabledCommands.has(entry.name)
    ) continue;

    try {
      const command = require(path.join(commandsDir, entry.name));
      if (command?.data) {
        commands.push(command.data.toJSON());
      }
    } catch (error) {
      console.error(`[loader] Failed to load command ${entry.name}:`, error);
    }
  }

  if (commands.length === 0 || !client.config?.APP_ID) return;

  const rest = new REST({ version: "10" }).setToken(client.config.TOKEN);
  const targetGuildId = client.config?.GUILD_ID;
  const route = targetGuildId
    ? Routes.applicationGuildCommands(client.config.APP_ID, targetGuildId)
    : Routes.applicationCommands(client.config.APP_ID);

  try {
    await rest.put(route, { body: commands });
    console.log(
      `[commands] Registered ${commands.length} slash commands${targetGuildId ? ` for guild ${targetGuildId}` : " globally"}`
    );
  } catch (error) {
    console.error("[commands] Failed to register commands:", error);
  }
};
