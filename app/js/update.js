var updateModule = (function(){
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
    "url":"/cgi-bin/routerapi/check_updates",
    "successCallback":checkUpdateCallback,
    "errorCallback":errorCallback,
    "data": checkUpdateData
  };

  var updateData = {
    "jsonrpc": "2.0",
    "method" : "update"
  };

  var updateRequest = {
    "url":"/cgi-bin/routerapi/update",
    "successCallback": function(){},
    "errorCallback":errorCallback,
    "data": updateData
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

