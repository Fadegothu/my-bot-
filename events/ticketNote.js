const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'channelCreate', // The event name to match the Discord.js event
    once: false, // Indicates the event should trigger every time a channel is created
    async execute(client, channel) {
        // Define the IDs of the two target categories
        const targetCategoryIDs = ['1236526335036358698', '1236526335036358699']; // Replace with your target category IDs
        
        // Check if the created channel belongs to either of the target categories
        if (targetCategoryIDs.includes(channel.parentId)) {
            // Delay interaction by 1 second
            setTimeout(async () => {
                const messageEmbed = new EmbedBuilder()
                    .setColor(0x2b2d31)
                    .setThumbnail("https://media.discordapp.net/attachments/1248738234524237945/1249354833371332720/1CAC8E64-AB38-42C9-AFFA-3F9E1C308343.jpg?ex=66d7b81c&is=66d6669c&hm=ee64176c61ba40bda07cbeb30fa61b0209ff4d4b7867a493681aea9b0c34d313&=&format=webp&width=905&height=905")
                    .setDescription(`<:TRP_Note2:1280664195846770788> Make sure to provide as much detail as you can for the support member helping you, this will allow quick and smooth support communication to get you the required assistance.\n\n* Don't ignore the ticket.\n* Don't ping support without a reason.\n* Avoid cluttering the ticket.`);

                try {
                    await channel.send({ embeds: [messageEmbed] });
                } catch (error) {
                    console.error(`Failed to send embed message in channel ${channel.id}:`, error);
                }
            }, 1000); // 1 second delay
        }
    },
};