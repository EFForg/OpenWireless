var updateModule = (function(){

  var checkUpdateCallback = function(response){
    if(response.result.status == "up-to-date"){
      dashboardModule.displayDate(new Date());
      alert("Your software is up-to-date!");
    } else {
      if(confirm("A new version is available. Would you like to update now?")){
        requestModule.submitRequest(updateRequest);
      }
    }
    $("#check-for-updates").removeClass("loading");
  };

  var errorCallback = function(response){
    alert("Unable to update - check your internet connection");
  };

  var updateCallback = function(response){
    if(response.result.status == "update-success"){
      dashboardModule.displayDate(new Date());
      alert("Successfully updated your software!");
    } else {
      alert("Unable to complete update.");
    }
  };

  var checkUpdateRequest = {
    "url": "/cgi-bin/routerapi/check_updates",
    "successCallback": checkUpdateCallback,
    "errorCallback": errorCallback,
    "data": {}
  };

  var updateRequest = {
    "url": "/cgi-bin/routerapi/update",
    "successCallback": updateCallback,
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
    $("#check-for-updates").addClass("loading");
    updateModule.submitUpdateRequest();
  });
});

