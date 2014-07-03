$(document).on("click", "#SSH", function() {
    $('#SSH').replaceWith("<input type='text' id='input-SSH'> <button id='submit-SSH'>Submit</button>");
});

$(document).on("click", "#submit-SSH", function(){
    requestModule.submitRequest({
        "url": "/cgi-bin/routerapi/update_setting",
        "successCallback": function(){},
        "errorCallback": errorCallback,
        "data": {"ssh_key" : $('#input-SSH').val()}
    });
});
