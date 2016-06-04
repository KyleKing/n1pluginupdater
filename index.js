const _ = require('underscore');
const settings = require(`${__dirname}/settings`);
const pluginUpdater = require(`${__dirname}/pluginUpdater`);

// // Ended up not working? - will revisit
// // https://www.npmjs.com/package/parent-package-json
// const parent = require('parent-package-json');

module.exports = {

  // Activate is called when the package is loaded. If your package previously
  // saved state using `serialize` it is provided.
  //
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
