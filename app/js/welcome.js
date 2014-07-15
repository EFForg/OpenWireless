$(function() {
  if (document.location.hostname == 'localhost') {
    var el = document.getElementById("continue")
    if (el) {
      el.href = 'https://localhost:8443';
    }
  }
});
