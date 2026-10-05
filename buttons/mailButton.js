const { pendingMessages } = require("../messages/pendingMessages.js");
const { createRevealedMailPayload } = require("../utils/pendingMailPayloads.js");

module.exports = {
  customID: "viewPendingMail",

  async execute(interaction, client, args = []) {
    const targetUserId = args[0];
    if (interaction.user.id !== targetUserId) {
      await interaction.reply({
        content: "This pending mail is not addressed to you.",
        ephemeral: true,
      });
      return;
    }

    const dmMessage = pendingMessages.get(targetUserId);
    if (!dmMessage) {
      await interaction.reply({
        content: "This pending message is no longer available. Please ask the sender to resend it.",
        ephemeral: true,
      });
      return;
    }

    await interaction.update(createRevealedMailPayload(dmMessage));
    pendingMessages.delete(targetUserId);
  },
};