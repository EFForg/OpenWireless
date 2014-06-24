$(function() {
  $('#checkForUpdate').click(function(){
    var authorizationToken = securityModule.getAuthToken();
    var data = {
      "jsonrpc": "2.0",
      "method" : "check_updates",
    };
    var successCallback = function(response){
      if(response.result.status == "up-to-date"){
        alert("Your software is up-to-date!");
      } else {
        confirm("A new version is available. Would you like to update now?")
      }
    };

    var errorCallback = function(errorType, errorMessage) {
      var genericError = $('.inputError');
      genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
      genericError.show();
    };

    var request = {
      "url":"http://192.168.1.1/cgi-bin/routerapi/update?auth=" + authorizationToken,
      "successCallback":successCallback,
      "errorCallback":errorCallback,
      "data": data
    };
    
    requestModule.submitRequest(request);
  });
});

