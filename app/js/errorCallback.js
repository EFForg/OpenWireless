errorCallback = function(jqXHR, textStatus, errorThrown) {
  if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
    if (jqXHR.responseJSON.error === "Not authenticated.") {
      helperModule.redirectTo('login.html?redirect_after_login=' +
        encodeURIComponent(document.location.href));
    }
    errorText = 'Server Error: ' + jqXHR.responseJSON.error;
  } else {
    errorText = 'JS error: ' + errorThrown;
  }

  var genericError = $("#genericError");
  if (genericError) {
    genericError.text(errorText);
    genericError.show();
  } else {
    console.log("Couldn't display error to user. Error was: ", errorText);
  }
};
