var initialResponse = {};
var response1 = {};
var response2 = {};
var response3 = {};
var response4 = {};
var response5 = {};
var response6 = {};

var replaceByteCounts = function(){
  var getRates = function(newResponse, lastResponse){
    var newDate = new Date(newResponse["dateTime"]);
    var lastDate = new Date(lastResponse["dateTime"]);
    var millisecondsToSecondsConversion = 0.001;
    var byteToMegabyteConversion = 0.000001;
    var byteToBitConversion = 8;
    var timeDifferenceInSeconds = (newDate - lastDate)*millisecondsToSecondsConversion*byteToBitConversion;

    var computeUploadRate = function(networkName){
      return ((newResponse[networkName]["uploadUsage"] - lastResponse[networkName]["uploadUsage"])*byteToMegabyteConversion/timeDifferenceInSeconds).toPrecision(2);
    };

    var computeDownloadRate = function(networkName){
      return ((newResponse[networkName]["downloadUsage"] - lastResponse[networkName]["downloadUsage"])*byteToMegabyteConversion/timeDifferenceInSeconds).toPrecision(2);
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

  var updateDevices = function(htmlTitle, numberOfDevices){
    $("h2:contains('" + htmlTitle + "')").parent().parent().find(".device-count").text(numberOfDevices);
  };

  var updateOpenwirelessBandwidth = function(networkRates){
    byteUsage = parseInt(networkRates["uploadUsage"]) + parseInt(networkRates["downloadUsage"]);
    var byteToMegabyteConversion = 0.000001;
    mbUsage = byteUsage * byteToMegabyteConversion;
    mbUsageForDisplay = mbUsage.toPrecision(2);
    $('#monthlyBandwidth').text(mbUsageForDisplay);
  }

  var successCallback = function(response){
    var response1 = response2;
    var response2 = response3;
    var response3 = response4;
    var response4 = response5;
    var response5 = response6;
    var response6 = response;

    if ($.isEmptyObject(response1)){
        rates = getRates(response6, initialResponse);
    } else {
        rates = getRates(response6, response1);
    }

    updateCount('Internet', rates['internet']);

    updateCount('LAN Network', rates['lanNetwork']);
    updateDevices('LAN Network', response['lanNetwork']['devices']);

    updateCount('Private Wifi', rates['privateWifi']);
    updateDevices('Private Wifi', response['privateWifi']['devices']);

    updateCount('Openwireless.org', rates['openWireless']);

    updateOpenwirelessBandwidth(rates['openWireless']);
    // We use a setTimeout rather than a setInterval because sometimes the
    // server responses are consistently slower than a second. Under
    // setInterval that would result in lots of stacked requests, exacerbating
    // the slowness.
    setTimeout(replaceByteCounts, 1000);
  };

  // When we get an error, trying in ten seconds instead of one.
  var retryingErrorCallback = function(jqXHR, textStatus, errorThrown) {
    errorCallback(jqXHR, textStatus, errorThrown);
    setTimeout(replaceByteCounts, 10000);
  }

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
    initialResponse = response;
  };

  var initialRequestData = {
    "data" : {},
    "successCallback" : initialSuccessCallback,
    "errorCallback"   : errorCallback,
    "url" : "/cgi-bin/routerapi/bytecount"
  };

  requestModule.submitRequest(initialRequestData);
  replaceByteCounts();
});
