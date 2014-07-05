var helperModule = (function(){

  var isEmpty = function(value) { return !value || value.length === 0 || value == " " };

  var checkEmptyField = function(field, errorField, fieldName) {
    if(isEmpty(field.val())) {
      field.addClass('error');
      errorField.html("Please enter a " + fieldName + "!");
      errorField.show();
      field.focus();
      return true;
    }
    return false;
  };

  var redirectTo = function(url) {
    // Check for redirect to javascript: or similar URIs
    if (url.match(/^[a-zA-Z]*:/) && !url.match(/^https?:/)) {
      throw("Invalid redirect URL");
    } else {
      window.location.href = url;
    }
  };

  var checkPassword = function(str) {
      var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
      return re.test(str);
  };

  return {
    isEmpty: isEmpty,
    checkEmptyField: checkEmptyField,
    redirectTo: redirectTo,
    checkPassword: checkPassword
  };
})();
