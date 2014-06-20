var requestModule = (function(){

  var submitRequest = function(request){
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


