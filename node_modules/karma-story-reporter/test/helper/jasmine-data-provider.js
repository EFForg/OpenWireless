/* global jasmine */
// Data provider code
function using(name, values, func) {

  'use strict';

  for (var i = 0, count = values.length; i < count; i++) {
    if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
      values[i] = [values[i]];
    }
    func.apply(this, values[i]);
    var valuesDescription = JSON.stringify(values[i]);
    if (!(typeof process !== "undefined" && process.ENV && process.ENV.TERM)) {
      var maxDescriptionLength = 35;
      if (valuesDescription.length > maxDescriptionLength) {
        valuesDescription = valuesDescription.substr(0, maxDescriptionLength) + '...';
      }
    }
    jasmine.currentEnv_.currentSpec.description += ' ("' + name + '": ' + valuesDescription + ')';
  }
}
