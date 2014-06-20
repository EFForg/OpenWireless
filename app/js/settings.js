var settingsModule = (function(){

  var config = {};
  var authorizationToken;
  var routerBandOptions = ["5", "2.4"];
  var router5ChannelOptions = ['auto',
    '36 (5.180 GHz)', '40 (5.200 GHz)', '44 (5.220 GHz)', '48 (5.240 GHz)',
    '149 (5.745 GHz)', '153 (5.765 GHz)', '159 (5.785 GHz)', '161 (5.805 GHz)',
    '165 (5.825 GHz)',
    '-- custom --'];
  var router24ChannelOptions = ['auto',
    '1 (2.412 GHz)', '2 (2.417 GHz)', '3 (2.422 GHz)', '4 (2.427 GHz)',
    '5 (2.432 GHz)', '6 (2.437 GHz)', '7 (2.442 GHz)', '8 (2.447 GHz)',
    '9 (2.452 GHz)', '10 (2.457 GHz)', '11 (2.462 GHz)', '12 (2.467 GHz)',
    '-- custom --'];
  var routerChannelBandwidthOptions = ['20', '40'];
  var routerVpnConfigurationOptions = ['None', 'TOR', 'VPN', 'VPN 2'];

  var menus = [
    { tag: "routerBand",                    options: routerBandOptions },
    { tag: "routerChannelBandwidth",        options: routerChannelBandwidthOptions },
    { tag: "routerVpnConfiguration",        options: routerVpnConfigurationOptions },
    { tag: "openwirelessBand",              options: routerBandOptions },
    { tag: "openwirelessChannelBandwidth",  options: routerChannelBandwidthOptions },
    { tag: "openwirelessVpnConfiguration",  options: routerVpnConfigurationOptions }
  ];

  var init = function(data, authToken){
    authorizationToken = authToken;
    config = data;
    displaySettings();
    initializeEditableFields();
  };

  var displaySettings = function(){
    var source = $('#settings-template').html();
    var template = Handlebars.compile(source);
    $('#main').empty();
    $('#main').append(template(config));

    initializeDropDownMenus();

    var tags = ["router", "openwireless"];
    setDependentDropDownMenus(tags);
  };

  var initializeDropDownMenus = function(){
    for (var index in menus) {
      setDropDownMenu(menus[index].tag, menus[index].options);
    }
  };

  var initializeEditableFields = function(){
    $('.editable').editable(function(value, settings) { 
      var tag = $(this).attr('id');
      config[tag] =  value;
      updateSettings(tag, config[tag]);
      return(value);
    }, { 
      type    : 'text',
      width   : '100',
      submit  : 'OK',
      onsubmit: function() {
        var validation = { 
          "ispDownloadSpeed":{
            rule : function(){ return { number: true, max: 1000 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 1000.' }}
          },
          "ispUploadSpeed":{
            rule : function(){ return { number: true, max: 1000 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 1000.' }}
          }
        };
        
        var fieldName = $(this).parent().attr("id");
        $(this).validate({
            rules: {
                'value':validation[fieldName].rule()

            },

            messages: {
                'value': validation[fieldName].message()
            }
        });

        return ($(this).valid());
    }
    });
  };

  var setDependentDropDownMenus = function(tags) {
    for (var index in tags){
      var dropDown = $('#' + tags[index] + 'Band');
      if (dropDown.val() === "5"){
        setDropDownMenu(tags[index] + "Channel", router5ChannelOptions);
      } else {
        setDropDownMenu(tags[index] + "Channel", router24ChannelOptions);
      }
    }
  };

  var setDropDownMenu = function(tag, options){
    var source = $('#dropdown-template').html();
    var template = Handlebars.compile(source);
    var dropDown = $('#' + tag);
    dropDown.empty();
    dropDown.append(template({options: options}));
    $('#' + tag + 'option:contains(' + config[tag] + ')').prop('selected', true);
    dropDown.change(function(){
      config[tag] = dropDown.val();
      updateSettings(tag, config[tag]);
      if (tag.substr(-4,4) === "Band") {
        config[tag.replace("Band", "Channel")] = "auto";
        setDependentDropDownMenus([tag.replace("Band", "")]);
      }
    });
  };

  var updateSettings = function(setting, value){
    var data = { "jsonrpc": "2.0", "method": "update_settings", "params": [setting, value]};
    var url = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken;
    var successCallback = function(response){};
    var errorCallback = function(errorType, errorMessage) {
        var genericError = $('.inputError');
        genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
        genericError.show();
        console.log('Error: ' + errorType + ': Message : ' + errorMessage);
    };

    requestModule.submitRequest({
        "data"              :data,
        "url"               :url,
        "errorCallback"     :errorCallback,
        "successCallback"   :successCallback
    });

  };

  return {
    init: init
  };

})();

$(function() {
    var data =  { "jsonrpc": "2.0", "method": "settings"};
    var authToken = securityModule.getAuthToken();
    var url = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authToken;
    var successCallback = function(response){
        settingsModule.init(JSON.parse(response.result), authToken);
    };
    var errorCallback = function(errorType, errorMessage) {
        var genericError = $('.inputError');
        genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
        genericError.show();
    };

    requestModule.submitRequest({
        "data"              :data,
        "url"               :url,
        "errorCallback"     :errorCallback,
        "successCallback"   :successCallback 
    });

});
