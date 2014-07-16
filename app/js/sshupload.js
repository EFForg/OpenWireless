$(document).on('click', '.edit-ssh', function() {
    $('#SSH').hide();
    $('#enterSshKey').show();
});

$(document).on('click', '#cancel-SSH', function(){
    $('#SSH').show();
    $('#enterSshKey').hide();
});

$(document).on('click', '#submit-SSH', function(){
    requestModule.submitRequest({
        url: '/cgi-bin/routerapi/ssh_key',
        successCallback: function(data, textStatus, jqXHR) {
          location.reload();
        },
        data: {
          method: 'set_ssh_key',
          params: [$('#input-SSH').val()]
        }
    });
});
