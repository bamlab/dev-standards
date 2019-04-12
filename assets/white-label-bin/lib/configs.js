const path = require('path');
const fs = require('fs');

const configDir = path.join(__dirname, '../../config');

function getConfigList() {
  const files = fs.readdirSync(configDir);
  return files.map(file => file.replace('.js', ''));
}

module.exports = {
  configDir,
  getConfigList
};
