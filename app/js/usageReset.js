$(document).on('click', '#reset-usage' , function(){
    
    var successCallback = function(){
        $("#usage").text("Usage successfully reset"); 
    };

    var errorCallback = function(){};

    var resetRequest = {
                        url: "/cgi-bin/routerapi/reset_usage",
                        data: {},
                        successCallback: successCallback,
                        errorCallback: errorCallback
                        };

    requestModule.submitRequest(resetRequest);
});
