function checkPassword(str)
{
    var re = /^([a-z]*)$/;
    return re.test(str);
}

function checkForm()
{
    if($("#newPassword").val() == " ") {
        alert("Please enter a password!");
        $("#newPassword").focus();
        return false;
    }

    if($("#newPassword").val() != "" && !checkPassword($("#newPassword").val())) {
        alert("The password you have entered is not valid!");
        $("#newPassword").focus();
        return false;
    }

    if($("#retypePassword").val() == "") {
        alert("Please re-enter your password");
        $("#retypePassword").focus();
        return false;
    }

    if($("#newPassword").val() != $("#retypePassword").val()) {
       alert("The passwords do not match!");
       $("#retypePassword").focus();
       return false;
    }

    alert("Password updated!")
    return true;
}
