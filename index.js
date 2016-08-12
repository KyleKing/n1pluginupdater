const _ = require('underscore');
const settings = require(`${__dirname}/settings`);
const pluginUpdater = require(`${__dirname}/pluginUpdater`);

module.exports = {

  checkForUpdate: (pluginData) => {
    if (_.has(pluginData, "repositoryOwner") &&
      _.has(pluginData, "repositoryName") &&
      _.has(pluginData, "currentVersion")) {
      settings.checkForUpdate(pluginUpdater, pluginData);
    } else {
      throw new Error("checkForUpdate(): Pass pluginData to the" +
        " n1pluginupdaterpackage with the properties: repositoryOwner," +
        " repositoryName, and currentVersion");
    }
  },

  deactivate: () => {
    pluginUpdater.deactivate();
  },

}
