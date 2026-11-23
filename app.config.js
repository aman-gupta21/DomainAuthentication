const { expo } = require('./app.json');

module.exports = {
  ...expo,
  extra: {
    ...expo.extra,
    eas: {
      ...expo.extra?.eas,
      projectId: '45b57a5e-9545-4956-b032-00dbb115ebae',
    },
  },
  ios: {
    ...expo.ios,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? expo.ios?.googleServicesFile,
  },
  android: {
    ...expo.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? expo.android?.googleServicesFile,
  },
};
