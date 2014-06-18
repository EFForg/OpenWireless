var settingsModule = (function(){

  var config = {};
  var authorizationToken;

  var init = function(data, authToken){
    authorizationToken = authToken;
    config = data;
    displaySettings(data);
    initializeEditableFields();
  };

  var displaySettings = function(settings){
    var source = $('#settings-template').html();
    var template = Handlebars.compile(source);
    $('#main').empty();
    $('#main').append(template(settings));
  };

  var initializeEditableFields = function(){
    $('.editable').editable(function(value, settings) { 
      config[$(this).attr('id')] =  value;

      return(value);
    }, { 
      type    : 'text',
      width   : '100',
      submit  : 'OK',
    });

    createEditableSelector('#routerBand', "{'2.4':'2.4', '5': '5', selected : '5'}"); 
    createEditableSelector('#routerChannel', "{'auto':'auto', 'custom': 'custom', selected : 'auto'}"); 
    createEditableSelector('#routerChannelBandwidth', "{'20':'20', '40': '40', selected : '20'}"); 
    createEditableSelector('#routerVpnConfiguration', "{'None':'None', 'TOR': 'TOR', 'VPN': 'VPN', 'VPN 2': 'VPN 2', selected : 'None'}"); 

    createEditableSelector('#openwirelessBand', "{'2.4':'2.4', '5': '5', selected : '5'}"); 
    createEditableSelector('#openwirelessChannel', "{'auto':'auto', 'custom': 'custom', selected : 'auto'}"); 
    createEditableSelector('#openwirelessChannelBandwidth', "{'20':'20', '40': '40', selected : '20'}"); 
    createEditableSelector('#openwirelessVpnConfiguration', "{'None':'None', 'TOR': 'TOR', 'VPN 1': 'VPN 1', 'VPN 2': 'VPN 2', selected : 'None'}"); 
  };

  var createEditableSelector = function(selectorId, selectorData) {
   $(selectorId).editable(function(value, settings) {
      config[$(this).attr('id')] = value;
      return(value);
    }, {
      data    : selectorData,
      type    : 'select',
      submit  : 'OK'
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
        //todo: make generic error display
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
