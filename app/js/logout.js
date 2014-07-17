$(document).ready(function() {
  $("#yes").click(function() {
    requestModule.submitRequest({
      url: '/cgi-bin/routerapi/logout',
      data: {},
      successCallback: function() {
        $("#logout").hide();
        $("#logged_out").show();
      }
    });
  });
  $("#no").click(function() {
    history.back();
  });
});
