var updateModule = (function(){

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
    "url": "/cgi-bin/routerapi/check_updates",
    "successCallback": checkUpdateCallback,
    "data": {}
  };

  var updateRequest = {
    "url": "/cgi-bin/routerapi/update",
    "data": {}
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

