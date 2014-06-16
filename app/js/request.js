var requestModule = (function(){

  var submitRequest = function(data, successCallback, errorCallback){
    $.ajax({
      type: "POST",
      url: "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: successCallback,
      error: errorCallback
    });
  };

  return {
    submitRequest: submitRequest
  };

})();


