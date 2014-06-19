var securityModule = (function(){

  var getAuthToken = function(){
    return getSysauthFromCookie(document.cookie);
  };

  var getSysauthFromCookie = function(cookieString) {
    var sysauthPairs = cookieString.split(";");
    var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
    return lastCookieValue[1];
  };

  return {
    getAuthToken : getAuthToken
  }

})();


