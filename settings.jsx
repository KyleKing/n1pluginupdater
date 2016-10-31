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

    github.releases.listReleases({
      owner: pluginData.repositoryOwner,
      repo: pluginData.repositoryName,
      per_page: 1,
    }, (err, res) => {
      if (err) console.log(err);
      try {
        // Decipher response:
        const resData = {
          curVer: pluginData.currentVersion,
          avaVer: res[0].tag_name,
          releaseURL: res[0].html_url,
          downloadURL: res[0].assets[0].browser_download_url,
          repositoryName: pluginData.repositoryName,
        };
        // Determine updated-ness of plugin
        if (resData.avaVer !== resData.curVer && res[0].draft === false) {
          console.log(`New release available at ${resData.releaseURL}!`);
          // Make sure to display thank you message after updating:
          fs.copySync(`${thanksFile}-true.json`, `${thanksFile}.json`);
          return pluginUpdater.activate('NEW_RELEASE', resData);
        } else if (resData.avaVer === resData.curVer && displayThanksNotification === true) {
          // Only display the thanks notification once
          fs.copySync(`${thanksFile}-false.json`, `${thanksFile}.json`);
          return pluginUpdater.activate('THANKS', resData);
        }
        console.log('n1pluginupdater: No update notification to show')
        return true;
      } catch (e) {
        console.warn('No Response from Github API!');
        console.log(e);
        return e
      }
    });
  },
}
