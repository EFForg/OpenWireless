var dashboardModule = (function(){
  var authorizationToken;

  var init = function(authToken){
    authorizationToken = authToken;
    displayInterfaces();
  };

  var getConnectivity = function(connected){
    if (connected) {
      return "Connected";
    } else if (connected == false){
      return "Disconnected";
    }
  };

  var getState = function(on){
    if (on) {
      return "On";
    } else if (on == false){
      return "Off";
    }
  };

  var getImage = function(name){
    imageMap = {"Internet" : "../images/router.png",
      "LAN Network": "../images/lan.png",
      "Private Wifi": "../images/antenna-on.png",
      "Openwireless.org": "../images/antenna-on.png"};
    return imageMap[name] || "../images/antenna-on.png";
  };

  var displayDate = function(){
    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    $('#date').text(curr_date + "-" + m_names[curr_month] + "-" + curr_year);
  };

  var displayInterface = function(interface) {
    var source = $('#interface-template').html();
    var template = Handlebars.compile(source);
    interface.imageSource = getImage(interface.name);
    interface.connectivity = getConnectivity(interface.connected);
    interface.state = getState(interface.on);
    interface.stateId = interface.name.replace(/ /g,'').replace(/\./g,'');
    $('#main').append(template(interface));
  };

  var displayInterfaces = function(){
    var data =  { "jsonrpc": "2.0", "method": "dashboard"};
    var successCallback = function(response) {
      if(response.result != null){
        var interfaces = response.result;
        displayInterface(interfaces.internet);
        displayInterface(interfaces.lanNetwork);
        displayInterface(interfaces.privateWifi);
        displayInterface(interfaces.openWireless);
        displayDate();
        enableToggles();
        return;
      }
    };
    submitRequest(data, successCallback, genericErrorCallback);
  };

  var enableToggles = function() {
    var createToggle = function (id, name) {
      $(id).click(function () {
        state = $(id + " span")[0].className.split(" ")[0];
        toggleInterface(name, state);
      });
    };
    createToggle("#Openwirelessorg", "Openwireless.org");
    createToggle("#PrivateWifi", "Private Wifi");
  };

  var toggleInterface = function(name, state) {
    var data = { "jsonrpc": "2.0", "method": "toggle", "params": {"name": name, "state": state}};
    var successCallback = location.reload();
    submitRequest(data, successCallback, genericErrorCallback);
  };

  var genericErrorCallback = function(errorType, errorMessage) {
    var genericError = $('.inputError');
    genericError.text('Error: ' + errorType + ': Message : ' + errorMessage);
    genericError.show();
  };

  var submitRequest = function(data, successCallback, errorCallback){
    requestModule.submitRequest({ "data": data,
      "successCallback":successCallback,
      "errorCallback": errorCallback,
      "url":"/cgi-bin/routerapi/dashboard?auth=" + authorizationToken
    });
  };

  return {
    init: init
  };
})();

$(function() {
  dashboardModule.init(securityModule.getAuthToken());
});
