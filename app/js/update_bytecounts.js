var replaceByteCounts = function(){
  
  var updateCount = function(htmlTitle, network){
    $("h2:contains('" + htmlTitle + "')").parent().parent().children("header").find(".upload-speed").text(network["uploadUsage"]);  
    $("h2:contains('" + htmlTitle + "')").parent().parent().children("header").find(".download-speed").text(network["downloadUsage"]);
  };

  var successCallback = function(response){
    updateCount('Internet', response['internet']);
    updateCount('LAN Network', response['lanNetwork']);
    updateCount('Private Wifi', response['privateWifi']);
    updateCount('Openwireless.org', response['openWireless']);
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
  var timer = $.timer(replaceByteCounts);
  timer.set({ time : 5000, autostart : true });
});
