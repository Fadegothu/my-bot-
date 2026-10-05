const showTicketModal = require("../utils/showTicketModal.js");

const categories = new Set(["general-support", "management", "department-support"]);

module.exports = {
  customID: "ticketPanelOpen",

  async execute(interaction, client, args = []) {
    await showTicketModal(interaction, client, categories.has(args[0]) ? args[0] : null);
  },
};
