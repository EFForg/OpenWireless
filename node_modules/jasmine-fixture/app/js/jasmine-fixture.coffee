(($) ->
  root = @

  originalJasmineFixture = root.jasmineFixture
  originalInject = root.inject
  originalAffix = root.affix

  _ = (list) ->
    inject: (iterator, memo) ->
      memo = iterator(memo, item) for item in list

  root.jasmineFixture = ($) ->
    #--------------------------------------------------------
    # #affix (jasmine-fixture 1.x)
    $.fn.affix = root.affix = (selectorOptions) ->
      $top=null
      _(selectorOptions.split(/[ ](?=[^\]]*?(?:\[|$))/)).inject(($parent, elementSelector) ->
        return $parent if elementSelector == ">"
        $el = createHTMLBlock($,elementSelector).appendTo($parent)
        $top ||= $el
        $el
      , $whatsTheRootOf(this))
      $top

    $whatsTheRootOf = (that) ->
      if that.jquery?
        that
      else if $('#jasmine_content').length > 0
        $('#jasmine_content')
      else
        $('<div id="jasmine_content"></div>').appendTo('body')

    afterEach ->
      $('#jasmine_content').remove()

    #--------------------------------------------------------
    # #inject (jasmine-fixture 0.x)
    isReady = false
    rootId = "specContainer"
    defaultConfiguration =
      el: "div"
      cssClass: ""
      id: ""
      text: ""
      html: ""
      defaultAttribute: "class"
      attrs: {}
    defaults = $.extend({}, defaultConfiguration)
    $.jasmine =
      inject: (arg, context) ->
        init()  if isReady isnt true
        parent = (if context then context else $("#" + rootId))
        $toInject = undefined
        if itLooksLikeHtml(arg)
          $toInject = $(arg)
        else
          config = $.extend({}, defaults, arg,
            userString: arg
          )
          $toInject = $("<" + config.el + "></" + config.el + ">")
          applyAttributes $toInject, config
          injectContents $toInject, config
        $toInject.appendTo parent

      configure: (config) ->
        $.extend defaults, config

      restoreDefaults: ->
        defaults = $.extend({}, defaultConfiguration)

      noConflict: ->
        root.jasmineFixture = originalJasmineFixture
        root.inject = originalInject
        root.affix = originalAffix
        this

    $.fn.inject = (html) ->
      $.jasmine.inject html, $(this)

    applyAttributes = ($html, config) ->
      attrs = $.extend({},
        id: config.id
        class: config["class"] or config.cssClass
      , config.attrs)
      attrs[config.defaultAttribute] = config.userString  if isString(config.userString)
      for key of attrs
        $html.attr key, attrs[key]  if attrs[key]

    injectContents = ($el, config) ->
      if config.text and config.html
        throw "Error: because they conflict, you may only configure inject() to set `html` or `text`, not both! \n\nHTML was: " + config.html + " \n\n Text was: " + config.text
      else if config.text
        $el.text config.text
      else $el.html config.html  if config.html

    itLooksLikeHtml = (arg) ->
      isString(arg) and arg.indexOf("<") isnt -1

    isString = (arg) ->
      arg and arg.constructor is String

    init = ->
      $("body").append "<div id=\"" + rootId + "\"></div>"
      isReady = true

    tidyUp = ->
      $("#" + rootId).remove()
      isReady = false

    $(($) -> init())
    afterEach -> tidyUp()

    $.jasmine

  if $
    jasmineFixture = root.jasmineFixture($)
    root.inject = root.inject or jasmineFixture.inject
)(window.jQuery)


