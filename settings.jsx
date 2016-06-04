const fs = require('fs-extra');
const GitHubApi = require("github");

// Terribly ugly workaround => need persistent data store alternative
const thanksFile = `${__dirname}/persistent-settings/thanks`;
const {displayThanksNotification} = require(`${thanksFile}.json`);

module.exports = {
  // checkForUpdate() sends a request to the Github API to see if a new release is available
  // The function also updates global variables with package settings
  //
  checkForUpdate: (pluginUpdater, pluginData) => {
    const github = new GitHubApi({
      version: '3.0.0',
      debug: false,
      protocol: 'https',
      host: 'api.github.com',
      timeout: 5000,
      headers: {
        'user-agent': 'N1-Updater',
      },
    });

    // // Make parent package.json available globally
    // process.env.repositoryOwner = pluginData.repositoryOwner;
    process.env.repositoryName = pluginData.repositoryName;
    // process.env.currentVersion = pluginData.currentVersion;

    github.releases.listReleases({
      owner: pluginData.repositoryOwner,
      repo: pluginData.repositoryName,
      per_page: 1,
    }, (err, res) => {
      if (err) console.log(err);
      try {
        // Decipher response:
        const curVer = pluginData.currentVersion;
        const avaVer = res[0].tag_name;
        const releaseURL = res[0].html_url;
        const downloadURL = res[0].assets[0].browser_download_url;
        // Update globals:
        process.env.PLUGIN_CURRENT_VER = curVer;
        process.env.PLUGIN_AVAILABLE_VER = avaVer;
        process.env.PLUGIN_AVAILABLE_URL = releaseURL;
        process.env.PLUGIN_DOWNLOAD_URL = downloadURL;
        // Determine updated-ness of plugin
        if (avaVer !== curVer && res[0].draft === false) {
          console.log(`New release available at ${releaseURL}!`);
          // Make sure to display thank you message after updating:
          fs.copySync(`${thanksFile}-true.json`, `${thanksFile}.json`);
          return pluginUpdater.activate('NEW_RELEASE');
        } else if (avaVer === curVer && displayThanksNotification === true) {
          // Only display the thanks notification once
          fs.copySync(`${thanksFile}-false.json`, `${thanksFile}.json`);
          return pluginUpdater.activate('THANKS');
        }
      } catch (e) {
        console.warn('No Response from Github API!');
        return e
      }
      return true;
    });
  },
}
