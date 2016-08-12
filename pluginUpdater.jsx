const {Actions} = require('nylas-exports');
const electron = require('electron');

module.exports = {
  activate(state, resData) {
    this.resData = resData;
    this.state = state;
    this._unlisten = Actions.notificationActionTaken.listen(this._onNotificationActionTaken,
      this);
    if (this.state === 'NEW_RELEASE') {
      return this.displayNotification(this.resData.avaVer);
    } else if (this.state === 'THANKS') {
      return this.displayThanksNotification();
    }
    return false;
  },

  displayNotification() {
    // Post Notification Types: `info`, `developer`, `error`, or `success`
    Actions.postNotification({
      type: 'developer',
      tag: 'app-update',
      sticky: true,
      message: `An update to ${this.resData.repositoryName}  (Plugin) is ` +
        ` available (${this.resData.avaVer} - click to update now!)`,
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

  displayThanksNotification() {
    Actions.postNotification({
      type: 'developer',
      tag: 'app-update',
      sticky: true,
      message: `You're running the latest version of ${this.resData.repositoryName}` +
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

  deactivate() {
    // That awkward moment that boilerplate code creates a bug
    console.log('Deactivating n1pluginupdater:');
    return true;
  },

  _onNotificationActionTaken({notification, action}) {
    console.log(notification);
    if (action.id === 'release-bar:view-plugin-changelog') {
      electron.shell.openExternal(this.resData.releaseURL);
      return false;
    }
    if (action.id === 'release-bar:install-plugin-update') {
      electron.shell.openExternal(this.resData.downloadURL);
      return true;
    }
    return false;
  },
}
