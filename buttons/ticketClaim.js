const { ChannelType } = require("discord.js");
const { getTicketMetadata, isTicketStaff, makeTicketTopic } = require("../utils/tickets.js");

module.exports = {
  customID: "ticketClaim",

  async execute(interaction, client) {
    if (
      !interaction.guild ||
      interaction.channel?.type !== ChannelType.GuildText ||
      !isTicketStaff(interaction.member, client.config)
    ) {
      await interaction.reply({
        content: "Only authorized ticket staff can claim tickets.",
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

    if (ticket.claimedBy) {
      await interaction.reply({
        content: `This ticket has already been claimed by <@${ticket.claimedBy}>.`,
        ephemeral: true,
      });
      return;
    }

    await interaction.channel.setTopic(
      makeTicketTopic({ ...ticket, claimedBy: interaction.user.id })
    );
    await interaction.reply({ content: `${interaction.user} claimed this ticket.` });
  },
};
