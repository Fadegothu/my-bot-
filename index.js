require("./utils/ProcessHandlers.js")();

const PREFIX = "-";

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField: { Flags: Permissions },
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.config = require("./config.json");
client.logs = require("./utils/Logs.js");
client.cooldowns = new Map();

require("./utils/ComponentLoader.js")(client);
require("./utils/EventLoader.js")(client);
require("./utils/RegisterCommands.js")(client);




client.logs.info(`Logging in...`);
client.login(client.config.TOKEN);
client.on("ready", function () {
  if (client.config.BOT_NAME && client.user.username !== client.config.BOT_NAME) {
    client.user
      .setUsername(client.config.BOT_NAME)
      .catch((err) => {
        client.logs.warn(`Could not update bot username: ${err.message}`);
      });
  }

  client.logs.custom(`Logged in as ${client.user.tag}!`, 0x7946ff);
  client.logs.info(
    `Invite URL: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands`
  );

  // It's a weird place but I am assuming by the time it logs in you are finished adding events
  // Adding events after it runs this function will not get checked
  require("./utils/CheckIntents.js")(client);
});

client.on("guildCreate", () => {});

function CheckAccess(requiredRoles, userIDs, member, user, config, roleConfigKey) {
  const roleIDs = roleConfigKey ? config?.[roleConfigKey] : requiredRoles;
  if (member && (requiredRoles || roleConfigKey)) {
    const hasRole = Array.isArray(roleIDs) && roleIDs.some((roleID) =>
      member._roles.includes(roleID)
    );
    if (!hasRole && !member.permissions.has("Administrator")) {
      throw ["You don't have permission to use this command!", "Missing roles"];
    }
  }

  if (Array.isArray(userIDs) && !userIDs.includes(user.id)) {
    throw [
      "You don't have permission to use this command!",
      "User not whitelisted",
    ];
  }
}

function CheckPermissions(permissionsArray, member) {
  if (!Array.isArray(permissionsArray) || !member) return;

  const prefix = member.user.id === client.id ? "I am" : "You are";

  const missingPermissions = [];
  if (permissionsArray.length === 0) return;
  for (const permission of permissionsArray) {
    if (member.permissions.has(Permissions[permission])) continue;
    missingPermissions.push(permission);
  }

  if (missingPermissions.length > 0) {
    throw [
      `${prefix} missing the following permissions: \`${missingPermissions.join(
        "`, `"
      )}\``,
      "Missing permissions",
    ];
  }
}

function CheckCooldown(userID, command, cooldown) {
  const timeRemaining = client.cooldowns.get(`${userID}-${command}`) ?? 0;
  const remaining = (timeRemaining - Date.now()) / 1000;
  if (remaining > 0) {
    throw [
      `Please wait ${remaining.toFixed(
        1
      )} more seconds before reusing the \`${command}\` command!`,
      "On cooldown",
    ];
  }
  client.cooldowns.set(`${userID}-${command}`, Date.now() + cooldown * 1000);
}

async function InteractionHandler(interaction, type) {
  const args = interaction.customId?.split("_") ?? [];
  const name = args.shift();

  const component = client[type].get(name ?? interaction.commandName);
  if (!component) {
    if (interaction.isRepliable?.()) {
      await interaction
        .reply({
          content: `There was an error while executing this command!\n\`\`\`Command not found\`\`\``,
          ephemeral: true,
        })
        .catch(() => {});
    }
    client.logs.error(`${type} not found: ${interaction.customId || interaction.commandName}`);
    return;
  }

  try {
    CheckAccess(
      component.roles,
      component.users,
      interaction.member,
      interaction.user,
      client.config,
      component.roleConfigKey
    );
    CheckCooldown(
      interaction.user.id,
      component.customID ?? interaction.commandName,
      component.cooldown
    );

    const botMember =
      interaction.guild?.members.cache.get(client.user.id) ??
      (await interaction.guild?.members
        .fetch(client.user.id)
        .catch(() => null));
    if (botMember !== null) {
      CheckPermissions(component.clientPerms, botMember);
      CheckPermissions(component.userPerms, interaction.member);
    }
  } catch ([response, reason]) {
    if (interaction.isRepliable?.()) {
      await interaction
        .reply({
          content: response,
          ephemeral: true,
        })
        .catch(() => {});
    }
    client.logs.error(`Blocked user from ${type}: ${reason}`);
    return;
  }

  try {
    if (interaction.isAutocomplete?.() && typeof component.autocomplete === "function") {
      await component.autocomplete(
        interaction,
        client,
        type === "commands" ? undefined : args
      );
      return;
    }

    await component.execute(
      interaction,
      client,
      type === "commands" ? undefined : args
    );
  } catch (error) {
    client.logs.error(error.stack || error);
    if (!interaction.replied && !interaction.deferred && interaction.isRepliable?.()) {
      await interaction.deferReply({ ephemeral: true }).catch(() => {});
    }

    const replyPayload = {
      content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
      embeds: [],
      components: [],
      files: [],
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(replyPayload).catch(() => {});
    } else {
      await interaction.reply(replyPayload).catch(() => {});
    }
  }
}

client.on("interactionCreate", async function (interaction) {
  if (
    interaction.isChatInputCommand?.() ||
    interaction.isContextMenuCommand?.() ||
    interaction.isCommand?.() ||
    interaction.isAutocomplete?.()
  ) {
    await InteractionHandler(interaction, "commands");
    return;
  }

  if (interaction.isButton?.()) {
    await InteractionHandler(interaction, "buttons");
    return;
  }

  if (interaction.isStringSelectMenu?.()) {
    await InteractionHandler(interaction, "menus");
    return;
  }

  if (interaction.isModalSubmit?.()) {
    await InteractionHandler(interaction, "modals");
    return;
  }
});

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  if (!message.content?.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).split(/\s+/);
  const name = args.shift().toLowerCase();

  const command = client.messages.get(name);
  if (!command) {
    client.logs.error(`Command not found: ${name}`);
    const errorMsg = await message
      .reply(
        `There was an error while executing this command!\n\`\`\`Command not found\`\`\``
      )
      .catch(() => {});
    // Delete message after 5 seconds to simulate ephemeral behavior
    setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
    return;
  }

  try {
    CheckAccess(
      command.roles,
      command.users,
      message.member,
      message.author,
      client.config,
      command.roleConfigKey
    );
    CheckCooldown(message.author.id, name, command.cooldown);

    const botMember =
      message.guild?.members.cache.get(client.user.id) ??
      (await message.guild?.members.fetch(client.user.id).catch(() => null));
    if (botMember !== null) {
      CheckPermissions(command.clientPerms, botMember); // bot
      CheckPermissions(command.userPerms, message.member); // user
    }
  } catch ([response, reason]) {
    const reply = await message.reply(response).catch(() => {});
    // Delete the error response after 5 seconds
    setTimeout(() => reply.delete().catch(() => {}), 5000);
    client.logs.error(`Blocked user from message: ${reason}`);
    return;
  }

  try {
    await command.execute(message, client, args);
  } catch (error) {
    client.logs.error(error.stack);
    const errorMsg = await message
      .reply(
        `There was an error while executing this command!\n\`\`\`${error}\`\`\``
      )
      .catch(() => {});
    // Delete message after 5 seconds to simulate ephemeral behavior
    setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
  } finally {
    client.cooldowns.set(
      message.author.id,
      Date.now() + command.cooldown * 1000
    );
    setTimeout(
      client.cooldowns.delete.bind(client.cooldowns, message.author.id),
      command.cooldown * 1000
    );
  }
});
