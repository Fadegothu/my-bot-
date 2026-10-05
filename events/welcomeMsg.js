const sendWelcome = require("../utils/sendWelcome.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    try {
      await sendWelcome(client, member);
    } catch (error) {
      client.logs.error(`Failed to send join welcome in ${member.guild.name}: ${error.stack || error}`);
    }
  },
};