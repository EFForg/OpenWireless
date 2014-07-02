var lastResponse = {};
var newResponse = {};

var replaceByteCounts = function(){
  
  var getRates = function(newResponse, lastResponse){
    var newDate = new Date(newResponse["dateTime"]);
    var lastDate = new Date(lastResponse["dateTime"]);
    var millisecondsToSecondsConversion = 0.001;
    var timeDifferenceInSeconds = (newDate - lastDate)*millisecondsToSecondsConversion;

    var computeUploadRate = function(networkName){
      return ((newResponse[networkName]["uploadUsage"] - lastResponse[networkName]["uploadUsage"])/timeDifferenceInSeconds).toPrecision(2);
    };

    var computeDownloadRate = function(networkName){
      return ((newResponse[networkName]["downloadUsage"] - lastResponse[networkName]["downloadUsage"])/timeDifferenceInSeconds).toPrecision(2);
    };

    var internetUploadUsage = computeUploadRate("internet");
    var internetDownloadUsage = computeDownloadRate("internet");

    var lanNetworkUploadUsage = computeUploadRate("lanNetwork");
    var lanNetworkDownloadUsage = computeDownloadRate("lanNetwork");

    var privateWifiUploadUsage = computeUploadRate("privateWifi");
    var privateWifiDownloadUsage = computeDownloadRate("privateWifi");

    var openWirelessUploadUsage = computeUploadRate("openWireless");
    var openWirelessDownloadUsage = computeDownloadRate("openWireless");
          
    return {
      "internet": {
        "uploadUsage" : internetUploadUsage,
        "downloadUsage" : internetDownloadUsage
      },
      "lanNetwork": {
        "uploadUsage" : lanNetworkUploadUsage,
        "downloadUsage" : lanNetworkDownloadUsage
      },
      "privateWifi": {
        "uploadUsage" : privateWifiUploadUsage,
        "downloadUsage" : privateWifiDownloadUsage
      },
      "openWireless": {
        "uploadUsage" : openWirelessUploadUsage,
        "downloadUsage" : openWirelessDownloadUsage
      }
    };
  };

  var updateCount = function(htmlTitle, network){
    $("h2:contains('" + htmlTitle + "')").parent().parent().children("header").find(".upload-speed").text(network["uploadUsage"]);  
    $("h2:contains('" + htmlTitle + "')").parent().parent().children("header").find(".download-speed").text(network["downloadUsage"]);
  };

  var successCallback = function(response){
    lastResponse = newResponse;
    newResponse = response;
    rates = getRates(newResponse, lastResponse);
    updateCount('Internet', rates['internet']);
    updateCount('LAN Network', rates['lanNetwork']);
    updateCount('Private Wifi', rates['privateWifi']);
    updateCount('Openwireless.org', rates['openWireless']);
  };

  var requestData = {
    "data" : {},
    "successCallback" : successCallback,
    "errorCallback" : errorCallback,
    "url" : "/cgi-bin/routerapi/bytecount"
  };

  requestModule.submitRequest(requestData);

};

$(function(){

  var initialSuccessCallback = function(response){
    newResponse = response;
  };

  var initialRequestData = {
    "data" : {},
    "successCallback" : initialSuccessCallback,
    "errorCallback"   : errorCallback,
    "url" : "/cgi-bin/routerapi/bytecount"
  };

  requestModule.submitRequest(initialRequestData);

  var timer = $.timer(replaceByteCounts);
  timer.set({ time : 5000, autostart : true });
});
