var helperModule = (function(){

  var isEmpty = function(value) { return !value || value.length === 0 || value == " " };

  var checkEmptyField = function(field, errorField, fieldName) {
    if(isEmpty(field.val())) {
      field.addClass('error');
      errorField.html("Please enter a " + fieldName + "!");
      errorField.show();
      field.focus();
      return;
    }
  };

  var redirectTo = function(url) { window.location.href = url; };

  return {
    isEmpty: isEmpty,
    checkEmptyField: checkEmptyField,
    redirectTo: redirectTo
  };
})();
