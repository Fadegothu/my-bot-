const { SlashCommandBuilder } = require('@discordjs/builders');
const createMemberCountPayload = require("../utils/memberCountPayload.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc')
    .setDescription('Shows server member count.'),
  async execute(interaction, client) {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const payload = await createMemberCountPayload(guild);
    await interaction.reply({ ...payload, flags: payload.flags | 64 });
  },
};
