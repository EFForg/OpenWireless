var requestModule = (function(){

  var submitRequest = function(request){
    //data,url, successCallback, errorCallback
    // var url = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken
    $.ajax({
      type: "POST",
      url: request.url,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(request.data),
      success: request.successCallback,
      error: request.errorCallback
    });
  };

  return {
    submitRequest: submitRequest
  };

})();


