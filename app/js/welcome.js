$(function() {
  if (document.location.port !== "") {
    var el = document.getElementById("continue")
    if (el) {
      var httpsPort = parseInt(document.location.port) + 1;
      el.href = 'https://' + document.location.hostname + ':' + httpsPort;
    }
  }
});
