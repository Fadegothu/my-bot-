const fs = require('fs');
const path = require('path');
const cmdDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(cmdDir)) {
  if (!file.endsWith('.js')) continue;
  const full = path.join(cmdDir, file);
  try {
    const mod = require(full);
    console.log(file, 'ok', typeof mod.execute, mod.data?.name || mod.name || 'no name');
  } catch (err) {
    console.error(file, 'ERROR', err.message);
  }
}
