var authorizationToken = getSysauthFromCookie(document.cookie);
function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};
function redirectTo(url) { window.location.href = url; }
function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
    return re.test(str);
};

function checkForm() {
  var form = $('form');
  var newPassword = $('#newPassword');
  var retypePassword = $('#retypePassword');
  var changePasswordUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken;

  form.on('submit', function(event){
    event.preventDefault();
    var changePasswordRequest = { "jsonrpc": "2.0", "method": "user.setpasswd", "params": ["root", newPassword.val()], "id": 1 };

    if(isEmpty(newPassword.val())) {
      alert("Please enter a password!");
      $("#newPassword").focus();
      return
    };

    if(!checkPassword(newPassword.val())) {
      alert("The password you have entered is not valid!");
      $("#newPassword").focus();
      return;
    };

    if(isEmpty(retypePassword.val())) {
      alert("Please re-enter your password");
      $("#retypePassword").focus();
      return;
    };

    if(newPassword.val() != retypePassword.val()) {
      alert("The passwords do not match!");
      $("#retypePassword").focus();
      return;
    };

    $.ajax({
      type: "POST",
      url: changePasswordUrl,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(changePasswordRequest),
      success: function(response) {
        redirectTo("setSSID.html");
      },
      error: function(request, errorType, errorMessage) {
        console.log('Error: ' + errorType + ': Message : ' + errorMessage);
      }
    });

  });
};

function isEmpty(value) { return !value || value.length === 0 || value == " " }

$(function() {
  checkForm();
});
