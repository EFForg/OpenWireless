# karma-story-reporter

A story reporter for the Karma test framework. Outputs test descriptions in hierarchical BDD-style user story format.

## Installation

The easiest way is to keep `karma-story-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-story-reporter": "~0.1"
  }
}
```

You can simply do this with:
```bash
npm install karma-story-reporter --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['story'],
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters story,dots
```

## Todo

- Output one browser at a time
- Suppress Karma's slow test output during test run
- Correctly indent sequential, un-nested describe blocks of same name (suites require unique ids instead of names)

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
