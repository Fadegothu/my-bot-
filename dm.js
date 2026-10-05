const { pendingMessages } = require("./pendingMessages.js");
const { createPendingMailPayload } = require('../utils/pendingMailPayloads.js');

module.exports = {
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    cooldown: 5,
    name: "dm",
    description: "DM a certain user.",
    async execute(message, client, args) {
        const userId = args[0]?.replace(/[<@!>]/g, "");
        const dmMessage = args.slice(1).join(" ").trim();
        if (!/^\d+$/.test(userId || "") || !dmMessage) {
            await message.reply("Usage: -dm [user mention or ID] [message]");
            return;
        }
        if (dmMessage.length > 3500) {
            await message.reply("Pending mail must be 3500 characters or fewer.");
            return;
        }

        try {
            const user = await client.users.fetch(userId);
            if (user.bot) {
                await message.reply("You cannot send pending mail to a bot.");
                return;
            }
            pendingMessages.set(user.id, dmMessage);
            await user.send(createPendingMailPayload(user));
            await message.channel.send(`Initial DM sent to ${user}.`);
        } catch (error) {
            pendingMessages.delete(userId);
            client.logs.error(`Failed to send pending mail to ${userId}: ${error.stack || error}`);
            await message.reply("I couldn't DM that user. Check the user ID and their DM privacy settings.");
        }
    }
};

module.exports.pendingMessages = pendingMessages;