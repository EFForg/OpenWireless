function checkPassword(str)
{
    var re = /^([a-z]*)$/;
    return re.test(str);
}

function checkForm()
{
    if($("#password1").val() == "") {
        alert("Please enter a password!");
        $("#password1").focus();
        return false;
    }

    if($("#password1").val() != "" && !checkPassword($("#password1").val())) {
        alert("The password you have entered is not valid!");
        $("#password1").focus();
        return false;
    }

    if($("#password2").val() == "") {
        alert("Please re-enter your password");
        $("#password2").focus();
        return false;
    }

    if($("#password1").val() != $("#password2").val()) {
       alert("The passwords do not match!");
       $("#password2").focus();
       return false;
    }

    alert("Password updated!")
    return true;
}
