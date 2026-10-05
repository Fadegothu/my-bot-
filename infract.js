const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    users: ['1130139643141177445'], // user whitelist via ID
    cooldown: 5, // cooldown in seconds
    data: new SlashCommandBuilder()
        .setName('infract')
        .setDescription('Issues an infraction to a user.')
        .addUserOption(option =>
            option.setName('infractee')
                .setDescription('The user to infract')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of infraction (e.g., strike, warning)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the infraction')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Restrict to members with kick permissions
    
    async execute(interaction, client) { // Accept client as a parameter
        const infractee = interaction.options.getUser('infractee');
        const type = interaction.options.getString('type');
        const reason = interaction.options.getString('reason');
        const infracter = interaction.user;

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31) // Embed color
            .setTitle('<:TRP:1241819276566855750> Staff Infraction')
            .setDescription(`**User:** ${infractee}\`(${infractee.id})\`\n**Infracter:** ${infracter} \`(${infracter.id})\`\n**Punishment:** ${type}\n**Reason:** "${reason}"`)
            .setFooter({ text: "San Antonio Systems", iconURL: client.user.displayAvatarURL() }) // Use client here
            .setTimestamp();

            try {
                await interaction.reply({ 
                    content: "<:TRP_Check:1277336634009849957> Infraction has been submitted", 
                    ephemeral: true 
                });
            } catch (error) {
                console.error('Error sending interaction reply:', error);
                // If the interaction was already replied to, use followUp
                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({ 
                        content: "<:TRP_Check:1277336634009849957> Infraction has been submitted", 
                        ephemeral: true 
                    });
                }
            }

        await interaction.channel.send({
            content: `**Infraction Notice:** ${infractee} – You have been issued an infraction.`,
            embeds: [embed],
            allowedMentions: { users: [infractee.id] }, // Prevents unwanted mentions
        });
    }
};