const { EmbedBuilder } = require("discord.js");

module.exports = {
  customID: "faq-select",

  async execute(interaction, client) {
    const selectedValue = interaction.values?.[0];
    const faq = (client.config.FAQ || []).find((item) => item.value === selectedValue);

    if (!faq) {
      await interaction.reply({
        content: "That FAQ is unavailable right now.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(faq.label)
      .setDescription(faq.answer);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
