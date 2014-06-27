describe("Nested spec A", function() {
  "use strict";

  it("has test A", function() {

  });

  describe("Nested spec B", function() {

    describe("Nested spec C", function() {

      it("has test C", function() {

      });
    });
  });
});

describe("Nested spec D", function() {
  "use strict";

  it("has test D", function() {

  });

  describe("Nested spec E", function() {

    describe("Nested spec F", function() {

      describe("Nested spec G", function() {

        it("has test G", function() {

        });

        describe("Nested spec F", function() {

          describe("Nested spec J", function() {

            describe("Nested spec K", function() {

              it("has test K", function() {

              });
            });
          });
        });
      });
    });
  });
});


describe("Suite A", function() {
  'use strict';

  describe("Suite B", function() {

    it("Test B", function() {

    });
  });
});


describe("Buffer Suite", function() {

  it("Buffer test", function() {

  });
});

describe("Suite A", function() {
  'use strict';

  describe("Suite B", function() {

    it("Test B", function() {

    });
  });
});
