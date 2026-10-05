const { isTicketStaff } = require("../utils/tickets.js");
const sendWelcome = require("../utils/sendWelcome.js");

module.exports = {
  name: "testwelcome",
  description: "Send a test of the server join welcome message",
  cooldown: 5,

  async execute(message, client) {
    if (!message.guild || (!isTicketStaff(message.member, client.config) &&
      !message.member.permissions.has("Administrator"))) {
      await message.reply("Only authorized staff can test the welcome message.");
      return;
    }

    try {
      await sendWelcome(client, message.member);
      await message.reply("Test welcome sent to the configured welcome channel.");
    } catch (error) {
      client.logs.error(`Welcome test failed: ${error.stack || error}`);
      await message.reply(`Welcome test failed: ${error.message}`);
    }
  },
};
