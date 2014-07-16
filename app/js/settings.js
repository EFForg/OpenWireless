var settingsModule = (function(){

  var config = {};
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
  var encryptionOptions = ['Unencrypted', 'EAP-TLS'];

  var menus = [
    { tag: "routerBand",                    options: routerBandOptions },
    { tag: "routerChannelBandwidth",        options: routerChannelBandwidthOptions },
    { tag: "routerVpnConfiguration",        options: routerVpnConfigurationOptions },
    { tag: "openwirelessBand",              options: routerBandOptions },
    { tag: "openwirelessChannelBandwidth",  options: routerChannelBandwidthOptions },
    { tag: "openwirelessVpnConfiguration",  options: routerVpnConfigurationOptions },
    { tag: "openwirelessEncryption",  options: encryptionOptions }
  ];

  var init = function(data){
    config = data;
    displaySettings();
    initializeEditableFields();
  };

  var displaySettings = function(){
    var template = Handlebars.templates.settings;
    $('#main').html(template(config));

    initializeDropDownMenus();

    var tags = ["router", "openwireless"];
    setDependentDropDownMenus(tags);
  };

    var disableVPNAndTORConfig = function() {
        $("#routerVpnConfiguration>option:contains(TOR)").prop('disabled', true);
        $("#routerVpnConfiguration>option:contains(VPN)").prop('disabled', true);
        $("#routerVpnConfiguration>option:contains(VPN2)").prop('disabled', true);

        $("#openwirelessVpnConfiguration>option:contains(TOR)").prop('disabled', true);
        $("#openwirelessVpnConfiguration>option:contains(VPN)").prop('disabled', true);
        $("#openwirelessVpnConfiguration>option:contains(VPN2)").prop('disabled', true);
    };

    var disableOpenWirelessWiFiSecurity = function() {
        $("#openwirelessEncryption>option:contains(EAP-TLS)").prop('disabled', true);
    };

    var disableCustomChannel = function() {
        $("#routerChannel>option:contains(-- custom --)").prop('disabled', true);
        $("#openwirelessChannel>option:contains(-- custom --)").prop('disabled', true);
    };


    var initializeDropDownMenus = function(){
        for (var index in menus) {
            setDropDownMenu(menus[index].tag, menus[index].options);
        }
        disableVPNAndTORConfig();
        disableOpenWirelessWiFiSecurity();
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
      select  : true,
      onsubmit: function() {
        var validation = {
          "ispDownloadSpeed":{
            rule : function(){ return { number: true, max: 1000 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 1000.' }}
          },
          "ispUploadSpeed":{
            rule : function(){ return { number: true, max: 1000 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 1000.' }}
          },
          "openwirelessBandwidth":{
            rule : function(){ return { number: true, max: 100 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 100.' }}
          },
          "openwirelessData":{
            rule : function(){ return { number: true, max: 1000000 }},
            message : function(){ return { number: 'Must be a number', max: 'Must be less than 1000000.' }}
          }
        };

        var fieldName = $(this).parent().attr("id");
        $(this).validate({
            rules: {
                'value': validation[fieldName].rule()
            },
            messages: {
                'value': validation[fieldName].message()
            }
        });

        if ((fieldName == "openwirelessBandwidth") && ($(this).find("input").val() < 5)) {
          return confirm("Are you sure that you want your open wireless bandwidth percentage to be less than 5?");
        }

        return ($(this).valid());
    }
    });
  };

  var setDependentDropDownMenus = function(tags) {
    for (var index in tags) {
      var dropDown = $('#' + tags[index] + 'Band');
      if (dropDown.val() === "5") {
        setDropDownMenu(tags[index] + "Channel", router5ChannelOptions);
      } else {
        setDropDownMenu(tags[index] + "Channel", router24ChannelOptions);
      }
    }
    disableCustomChannel();
  };

  var setDropDownMenu = function(tag, options) {
    var template = Handlebars.templates["settings-dropdown"];
    var dropDown = $('#' + tag);
    dropDown.empty();
    dropDown.append(template({options: options}));
    $('#' + tag + ' option:contains(' + config[tag] + ')').prop('selected', true);
    dropDown.change(function() {
      config[tag] = dropDown.val();
      updateSettings(tag, config[tag]);
      if (tag.substr(-4,4) === "Band") {
        config[tag.replace("Band", "Channel")] = "auto";
        setDependentDropDownMenus([tag.replace("Band", "")]);
      }
    });
  };

  var updateSettings = function(setting, value) {
    var data = {};
    data[setting] = value;
    var url = "/cgi-bin/routerapi/update_setting";
    var successCallback = function(response){};

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
    var url = "/cgi-bin/routerapi/settings"
    var successCallback = function(response) {
        settingsModule.init(response.result);
    };

    requestModule.submitRequest({
        "data"              :data,
        "url"               :url,
        "errorCallback"     :errorCallback,
        "successCallback"   :successCallback
    });
});
