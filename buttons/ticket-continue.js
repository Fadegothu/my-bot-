const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const categories = [
  { label: "General Support", value: "general-support", description: "Questions and general assistance" },
  { label: "Staff Report", value: "staff-report", description: "Report a staff-related concern" },
  { label: "Department Support", value: "department-support", description: "Department-related assistance" },
];

module.exports = {
  customID: "ticket-continue",
  execute: async function (interaction, client) {
    if (client.config.TICKET_SYSTEM_ENABLED === false) {
      await interaction.reply({
        content: "Ticket creation is temporarily disabled right now.",
        ephemeral: true,
      });
      return;
    }

    if (!interaction.guild) {
      await interaction.reply({
        content: "This ticket flow only works in a server.",
        ephemeral: true,
      });
      return;
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket-category")
      .setPlaceholder("Choose your ticket category")
      .addOptions(categories);

    await interaction.reply({
      content: "Choose the ticket category that best matches your issue.",
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });
  },
};
