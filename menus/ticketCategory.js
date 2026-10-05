const showTicketModal = require("../utils/showTicketModal.js");

module.exports = {
  customID: "ticket-category",

  async execute(interaction, client) {
    await showTicketModal(interaction, client, interaction.values?.[0]);
  },
};