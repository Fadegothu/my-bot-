const { AttachmentBuilder } = require('discord.js'); // For Discord.js v14

module.exports = {
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    cooldown: 5,
    name: "hire",
    description: "Sends the hire message",
    async execute(message, client, args) {
        await message.delete();

        // Check if an argument was provided
        if (args.length === 0) {
            return message.channel.send({ content: "<:TRP_Cross:1277336701970284626> Missing argument: [@user]", ephemeral: true });
        }

        // Get the user from the mention, ID, or username
        const input = args[0];
        let user;
        
        if (/<@!?(\d+)>/.test(input)) { // Check if the input is a mention
            const userId = input.replace(/[<@!>]/g, '');
            user = await client.users.fetch(userId).catch(() => null);
        } else if (/^\d+$/.test(input)) { // Check if the input is a user ID
            user = await client.users.fetch(input).catch(() => null);
        } else { // Assume the input is a username
            user = client.users.cache.find(u => u.username.toLowerCase() === input.toLowerCase());
        }

        // Ensure the user exists
        if (!user) {
            return message.channel.send({ content: "<:TRP_Cross:1277336701970284626> Invalid user mention, ID, or username.", ephemeral: true });
        }

        // Construct the message content with a ping
        const userMention = `<@${user.id}>`;
        const hireMessage = `<:TRP_World:1277336783016689706> Hey there, ${userMention}, you have been accepted into the staff program here at San Antonio Systems!\n-# We ask that you join the <:TRP_Melonly:1279437765020221472> [Official San Antonio Systems Melonly](<https://melonly.xyz/dashboard?joinCode=OZKVZT>) & <:TRP_Roblox:1277338300025274501> [ROBLOX Group](<https://www.roblox.com/groups/33102342/San-Antonio-Systems>)`;

        
        // Send the hire message with the image
        await message.channel.send({
            content: hireMessage
        });
    }
}