function createPendingMailPayload(user) {
  return {
    attachments: [],
    flags: 32768,
    components: [
      {
        id: 1,
        type: 10,
        content: `-# ${user}`,
      },
      {
        id: 2,
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [
          {
            type: 9,
            components: [
              {
                id: 5,
                type: 10,
                content: `# <:wave:1514337303907274902> Hello ${user} — You Have New Mail`,
              },
            ],
            accessory: {
              style: 2,
              type: 2,
              label: "View Mail",
              custom_id: `viewPendingMail_${user.id}`,
            },
          },
          {
            id: 6,
            type: 14,
            divider: true,
            spacing: 2,
          },
          {
            id: 12,
            type: 12,
            items: [
              {
                media: {
                  url: "https://cdn.discordapp.com/attachments/1547003871434383491/1548087392655909005/Copy_of_Copy_of_Copy_of_FCSO_LEADERSHIP_ONLY_20260911_174625_0000.png?ex=6ac371fc&is=6ac2207c&hm=8f8e9f46fae5dbb6413a83424df5828453c20502e213669bfde6f08dc9179bce",
                  proxy_url: "https://images-ext-1.discordapp.net/external/jru-L8oaz59H6ltz44ruE7DB8knxxDa96sXoqpL9hks/https/banners.monolithtech.cc/clearwater_v3_footer.png",
                  width: 2040,
                  height: 80,
                  content_type: "image/png",
                },
                description: null,
                spoiler: false,
              },
            ],
          },
        ],
      },
    ],
    allowedMentions: { users: [user.id] },
  };
}

function createRevealedMailPayload(message) {
  return {
    attachments: [],
    flags: 32768,
    components: [
      {
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [
          {
            id: 5,
            type: 10,
            content: `# MailBox\n\n${message}`,
          },
          {
            id: 6,
            type: 14,
            divider: true,
            spacing: 2,
          },
          {
            id: 12,
            type: 12,
            items: [
              {
                media: {
                  url: "https://cdn.discordapp.com/attachments/1547003871434383491/1548087392655909005/Copy_of_Copy_of_Copy_of_FCSO_LEADERSHIP_ONLY_20260911_174625_0000.png?ex=6ac371fc&is=6ac2207c&hm=8f8e9f46fae5dbb6413a83424df5828453c20502e213669bfde6f08dc9179bce",
                  proxy_url: "https://images-ext-1.discordapp.net/external/jru-L8oaz59H6ltz44ruE7DB8knxxDa96sXoqpL9hks/https/banners.monolithtech.cc/clearwater_v3_footer.png",
                  width: 2040,
                  height: 80,
                  content_type: "image/png",
                },
                description: null,
                spoiler: false,
              },
            ],
          },
        ],
      },
    ],
  };
}

module.exports = { createPendingMailPayload, createRevealedMailPayload };
