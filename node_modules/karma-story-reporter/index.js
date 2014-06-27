/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true,
 noarg:true, noempty:true, nonew:true, regexp:true, undef:true, unused:true, strict:true, trailing:true, indent:2,
 maxparams:5, maxdepth:3, maxstatements:50, maxcomplexity:20, maxlen:120, browser:true, node:true, nomen:false,
 white:false, maxerr:200 */

var util = require('util');
require('colors');

var StoryReporter = function(baseReporterDecorator, formatError, helper, reportSlow, colors) {

  'use strict';

  var previousSuite = null;
  var isFirstSpec = true;
  var suiteOutputCache = {};
  var suiteErrorOutput = {content: []};

  var debug = false;
  var totalResult = [];

  baseReporterDecorator(this, formatError, reportSlow);

  this.USE_COLORS = colors;

  this.HEADER_PASSED = '%s %s' + '\n';
  this.HEADER_FAILURE = '%s %s' + '\n';

  this.SPEC_PASSED = '%s %s PASSED' + '\n';
  this.SPEC_FAILURE = '%s %s FAILED' + '\n';
  this.SPEC_SLOW_PASSED = '%s %s PASSED (SLOW: %s)' + '\n';
  this.SPEC_SLOW_FAILED = '%s %s FAILED (SLOW: %s)' + '\n';
  this.ERROR = '%s ERROR\n';

  this.FINISHED_ERROR = ' ERROR';
  this.FINISHED_SUCCESS = ' SUCCESS';
  this.FINISHED_DISCONNECTED = ' DISCONNECTED';

  this.X_FAILED = ' (%d FAILED)';

  this.TOTAL_SUCCESS = 'TOTAL: %d SUCCESS\n';
  this.TOTAL_FAILED = 'TOTAL: %d FAILED, %d SUCCESS\n';

  if (this.USE_COLORS) {

    this.HEADER_PASSED = this.HEADER_PASSED.green;
    this.HEADER_FAILURE = this.HEADER_FAILURE.red;

    this.SPEC_PASSED = this.SPEC_PASSED.green;
    this.SPEC_FAILURE = this.SPEC_FAILURE.red;
    this.SPEC_SLOW_PASSED = this.SPEC_SLOW_PASSED.yellow;
    this.SPEC_SLOW_FAILED = this.SPEC_SLOW_FAILED.red;
    this.ERROR = this.ERROR.red;

    this.FINISHED_ERROR = this.FINISHED_ERROR.red;
    this.FINISHED_SUCCESS = this.FINISHED_SUCCESS.green;
    this.FINISHED_DISCONNECTED = this.FINISHED_DISCONNECTED.red;

    this.X_FAILED = this.X_FAILED.red;

    this.TOTAL_SUCCESS = this.TOTAL_SUCCESS.green;
    this.TOTAL_FAILED = this.TOTAL_FAILED.red;
  }

  this.specSuccess = function(browser, result) {
    debug && totalResult.push(result);

    var specName = this.getSpecName(result, browser);
    if (reportSlow && result.time > reportSlow) {
      var time = helper.formatTimeInterval(result.time);
      var fullSpecName = result.suite.join(' ') + ' ' + result.description;

      this.writeToCache([this.SPEC_SLOW_PASSED, browser.name, specName, time]);
      this.writeToErrorCache(util.format(this.SPEC_SLOW_PASSED, browser.name, fullSpecName, time));
    } else {
      this.writeToCache([this.SPEC_PASSED, browser.name, specName]);
    }

    debug && this._dumpDebug();
  };

  this.specFailure = function(browser, result) {
    debug && totalResult.push(result);

    var specName = this.getSpecName(result, browser);
    var fullSpecName = result.suite.join(' ') + ' ' + result.description;
    var error = '';
    result.log.forEach(function(log) {
      error += formatError(log, '\t');
    });

    if (reportSlow && result.time > reportSlow) {
      var time = helper.formatTimeInterval(result.time);
      this.writeToCache([this.SPEC_SLOW_FAILED, browser.name, specName, time]);
      this.writeToErrorCache(
        util.format(this.SPEC_SLOW_FAILED, browser.name, fullSpecName, time) + error, result.suite);
    } else {
      this.writeToCache([this.SPEC_FAILURE, browser.name, specName]);
      this.writeToErrorCache(
        util.format(this.SPEC_FAILURE, browser.name, fullSpecName) + error, result.suite);
    }

    debug && this._dumpDebug();
  };

  this.getSpecName = function(result, browser) {
    this.detectRootSuite(result.suite);
    this.detectSuiteChange(result.suite, browser);

    return this.getIndentedSpecName(result.suite, result.description);
  };

  this.detectSuiteChange = function(suite, browser) {
    var isNextSuite = previousSuite &&
      ((suite.length !== previousSuite.length) || (suite.join('') !== previousSuite.join('')));

    if (isNextSuite || isFirstSpec || !previousSuite) {
      var self = this;
      if (isFirstSpec) {
        isFirstSpec = false;
      } else {
        // TODO: conditional colouring of this spacer line from percentage of passed specs
        this.writeToCache([this.HEADER_PASSED, browser.name, '', suite.length]);
      }

      suite.forEach(function(suiteName, index) {
        if (!previousSuite || !previousSuite[index] || previousSuite[index] !== suite[index]) {
          var thisSuiteName = self.getTabIndents(index) + '- ' + suite[index] + ':';
          self.writeToCache([self.HEADER_PASSED, browser.name, thisSuiteName, suite.length]);
        }
      });
    }
  };

  this.detectRootSuite = function(suite) {
    var previousSuiteLength = (previousSuite && previousSuite.length) || 0;
    if (suite.length === 1 && (suite.length < previousSuiteLength)) {
      if (suite[0] !== previousSuite[0]) {
        totalResult = [];
        this.flushCache();
      }
    }
  };

  this.getIndentedSpecName = function(suite, testName) {
    previousSuite = suite;
    return this.getTabIndents(suite.length) + testName;
  };

  this.getTabIndents = function(specLength) {
    var tabIndents = '';
    for (var indents = 0; indents < specLength; indents++) {
      tabIndents += '\t';
    }
    return tabIndents;
  };

  this.writeToCache = function(message) {
    suiteOutputCache.content.push(message);
  };

  this.writeToErrorCache = function(message, suite) {
    suiteErrorOutput.content.push(message);
    suite && (suiteOutputCache.failedSuites = suiteOutputCache.failedSuites.concat(suite));
  };

  this.flushCache = function() {
    var self = this;
    suiteOutputCache.content.forEach(function(spec) {
      if (Array.isArray(spec)) {
        var trimmedSuiteName = spec[2].replace(/[ \t]*- (.*):$/, '$1');
        var hasFailingSpec = suiteOutputCache.failedSuites.some(function(failedSuite) {
          // TODO: suites should be identified by a unique ID from Jasmine - is it possible?
          return failedSuite === trimmedSuiteName;
        });
        hasFailingSpec && (spec[0] = self.HEADER_FAILURE);
        self.write(util.format(spec[0], spec[1], spec[2]));
      } else {
        self.write(spec);
      }
    });

    this.resetSuiteOutput();
  };

  this.onBrowserComplete = function(browser) {
    this.flushCache();
    this.write(this._refresh());

    if (suiteErrorOutput.content.length > 0) {
      var self = this;
      this.write(browser.name + '\n');
      suiteErrorOutput.content.forEach(function(msg) {
        self.write(msg);
      });
      suiteErrorOutput = {content: []};
    }

    isFirstSpec = true;
    previousSuite = null;
  };

  this._refresh = function() {
    return this._renderSummary();
  };

  this._renderSummary = function() {
    return this._browsers.map(this.renderBrowser).join('\n') + '\n';
  };

  this.resetSuiteOutput = function() {
    suiteOutputCache = {
      prefixNewline: true,
      content:       [],
      failedSuites:  []
    };
  };

  this._dumpDebug = function() {
    var formattedSpecs = [];
    suiteOutputCache.content.forEach(function(spec) {
      var specName = spec[2];
      formattedSpecs.push(specName);
    });

    console.log('[', JSON.stringify(totalResult), ',', formattedSpecs, "]\n\n");
  };

  this._testInterface = {
    previousSuite:    previousSuite,
    isFirstSpec:      isFirstSpec,
    suiteOutputCache: suiteOutputCache,
    suiteErrorOutput: suiteErrorOutput
  };

  this.resetSuiteOutput();
};

StoryReporter.$inject = ['baseReporterDecorator', 'formatError', 'helper', 'config.reportSlowerThan', 'config.colors'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:story': ['type', StoryReporter]
};