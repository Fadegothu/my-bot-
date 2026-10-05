module.exports = { 
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    cooldown: 5,
    name: "say",
    description: "Say cmd for saying need!",
    async execute(message, client, args) {
        await message.delete();
        // Check for command arguments
        if (args.length === 0) {
            return message.reply("Please provide the input to echo back.");
        }

        const input = args.join(" ");
        await message.channel.send(`${input}`);
// ANY CUSTOM MESSAGE        await message.channel.send(`# <:TRP_Home:1277338242940932157> Command Migration\n> All session based commands have been migrated to the <@1277007038727196774>  bot, these will generally work if the bot is online, if you have any questions ping or DM @dime_out .\n-# Tampa Management // Ownership Team`)
        await message.react("<:TRP_Check:1277336634009849957>")
    }
};