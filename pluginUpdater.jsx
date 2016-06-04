const {Actions} = require('nylas-exports');
const electron = require('electron');

module.exports = {
  activate: function activate(state) {
    this.state = state;
    console.log('this - activate');
    console.log(this);
    this._unlisten = Actions.notificationActionTaken.listen(this._onNotificationActionTaken,
      this);
    console.log(this);
    if (this.state === 'NEW_RELEASE') {
      return this.displayNotification(process.env.PLUGIN_AVAILABLE_VER);
    } else if (this.state === 'THANKS') {
      return this.displayThanksNotification();
    }
    return false;
  },

  displayNotification: function displayNotification() {
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

  displayThanksNotification: function displayThanksNotification() {
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

  deactivate: function deactivate() {
    console.log(this);
    return this._unlisten();
  },

  _onNotificationActionTaken: function notify({notification, action}) {
    console.log(notification);
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
