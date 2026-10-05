const { EmbedBuilder } = require("@discordjs/builders");
const axios = require("axios");
const nbx = require("noblox.js");

module.exports = {
  name: "ssu",
  roleConfigKey: "TICKET_STAFF_ROLE_IDS",
  description: "Start a server session!",
  cooldown: 5,
  async execute(message, client, args) {
    await message.delete();

    const targetChannel = args?.includes("--here")
      ? message.channel
      : client.channels.cache.get("1535084146609758349") ??
        (await client.channels.fetch("1535084146609758349").catch(() => null));

    if (!targetChannel) {
      client.logs.error("Session announcement channel was not found.");
      return;
    }

    try {
      if (!client.config.ERLC_API) {
        throw new Error("ERLC_API is not configured.");
      }

      const apiBaseUrl = (client.config.ERLC_BASEURL || "https://api.policeroleplay.community/v1")
        .replace(/\/+$/, "");
      const response = await axios.get(
        `${apiBaseUrl}/server`,
        {
          headers: {
            "Server-Key": client.config.ERLC_API,
          },
        }
      );
      const server = response.data;

      const ownerName = await nbx.getUsernameFromId(server.OwnerId);
      const ssuEmbed = new EmbedBuilder()
        .setDescription(
          `Our team is hosting a session! Join our **[ERLC server](https://policeroleplay.community/join/rptampa)** with the information below.\n\n<:TRP_Text1:1277437292465619018> **Server Name:** \` ${server.Name} \` \n<:TRP_Text2:1277437378658697236> **Server Code:** \` ${server.JoinKey} \`\n<:TRP_Text3:1277437507692269608> **Server Owner:** \` ${ownerName} \` or [Quick Link](https://www.roblox.com/users/${server.OwnerId}/profile)`
        )
        .setColor(0x2b2d31)
        .setFooter({ text: "Immersive • Realistic • Fun" })
        .setImage(
          "https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&"
        );

      await targetChannel.send({
        embeds: [ssuEmbed],
        content: "@everyone - New Session Notification!",
        allowedMentions: { parse: ["everyone"] },
      });
    } catch (error) {
      client.logs.error(`Failed to send session panel: ${error.stack || error}`);
      if (args?.includes("--here")) {
        await message.channel.send(`Could not send the session panel: ${error.message}`);
      }
    }
  },
};
