describe('jasmine-fixture 0.x',function(){
  var itInjectsStuff = function($) {

    describe("$.jasmine", function() {
      it('is named $.jasmine',function(){
        expect($.jasmine).toBeDefined();
      });

      describe('#inject',function(){
        var $result;

        context('provided an HTML string', function(){
          beforeEach(function(){
           $result = $.jasmine.inject('<div class="pants"></div>');
          });

          it('returns the injected HTML as a jQuery result',function(){
            expect($result).toIs('div.pants');
          });
        });

        context('provided a string argument', function(){
          beforeEach(function(){
            $result = $.jasmine.inject('pants');
          });


          it('uses the passed string as its class', function(){
            expect($result).toIs('div.pants');
          });

          it('is contained by the body', function(){
            expect($result).toExist();
          });
        });

        context("provided a config object", function() {
          beforeEach(function() {
            $result = $.jasmine.inject({
              el: 'input',
              cssClass: 'open closed',
              id: 'door',
              text: "oh hai, i'm some <escaped>text</escaped>"
            });
          });

          it("is injected as configured", function() {
            expect($result).toIs('input#door.open.closed');
          });

          it("contains the configured text", function() {
            expect($result.text()).toEqual("oh hai, i'm some <escaped>text</escaped>");
          });
        });

        context("embedding HTML", function() {
          beforeEach(function() {
            $result = $.jasmine.inject({
              html: 'oh hi, <span class="oh-yeah">text</span>'
            });
          });

          it("contains the injected span", function() {
            expect($result).toHas('.oh-yeah');
          });

        });

        context("specifying both text & html", function() {
          it("throws an error", function() {
            expect(function() { $.jasmine.inject({ html: 'HTML', text: 'TEXT' }); }).toThrow("Error: because they conflict, you may only configure inject() to set `html` or `text`, not both! \n\nHTML was: HTML \n\n Text was: TEXT");
          });
        });

        context("passed a properly quoted 'class' property in the config object", function() {
          beforeEach(function() {
            $result = $.jasmine.inject({ 'class': 'burger' });
          });

          it("applies the css class", function() {
            expect($result).toIs('.burger');
          });
        });

        context("passed additional attributes to be applied in the config object", function() {
          beforeEach(function() {
            $result = $.jasmine.inject({ el: 'script', attrs: { type: 'text/template' } });
          });

          it("applies the additional attributes", function() {
            expect($result.attr('type')).toEqual('text/template');
          });
        });

      });

      describe("#configure", function() {
        var $result;
        context("configured custom defaults", function() {
          beforeEach(function() {
            $.jasmine.configure({
              el: 'input',
              cssClass: 'party',
              id: 'frog',
              text: '&&'
            })
          });

          context("and inject is passed nothing", function() {
            beforeEach(function() {
              $result = $.jasmine.inject();
            });
            it("uses those defaults", function() {
              expect($result).toIs('input#frog.party');
            });
            it("even sets the text", function() {
              expect($result.text()).toEqual('&&');
            });
          });

          context("and inject is passed a string", function() {
            beforeEach(function() {
              $result = $.jasmine.inject('sauce');
            });
            it("uses those defaults, but changes the class", function() {

              expect($result).toIs('input#frog.sauce');
            });
            it("even sets the text", function() {
              expect($result.text()).toEqual('&&');
            });
          });

        });

        context("configured that when given a string it should inject the id", function() {
          beforeEach(function() {
            $.jasmine.configure({ defaultAttribute: 'id' });

            $result = $.jasmine.inject('foo');
          });
          xit("sets the id and not the class", function() {
            expect($result).toIs('#foo');
          });
        });

      });

      describe("#restoreDefaults", function() {
        var $result;
        beforeEach(function() {
          $.jasmine.configure({
            el: 'span',
            defaultAttribute: 'id',
            cssClass: 'green',
            id: 'panda',
            text: 'zoo'
          });

          $.jasmine.restoreDefaults();
          $result = $.jasmine.inject('zebra');
        });

        it("doesn't use the custom configuration", function() {
          expect($result).not.toIs('span#zebra.green');
          expect($result.text()).not.toEqual('zoo');
        });

        it("does use the original default configuration", function() {
          expect($result).toIs('.zebra');
        });
      });
    });

    describe("$.fn.inject",function(){
      var $container,$result;
      beforeEach(function(){
        $container = $.jasmine.inject('phone');

        $result = $container.inject('fax');
      });

      it('appends the injected as a child of the container',function(){
        expect($container).toHas('.fax');
      });

      it('returns the child (even though an idiomatic jQuery function would return the original set)',function(){
        expect($result).toIs('.fax');
      });
    });

    it("afterward, it tidies up (the page no longer contains the injected content on the page)", function() {
      expect('.pants').not.toExist();
    });

    describe("#noConflict", function() {
      var subject,noConflicted,cachedCopy;
      beforeEach(function() {
        cachedCopy = window.jasmineFixture;

        subject = window.jasmineFixture($);

        noConflicted = subject.noConflict();
      });

      afterEach(function() {
        window.jasmineFixture = cachedCopy;
      });

      it("returns itself when noConflicted", function() {
        expect(subject).toBe(noConflicted);
      });

      it("returns control of jasmineFixture to the thing that owned it first", function() {
        //see the specRunner HTML for the source to this magic string
        expect(window.jasmineFixture).toEqual("Thing that owned jasmineFixture first");
      });

      it("clears window.inject", function() {
        expect(window.inject).not.toBeDefined();
      });

      it("clears window.affix", function() {
        expect(window.affix).not.toBeDefined();
      });
    });
  };

  it("assigns window.inject to the first jQuery it sees", function() {
    expect(window.inject).toBe(jQuery.jasmine.inject);
  });

  itInjectsStuff(jQuery);
  jasmineFixture(jQuery_1_6_4);
  itInjectsStuff(jQuery_1_6_4);
});
