errorCallback = function(jqXHR, textStatus, errorThrown) {
  var errorText = "";
  if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
    errorText = 'Error: ' + jqXHR.responseJSON.error;
  } else {
    errorText = 'Error';
  }

  var genericError = $("#genericError");
  if (genericError) {
    genericError.text(errorText);
    genericError.show();
  } else {
    console.log("Couldn't display error to user. Error was: ", errorText);
  }
};
