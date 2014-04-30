function checkPassword(str)
{
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
    return re.test(str);
}

function checkForm()
{
    if($("#newPassword").val() == " ") {
        alert("Please enter a password!");
        $("#newPassword").focus();
        return true;
    }

    if(!checkPassword($("#newPassword").val())) {
        alert("The password you have entered is not valid!");
        $("#newPassword").focus();
        return true;
    }

    if($("#retypePassword").val() == " ") {
        alert("Please re-enter your password");
        $("#retypePassword").focus();
        return true;
    }

    if($("#newPassword").val() != $("#retypePassword").val()) {
       alert("The passwords do not match!");
       $("#retypePassword").focus();
       return true;
    }

    function changePasswordSuccess() {
        window.location.href="setSSID.html";
    }

    var changePasswordUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken;
    var changePasswordRequest = createJsonRequest("user.setpasswd", ["root", $("#newPassword").val()]);
    createAjaxRequest(changePasswordUrl, changePasswordRequest, changePasswordSuccess);

    return false;
}
