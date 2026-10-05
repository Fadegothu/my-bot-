const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const WELCOME_CHANNEL_ID = "1556143811649085533";

async function sendWelcome(client, member) {
  const guild = member.guild;
  const welcomeChannel =
    guild.channels.cache.get(WELCOME_CHANNEL_ID) ??
    await guild.channels.fetch(WELCOME_CHANNEL_ID);

  if (!welcomeChannel?.isTextBased() || typeof welcomeChannel.send !== "function") {
    throw new Error(`Welcome channel ${WELCOME_CHANNEL_ID} is missing or is not a text channel.`);
  }

  const memberCountButton = new ButtonBuilder()
    .setCustomId("mcButton")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("1527725920759185469")
    .setLabel(guild.memberCount.toString())
    .setDisabled(true);
  const homeButton = new ButtonBuilder()
    .setLabel("Home")
    .setEmoji("1527988062980800683")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/channels/1452671275381166205/1556143799271563414");

  const sent = await welcomeChannel.send({
    content: `Welcome ${member} to \`${guild.name}\`. We're glad to have you here!`,
    components: [new ActionRowBuilder().addComponents(memberCountButton, homeButton)],
    allowedMentions: { users: [member.id] },
  });
  client.logs.info(`Sent join welcome for ${member.user.tag} in ${guild.name}.`);
  return sent;
}

module.exports = sendWelcome;
