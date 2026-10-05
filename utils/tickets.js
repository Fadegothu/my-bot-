const fs = require("fs");
const path = require("path");

const TICKET_TOPIC_PREFIX = "la-ticket:v1";
const BLACKLIST_PATH = path.join(__dirname, "ticketBlacklist.json");

function getTicketMetadata(channel, config) {
  if (!channel?.guild || !channel.parentId || !channel.topic) return null;

  const values = new Map(
    channel.topic
      .split(";")
      .slice(1)
      .map((entry) => entry.split("="))
      .filter(([key, value]) => key && value)
  );
  const category = values.get("category");
  const categoryId = config.TICKET_CATEGORY_IDS?.[category];

  if (
    !channel.topic.startsWith(`${TICKET_TOPIC_PREFIX};`) ||
    !categoryId ||
    channel.parentId !== categoryId ||
    !values.get("owner") ||
    !values.get("status")
  ) {
    return null;
  }

  return {
    ownerId: values.get("owner"),
    category,
    status: values.get("status"),
    claimedBy: values.get("claimedBy"),
  };
}

function makeTicketTopic(metadata) {
  const claimedBy = metadata.claimedBy ? `;claimedBy=${metadata.claimedBy}` : "";
  return `${TICKET_TOPIC_PREFIX};owner=${metadata.ownerId};category=${metadata.category};status=${metadata.status}${claimedBy}`;
}

function isTicketStaff(member, config) {
  const roleIds = config.TICKET_STAFF_ROLE_IDS;
  return (
    Array.isArray(roleIds) &&
    roleIds.length > 0 &&
    roleIds.some((roleId) => member?.roles?.cache?.has(roleId))
  );
}

function readBlacklist() {
  try {
    const contents = fs.readFileSync(BLACKLIST_PATH, "utf8");
    const blacklist = JSON.parse(contents);
    return blacklist && typeof blacklist === "object" && !Array.isArray(blacklist)
      ? blacklist
      : {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

function writeBlacklist(blacklist) {
  fs.writeFileSync(BLACKLIST_PATH, `${JSON.stringify(blacklist, null, 2)}\n`);
}

function getTicketCategoryName(category) {
  return {
    "general-support": "General Support",
    management: "Management",
    "staff-report": "Staff Report",
    "department-support": "Department Support",
  }[category];
}

module.exports = {
  getTicketMetadata,
  getTicketCategoryName,
  isTicketStaff,
  makeTicketTopic,
  readBlacklist,
  writeBlacklist,
};