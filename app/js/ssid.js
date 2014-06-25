var ssidModule = (function() {
  var form;
  var ssid;
  var ssidPassphrase;
  var ssidError;
  var ssidPassphraseError;
  var genericError;

  //TODO: make sure this cookie is secure
  var uciUrl;

  var init = function() {
    uciUrl = "uci?auth=" + getSysauthFromCookie(document.cookie);
    initializeFields();
    initializeForm();
  };

  var initializeFields = function(){
    form = $('form');
    ssid = $('#ssid');
    ssidPassphrase = $('#ssidPassphrase');
    ssidError = $('#ssidError');
    ssidPassphraseError = $('#ssidPassphraseError');
    genericError = $('#genericError');
  };

  var initializeForm = function(){
    form.submit(function(event){
      event.preventDefault();
      ssidError.hide();
      ssidPassphraseError.hide();
      genericError.hide();
      ssid.removeClass('error');
      ssidPassphrase.removeClass('error');

      if(helperModule.checkEmptyField(ssid, ssidError, "SSID")){
        return;
      }

      if(helperModule.checkEmptyField(ssidPassphrase, ssidPassphraseError, "passphrase")){
        return;
      }

      $('.formDiv').hide();
      $('#restarting').show();

      //TODO: sending info over plain http
      //TODO: hard coded ip address
      //TODO: First validate the input before hiding

      setSSID(setPassphrase);
    });
  };

  var setSSID = function(successCallback) {
    var ssidRequest = { "jsonrpc": "2.0", "method": "set", "params": ["wireless.@wifi-iface[0].ssid=" + ssid.val()], "id": 1 };

    requestModule.submitRequest({url: uciUrl, successCallback: successCallback, errorCallback: errorHandler, data: ssidRequest});
  };

  var setPassphrase = function() {
    var ssidRequest = { "jsonrpc": "2.0", "method": "set", "params": ["wireless.@wifi-iface[0].key=" + ssidPassphrase.val()], "id": 1 };

    requestModule.submitRequest({url: uciUrl, successCallback: setPassPhraseEncryption, errorCallback: errorHandler, data: ssidRequest});
  };

  var setPassPhraseEncryption = function() {
    var ssidRequest = { "jsonrpc": "2.0", "method": "set", "params": ["wireless.@wifi-iface[0].encryption=psk2"], "id": 1 };

    requestModule.submitRequest({url: uciUrl, successCallback: commitSsid, errorCallback: errorHandler, data: ssidRequest});
  };

  var commitSsid = function() {
    var commitRequest = { "jsonrpc": "2.0", "method": "commit", "params": ["wireless"], "id": 1 };

    requestModule.submitRequest({url: uciUrl, successCallback: getSSID, errorCallback: errorHandler, data: commitRequest});
  };

  var getSSID = function(response) {
    var getRequest = { "jsonrpc": "2.0", "method": "get", "params": ["wireless.@wifi-iface[0].ssid"], "id": 1 };
    requestModule.submitRequest({url: uciUrl, successCallback: getSSIDSuccess, errorCallback: errorHandler, data: getRequest});
  };

  var getSSIDSuccess = function(response) {
    setTimeout(function () {
      $('#restarting').hide();
      $("#restartSuccess").html("<h1>Restart Successful</h1><p>SSID updated to <b>" + response.result +
          "</b>.<br>Please connect to this network now.</p> <a href='/app/html/dashboard.html'>View Router Dashboard</a>");
      $('#restartSuccess').show();
    }, 3000);
  };

  var errorHandler = function(request, errorType, errorMessage) {
    console.log('Error: ' + errorType + ': Message : ' + errorMessage);
  };

  //TODO: dry this up
  var getSysauthFromCookie = function(cookieString) {
    var sysauthPairs = cookieString.split(";");
    var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
    return lastCookieValue[1];
  };

  return {
    init: init
  }

})();

$(document).ready(function() {
  ssidModule.init();
});
