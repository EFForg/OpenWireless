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
      //submit request here
      return(value);
    }, { 
      type    : 'text',
      width   : '100',
      submit  : 'OK',
    });

    createEditableSelector('#routerBand', "{'2.4':'2.4', '5': '5', selected : '5'}"); 
    createEditableSelector('#routerChannel', "{'auto':'auto', 'custom': 'custom', selected : 'auto'}"); 
    createEditableSelector('#routerChannelBandwidth', "{'20':'20', '40': '40', selected : '20'}"); 
    createEditableSelector('#routerVpnConfiguration', "{'None':'None', 'TOR': 'TOR', 'VPN': 'VPN', selected : 'None'}"); 
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
  $.getJSON("../js/settings-data.json", function(data){ 
    var authToken = securityModule.getAuthToken();
    settingsModule.init(data, authToken);
  });
});
