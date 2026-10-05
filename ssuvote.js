const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require('discord.js');

global.maxVotes = 10;
global.voters = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ssuvote')
    .setDescription('Starts a session vote panel for the server.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel to post the vote panel in')
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const targetChannel = interaction.options.getChannel('channel') ?? interaction.channel;

    if (!targetChannel?.isTextBased?.()) {
      return interaction.reply({ content: 'Please choose a text channel.', ephemeral: true });
    }

    voters.clear();

    const label = `0/${maxVotes}`;
    const voteButton = new ButtonBuilder()
      .setCustomId('vote')
      .setLabel(label)
      .setStyle(ButtonStyle.Success);

    const voterListButton = new ButtonBuilder()
      .setCustomId('voters')
      .setLabel('Voters')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(voteButton, voterListButton);
    const timeNow = Math.floor(Date.now() / 1000);

    const ssuvoteEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setFooter({ text: 'Immersive • Realistic • Fun' })
      .setDescription(
        `The <@&1236526332662517775> Team are thinking of starting a server session! If you'd like to participate and roleplay within the San Antonio Systems community, we highly suggest you vote up.\n\n<:TRP_Text1:1277437292465619018> Votes Required: \`${maxVotes}\`\n<:TRP_Text2:1277437378658697236> Vote Time Start: <t:${timeNow}:R>\n<:TRP_Text3:1277437507692269608> Started by: ${interaction.user}`
      )
      .setImage(
        'https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&'
      );

    await interaction.reply({ content: `Posting the session vote panel in ${targetChannel}.`, ephemeral: true });
    await targetChannel.send({
      content: '@everyone - New Session Vote Notification!',
      embeds: [ssuvoteEmbed],
      components: [row],
    });
  },
};
