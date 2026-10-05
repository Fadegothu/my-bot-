const { ChannelType } = require("discord.js");
const {
  getTicketMetadata,
  isTicketStaff,
  makeTicketTopic,
} = require("../utils/tickets.js");

module.exports = {
  customID: "ticketClose",

  async execute(interaction, client) {
    if (
      !interaction.guild ||
      interaction.channel?.type !== ChannelType.GuildText ||
      !isTicketStaff(interaction.member, client.config)
    ) {
      await interaction.reply({
        content: "Only authorized ticket staff can close tickets.",
        ephemeral: true,
      });
      return;
    }

    const ticket = getTicketMetadata(interaction.channel, client.config);
    if (!ticket || ticket.status === "closed") {
      await interaction.reply({
        content: "This button only works in an active ticket channel.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.send(`This ticket was closed by ${interaction.user}.`);
    await interaction.channel.setTopic(
      makeTicketTopic({ ...ticket, status: "closed" })
    );
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
  },
};
