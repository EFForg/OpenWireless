var dashboardModule = (function(){
  var init = function(){
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
      return "on";
    } else if (on == false){
      return "off";
    }
  };

  var getImage = function(name){
    imageMap = {"Internet" : "images/router.png",
      "LAN Network": "images/lan.png",
      "Private WiFi": "images/antenna-on.png",
      "Openwireless.org": "images/antenna-on.png"};
    return imageMap[name] || "images/antenna-on.png";
  };

  var displayIpAddresses = function(lanIp, wanIp){
    $('#lan-ip').text(lanIp);
    $('#wan-ip').text(wanIp);
  }

  var displayDate = function(){
    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    $('#date').text(curr_date + "-" + m_names[curr_month] + "-" + curr_year);
  };

  var displayInterface = function(interface) {
    var template = Handlebars.templates.dashboard;
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
        $("#genericError").hide();
        var interfaces = response.result;
        displayInterface(interfaces.internet);
        displayInterface(interfaces.lanNetwork);
        displayInterface(interfaces.privateWifi);
        displayInterface(interfaces.openWireless);
        displayIpAddresses(interfaces.lanIp, interfaces.wanIp);
        displayDate();
        enableToggles();
        return;
      }
    };
    submitRequest(data, successCallback);
  };

  var enableToggles = function() {
    var createToggle = function (id, name) {
        $(document).on('click', id, function () {
          state = $(id + " span")[0].className.split(" ")[1];
          if (id == "#PrivateWiFi" && state == "on") {
            if (confirm("Turning off the Private WiFi network will cause loss of connectivity to the network and this admin interface. " +
              "To regain access to this admin interface you must connect to the wired LAN. Are you sure you want to proceed?")) {
            toggleInterface(name, state);
          }
        } else {
          toggleInterface(name, state);
        }
      });
    };
    createToggle("#Openwirelessorg", "Openwireless.org");
    createToggle("#PrivateWiFi", "Private WiFi");
  };

  var toggleInterface = function(name, state) {
    var data = { "jsonrpc": "2.0", "method": "toggle", "name": name, "state": state};
    var successCallback = function(response){
        if(response["name"] == "Openwireless.org"){
          $("#Openwirelessorg span").removeClass("on").removeClass("off")
          $("#Openwirelessorg span").addClass(response["new_state"])
        }
        if(response["name"] == "Private WiFi"){
          $("#PrivateWiFi span").removeClass("on").removeClass("off")
          $("#PrivateWiFi span").addClass(response["new_state"])
        }
    };
    submitToggleRequest(data, successCallback);
  };

  var submitToggleRequest = function(data, successCallback) {
    requestModule.submitRequest({
      data: data,
      successCallback:successCallback,
      url: "/cgi-bin/routerapi/toggle_interface"
    });
  };

  var submitRequest = function(data, successCallback) {
    requestModule.submitRequest({
      data: data,
      successCallback: successCallback,
      url: "/cgi-bin/routerapi/dashboard"
    });
  };

  return {
    init: init
  };
})();

$(function() {
  dashboardModule.init();
});
