# jasmine-fixture 0.x

** WARNING: this document describes the now-deprecated `inject` provided by jasmine-fixture. For new specs, I strongly recommend you use the new `affix` method instead, which is described in the [current README](https://github.com/searls/jasmine-fixture) **

A simple script to support writing [Jasmine](http://pivotal.github.com/jasmine) by enabling you to easily inject HTML into the DOM. You can grab the latest release at the [Downloads](https://github.com/searls/jasmine-fixture/downloads) page.

## Usage

### Load it

jasmine-fixture needs to be loaded in the spec runner HTML file after both Jasmine and jQuery, but before your specs. (It plays really nicely with [jasmine-jquery](https://github.com/velesin/jasmine-jquery) too.)

If I'm rolling my own spec runner HTML, that might look like this:

``` html
  <script type="text/javascript" src="../lib/jasmine-fixture.js"></script>
```

Also, if window.inject isn't being used by anything else, jasmine-fixture will automatically assign it to $.jasmine.inject. If you're dealing with multiple versions of jQuery, you may care to remove or change this alias as necessary.

``` javascript
window.inject = $.jasmine.inject
```

Nevertheless, all examples below assume that window.inject is an alias of $.jasmine.inject.

### Usage


#### Simple injection

At its simplest, calling inject with a string argument will inject a `<div>` with the string set to the class attribute

``` javascript
beforeEach(function(){
  $container = inject('add-item');
});
```

Therefore, the above will inject `<div class="add-item"></div>` to a special sandbox div in the DOM. It will be tidied up for you `afterEach` spec executes. `inject` will return a jQuery result object that includes the injected element.

#### Chaining injection

You can also chain calls to inject (that is, jasmine-fixture defines `$.fn.inject` as well).

So you could write:

``` javascript
beforeEach(function(){
  $input = inject('my-form').inject({el: 'input'});
});
```

The above will inject something like this:

``` html
<div class="my-form">
  <input></input>
</div>
```

And the `$input` return value will be of the input, not the containing form. That makes it easier to keep the fixture code to a minimal--since your expectations will usually be about the most deeply-nested thing in your fixture markup.

#### Injecting plain ol' HTML

Of course, you can also inject raw HTML into the DOM. That's as easy as passing a string of HTML to `inject`

``` javascript
beforeEach(function(){
  $input = inject('<div><span><b>Bold!</b></span></div>')
});
```

And that'll work exactly as you'd expect it to.

#### Injecting with a configuration object

When you need to inject something slightly more complex, you can customize the element using a configuration object.

``` javascript
beforeEach(function() {
  $span = inject({
    el: 'span',
    'class': 'open closed',
    id: 'door',
    text: "oh hai, i'm some <escaped>text</escaped>",
    attrs: { title: "42" }
  });
});
```

This would yield the following markup being injected into the DOM:

``` html
<span id="door" class="open closed" title="42">oh hai, i'm some &lt;escaped&gt;text&lt;/escaped&gt;</span>
```

Worth noting, one rarely needs to specify all of the parameters at once; jasmine-fixture will fall back on its defaults where you don't specify a value (see below).


### Configuring default behavior

You might want to setup jasmine-fixture in a spec helper that runs before all of your specs.

``` javascript
(function($){
  window.inject = $.jasmine.inject;

  //These are jasmine-fixture's current defaults
  $.jasmine.configure({
    el:'div',                 // HTML element to be injected
    cssClass:'',              // HTML class attribute (string-wrapped 'class' can also be used)
    id:'',                    // HTML id attribute
    text: '',                 // the text within the HTML element
    defaultAttribute: 'class' // when inject() is only passed a string, it'll be set on this attribute
  });
})(jQuery);
```

The defaults passed to `configure` will be applied on all subsequent calls to `inject()`. If you happen to select elements by id more often than class, then changing "defaultAttribute" to "id" would make good sense. (As you'll read below, that setting would allow you to say `inject('panda')` to inject an element with ID "panda".)

Thanks to a pull request from [@kchien](https://github.com/kchien), you can also restore the original default behavior with `$.jasmine.restoreDefaults()`.

### Other notes

#### Multiple jQuery versions

jasmine-fixture supports dealing with multiple versions of jQuery. By default, it'll set itself up on the instance of jQuery that owns `window.jQuery` at the time that its script is run. But if you want to add jasmine-fixture to an additional version of jQuery, just execute something like:

``` javascript
jasmineFixture(jQuery_1_4_2_);
```

And this will have the effect of adding a new `jQuery_1_4_2_.jasmine.inject`, which will only depend on *that* instance of jQuery and not the page's default.

#### No conflict mode

If you don't want the `jasmineFixture` function cluttering up the global namespace, just call `$.jasmine.noConflict()`, and it'll relinquish ownership to whatever owned it previously (which is quite likely to be `undefined`).

## Maintainers

* [Justin Searls](http://about.me/searls)