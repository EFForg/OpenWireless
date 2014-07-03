var requestModule = (function(){
  var getCsrfToken = function() {
    cookies = document.cookie.split('; ');
    for (i = cookies.length-1; i >= 0; i--) {
      keyVal = cookies[i].split('=');
      if (keyVal[0] === 'csrf_token') {
        return keyVal[1];
      }
    }
    return '';
  }

  var submitRequest = function(request){
    $.ajax({
      type: "POST",
      url: request.url,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(request.data),
      headers: {
        "X-CSRF-Token": getCsrfToken()
      },
      success: request.successCallback,
      error: request.errorCallback
    });
  };

  return {
    submitRequest: submitRequest
  };

})();
