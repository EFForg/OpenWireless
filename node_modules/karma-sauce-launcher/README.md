# karma-sauce-launcher

> Use any browser on [SauceLabs](https://saucelabs.com/)!


## Installation

The easiest way is to keep `karma-sauce-launcher` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-sauce-launcher": "~0.1"
  }
}
```

You can also add it by this command:
```bash
npm install karma-sauce-launcher --save-dev
```


## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // global config for SauceLabs
    sauceLabs: {
      username: 'jamesbond',
      accessKey: '007',
      startConnect: false,
      testName: 'my unit tests'
    },

    // define SL browsers
    customLaunchers: {
      sl_chrome_linux: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'linux'
      }
    },

    browsers: ['sl_chrome_linux']
  });
};
```

### Global options
- `username` your SL username, you can also use `SAUCE_USERNAME` env variable.
- `accessKey` your SL access key, you can also use `SAUCE_ACCESS_KEY` env variable.
- `tunnelIdentifier` Sauce Connect can proxy multiple sessions, this is an id of a session.
- `startConnect` do you wanna start Sauce Connect ? (defaults to `true`)
- `tags` an array of tags (will show up in SL web interface)
- `testName` test name (will show up in SL web interface)
- `build` build id (will show up in SL web interface)
- `recordVideo` do you wanna record video of the session ? (defaults to `false`)
- `recordScreenshots` do you wanna take screenshots ? (defaults to `true`)


### Per browser options
- `browserName` name of the browser
- `version` version of the browser (defaults to the latest available)
- `platform` which platform ? (defaults to any)
- `deviceOrientation` portrait or landscape (mobile testing option only)

For an example project of, check out [AngularJS](https://github.com/angular/angular.js/blob/master/.travis.yml).


----

For more information on Karma see the [homepage](http://karma-runner.github.com).
