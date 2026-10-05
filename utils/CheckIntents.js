module.exports = (client) => {
  const enabled = client.options.intents.toArray();
  console.log(`[intents] Enabled for this client: ${enabled.join(", ")}`);
  for (const requiredIntent of ["GuildMembers", "GuildPresences", "GuildMessages", "MessageContent"]) {
    if (!enabled.includes(requiredIntent)) {
      console.error(`[intents] ${requiredIntent} is required for welcome events and -testwelcome.`);
    }
  }
};
