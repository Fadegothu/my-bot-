const { ChannelType, PermissionFlagsBits } = require("discord.js");
const {
  getTicketCategoryName,
  makeTicketTopic,
  readBlacklist,
} = require("../utils/tickets.js");

const categoryNames = ["general-support", "management", "staff-report", "department-support"];

module.exports = {
  customID: "ticketCreate",

  async execute(interaction, client, args = []) {
    const category = args[0];
    const parentId = client.config.TICKET_CATEGORY_IDS?.[category];
    if (!interaction.guild || !categoryNames.includes(category) || !parentId) {
      await interaction.reply({ content: "That ticket category is not configured.", ephemeral: true });
      return;
    }

    let blacklist;
    try {
      blacklist = readBlacklist();
    } catch (error) {
      client.logs.error(`Unable to read ticket blacklist: ${error.message}`);
      await interaction.reply({ content: "Ticket creation is temporarily unavailable.", ephemeral: true });
      return;
    }
    if (blacklist[interaction.user.id]) {
      await interaction.reply({
        content: "You cannot create a ticket at this time. Contact server staff if you believe this is an error.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const profile = interaction.fields.getTextInputValue("profile").trim();
    const inquiry = interaction.fields.getTextInputValue("inquiry").trim();
    if (inquiry.length < 15) {
      await interaction.editReply("Please provide an inquiry with at least 15 characters.");
      return;
    }

    const categoryName = getTicketCategoryName(category);
    const safeUsername = interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40);
    const overwrites = [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageMessages,
        ],
      },
      ...(client.config.TICKET_STAFF_ROLE_IDS || []).map((roleId) => ({
        id: roleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      })),
    ];

    try {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${safeUsername}`.slice(0, 100),
        type: ChannelType.GuildText,
        parent: parentId,
        topic: makeTicketTopic({ ownerId: interaction.user.id, category, status: "open" }),
        permissionOverwrites: overwrites,
      });

      const staffMentions = (client.config.TICKET_STAFF_ROLE_IDS || []).map((id) => `<@&${id}>`).join(" ");
      const ticketCreatedAt = Math.floor(Date.now() / 1000);
      const ticketMessage = {
        attachments: [],
        flags: 32768,
        components: [
          {
            id: 1,
            type: 10,
            content: `-# ${staffMentions}`,
          },
          {
            id: 2,
            type: 17,
            accent_color: null,
            spoiler: false,
            components: [
              {
                id: 3,
                type: 12,
                items: [
                  {
                    media: {
                      url: "https://cdn.discordapp.com/attachments/1547003871434383491/1548087389426024531/Copy_of_Copy_of_Copy_of_FCSO_LEADERSHIP_ONLY_20260911_174558_0000.png?ex=6ac371fb&is=6ac2207b&hm=b1a45302e50c7baee1e69ddbd7c6edf2301fadd722ab1bccde0be721a4b62b16",
                      proxy_url: "https://images-ext-1.discordapp.net/external/8Kav3HfUyoefU_5vUDsh3XXzMYPmIKRCa0H9IkcZZps/https/banners.monolithtech.cc/clearwater_v3_assistance.png",
                      width: 2000,
                      height: 600,
                      content_type: "image/png",
                    },
                    description: null,
                    spoiler: false,
                  },
                ],
              },
              {
                id: 4,
                type: 14,
                divider: true,
                spacing: 1,
              },
              {
                id: 5,
                type: 10,
                content: `# <:wave1:1498256387275362325> Hello ${interaction.user.username} — ${categoryName}\n> We kindly ask that you refrain from pinging members of our team, we will be with you as soon as possible. Any left-out details, we encourage you to add it here.`,
              },
              {
                id: 6,
                type: 14,
                divider: true,
                spacing: 2,
              },
              {
                id: 14,
                type: 10,
                content: `## <:chats:1498255369288421407> Inquiry\n${inquiry}`,
              },
              {
                id: 15,
                type: 14,
                divider: true,
                spacing: 2,
              },
              {
                id: 7,
                type: 10,
                content: `## <:book:1498255010947928154> Account Information\n**Username:** ${interaction.user.tag}\n**Roblox Profile:** ${profile || "Not provided"}\n**Ticket Created:** <t:${ticketCreatedAt}:D>\n`,
              },
              {
                id: 8,
                type: 14,
                divider: true,
                spacing: 2,
              },
              {
                id: 11,
                type: 14,
                divider: false,
                spacing: 1,
              },
              {
                id: 13,
                type: 1,
                components: [
                  {
                    style: 2,
                    type: 2,
                    label: "Claim",
                    custom_id: "ticketClaim",
                  },
                  {
                    style: 4,
                    type: 2,
                    label: "Close",
                    custom_id: "ticketClose",
                  },
                ],
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

      await channel.send(ticketMessage);
      await interaction.editReply(`Your ticket is ready: ${channel}`);
    } catch (error) {
      client.logs.error(`Failed to create ticket: ${error.stack || error}`);
      await interaction.editReply("I couldn't create your ticket. Please contact server staff.");
    }
  },
};