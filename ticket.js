const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const {
  getTicketMetadata,
  isTicketStaff,
  makeTicketTopic,
  readBlacklist,
  writeBlacklist,
} = require("../utils/tickets.js");

function getTicket(interaction, client) {
  if (!interaction.guild || interaction.channel?.type !== ChannelType.GuildText) {
    return null;
  }
  return getTicketMetadata(interaction.channel, client.config);
}

async function requireTicket(interaction, client) {
  const ticket = getTicket(interaction, client);
  if (!ticket) {
    await interaction.reply({
      content: "This command only works in an active ticket channel.",
      ephemeral: true,
    });
    return null;
  }
  return ticket;
}

async function requireStaff(interaction, client) {
  if (isTicketStaff(interaction.member, client.config)) return true;
  await interaction.reply({
    content: "Only authorized Tallahassee Roleplay staff can use this command.",
    ephemeral: true,
  });
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Manage the current support ticket")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a user to this ticket")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to add").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a user from this ticket")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to remove").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("close").setDescription("Close this ticket")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("close-request")
        .setDescription("Request that this ticket be closed")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("blacklist")
        .setDescription("Blacklist a user from creating tickets")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to blacklist").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the blacklist")
            .setRequired(true)
            .setMaxLength(500)
        )
    ),

  async execute(interaction, client) {
    const ticket = await requireTicket(interaction, client);
    if (!ticket) return;

    const action = interaction.options.getSubcommand();
    const staffOnly = ["add", "remove", "close", "blacklist"].includes(action);
    if (staffOnly && !(await requireStaff(interaction, client))) return;

    if (ticket.status === "closed") {
      await interaction.reply({
        content: "This ticket is closed.",
        ephemeral: true,
      });
      return;
    }

    if (action === "add") {
      const user = interaction.options.getUser("user", true);
      if (user.bot) {
        await interaction.reply({ content: "Bots cannot be added to tickets.", ephemeral: true });
        return;
      }
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        await interaction.reply({ content: "That user is not in this server.", ephemeral: true });
        return;
      }
      await interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });
      await interaction.reply({ content: `${user} was added to this ticket.` });
      return;
    }

    if (action === "remove") {
      const user = interaction.options.getUser("user", true);
      if (user.id === ticket.ownerId) {
        await interaction.reply({ content: "The ticket creator cannot be removed.", ephemeral: true });
        return;
      }
      await interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: false,
        SendMessages: false,
      });
      await interaction.reply({ content: `${user} was removed from this ticket.` });
      return;
    }

    if (action === "close-request") {
      const requesterOrStaff =
        interaction.user.id === ticket.ownerId ||
        isTicketStaff(interaction.member, client.config);
      if (!requesterOrStaff) {
        await interaction.reply({
          content: "Only the ticket creator or authorized staff can request closure.",
          ephemeral: true,
        });
        return;
      }
      if (ticket.status === "close-requested") {
        await interaction.reply({ content: "A close has already been requested here.", ephemeral: true });
        return;
      }
      await interaction.channel.setTopic(
        makeTicketTopic({ ...ticket, status: "close-requested" })
      );
      const staffRoles = (client.config.TICKET_STAFF_ROLE_IDS || []).map((id) => `<@&${id}>`);
      await interaction.reply({
        content: `A close has been requested by ${interaction.user}.${staffRoles.length ? ` ${staffRoles.join(" ")}` : ""}`,
        allowedMentions: { roles: client.config.TICKET_STAFF_ROLE_IDS || [], users: [] },
      });
      return;
    }

    if (action === "close") {
      await interaction.deferReply({ ephemeral: true });
      await interaction.channel.send(`This ticket was closed by ${interaction.user}.`);
      await interaction.channel.setTopic(makeTicketTopic({ ...ticket, status: "closed" }));
      await interaction.channel.permissionOverwrites.edit(ticket.ownerId, {
        ViewChannel: false,
        SendMessages: false,
      });
      await interaction.editReply("Ticket closed. This channel will be deleted in 5 seconds.");
      setTimeout(() => {
        interaction.channel.delete("Ticket closed; scheduled deletion").catch((error) => {
          client.logs.error(`Failed to delete closed ticket ${interaction.channel.id}: ${error.stack || error}`);
        });
      }, 5000);
      return;
    }

    if (action === "blacklist") {
      const user = interaction.options.getUser("user", true);
      const reason = interaction.options.getString("reason", true);
      const blacklist = readBlacklist();
      blacklist[user.id] = {
        reason,
        moderatorId: interaction.user.id,
        createdAt: new Date().toISOString(),
      };
      writeBlacklist(blacklist);
      await interaction.reply({
        content: `${user} is now blacklisted from creating tickets.`,
        ephemeral: true,
      });
    }
  },
};