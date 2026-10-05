module.exports = {
    roleConfigKey: "TICKET_STAFF_ROLE_IDS",
    name: 'group',
    description: "Gets the San Antonio Systems group link!",
    cooldown: 5,
    async execute(message, client, args) {
        await message.delete();
        message.channel.send({ content: `<:TRP_Roblox:1277338300025274501> The [San Antonio Systems](<https://www.roblox.com/groups/33102342/San-Antonio-Systems>) group can be found here!\n-# <:TRP_World:1277336783016689706> Join this group for official San Antonio Systems updates and more.` })
    }
}