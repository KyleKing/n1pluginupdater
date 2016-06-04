const {Actions} = require('nylas-exports');
const electron = require('electron');

module.exports = {
  activate: (pluginUpdater, state) => {
    console.log(pluginUpdater);
    pluginUpdater.state = state;
    if (pluginUpdater.state === 'NEW_RELEASE') {
      return pluginUpdater.displayNotification(process.env.PLUGIN_AVAILABLE_VER);
    } else if (pluginUpdater.state === 'THANKS') {
      return pluginUpdater.displayThanksNotification();
    }
    return false;
  },

  displayNotification: () => {
    // Post Notification Types: `info`, `developer`, `error`, or `success`
    Actions.postNotification({
      type: 'developer',
      tag: 'app-update',
      sticky: true,
      message: `An update to ${process.env.repositoryName}  (Plugin) is ` +
        ` available (${process.env.PLUGIN_AVAILABLE_VER} - click to update now!)`,
      icon: 'fa-flag',
      actions: [
        {
          label: 'See What\'s New',
          id: 'release-bar:view-plugin-changelog',
        }, {
          label: 'Install Now',
          dismisses: true,
          default: true,
          id: 'release-bar:install-plugin-update',
        },
      ],
    });
  },

  displayThanksNotification: () => {
    Actions.postNotification({
      type: 'developer',
      tag: 'app-update',
      sticky: true,
      message: `You're running the latest version of ${process.env.repositoryName}` +
        ` (Plugin) - view the changelog to see what's new.`,
      icon: 'fa-magic',
      actions: [
        {
          label: 'Thanks',
          dismisses: true,
          id: 'release-bar:no-op',
        }, {
          label: 'See What\'s New',
          default: true,
          id: 'release-bar:view-plugin-changelog',
        },
      ],
    });
  },

  deactivate: () => {
    this._unlisten();
  },

  _onNotificationActionTaken: ({notification, action}) => {
    if (action.id === 'release-bar:view-plugin-changelog') {
      electron.shell.openExternal(process.env.PLUGIN_AVAILABLE_URL);
      return false;
    }
    if (action.id === 'release-bar:install-plugin-update') {
      electron.shell.openExternal(process.env.PLUGIN_DOWNLOAD_URL);
      return true;
    }
    return false;
  },
}
