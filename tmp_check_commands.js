const { Collection } = require('discord.js');
const Client = {
  commands: new Collection(),
  buttons: new Collection(),
  menus: new Collection(),
  modals: new Collection(),
  messages: new Collection(),
};
require('./utils/ComponentLoader.js')(Client);
console.log('commands loaded:', [...Client.commands.keys()]);
console.log('has ssuvote:', Client.commands.has('ssuvote'));
