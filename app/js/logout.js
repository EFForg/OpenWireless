$(document).ready(function() {
  requestModule.submitRequest({
    url: '/cgi-bin/routerapi/logout',
    data: {},
    successCallback: function() {
      $("#logging_out").hide();
      $("#logged_out").show();
    }
  });
});
