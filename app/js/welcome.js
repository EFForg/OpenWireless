$(function() {
  if (document.location.port === '8888') {
    var el = document.getElementById("continue")
    if (el) {
      el.href = 'https://' + document.location.hostname + ':8443';
    }
  }
});
