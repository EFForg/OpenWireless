var authorizationToken = "";	
	
function getAuthToken() {

	var username = $('#username').val();
	var password = $('#password').val();

	var authRequest = {
		"jsonrpc": "2.0",
		"method": "login",
		"params": [username, password],
		"id": 1
	}

	var success = function (response){
		authorizationToken = response.result;
		$('#authToken').val(authorizationToken);
		$.ajax({
			type: "POST",
			url: "http://192.168.1.1/cgi-bin/luci/rpc/sauth",
			data: JSON.stringify({
				"jsonrpc": "2.0",
				"method": "sauth.write",
				"params": ["sid"]
			}),
			success: readData
		});
	};

	var readData = function (response) {
		$.ajax({
			type: "POST",
			url: "http://192.168.1.1/cgi-bin/luci/rpc/sauth",
			data: JSON.stringify({
				"jsonrpc": "2.0",
				"method": "read",
				"params": [authorizationToken]
			}),
			success: function (response){
						$('#authToken').val(response.result);
					}
		});
		return false;
	};

	var writeAuthToken = function(response) {
		authorizationToken = response.result;
		$('#authToken').val(response.result);
	};

	$.ajax({
		type: "POST",
		url: "http://192.168.1.1/cgi-bin/luci/rpc/auth",
		data: JSON.stringify(authRequest),
		success: writeAuthToken
	});

	return false;
};

function execJSON() {
	$('#result').val("");
	var library = $('#library').val();
	if(library != "") {
		library = "rpc/"+library
	}
	var method = $('#method').val();
	var params = $('#param').val().split(" ");
// var paramArray = [];
// paramArray.push(params);

	var request = {
		"jsonrpc": "2.0",
		"method": method,
		//"params": paramArray,
		"params": params,
		"id": 1
	}

	var url = "http://192.168.1.1/cgi-bin/luci/" + library + "?auth=" + authorizationToken;

	var showResult = function (response){
		$('#result').val(response.result);
	}

	$.ajax({
		type: "POST",
		url: url,
		data: JSON.stringify(request),
		success: showResult,
		contentType: "application/json",
		dataType: "json"
	});
	return false;
};

function setSSID() {
var ssid = $('#ssid').val();
var ssidArray = [];
ssidArray.push("wireless.@wifi-iface[0].ssid="+ssid);
var ssidRequest = {
    "jsonrpc": "2.0",
    "method": "set",
    "params": ssidArray,
    "id": 1
}

	var uciUrl = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth=" + authorizationToken;

	var commitSSIDResult = function (response){
		if(response.result) {  
  var commitRequest = {
    "jsonrpc": "2.0",
    "method": "commit",
    "params": ["wireless"],
    "id": 1
  }
    $.ajax({
	    type: "POST",
	    url: uciUrl,
	    data: JSON.stringify(commitRequest),
	    success: function(response) {
      		if(response.result) {
    			$('#newSSID').val("SSID updated");
    		} 
    	},
	    contentType: "application/json",
	    dataType: "json"
	});
  }
	}
	
$.ajax({
		type: "POST",
		url: uciUrl,
		data: JSON.stringify(ssidRequest),
		success: commitSSIDResult,
		contentType: "application/json",
		dataType: "json"
	});
	return false;
};

function logout() {
	var authRequest = {
        "jsonrpc": "2.0",
        "method": "kill",
        "params": [authorizationToken],
        "id": 1
    }

    var success = function (response){
        alert("Successfully logged out.");
    };

    $.ajax({
        type: "POST",
        url: "http://192.168.1.1/cgi-bin/luci/rpc/sauth?auth="+authorizationToken,
        data: JSON.stringify(authRequest),
        success: success
    });

    return false;
};