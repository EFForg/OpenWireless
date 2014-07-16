(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dashboard'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return " ("
    + escapeExpression(((helper = helpers.ssid || (depth0 && depth0.ssid)),(typeof helper === functionType ? helper.call(depth0, {"name":"ssid","hash":{},"data":data}) : helper)))
    + ")";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return " \n            <div class=\"ping\">"
    + escapeExpression(((helper = helpers.pingSpeed || (depth0 && depth0.pingSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"pingSpeed","hash":{},"data":data}) : helper)))
    + "<small> "
    + escapeExpression(((helper = helpers.pingSpeedMetric || (depth0 && depth0.pingSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"pingSpeedMetric","hash":{},"data":data}) : helper)))
    + " ping to eff.org</small></div>\n          ";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            <div class=\"devices\"><span class=\"device-count\">"
    + escapeExpression(((helper = helpers.devices || (depth0 && depth0.devices)),(typeof helper === functionType ? helper.call(depth0, {"name":"devices","hash":{},"data":data}) : helper)))
    + "</span><small> devices</small></div>\n          ";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            <div class=\"bandwidth\">"
    + escapeExpression(((helper = helpers.maxBandwidthPercent || (depth0 && depth0.maxBandwidthPercent)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxBandwidthPercent","hash":{},"data":data}) : helper)))
    + "%<small> max <br> bandwidth </small></div>\n          ";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n          <div class=\"bandwidth\"><span id=\"monthlyBandwidth\">"
    + escapeExpression(((helper = helpers.monthlyBandwidthUsage || (depth0 && depth0.monthlyBandwidthUsage)),(typeof helper === functionType ? helper.call(depth0, {"name":"monthlyBandwidthUsage","hash":{},"data":data}) : helper)))
    + "</span> <small>used of</small> "
    + escapeExpression(((helper = helpers.maxMonthlyBandwidth || (depth0 && depth0.maxMonthlyBandwidth)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxMonthlyBandwidth","hash":{},"data":data}) : helper)))
    + "<small> "
    + escapeExpression(((helper = helpers.maxMonthlyBandwidthMetric || (depth0 && depth0.maxMonthlyBandwidthMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxMonthlyBandwidthMetric","hash":{},"data":data}) : helper)))
    + " max <br> per month </small></div>\n          ";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <div class=\"status\"><span class=\""
    + escapeExpression(((helper = helpers.connectivity || (depth0 && depth0.connectivity)),(typeof helper === functionType ? helper.call(depth0, {"name":"connectivity","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = helpers.connectivity || (depth0 && depth0.connectivity)),(typeof helper === functionType ? helper.call(depth0, {"name":"connectivity","hash":{},"data":data}) : helper)))
    + "</span></div>\n        ";
},"13":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <div class=\"status toggle\" id=\""
    + escapeExpression(((helper = helpers.stateId || (depth0 && depth0.stateId)),(typeof helper === functionType ? helper.call(depth0, {"name":"stateId","hash":{},"data":data}) : helper)))
    + "\"><span class=\"on-button "
    + escapeExpression(((helper = helpers.state || (depth0 && depth0.state)),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + "\">On</span> | <span class=\"off-button "
    + escapeExpression(((helper = helpers.state || (depth0 && depth0.state)),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + "\">Off</span></div>\n        ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "      <div class=\"network on\">\n        <header>\n          <img src=\""
    + escapeExpression(((helper = helpers.imageSource || (depth0 && depth0.imageSource)),(typeof helper === functionType ? helper.call(depth0, {"name":"imageSource","hash":{},"data":data}) : helper)))
    + "\" alt=\"router-on\" class=\"icon\" />\n          <div class=\"speed\">\n            <div class=\"upload\">&#8593;<span class=\"upload-speed\">"
    + escapeExpression(((helper = helpers.uploadSpeed || (depth0 && depth0.uploadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"uploadSpeed","hash":{},"data":data}) : helper)))
    + "</span><span> "
    + escapeExpression(((helper = helpers.uploadSpeedMetric || (depth0 && depth0.uploadSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"uploadSpeedMetric","hash":{},"data":data}) : helper)))
    + "</span></div>\n            <div class=\"download\">&#8595;<span class=\"download-speed\">"
    + escapeExpression(((helper = helpers.downloadSpeed || (depth0 && depth0.downloadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"downloadSpeed","hash":{},"data":data}) : helper)))
    + "</span><span> "
    + escapeExpression(((helper = helpers.downloadSpeedMetric || (depth0 && depth0.downloadSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"downloadSpeedMetric","hash":{},"data":data}) : helper)))
    + "</span></div>\n          </div>\n        </header>\n        <div class=\"title\">\n          <h2>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)));
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.ssid), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.pingSpeed), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.devices), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.maxBandwidthPercent), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.maxMonthlyBandwidth), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        </div>\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.connectivity), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n\n      </div>\n";
},"useData":true});
templates['setSSID'] = template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "<h1>Restarting</h1>\n<p>SSID updated. Your router is now restarting.<p>\n<p>Please connect to your new network <b>"
    + escapeExpression(((helper = helpers.ssid || (depth0 && depth0.ssid)),(typeof helper === functionType ? helper.call(depth0, {"name":"ssid","hash":{},"data":data}) : helper)))
    + "</b> when it becomes available.</p>\n<a href='dashboard.html'>View Router Dashboard</a>\n";
},"useData":true});
templates['settings-dropdown'] = template({"1":function(depth0,helpers,partials,data) {
  var functionType="function", escapeExpression=this.escapeExpression;
  return "\n          <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n        ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});
templates['settings'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "\n              ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.exists), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(7, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n              <div id=\"enterSshKey\">\n                Paste an SSH public key. Hint: ~/.ssh/id_rsa.pub.<br/>\n                You can change this until your first successful SSH login,\n                after which it will be locked to prevent tampering. Further\n                updates can be made via SSH login.\n                <textarea id='input-SSH'>"
    + escapeExpression(((helper = helpers.contents || (depth0 && depth0.contents)),(typeof helper === functionType ? helper.call(depth0, {"name":"contents","hash":{},"data":data}) : helper)))
    + "</textarea><br>\n                <button id='submit-SSH'>Submit</button>\n                <button id='cancel-SSH'>Cancel</button>\n              </div>\n            ";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "\n              SSH enabled\n              <span class='setting'>\n                Key '<span id=keyComment>"
    + escapeExpression(((helper = helpers.comment || (depth0 && depth0.comment)),(typeof helper === functionType ? helper.call(depth0, {"name":"comment","hash":{},"data":data}) : helper)))
    + "</span>'\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.locked), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(5, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n              </span>\n              ";
},"3":function(depth0,helpers,partials,data) {
  return "\n                <span title=\"You've successfully logged in with this key once.\n                  You can only edit it via SSH or failsafing your router.\">\n                  ( locked )</span>\n                ";
  },"5":function(depth0,helpers,partials,data) {
  return "\n                <a class=\"links edit-ssh\">Edit</a>\n                ";
  },"7":function(depth0,helpers,partials,data) {
  return "\n              SSH not enabled <a class=\"setting links edit-ssh\">Enable</a>\n              ";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression, buffer = "        <h2>Administration\n          <span class=\"subheading\">\n            <a href=\"./changePassword.html\" class=\"links\">Change admin password</a>\n          </span>\n        </h2>\n        <div class=\"section\">\n          <p id=\"SSH\">\n            ";
  stack1 = ((helper = helpers.sshKey || (depth0 && depth0.sshKey)),(options={"name":"sshKey","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.sshKey) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n          </p>\n          <p>Software Version <span class=\"subheading\"> "
    + escapeExpression(((helper = helpers.softwareVersion || (depth0 && depth0.softwareVersion)),(typeof helper === functionType ? helper.call(depth0, {"name":"softwareVersion","hash":{},"data":data}) : helper)))
    + "</span></p>\n          <p>Software Version date <span class=\"subheading\"> "
    + escapeExpression(((helper = helpers.softwareVersionUpdateDate || (depth0 && depth0.softwareVersionUpdateDate)),(typeof helper === functionType ? helper.call(depth0, {"name":"softwareVersionUpdateDate","hash":{},"data":data}) : helper)))
    + "</span></p>\n        </div>\n\n        <h2>ISP Speeds\n          <span class=\"subheading\">Set these to help optimize your router</span>\n        </h2>\n        <div class=\"section\">\n          <p>ISP Download Speed <span class=\"setting\" ><span id=\"ispDownloadSpeed\" class=\"editable\">"
    + escapeExpression(((helper = helpers.ispDownloadSpeed || (depth0 && depth0.ispDownloadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"ispDownloadSpeed","hash":{},"data":data}) : helper)))
    + "</span> Mb/s </span></p>\n          <p>ISP Upload Speed <span class=\"setting\" ><span id=\"ispUploadSpeed\" class=\"editable\">"
    + escapeExpression(((helper = helpers.ispUploadSpeed || (depth0 && depth0.ispUploadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"ispUploadSpeed","hash":{},"data":data}) : helper)))
    + "</span> Mb/s </span></p>\n        </div>\n\n        <h2>Private WiFi\n          <span class=\"subheading\">\n            <label for=routerSsid>SSID</label>\n            <span>"
    + escapeExpression(((helper = helpers.routerSsid || (depth0 && depth0.routerSsid)),(typeof helper === functionType ? helper.call(depth0, {"name":"routerSsid","hash":{},"data":data}) : helper)))
    + "</span> &nbsp &nbsp\n            <a href=\"./setSSID.html\" class=\"links\">Edit</a>\n          </span>\n        </h2>\n\n        <div class=\"section\">\n          <p>\n            <label for=\"routerBand\">Frequency Band</label>\n            <span class=\"selector\">\n              <select class=\"setting\" id=\"routerBand\">RouterBand</select>\n            </span>\n          </p>\n          <p>\n            <label for=\"routerChannel\">Channel</label>\n            <select class=\"setting\" id=\"routerChannel\">RouterChannel</select>\n          </p>\n          <p>\n            <label for=\"routerChannelBandwidth\">Channel bandwidth</label>\n            <select class=\"setting\" id=\"routerChannelBandwidth\">RouterChannelBandwidth</select>\n          </p>\n          <p>\n            <label for=\"routerVpnConfiguration\">VPN/TOR Configuration</label>\n            <select class=\"setting\" id=\"routerVpnConfiguration\">RouterVpnConfiguration</select>\n          </p>\n        </div>\n\n        <h2>Open Wireless</h2>\n        <div class=\"section\">\n          <p>\n            <label for=openwirelessBandwidth>Max bandwidth fraction</label>\n            <span class=\"setting\"><span class=\"editable\" id=\"openwirelessBandwidth\">"
    + escapeExpression(((helper = helpers.openwirelessBandwidth || (depth0 && depth0.openwirelessBandwidth)),(typeof helper === functionType ? helper.call(depth0, {"name":"openwirelessBandwidth","hash":{},"data":data}) : helper)))
    + "</span>%\n              </span></p>\n          <p>\n            <label for=\"openwirelessData\">Max total data per month</label>\n            <span class=\"setting\"><span class=\"editable\" id=\"openwirelessData\">"
    + escapeExpression(((helper = helpers.openwirelessData || (depth0 && depth0.openwirelessData)),(typeof helper === functionType ? helper.call(depth0, {"name":"openwirelessData","hash":{},"data":data}) : helper)))
    + "</span> MB\n          </span></p>\n          <p>Usage counter auto-reset day<span class=\"subheading\"><a href=\"#\" class=\"links\">Reset usage counter</a></span></p>\n	      <br>\n          <p>\n            <label for=\"openwirelessBand\">Frequency Band</label>\n            <select class=\"setting\" id=\"openwirelessBand\">OpenwirelessBand</select>\n          </p>\n          <p>\n            <label for=\"openwirelessChannel\">Channel</label>\n            <select class=\"setting\" id=\"openwirelessChannel\">OpenwirelessChannel</select>\n          </p>\n          <p>\n            <label for=\"openwirelessChannelBandwidth\">Channel bandwidth</label>\n            <select class=\"setting\" id=\"openwirelessChannelBandwidth\">OpenwirelessChannelBandwidth</select>\n          </p>\n          <p>\n            <label for=\"openwirelessVpnConfiguration\">VPN/TOR Configuration</label>\n            <select class=\"setting\" id=\"openwirelessVpnConfiguration\">OpenwirelessVpnConfiguration</select>\n          </p>\n          <p>\n            <label for=\"openwirelessEncryption\">WiFi security</label>\n            <select class=\"setting\" id=\"openwirelessEncryption\">OpenwirelessEncryption</select>\n          </p>\n        </div>\n";
},"useData":true});
})();