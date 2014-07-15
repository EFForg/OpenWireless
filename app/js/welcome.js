$(function() {
  if (document.location.hostname == 'localhost') {
    document.getElementById("continue").href =
      'https://localhost:8443';
  }
});
