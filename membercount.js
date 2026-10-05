const createMemberCountPayload = require("../utils/memberCountPayload.js");

module.exports = {
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    cooldown: 5,
    name: 'mc',
    description: "Shows server member count",
    async execute(message) {
        await message.delete();
        const guild = message.guild;
        await message.channel.send(await createMemberCountPayload(guild));
    }
};