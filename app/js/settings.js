var authorizationToken = getSysauthFromCookie(document.cookie);

var submitRequest = function(data, successCallback, errorCallback){
  $.ajax({
    type: "POST",
    url: "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: successCallback,
    error: errorCallback
  });
};

var displaySettings = function(settings) {
  var source = $('#settings-template').html();
  var template = Handlebars.compile(source);
  $('#main').empty();
  $('#main').append(template(settings));
};

var initializeEditableFields = function(){
  $('.editable').editable(function(value, settings) { 
    config[$(this).attr('id')] =  value;
    return(value);
  }, { 
    type    : 'text',
    width   : '100',
    submit  : 'OK',
  });
};


//Todo: DRY this
function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

var config = {};


$(function() {
  $.getJSON("../js/settings-data.json", function(data){
    config = data;
    displaySettings(config);
    initializeEditableFields();
  });
});
