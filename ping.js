module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	async execute(message, client, args) {
        const sent = await message.reply({ content: "Pinging...", fetchReply: true });
        const roundTripLatency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = client.ws.ping;

        await sent.edit({
            content: `Pong! Response: ${roundTripLatency}ms · Discord: ${apiLatency}ms`,
            embeds: [],
        });
    }
}