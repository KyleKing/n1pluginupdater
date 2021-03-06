# Deprecated - only works on Nylas v0.4.52 or earlier

N1 changed the notification system to add support for a greater array of notification types. Unfortunately this new system now uses internal states to trigger notifications rather than a callable action

# n1pluginupdater

Alerts users that an updated plugin has been released using the N1 official notification bar!

![Example N1 Plugin Notification](README/notification.png)

## How to Install

[![NPM](https://nodei.co/npm/n1pluginupdater.png)](https://nodei.co/npm/n1pluginupdater/)

1. Add this npm module: `npm install n1pluginupdater --save`

2. Require the package.json information and this module (somewhere at the top of your `main.jsx` file):
  ```jsx
  const config = require(`${__dirname}/../package.json`); // the path to your package.json
  const n1pluginupdater = require('n1pluginupdater');
  ```

3. Initialize the updater in the `activate` block of `main.jsx`:
  ```jsx
  activate: () => {
    n1pluginupdater.checkForUpdate({
      repositoryName: "your_Github_Repository_Name",
      repositoryOwner: "your_Github_Username",
      currentVersion: config.version,
    });
    // Other code...etc.
  },
  ```

4. **OPTIONAL**: *BREAK IT* and test it out. Try hardcoding values you know won't work and see the notification appear after refreshing Nylas:
  ```jsx
  activate: () => {
    n1pluginupdater.checkForUpdate({
      repositoryName: "n1-unsubscribe",
      repositoryOwner: "colinking",
      currentVersion: "1.3.0",
    });
    // Other code...etc.
  },
  ```

5. For good measure, turn off the listeners:
  ```jsx
  deactivate: () => {
    n1pluginupdater.deactivate();
    // etc.
  }
  ```

6. **Make your own style**. In your `main.less` or other stylesheet) add:
  ```less
  // Style the plugin notification bar to differentiate from the
  // N! regular updates and other plugin updates
  .notifications-sticky .notification-developer {
  	background-color: #60CBF1 !important;
  }
  // This colors the notification bar bright blue like the screenshot above
  ```

## The Fine Print

To use this package you need to be specific about making releases. The version number in the package.json needs to match the tag you use on the release.

![Note on tag use](README/tag.png)

