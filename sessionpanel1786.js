const sessionAnnouncement = require("./ssu.js");

module.exports = {
  name: "sessionpanel1786",
  roleConfigKey: "TICKET_STAFF_ROLE_IDS",
  description: "Post a session panel in this channel.",
  cooldown: 5,
  async execute(message, client) {
    await sessionAnnouncement.execute(message, client, ["--here"]);
  },
};
