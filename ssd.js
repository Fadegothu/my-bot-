const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  roleConfigKey: "TICKET_STAFF_ROLE_IDS",
  cooldown: 5,
  name: "ssd",
  description: "Send the server shutdown message!",
  async execute(message, client, args) {
    await message.delete();

    // Specify the channel ID where the message should be sent
    const targetChannelId = "1535084146609758349"; // Replace with the actual channel ID
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (!targetChannel) {
      console.error(`Channel with ID ${targetChannelId} not found.`);
      return;
    }

    const ssdEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setFooter({ text: "Immersive • Realistic • Fun " })
      .setImage(
        "https://cdn.discordapp.com/attachments/1248738234524237945/1276940776752021565/image.png?ex=66cb5b45&is=66ca09c5&hm=d9903bf8e1457565489e58bde881b04d7cdc65161422579d0df27090254213cf&"
      )
      .setDescription(
        `The <@&1535084145846259759> Team has deemed it necessary to shutdown the game server for the moment! Not to worry, another session will be made public if they think it's right! \n\n<:TRP_Arrow:1278428342932082688> Want to get notified of sessions? Click the "[Get Notified!](https://discord.com/channels/1236526332628828231/1535084146609758349/1274513012400586826)" button.`
      );

    try {
      await targetChannel.send({
        content: "Session Update Notification!",
        embeds: [ssdEmbed],
      });
    } catch (error) {
      console.error(`Failed to send the shutdown message: ${error}`);
    }
  },
};
