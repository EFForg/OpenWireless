function checkPassword(str)
{
    var re = /^([a-z]*)$/;
    return re.test(str);
}

function checkForm(form)
{
    if(form.password1.value == "") {
        alert("Please enter a password!");
        form.password1.focus();
        return false;
    }

    if(form.password1.value != "" && !checkPassword(form.password1.value)) {
        alert("The password you have entered is not valid!");
        form.password1.focus();
        return false;
    }

    if(form.password2.value == "") {
        alert("Please re-enter your password");
        form.password2.focus();
        return false;
    }

    if(form.password1.value != form.password2.value) {
       alert("The passwords do not match!");
       form.password1.focus();
       return false;
    }

    alert("Password updated!")
    return true;
}
