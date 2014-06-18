var authorizationToken = getSysauthFromCookie(document.cookie);

var submitRequest = function(data, successCallback, errorCallback){
  $.ajax({
    type: "POST",
    url: "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: successCallback,
    error: errorCallback
  });
};

var displayInterface = function(interface) {
  var source = $('#interface-template').html();
  var template = Handlebars.compile(source);
  interface.imageSource = getImage(interface.name); 
  interface.connectivity = getConnectivity(interface.connected); 
  interface.state = getState(interface.on); 
	$('#main').append(template(interface));
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
}


var getImage = function(name){
  imageMap = {"Internet" : "../images/router.png",
              "LAN Network": "../images/lan.png",
              "Private Wifi": "../images/antenna-on.png",
              "Openwireless.org": "../images/antenna-on.png"};
  return imageMap[name] || "../images/antenna-on.png"; 
}

var displayDate = function(){
  var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  $('#date').text(curr_date + "-" + m_names[curr_month] + "-" + curr_year);
}

var displayInterfaces = function(){
	var data =  { "jsonrpc": "2.0", "method": "dashboard"};
	var successCallback = function(response) {
	  if(response.result != null){
	  	var interfaces = JSON.parse(response.result);
	  	displayInterface(interfaces.internet);
	  	displayInterface(interfaces.lanNetwork);
	  	displayInterface(interfaces.privateWifi);
	  	displayInterface(interfaces.openWireless);
      displayDate();
      return;
	  }
	};
	var errorCallback = function(errorType, errorMessage) {
      //todo: make generic error display
	  genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
	  genericError.show();
	};
	submitRequest(data, successCallback, errorCallback);
};

function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

$(function() {
  displayInterfaces();
});
