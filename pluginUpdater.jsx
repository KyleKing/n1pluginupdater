// const {Actions} = require('nylas-exports');
// const {ipcRenderer, remote} = require('electron');
// const electron = require('electron');


// class ThreadUnsubscribeStoreManager {
//   constructor() {
//     this.state = '';
//   }

//   activate: (state) => {
//     console.log(this);
//     this.state = state;
//     this._unlisten = Actions.notificationActionTaken.listen(this._onNotificationActionTaken, this)
//     if (this.state === 'NEW_RELEASE') {
//       return this.displayNotification(process.env.N1_UNSUBSCRIBE_AVAILABLE_VER);
//     } else if (this.state === 'THANKS') {
//       return this.displayThanksNotification();
//     }
//   }

//   displayNotification: (version) => {
//     // Types: `info`, `developer`, `error`, or `success`
//     // version = if version then "(#{version})" else ''
//     Actions.postNotification({
//       type: 'developer',
//       tag: 'app-update',
//       sticky: true,
//       message: "An update to N1-Unsubscribe (Plugin) is available (" +
//         process.env.N1_UNSUBSCRIBE_AVAILABLE_VER + " - click to update now!)",
//       icon: 'fa-flag',
//       actions: [
//         {
//           label: 'See What\'s New',
//           id: 'release-bar:view-plugin-changelog',
//         }, {
//           label: 'Install Now',
//           dismisses: true,
//           default: true,
//           id: 'release-bar:install-plugin-update',
//         },
//       ],
//     });
//   }

//   displayThanksNotification: () => {
//     Actions.postNotification({
//       type: 'developer',
//       tag: 'app-update',
//       sticky: true,
//       message: "You're running the latest version of N1-Unsubscribe (Plugin)" +
//         " - view the changelog to see what's new.",
//       icon: 'fa-magic',
//       actions: [
//         {
//           label: 'Thanks',
//           dismisses: true,
//           id: 'release-bar:no-op',
//         }, {
//           label: 'See What\'s New',
//           default: true,
//           id: 'release-bar:view-plugin-changelog',
//         },
//       ],
//     });
//   }

//   deactivate: () => {
//     this._unlisten();
//   }

//   _onNotificationActionTaken: ({notification, action}) => {
//     if (action.id === 'release-bar:view-plugin-changelog') {
//       electron.shell.openExternal(process.env.N1_UNSUBSCRIBE_AVAILABLE_URL);
//       return false;
//     }
//     if (action.id === 'release-bar:install-plugin-update') {
//       electron.shell.openExternal(process.env.N1_UNSUBSCRIBE_DOWNLOAD_URL);
//       return true;
//     }
//   }
// }


// module.exports = new ThreadUnsubscribeStoreManager();


const {Actions} = require('nylas-exports');
const {ipcRenderer, remote} = require('electron');
const electron = require('electron');

module.exports = {
  activate: (pluginUpdater, state) => {
    console.log(pluginUpdater);
    pluginUpdater.state = state;
    if (pluginUpdater.state === 'NEW_RELEASE') {
      return pluginUpdater.displayNotification(process.env.N1_UNSUBSCRIBE_AVAILABLE_VER);
    } else if (pluginUpdater.state === 'THANKS') {
      return pluginUpdater.displayThanksNotification();
    }
  },

  displayNotification: (version) => {
    // Types: `info`, `developer`, `error`, or `success`
    // version = if version then "(#{version})" else ''
    Actions.postNotification({
      type: 'developer',
      tag: 'app-update',
      sticky: true,
      message: "An update to N1-Unsubscribe (Plugin) is available (" +
        process.env.N1_UNSUBSCRIBE_AVAILABLE_VER + " - click to update now!)",
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
      message: "You're running the latest version of N1-Unsubscribe (Plugin)" +
        " - view the changelog to see what's new.",
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
      electron.shell.openExternal(process.env.N1_UNSUBSCRIBE_AVAILABLE_URL);
      return false;
    }
    if (action.id === 'release-bar:install-plugin-update') {
      electron.shell.openExternal(process.env.N1_UNSUBSCRIBE_DOWNLOAD_URL);
      return true;
    }
  },
}
