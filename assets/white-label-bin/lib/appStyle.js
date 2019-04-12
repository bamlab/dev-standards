const path = require('path');
const fs = require('fs');
require('colors');
const shippingConfigs = require('./configs');

const appStylePath = path.join(__dirname, '../../../../YourAweSomeProject/src/appStyle.js');
const destDirName = shippingConfigs.configDir;

function copyAppStyle(config, saving) {
  const savePath = path.join(destDirName, config, 'appStyle/appStyle.js');
  const restorePath = appStylePath;

  const destFile = saving ? savePath : restorePath;
  const initialFile = saving ? restorePath : savePath;

  return new Promise((resolve, reject) => {
    try {
      console.log('Copying the appStyle');
      fs.createReadStream(initialFile).pipe(fs.createWriteStream(destFile));
    } catch (e) {
      console.log('Error copying the appStyle'.red);
      reject(e);
    }

    const verb = saving ? 'saved' : 'restored';
    console.log(`AppStyle successfully ${verb}`.green);
    resolve();
  });
}

function saveAppStyle(config) {
  console.log('');
  console.log(`Saving the appStyle for config ${config}`.yellow);

  const destDir = path.join(destDirName, config);

  if (!fs.existsSync(destDir)) {
    try {
      fs.mkdirSync(destDir);
    } catch (e) {
      console.log(e);
    }
  }
  if (!fs.existsSync(path.join(destDir, 'appStyle'))) {
    try {
      fs.mkdirSync(path.join(destDir, 'appStyle'));
    } catch (e) {
      console.log(e);
    }
  }

  return copyAppStyle(config, true);
}

function restoreAppStyle(config) {
  console.log('');
  console.log(`Restoring the appStyle for config ${config}`.yellow);

  return copyAppStyle(config, false);
}

module.exports = {
  saveAppStyle,
  restoreAppStyle
};
