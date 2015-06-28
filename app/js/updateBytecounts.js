var initialResponse = {};
var response1 = {};
var response2 = {};
var response3 = {};
var byteCountPath = "/cgi-bin/routerapi/bytecount";
var keepAliveIntervalMs = 10000;

var replaceByteCounts = function(){
  var roundToDecimal = function(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }

  var getRates = function(newResponse, lastResponse){
    var newDate = new Date(newResponse["dateTime"]);
    var lastDate = new Date(lastResponse["dateTime"]);
    var millisecondsToSecondsConversion = 0.001;
    var bytesToMegabits = 8.0 / 1000000;
    var timeDifferenceInSeconds = (newDate.getTime() - lastDate.getTime())*millisecondsToSecondsConversion;
    var conversion = bytesToMegabits / timeDifferenceInSeconds;

    var computeRate = function(networkName, key) {
      var newVal = newResponse[networkName];
      var oldVal = lastResponse[networkName];
      if (newVal && oldVal) {
        var rate = conversion * (newVal[key] - oldVal[key]);
        roundedRate = roundToDecimal(rate, 1);
        if (roundedRate == 0) {
          return "0.0";
        }
        return roundedRate;
      } else {
        return "0.0";
      }
    };

    var computeUploadRate = function(networkName) {
      return computeRate(networkName, "uploadUsage");
    }
    var computeDownloadRate = function(networkName) {
      return computeRate(networkName, "downloadUsage");
    }

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

  var updateFields = function(response) {
    response1 = response2;
    response2 = response;

    if ($.isEmptyObject(response1)){
        rates = getRates(response2, initialResponse);
    } else {
        rates = getRates(response2, response1);
    }

    updateCount('Internet', rates['internet']);

    updateCount('LAN Network', rates['lanNetwork']);
    updateDevices('LAN Network', response['lanNetwork']['devices']);

    updateCount('Private WiFi', rates['privateWifi']);
    updateDevices('Private WiFi', response['privateWifi']['devices']);

    updateCount('Openwireless.org', rates['openWireless']);
  };

  // When we get an error, trying in five seconds instead of one.
  var retryingErrorCallback = function(jqXHR, textStatus, errorThrown) {
    // [SJP] TODO rewrite error callback/retrying error callback to follow websocket protocol
    errorCallback(jqXHR, textStatus, errorThrown);
    setTimeout(replaceByteCounts, 5000);
  }

  requestModule.openWebsocket(byteCountPath, keepAliveIntervalMs, {
    message: function(response) {
      jsonResponse = JSON.parse(response);
      if (initialResponse === null){
        initialResponse = jsonResponse;
      } else {
        updateFields(response);
      }
    },
    open: function(){},
    close: retryingErrorCallback
  });
};
