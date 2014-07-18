$(document).on('click', '#reset-usage' , function(){
    
    var successCallback = function(){};
    var errorCallback = function(){};

    var resetRequest = {
                        url: "/cgi-bin/routerapi/reset_usage",
                        data: {},
                        successCallback: successCallback,
                        errorCallback: errorCallback
                        };

    requestModule.submitRequest(resetRequest);
});
