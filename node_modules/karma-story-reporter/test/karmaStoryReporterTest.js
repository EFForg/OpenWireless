describe("Karma story reporter mock formatter", function() {

  'use strict';

  it("concatenates arguments into a string", function() {
    expect(mockFormatter('a', 'b', 'c')).toBe('abc');
  });

  it("concatenates arguments into a string", function() {
    expect(mockFormatter('0', '1', '2')).toBe('012');
  });
});

describe("Karma story reporter", function() {

  'use strict';

  var storyReporter = null;
  var browser = {name: 'Test Browser (Test)'};

  beforeEach(function() {
    storyReporter = new StoryReporter(baseReporterDecorator, null, null, null, false);
  });

  describe("tabs", function() {

    using("tab indents",
      [
        [-2, ''],
        [0, ''],
        [1, '\t'],
        [2, '\t\t'],
        [10, '\t\t\t\t\t\t\t\t\t\t']
      ],
      function(numberOfIndents, tabString) {

        it("gets tab intents", function() {
          expect(storyReporter.getTabIndents(numberOfIndents)).toBe(tabString);
        });
      });
  });

  using("spec sets",
    [
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 3, "log": []}
        ],
        [ '- Initial spec:', '\thas a passing child test' ]
      ],
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 3, "log": []},
          {"id": 1, "description": "has a first test that passes", "suite": ["Story reporter"], "success": true, "skipped": false, "time": 0, "log": []}
        ],
        [ '- Initial spec:',
          '\thas a passing child test',
          '',
          '- Story reporter:',
          '\thas a first test that passes'
        ]
      ],
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 2, "log": []},
          {"id": 1, "description": "has a first test that passes", "suite": ["Story reporter"], "success": true, "skipped": false, "time": 1, "log": []},
          {"id": 2, "description": "has a first test that fails", "suite": ["Story reporter"], "success": false, "skipped": false, "time": 0, "log": ["Expected true to be falsy."]},
          {"id": 3, "description": "has a passing child test", "suite": ["Story reporter", "nested spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 4, "description": "has an initial test that passes", "suite": ["Story reporter", "with deeply nested spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 5, "description": "has a test that fails", "suite": ["Story reporter", "with deeply nested spec"], "success": false, "skipped": false, "time": 0, "log": ["Expected null not to be null."]},
          {"id": 6, "description": "has a passing child test", "suite": ["Story reporter", "with deeply nested spec", "nested further"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 7, "description": "has a passing child test", "suite": ["Story reporter", "with deeply nested spec", "nested further", "and even further"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 8, "description": "passes this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 9, "description": "fails this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec", "with failing test"], "success": false, "skipped": false, "time": 0, "log": ["Expected false to be truthy."]},
          {"id": 10, "description": "passes this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec", "with failing test", "child of failing test"], "success": true, "skipped": false, "time": 0, "log": []}
        ],
        [ '- Initial spec:',
          '\thas a passing child test',
          '',
          '- Story reporter:',
          '\thas a first test that passes',
          '\thas a first test that fails',
          '',
          '\t- nested spec:',
          '\t\thas a passing child test',
          '',
          '\t- with deeply nested spec:',
          '\t\thas an initial test that passes',
          '\t\thas a test that fails',
          '',
          '\t\t- nested further:',
          '\t\t\thas a passing child test',
          '',
          '\t\t\t- and even further:',
          '\t\t\t\thas a passing child test',
          '',
          '\t\t- with a failing child spec:',
          '\t\t\tpasses this test',
          '',
          '\t\t\t- with failing test:',
          '\t\t\t\tfails this test',
          '',
          '\t\t\t\t- child of failing test:',
          '\t\t\t\t\tpasses this test'
        ]
      ],

      [
        [
          {"id": 0, "description": "has test A", "suite": ["Block A"], "success": true, "skipped": false, "time": 2, "log": []},
          {"id": 1, "description": "has test C", "suite": ["Block A", "Block B", "Block C"], "success": true, "skipped": false, "time": 0, "log": []}
        ] ,
        [ '- Block A:',
          '\thas test A',
          '',
          '\t- Block B:',
          '\t\t- Block C:',
          '\t\t\thas test C'
        ]
      ],

      [
        [
          {"id": 0, "description": "has test D", "suite": ["Nested spec D"], "success": true, "skipped": false, "time": 3, "log": []},
          {"id": 1, "description": "has test G", "suite": ["Nested spec D", "Nested spec E", "Nested spec F", "Nested spec G"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 2, "description": "has test K", "suite": ["Nested spec D", "Nested spec E", "Nested spec F", "Nested spec G", "Nested spec F", "Nested spec J", "Nested spec K"], "success": true, "skipped": false, "time": 0, "log": []}
        ] ,
        [ '- Nested spec D:',
          '\thas test D',
          '',
          '\t- Nested spec E:',
          '\t\t- Nested spec F:',
          '\t\t\t- Nested spec G:',
          '\t\t\t\thas test G',
          '',
          '\t\t\t\t- Nested spec F:',
          '\t\t\t\t\t- Nested spec J:',
          '\t\t\t\t\t\t- Nested spec K:',
          '\t\t\t\t\t\t\thas test K' ]
      ],

      [
        [
          {"id": 0, "description": "has test A", "suite": ["Root suite"], "success": true, "skipped": false, "time": 2, "log": []},
          {"id": 1, "description": "has test B", "suite": ["Root suite", "Nested Suite"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 2, "description": "has test C", "suite": ["Root suite"], "success": true, "skipped": false, "time": 2, "log": []}
        ] ,
        [ '- Root suite:',
          '\thas test A',
          '',
          '\t- Nested Suite:',
          '\t\thas test B',
          '',
          '\thas test C'
        ]
      ],

      [
        [
          {"id": 0, "description": "Buffer test", "suite": ["Buffer Suite"], "success": true, "skipped": false, "time": 2, "log": []},
          {"id": 1, "description": "Test B", "suite": ["Suite A", "Suite B"], "success": true, "skipped": false, "time": 0, "log": []}
        ] ,
        [ '- Buffer Suite:',
          '\tBuffer test',
          '',
          '- Suite A:',
          '\t- Suite B:',
          '\t\tTest B'
        ]
      ],

      [
        [
          {"id": 2, "description": "has test D", "suite": ["Nested spec D"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 3, "description": "has test G", "suite": ["Nested spec D", "Nested spec E", "Nested spec F", "Nested spec G"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 4, "description": "has test K", "suite": ["Nested spec D", "Nested spec E", "Nested spec F", "Nested spec G", "Nested spec F", "Nested spec J", "Nested spec K"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 5, "description": "Test B", "suite": ["Suite A", "Suite B"], "success": true, "skipped": false, "time": 0, "log": []}
        ] ,
        [ '- Nested spec D:',
          '\thas test D',
          '',
          '\t- Nested spec E:',
          '\t\t- Nested spec F:',
          '\t\t\t- Nested spec G:',
          '\t\t\t\thas test G',
          '',
          '\t\t\t\t- Nested spec F:',
          '\t\t\t\t\t- Nested spec J:',
          '\t\t\t\t\t\t- Nested spec K:',
          '\t\t\t\t\t\t\thas test K',
          '',
          '- Suite A:',
          '\t- Suite B:',
          '\t\tTest B'
        ]
      ],
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec", "Initial spec 2"], "success": true, "skipped": false, "time": 3, "log": []}
        ] ,
        [ '- Initial spec:',
          '\t- Initial spec 2:',
          '\t\thas a passing child test' ]
      ]

    ],
    function(testResults, expectedFormatting) {

      it("detects spec success", function() {
        var suiteOutputCache = {content: []};
        storyReporter.writeToCache = function(output) {
          suiteOutputCache.content.push(output);
        };
        storyReporter.write = function() {
        };

        testResults.forEach(function(result) {
          storyReporter.specSuccess(browser, result);
        });

        storyReporter.flushCache();

        var formattedSpecs = [];
        suiteOutputCache.content.forEach(function(spec) {
          var specName = spec[2];
          formattedSpecs.push(specName);
        });

        expect(formattedSpecs).toEqual(expectedFormatting);
      });
    });
});
