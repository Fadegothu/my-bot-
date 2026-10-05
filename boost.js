const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const nbx = require("noblox.js");

module.exports = {
  roleConfigKey: "TICKET_STAFF_ROLE_IDS",
  cooldown: 5,
  name: "boost",
  description: "Send a server mc message - Uses ERLC API",
  async execute(message, client, args) {
    await message.delete();

    // Specify the channel ID where the message should be sent
    const targetChannelId = "1535084146609758349"; // Replace with the actual channel ID
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (!targetChannel) {
      console.error(`Channel with ID ${targetChannelId} not found.`);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.policeroleplay.community/v1/server",
        {
          headers: {
            "Server-Key": client.config.ERLC_API,
          },
        }
      );
      const server = response.data;

      await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

      const response2 = await axios.get(
        "https://api.policeroleplay.community/v1/server/players",
        {
          headers: {
            "Server-Key": client.config.ERLC_API,
          },
        }
      );

      const ownerName = await nbx.getUsernameFromId(server.OwnerId);
      const boostEmbed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setFooter({ text: "Immersive • Realistic • Fun" })
        .setDescription(
          `The <@&1236526332662517775> Team have seen a decline in players in game, and is currently sitting at \`${server.CurrentPlayers}\` player(s). Tampa is offering players the ability to join and experience enjoyable roleplay moments!\n\n<:TRP_Text1:1277437292465619018> **Server Name:** \`${server.Name}\` or [rptampa](https://policeroleplay.community/join/rptampa)\n<:TRP_Text3:1277437507692269608> **Server Owner:** \`${ownerName}\` or [Quick Link](https://www.roblox.com/users/${server.OwnerId}/profile)`
        )
        .setImage(
          "https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&"
        );

      await targetChannel.send({
        embeds: [boostEmbed],
        content:
          "@here `@Sessions` `@Staff Team` - Low Membercount Notification!",
      });
    } catch (error) {
      console.error("Error fetching server data:", error);
    }
  },
};
