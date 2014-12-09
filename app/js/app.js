Handlebars.registerHelper('datetime', function(datetimeString, options) {
  var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

  var d = new Date(datetimeString);
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  var curr_hour = d.getHours().pad(2);
  var curr_minutes = d.getMinutes().pad(2);

  return "" + curr_date + "-" + m_names[curr_month] + "-" + curr_year + "  " + curr_hour + ":" + curr_minutes;
});
