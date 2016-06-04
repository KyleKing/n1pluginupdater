const fs = require('fs-extra');
const GitHubApi = require("github");

// Terribly ugly workaround => need persistent data store
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
    github.releases.listReleases({
      owner: pluginData.repositoryOwner,
      repo: pluginData.repositoryName,
      per_page: 1,
    }, (err, res) => {
      if (err) console.log(err);
      if (res) {
        const curVer = pluginData.currentVersion;
        const avaVer = res[0].tag_name;
        const releaseURL = res[0].html_url;
        const downloadURL = res[0].assets[0].browser_download_url;
        // Update globals:
        process.env.N1_UNSUBSCRIBE_CURRENT_VER = curVer;
        process.env.N1_UNSUBSCRIBE_AVAILABLE_VER = avaVer;
        process.env.N1_UNSUBSCRIBE_AVAILABLE_URL = releaseURL;
        process.env.N1_UNSUBSCRIBE_DOWNLOAD_URL = downloadURL;
        if (avaVer !== curVer && res[0].draft === false) {
          console.log(`New release available at ${releaseURL}!`);
          // Make sure to display thank you message after updating:
          fs.copySync(`${thanksFile}-true.json`, `${thanksFile}.json`);
          return pluginUpdater.activate(pluginUpdater, 'NEW_RELEASE');
        } else if (avaVer === curVer && displayThanksNotification === true) {
          // Only display the thanks notification once
          fs.copySync(`${thanksFile}-false.json`, `${thanksFile}.json`);
          return pluginUpdater.activate(pluginUpdater, 'THANKS');
        }
      } else {
        throw new Error('No Response from Github API!');
      }
      return false;
    });
  },
}
