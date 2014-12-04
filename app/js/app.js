Handlebars.registerHelper('datetime', function(datetimeString, options) {
  return new Date(datetimeString).toLocaleString();
});
