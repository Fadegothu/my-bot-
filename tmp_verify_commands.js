const config = require('./config.json');
const { REST } = require('discord.js');

(async () => {
  const rest = new REST({ version: '10' }).setToken(config.TOKEN);
  try {
    const commands = await rest.get(`/applications/${config.APP_ID}/guilds/${config.GUILD_ID}/commands`);
    console.log('Registered commands:', commands.map(c => c.name));
  } catch (err) {
    console.error('STATUS', err.status);
    console.error('MESSAGE', err.message);
    console.error('RAW', JSON.stringify(err.rawError || {}, null, 2));
  }
})();
