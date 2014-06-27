var module = {};

var mockFormatter = function() {
  'use strict';

  return arguments[0] + arguments[1] + arguments[2];
};

function require(lib) {
  'use strict';

  if (lib === 'util') {
    return {
      format: mockFormatter
    };
  }
}

function baseReporterDecorator(self) {
  'use strict';

  self.write = function() {
    //    console.log('writing', arguments)
  };
}