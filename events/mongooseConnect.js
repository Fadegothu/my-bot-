module.exports = {
  name: 'ready',
  once: true,
  async execute() {
    console.log("MongoDB connection disabled; skipping database setup.");
  },
};