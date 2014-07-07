/**
 * Detect whether the user is logged in, and which setup stage they are in, and
 * redirect appropriately.
 *
 * Logged out, setup stage == set-password -> welcome.html
 * Logged out, setup stage == complete -> login.html
 * Logged out, setup stage == * -> login.html?redirect_after_login=...
 * Logged in, setup stage == set-password -> setSSID.html
 * Logged in, setup stage == complete -> dashboard.html
 * Logged in, setup stage == * -> ...
 */
function redirectAsAppropriate() {
  var loggedIn = document.cookie.match(/csrf_token=/);
  var state = requestModule.submitRequest({
    url: '/cgi-bin/routerapi/setup_state',
    data: JSON.stringify({
      'jsonrpc': '2.0',
      'method': 'system.setup_state',
      'params': [],
      'id': 1
    }),
    successCallback: function(response) {
      if (response != null) {
        var state = response.state;
        helperModule.redirectTo(redirectTarget(loggedIn, state));
      }
    }
  });
}

function redirectTarget(loggedIn, state) {
  if (!loggedIn) {
    if (state === 'set-password') {
      return 'welcome.html';
    } else if (state === 'complete') {
      return 'login.html';
    } else {
      return 'login.html?redirect_after_login=' + loggedInRedirectTarget(state);
    }
  } else {
    return loggedInRedirectTarget(state);
  }
}

function loggedInRedirectTarget(state) {
  if (state === 'set-password') {
    console.log('Shouldn\'t happen: logged in, but in state "set-password".');
    // Treat it as state setup-private-net.
    return 'setSSID.html';
  } else if (state === 'complete') {
    return 'dashboard.html';
  } else if (state === 'setup-private-net') {
    return 'setSSID.html';
  } else if (state === 'setup-public-net') {
    return 'unimplemented';
  }
}

$(function() {
  redirectAsAppropriate();
});
