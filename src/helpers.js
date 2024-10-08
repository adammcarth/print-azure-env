/**
 * Formats environment variables into the standard "dotenv" format for local development.
 */
module.exports.formatDotEnv = (appSettings) => {
  return appSettings
    .map(appSetting => `${appSetting.name}=${appSetting.value}`)
    .join('\n');
};

/**
 * Formats environment variables into the format used for local Azure Function
 * App development (local.settings.json)
 */
module.exports.formatLocalSettings = (appSettings) => {
  return JSON.stringify(
    {
      IsEncrypted: false,
      Values: appSettings.reduce((all, appSetting) => ({
        ...all,
        [appSetting.name]: appSetting.value,
      }), {}),
    },
    null,
    2,
  );
};

/**
 * Outputs environment variables in the Azure format which can be pasted into
 * the "Advanced Editor" tab within an app service or function app.
 */
module.exports.formatAzure = (appSettings) => {
  return JSON.stringify(appSettings, null, 2);
};
