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
	var main = $('#main');
	main.append("<div class='network'> <header> <div class='speed'> <div class='upload'>" + interface.uploadSpeed + " <span>mb/s</span></div><div class='download'>" + interface.downloadSpeed + "<span>mb/s</span></div></div></header> " +
				"<div class='title'><h2> " + interface.name + "</h2></div> <div class='status'></div> </div>");
};

var fakeRequest = function(data, successCallback, errorCallback){
	$.getJSON("./js/status-data.json", function(data){
		successCallback(data);	
	});
};

var displayInterfaces = function(){
	var data =  { "jsonrpc": "2.0", "method": "net.routes"}
	var successCallback = function(response) {
	  if(response.result != null){
	  	var interfaces = response.result;
	  	displayInterface(interfaces.internet);
	  	displayInterface(interfaces.lanNetwork);
	  	displayInterface(interfaces.privateWifi);
	  	displayInterface(interfaces.openWireless);
	    return;
	  }
	};
	var errorCallback = function(errorType, errorMessage) {
	  genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
	  genericError.show();
	};
	// submitRequest(data, successCallback, errorCallback);
	fakeRequest(data, successCallback, errorCallback);
};

function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

$(function() {
  displayInterfaces();
});