createHTMLBlock = ( ->
  # Copyright (c) 2010 Mike Kent
  #
  # Permission is hereby granted, free of charge, to any person obtaining
  # a copy of this software and associated documentation files (the
  # "Software"), to deal in the Software without restriction, including
  # without limitation the rights to use, copy, modify, merge, publish,
  # distribute, sublicense, and/or sell copies of the Software, and to
  # permit persons to whom the Software is furnished to do so, subject to
  # the following conditions:
  #
  # The above copyright notice and this permission notice shall be
  # included in all copies or substantial portions of the Software.
  createHTMLBlock = ($,ZenObject, data, functions, indexes) ->
    if $.isPlainObject(ZenObject)
      ZenCode = ZenObject.main
    else
      ZenCode = ZenObject
      ZenObject = main: ZenCode
    origZenCode = ZenCode
    indexes = {}  if indexes is `undefined`
    if ZenCode.charAt(0) is "!" or $.isArray(data)
      if $.isArray(data)
        forScope = ZenCode
      else
        obj = parseEnclosure(ZenCode, "!")
        obj = obj.substring(obj.indexOf(":") + 1, obj.length - 1)
        forScope = parseVariableScope(ZenCode)
      forScope = parseVariableScope("!for:!" + parseReferences(forScope, ZenObject))  while forScope.charAt(0) is "@"
      zo = ZenObject
      zo.main = forScope
      el = $()
      if ZenCode.substring(0, 5) is "!for:" or $.isArray(data)
        if not $.isArray(data) and obj.indexOf(":") > 0
          indexName = obj.substring(0, obj.indexOf(":"))
          obj = obj.substr(obj.indexOf(":") + 1)
        arr = (if $.isArray(data) then data else data[obj])
        zc = zo.main
        if $.isArray(arr) or $.isPlainObject(arr)
          $.map arr, (value, index) ->
            zo.main = zc
            indexes[indexName] = index  if indexName isnt `undefined`
            value = value: value  unless $.isPlainObject(value)
            next = createHTMLBlock($, zo, value, functions, indexes)
            unless el.length is 0
              $.each next, (index, value) ->
                el.push value
        unless $.isArray(data)
          ZenCode = ZenCode.substr(obj.length + 6 + forScope.length)
        else
          ZenCode = ""
      else if ZenCode.substring(0, 4) is "!if:"
        result = parseContents("!" + obj + "!", data, indexes)
        el = createHTMLBlock($, zo, data, functions, indexes)  if result isnt "undefined" or result isnt "false" or result isnt ""
        ZenCode = ZenCode.substr(obj.length + 5 + forScope.length)
      ZenObject.main = ZenCode
    else if ZenCode.charAt(0) is "("
      paren = parseEnclosure(ZenCode, "(", ")")
      inner = paren.substring(1, paren.length - 1)
      ZenCode = ZenCode.substr(paren.length)
      zo = ZenObject
      zo.main = inner
      el = createHTMLBlock($, zo, data, functions, indexes)
    else
      blocks = ZenCode.match(regZenTagDfn)
      block = blocks[0]
      return ""  if block.length is 0
      if block.indexOf("@") >= 0
        ZenCode = parseReferences(ZenCode, ZenObject)
        zo = ZenObject
        zo.main = ZenCode
        return createHTMLBlock($, zo, data, functions, indexes)
      block = parseContents(block, data, indexes)
      blockClasses = parseClasses($,block)
      blockId = regId.exec(block)[1]  if regId.test(block)
      blockAttrs = parseAttributes(block, data)
      blockTag = (if block.charAt(0) is "{" then "span" else "div")
      blockTag = regTag.exec(block)[1]  if ZenCode.charAt(0) isnt "#" and ZenCode.charAt(0) isnt "." and ZenCode.charAt(0) isnt "{"
      blockHTML = block.match(regCBrace)[1]  unless block.search(regCBrace) is -1
      blockAttrs = $.extend(blockAttrs,
        id: blockId
        class: blockClasses
        html: blockHTML
      )
      el = $("<" + blockTag + ">", blockAttrs)
      el.attr blockAttrs
      el = bindEvents(block, el, functions)
      el = bindData(block, el, data)
      ZenCode = ZenCode.substr(blocks[0].length)
      ZenObject.main = ZenCode
    if ZenCode.length > 0
      if ZenCode.charAt(0) is ">"
        if ZenCode.charAt(1) is "("
          zc = parseEnclosure(ZenCode.substr(1), "(", ")")
          ZenCode = ZenCode.substr(zc.length + 1)
        else if ZenCode.charAt(1) is "!"
          obj = parseEnclosure(ZenCode.substr(1), "!")
          forScope = parseVariableScope(ZenCode.substr(1))
          zc = obj + forScope
          ZenCode = ZenCode.substr(zc.length + 1)
        else
          len = Math.max(ZenCode.indexOf("+"), ZenCode.length)
          zc = ZenCode.substring(1, len)
          ZenCode = ZenCode.substr(len)
        zo = ZenObject
        zo.main = zc
        els = $(createHTMLBlock($, zo, data, functions, indexes))
        els.appendTo el
      if ZenCode.charAt(0) is "+"
        zo = ZenObject
        zo.main = ZenCode.substr(1)
        el2 = createHTMLBlock($, zo, data, functions, indexes)
        $.each el2, (index, value) ->
          el.push value
    ret = el
    ret
  bindData = (ZenCode, el, data) ->
    return el  if ZenCode.search(regDatas) is 0
    datas = ZenCode.match(regDatas)
    return el  if datas is null
    i = 0

    while i < datas.length
      split = regData.exec(datas[i])
      if split[3] is `undefined`
        $(el).data split[1], data[split[1]]
      else
        $(el).data split[1], data[split[3]]
      i++
    el
  bindEvents = (ZenCode, el, functions) ->
    return el  if ZenCode.search(regEvents) is 0
    bindings = ZenCode.match(regEvents)
    return el  if bindings is null
    i = 0

    while i < bindings.length
      split = regEvent.exec(bindings[i])
      if split[2] is `undefined`
        fn = functions[split[1]]
      else
        fn = functions[split[2]]
      $(el).bind split[1], fn
      i++
    el
  parseAttributes = (ZenBlock, data) ->
    return `undefined`  if ZenBlock.search(regAttrDfn) is -1
    attrStrs = ZenBlock.match(regAttrDfn)
    attrs = {}
    i = 0

    while i < attrStrs.length
      parts = regAttr.exec(attrStrs[i])
      attrs[parts[1]] = ""
      attrs[parts[1]] = parseContents(parts[3], data)  if parts[3] isnt `undefined`
      i++
    attrs
  parseClasses = ($,ZenBlock) ->
    ZenBlock = ZenBlock.match(regTagNotContent)[0]
    return `undefined`  if ZenBlock.search(regClasses) is -1
    classes = ZenBlock.match(regClasses)
    clsString = ""
    i = 0

    while i < classes.length
      clsString += " " + regClass.exec(classes[i])[1]
      i++
    $.trim clsString
  parseContents = (ZenBlock, data, indexes) ->
    indexes = {}  if indexes is `undefined`
    html = ZenBlock
    return html  if data is `undefined`
    while regExclamation.test(html)
      html = html.replace(regExclamation, (str, str2) ->
        begChar = ""
        return str  if str.indexOf("!for:") > 0 or str.indexOf("!if:") > 0
        unless str.charAt(0) is "!"
          begChar = str.charAt(0)
          str = str.substring(2, str.length - 1)
        fn = new Function("data", "indexes", "var r=undefined;" + "with(data){try{r=" + str + ";}catch(e){}}" + "with(indexes){try{if(r===undefined)r=" + str + ";}catch(e){}}" + "return r;")
        val = unescape(fn(data, indexes))
        begChar + val
      )
    html = html.replace(/\\./g, (str) ->
      str.charAt 1
    )
    unescape html
  parseEnclosure = (ZenCode, open, close, count) ->
    close = open  if close is `undefined`
    index = 1
    count = (if ZenCode.charAt(0) is open then 1 else 0)  if count is `undefined`
    return  if count is 0
    while count > 0 and index < ZenCode.length
      if ZenCode.charAt(index) is close and ZenCode.charAt(index - 1) isnt "\\"
        count--
      else count++  if ZenCode.charAt(index) is open and ZenCode.charAt(index - 1) isnt "\\"
      index++
    ret = ZenCode.substring(0, index)
    ret
  parseReferences = (ZenCode, ZenObject) ->
    ZenCode = ZenCode.replace(regReference, (str) ->
      str = str.substr(1)
      fn = new Function("objs", "var r=\"\";" + "with(objs){try{" + "r=" + str + ";" + "}catch(e){}}" + "return r;")
      fn ZenObject, parseReferences
    )
    ZenCode
  parseVariableScope = (ZenCode) ->
    return `undefined`  if ZenCode.substring(0, 5) isnt "!for:" and ZenCode.substring(0, 4) isnt "!if:"
    forCode = parseEnclosure(ZenCode, "!")
    ZenCode = ZenCode.substr(forCode.length)
    return parseEnclosure(ZenCode, "(", ")")  if ZenCode.charAt(0) is "("
    tag = ZenCode.match(regZenTagDfn)[0]
    ZenCode = ZenCode.substr(tag.length)
    if ZenCode.length is 0 or ZenCode.charAt(0) is "+"
      return tag
    else if ZenCode.charAt(0) is ">"
      rest = ""
      rest = parseEnclosure(ZenCode.substr(1), "(", ")", 1)
      return tag + ">" + rest
    `undefined`

  regZenTagDfn = /([#\.\@]?[\w-]+|\[([\w-!?=:"']+(="([^"]|\\")+")? {0,})+\]|\~[\w$]+=[\w$]+|&[\w$]+(=[\w$]+)?|[#\.\@]?!([^!]|\\!)+!){0,}(\{([^\}]|\\\})+\})?/i
  regTag = /(\w+)/i
  regId = /(?:^|\b)#([\w-!]+)/i
  regTagNotContent = /((([#\.]?[\w-]+)?(\[([\w!]+(="([^"]|\\")+")? {0,})+\])?)+)/i
  regClasses = /(\.[\w-]+)/g
  regClass = /\.([\w-]+)/i
  regReference = /(@[\w$_][\w$_\d]+)/i
  regAttrDfn = /(\[([\w-!]+(="?([^"]|\\")+"?)? {0,})+\])/ig
  regAttrs = /([\w-!]+(="([^"]|\\")+")?)/g
  regAttr = ///
             ([\w-!]+)  #one or more combination of words, - (dashes), and ! (bang)
             (="?            # equals sign (=), followed by optional double quote
             (             
                             # one or more of the following three:
             (                            
             ([\w]+\[.*?\])  # 1) one or more words, followed by brackets with any chars
             |[^"\]]         # 2) anything except double quote and closing bracket 
             | \\")+         # 3) double quote
             )
             "?)             # optional double quote
             ?   # .... the preceding parenthesized expression zero (0) or one (1) time
        ///i
  regCBrace = /\{(([^\}]|\\\})+)\}/i
  regExclamation = /(?:([^\\]|^))!([^!]|\\!)+!/g
  regEvents = /\~[\w$]+(=[\w$]+)?/g
  regEvent = /\~([\w$]+)=([\w$]+)/i
  regDatas = /&[\w$]+(=[\w$]+)?/g
  regData = /&([\w$]+)(=([\w$]+))?/i

  createHTMLBlock
)()
