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

    setDropDownMenu("routerBand", routerBandOptions);
    setDropDownMenu("routerChannelBandwidth", routerChannelBandwidthOptions);
    setDropDownMenu("routerVpnConfiguration", routerVpnConfigurationOptions);
    setDropDownMenu("openwirelessBand", routerBandOptions);
    setDropDownMenu("openwirelessChannelBandwidth", routerChannelBandwidthOptions);
    setDropDownMenu("openwirelessVpnConfiguration", routerVpnConfigurationOptions);

    setDependentBandwidthDropDownMenus();
  };

  var initializeEditableFields = function(){
    $('.editable').editable(function(value, settings) { 
      config[$(this).attr('id')] =  value;

      return(value);
    }, { 
      type    : 'text',
      width   : '100',
      submit  : 'OK'
    });
  };

  var setDependentBandwidthDropDownMenus = function() {
    var tags = ["router", "openwireless"];
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
      if (tag.substr(-4,4) === "Band") {
        config[tag.replace("Band", "Channel")] = "auto";
        setDependentBandwidthDropDownMenus();
      }
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
