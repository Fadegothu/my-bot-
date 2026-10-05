const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { readBlacklist } = require("./tickets.js");

const categoryNames = {
  "general-support": "General",
  management: "Management",
  "department-support": "Department",
  "staff-report": "Staff Report",
};

async function showTicketModal(interaction, client, category) {
  if (client.config.TICKET_SYSTEM_ENABLED === false) {
    await interaction.reply({
      content: "Ticket creation is temporarily disabled right now.",
      ephemeral: true,
    });
    return;
  }

  if (
    !interaction.guild ||
    !categoryNames[category] ||
    !client.config.TICKET_CATEGORY_IDS?.[category]
  ) {
    await interaction.reply({ content: "That ticket category is not configured.", ephemeral: true });
    return;
  }

  let blacklist;
  try {
    blacklist = readBlacklist();
  } catch (error) {
    client.logs.error(`Unable to read ticket blacklist: ${error.message}`);
    await interaction.reply({ content: "Ticket creation is temporarily unavailable.", ephemeral: true });
    return;
  }
  if (blacklist[interaction.user.id]) {
    await interaction.reply({
      content: "You cannot create a ticket at this time. Contact server staff if you believe this is an error.",
      ephemeral: true,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`ticketCreate_${category}`)
    .setTitle(categoryNames[category]);
  const profile = new TextInputBuilder()
    .setCustomId("profile")
    .setLabel("Roblox username or profile (optional)")
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setMaxLength(100);
  const inquiry = new TextInputBuilder()
    .setCustomId("inquiry")
    .setLabel("How can we help?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(15)
    .setMaxLength(1500);
  modal.addComponents(
    new ActionRowBuilder().addComponents(profile),
    new ActionRowBuilder().addComponents(inquiry)
  );
  await interaction.showModal(modal);
}

module.exports = showTicketModal;
