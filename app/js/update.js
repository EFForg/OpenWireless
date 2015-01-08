var updateModule = (function(){

  var checkUpdateCallback = function(response){
    newdate = new Date(response.result.last_update_check);
    if(response.result.status == "not-up-to-date") {
      dashboardModule.displayLastUpdate({updateAvailable: true, lastCheckDate: newdate});
      $("#check-for-updates").removeClass("loading");
      if(confirm("A new version is available. Would you like to update now?")){
        requestModule.submitRequest(updateRequest);
      }
    } else if(response.result.status == "up-to-date") {
      dashboardModule.displayLastUpdate({updateAvailable: false, lastCheckDate: newdate});
      $("#check-for-updates").removeClass("loading");
      alert("Your software is up-to-date!");
    } else if(response.result.status ==  "system-busy-try-again") {
      $("#check-for-updates").removeClass("loading");
      alert("The system was busy and could not execute your request. Please try again later.");
    }
    else {
      $("#check-for-updates").removeClass("loading");
      alert("There was a system error. Please check logs on router.");
    }
  };

  var errorCallback = function(response){
    alert("Unable to update - check your internet connection");
    $("#check-for-updates").removeClass("loading");
  };

  var updateCallback = function(response){
    if(response.result.status == "update-success"){
      //Should never get here 
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
  $(document).on('click', '#checkForUpdate', function(){
    $("#check-for-updates").addClass("loading");
    updateModule.submitUpdateRequest();
  });
});

