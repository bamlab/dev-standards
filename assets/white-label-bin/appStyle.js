#!/usr/bin/env node

const program = require('commander');
require('colors');
const shippingConfigs = require('./lib/Configs');
const serviceAgent = require('./lib/appStyle.js');

let commandValid = false;
const configs = shippingConfigs.getConfigList();

function checkCommandValid(config) {
  commandValid = configs.indexOf(config) !== -1;
  return commandValid;
}

program
  .version(require('../../../YourAwesomeProject/package').version)
  .description('Save and restore appStyle.');

program
  .command('save <config>')
  .alias('s')
  .description('Save the appStyle for a shipping config.')
  .action(config => {
    if (!checkCommandValid(config)) {
      return;
    }
    serviceAgent.saveAppStyle(config);
  });

program
  .command('restore <config>')
  .alias('r')
  .description('Save the appStyle from a shipping config.')
  .action(config => {
    if (!checkCommandValid(config)) {
      return;
    }
    serviceAgent.restoreAppStyle(config);
  });

program.on('--help', () => {
  console.log('');
  console.log('  Available shipping config : ');
  console.log('');

  configs.forEach(config => {
    console.log(`\t - ${config}`);
  });
});

program.parse(process.argv);

if (!commandValid) {
  program.help();
}
