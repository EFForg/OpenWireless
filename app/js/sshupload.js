$(document).on("click", "#SSH", function() {
    $('#SSH').hide();
    $('#enterSshKey').show();
});

$(document).on("click", "#submit-SSH", function(){
    requestModule.submitRequest({
        "url": "/cgi-bin/routerapi/update_setting",
        "successCallback": function(){},
        "errorCallback": errorCallback,
        "data": {"ssh_key" : $('#input-SSH').val()}
    });
});
