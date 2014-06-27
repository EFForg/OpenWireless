var updateModule = (function(){

  var authorizationToken = securityModule.getAuthToken();

  var checkUpdateData = {
    "jsonrpc": "2.0",
    "method" : "check_updates"
  };

  var checkUpdateCallback = function(response){
    if(response.result.status == "up-to-date"){
      alert("Your software is up-to-date!");
    } else {
      if(confirm("A new version is available. Would you like to update now?")){
        requestModule.submitRequest(updateRequest);
      }
    }
  };

  var checkUpdateRequest = {
    "url":"/cgi-bin/routerapi/check_updates?auth=" + authorizationToken,
    "successCallback":checkUpdateCallback,
    "errorCallback":errorCallback,
    "data": checkUpdateData
  };

  var updateData = {
    "jsonrpc": "2.0",
    "method" : "update"
  };

  var updateRequest = {
    "url":"/cgi-bin/routerapi/update?auth=" + authorizationToken,
    "successCallback": function(){},
    "errorCallback":errorCallback,
    "data": updateData
  };
 
  var errorCallback = function(errorType, errorMessage) {
    var genericError = $('.inputError');
    genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
    genericError.show();
  };

  var submitUpdateRequest = function(){
    requestModule.submitRequest(checkUpdateRequest);
  };

  return {
    submitUpdateRequest: submitUpdateRequest 
  };

})();


$(function() {
  $('#checkForUpdate').click(function(){
    updateModule.submitUpdateRequest();
  });
});

