const { SlashCommandBuilder } = require("discord.js");
const { isTicketStaff } = require("../utils/tickets.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Post the Tallahassee ticket creation panel"),

  async execute(interaction, client) {
    if (!interaction.guild || !isTicketStaff(interaction.member, client.config)) {
      await interaction.reply({
        content: "Only authorized Tallahassee Roleplay staff can post the ticket panel.",
        flags: 64,
      });
      return;
    }

    const payload = {
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
              id: 3,
              type: 10,
              content: "## <:Support_Agent:1556159373678481560>  Contact Us — Tallahassee Roleplay\n> Need a hand? Open a ticket and our team will help you out. Pick the category that best fits your issue from the menu below and a private channel will be opened just for you.",
            },
            {
              id: 4,
              type: 14,
              divider: true,
              spacing: 2,
            },
            {
              id: 5,
              type: 10,
              content: "### Choose your category:\n- **General** General questions, server assistance, player concerns, or issues that do not fit another category.\n- **Management** for imperative inquiries requiring quick attention.\n- **Department** Department-related questions, applications, leadership concerns, or other department assistance.",
            },
            {
              id: 6,
              type: 14,
              divider: true,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  style: 2,
                  type: 2,
                  label: "General",
                  custom_id: "ticketPanelOpen_general-support",
                },
                {
                  style: 2,
                  type: 2,
                  label: "Management",
                  custom_id: "ticketPanelOpen_management",
                },
                {
                  style: 2,
                  type: 2,
                  label: "Department",
                  custom_id: "ticketPanelOpen_department-support",
                },
              ],
            },
            {
              type: 14,
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

    await interaction.channel.send(payload);
    await interaction.reply({ content: "Ticket panel posted.", flags: 64 });
  },
};