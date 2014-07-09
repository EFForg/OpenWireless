var helperModule = (function(){

  var isEmpty = function(value) { return !value || value.length === 0 || value == " " };

  var checkEmptyField = function(field, errorField, fieldName) {
    if(isEmpty(field.val())) {
      field.addClass('error');
      errorField.text("Please enter a " + fieldName + "!");
      errorField.show();
      field.focus();
      return true;
    }
    return false;
  };

  var url = function() {
    return document.location.href + "";
  };

  var redirectTo = function(url) {
    // Check for redirect to javascript: or similar URIs
    if (url.match(/^[a-zA-Z]*:/) && !url.match(/^https?:/)) {
      throw("Invalid redirect URL");
    } else {
      window.location.href = url;
    }
  };

  return {
    isEmpty: isEmpty,
    checkEmptyField: checkEmptyField,
    redirectTo: redirectTo,
    url: url
  };
})();
