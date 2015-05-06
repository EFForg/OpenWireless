var requestModule = (function(){
  var getCsrfToken = function() {
    var cookies = document.cookie.split('; ');
    for (i = cookies.length-1; i >= 0; i--) {
      var keyVal = cookies[i].split('=');
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
      error: request.errorCallback || errorCallback,
      timeout: 20000 // twenty seconds
    });
  };

  var openWebsocket = function(url, onMessageCallback, callback){
    socket = new WebSocket(url);
    socket.onopen = function(e){
      callback(socket, e);
    };
    socket.onmessage = onMessageCallback;
  };

  var sendSocketMessage = function(socket, message){
    var parcel = {
      csrf: getCsrfToken(),
      message: message
    };

    socket.send(JSON.stringify(parcel));
  }

  return {
    submitRequest: submitRequest,
    openWebsocket: openWebsocket,
    sendSocketMessage: sendSocketMessage
  };

})();
