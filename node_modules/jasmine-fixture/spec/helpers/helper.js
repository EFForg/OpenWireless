var root = this;

root.context = root.describe;
root.xcontext = root.xdescribe;

beforeEach(function() {
  this.addMatchers({
    toIs: function(selector) {
      return this.actual.is(selector);
    },
    toHas: function(selector) {
      return this.actual.find(selector).length > 0;
    },
    toExist: function() {
      if(this.actual.constructor === String) {
        return $(this.actual).length > 0;
      } else {
        return $.contains(document.body,$(this.actual)[0]);
      }
    }
  });
});

