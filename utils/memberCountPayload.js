async function createMemberCountPayload(guild) {
  await guild.members.fetch();

  const onlineCount = guild.members.cache.filter(
    (member) => member.presence && member.presence.status !== "offline"
  ).size;

  return {
    attachments: [],
    flags: 32768,
    components: [
      {
        id: 1,
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [
          {
            id: 2,
            type: 10,
            content: `<:member:1527725920759185469> **Total**: ${guild.memberCount}\n<:status:1556416963427696661> **Online**: ${onlineCount}\n<:d_rocket:1556157281438007317> **Boost**: ${guild.premiumSubscriptionCount ?? 0}\n\n-# **Tallahassee Systems**`,
          },
        ],
      },
    ],
  };
}

module.exports = createMemberCountPayload;
