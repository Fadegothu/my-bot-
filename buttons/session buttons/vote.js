const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
let voteCount = 0;

module.exports = {
  customID: "vote",
  execute: async function (interaction) {
    const reply = interaction.message;
    if (voters.has(interaction.user.id)) {
      voteCount = voters.size - 1;
      voters.delete(interaction.user.id);

      const label = `${voteCount}/${maxVotes}`;
      const voteButton = new ButtonBuilder()
        .setCustomId("vote")
        .setLabel(label)
        .setStyle(ButtonStyle.Success);

      const voterListButton = new ButtonBuilder()
        .setCustomId("voters")
        .setLabel("Voters")
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(
        voteButton,
        voterListButton
      );
      reply.edit({ components: [row] });

      const unvotedEmbed = new EmbedBuilder()
        .setColor("2b2d31")
        .setDescription(
          `**I have unregistered your vote!** We now have \`${voteCount}\` vote(s).`
        );

      interaction.reply({ embeds: [unvotedEmbed], ephemeral: true });
    } else {
      voteCount = voters.size + 1;
      voters.add(interaction.user.id);

      let row;
      if (voteCount === maxVotes) {
        const updatedSPollEmbed = new EmbedBuilder()
          .setColor("2b2d31")
          .setDescription(
            `The session vote has reached the required \`${maxVotes}\` vote(s)! The session will start soon.`
          );

        reply.channel.send({
          embeds: [updatedSPollEmbed],
        });

        row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("vote")
            .setLabel(`${voteCount}/${maxVotes}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("voters")
            .setLabel("Voters")
            .setStyle(ButtonStyle.Secondary)
        );
      } else {
        row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("vote")
            .setLabel(`${voteCount}/${maxVotes}`)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("voters")
            .setLabel("Voters")
            .setStyle(ButtonStyle.Secondary)
        );
      }

      reply.edit({ components: [row] });

      const votedEmbed = new EmbedBuilder()
        .setColor("2b2d31")
        .setDescription(
          `**I have registered your vote!** We are now at \`${voteCount}\` vote(s).`
        );

      interaction.reply({ embeds: [votedEmbed], ephemeral: true });
    }
  },
};
