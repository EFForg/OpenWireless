var errorCallback = function(jqXHR, textStatus, errorThrown) {
  // Re-enable any buttons that were greyed out to indicate background RPCs.
  $("input[type=submit]").prop('disabled', false);
  // Filter out spurious XHR errors that are thrown on page unload. Filtering by
  // readyState == 0 is imperfect, but good enough. See for details:
  // http://stackoverflow.com/questions/1370322/jquery-ajax-fires-error-callback-on-window-unload-how-do-i-filter-out-unload-a
  if (jqXHR.readyState == 0) {
    console.log("Skipped showing error because readyState == 0.");
    return;
  }
  if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
    if (jqXHR.responseJSON.error === "Not authenticated.") {
      helperModule.redirectTo('login.html?redirect_after_login=' +
        encodeURIComponent(document.location.pathname));
      return;
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
