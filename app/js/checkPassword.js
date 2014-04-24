function checkPassword(str)
{
    var re = /^([a-z]+)$/;
    return re.test(str);
}

function checkForm()
{
    if($("#newPassword").val() == " ") {
        alert("Please enter a password!");
        $("#newPassword").focus();
        return false;
    }

    if(!checkPassword($("#newPassword").val())) {
        alert("The password you have entered is not valid!");
        $("#newPassword").focus();
        return false;
    }

    if($("#retypePassword").val() == " ") {
        alert("Please re-enter your password");
        $("#retypePassword").focus();
        return false;
    }

    if($("#newPassword").val() != $("#retypePassword").val()) {
       alert("The passwords do not match!");
       $("#retypePassword").focus();
       return false;
    }

    function changePasswordSuccess() {
        alert("Password updated!");
    }

    var changePasswordUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken;
    var changePasswordRequest = createJsonRequest("user.setpasswd", ["root", $("#newPassword").val()]);
    createAjaxRequest(changePasswordUrl, changePasswordRequest, changePasswordSuccess);

    return true;
}
