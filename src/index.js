#!/usr/bin/env node

/*
 * Author: Adam McArthur
 * Description: Downloads environment variables from an Azure App Service
 * or Function App and logs them to the console in a variety of formats.
 */

const { parseArgs, promisify } = require('node:util');
const { exec: syncExec } = require('node:child_process');
const { formatDotEnv, formatLocalSettings, formatAzure } = require('./helpers');

const { values: cliArgs } = parseArgs({
  options: {
    help: { type: 'boolean', short: 'h' },
    type: { type: 'string', short: 't' },
    'resource-group': { type: 'string', short: 'r' },
    name: { type: 'string', short: 'n' },
    slot: { type: 'string', short: 's' },
    format: { type: 'string', short: 'f' },
    'no-keyvault': { type: 'boolean' },
  },
});
const exec = promisify(syncExec);

const main = async () => {
  if (Object.keys(cliArgs).length === 0 || cliArgs.help) {
    console.info('\n');
    console.info('\x1b[1mDescription:\x1b[0m');
    console.info(
      '\nFetches environment variables from an Azure App Service (or Function App)'
      + ' and prints them in a variety of formats.\n',
    );
    console.info('\x1b[1mUsage:\x1b[0m', '\n');
    console.info('  print-azure-env');
    console.info('    -t, --type "webapp|functionapp"');
    console.info('    -r, --resource-group "resource-group-name"');
    console.info('    -n, --name "resource-name"');
    console.info('    -s, --slot "optional-slot-name"');
    console.info('    -f, --format "dotenv|local_settings|azure"');
    console.info('    --no-keyvault')
    return
  }
  const {
    type,
    'resource-group': rg,
    name: n,
    slot: s,
    format,
    'no-keyvault': noKeyvault,
  } = cliArgs;
  let command = `az ${type} config appsettings list -g ${rg} -n ${n}`
  if (s) {
    command += ` -s ${s}`
  }
  const { stdout: appSettingsText } = await exec(command);
  const appSettings = JSON.parse(appSettingsText);
  const processedAppSettings = [];
  for (const appSetting of appSettings) {
    const test = /^@Microsoft.KeyVault\(SecretUri=https:\/\/([a-z0-9\-]*).vault.azure.net\/secrets\/([a-z0-9\-]*)\)$/.exec(appSetting.value);
    if (!test || noKeyvault) {
      processedAppSettings.push(appSetting);
      continue;
    }
    const [, vaultName, secretName] = test;
    const { stdout: keyVaultSecretValueText } = await exec(
      `az keyvault secret show --vault-name ${vaultName}`
      + ` --n ${secretName} --query value`
    );
    const keyVaultSecretValue = JSON.parse(keyVaultSecretValueText);
    processedAppSettings.push({
      name: appSetting.name,
      slotSetting: appSetting.slotSetting,
      value: keyVaultSecretValue,
    });
  }
  processedAppSettings.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  switch (format) {
    case 'local_settings':
      console.info(formatLocalSettings(processedAppSettings));
      break;
    case 'azure':
      console.info(formatAzure(processedAppSettings));
      break;
    case 'dotenv':
    default:
      console.info(formatDotEnv(processedAppSettings));
  };
};

main();
