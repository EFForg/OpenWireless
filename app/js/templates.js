(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dashboard'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return " \n            <div class=\"ping\">"
    + escapeExpression(((helper = helpers.pingSpeed || (depth0 && depth0.pingSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"pingSpeed","hash":{},"data":data}) : helper)))
    + "<small> "
    + escapeExpression(((helper = helpers.pingSpeedMetric || (depth0 && depth0.pingSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"pingSpeedMetric","hash":{},"data":data}) : helper)))
    + " ping</small></div>\n          ";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            <div class=\"devices\">"
    + escapeExpression(((helper = helpers.devices || (depth0 && depth0.devices)),(typeof helper === functionType ? helper.call(depth0, {"name":"devices","hash":{},"data":data}) : helper)))
    + "<small> devices</small></div>\n          ";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            <div class=\"bandwidth\">"
    + escapeExpression(((helper = helpers.maxBandwidthPercent || (depth0 && depth0.maxBandwidthPercent)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxBandwidthPercent","hash":{},"data":data}) : helper)))
    + "%<small> max <br> bandwidth </small></div>\n          ";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n          <div class=\"bandwidth\">"
    + escapeExpression(((helper = helpers.monthlyBandwidthUsage || (depth0 && depth0.monthlyBandwidthUsage)),(typeof helper === functionType ? helper.call(depth0, {"name":"monthlyBandwidthUsage","hash":{},"data":data}) : helper)))
    + " <small>used of</small> "
    + escapeExpression(((helper = helpers.maxMonthlyBandwidth || (depth0 && depth0.maxMonthlyBandwidth)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxMonthlyBandwidth","hash":{},"data":data}) : helper)))
    + "<small> "
    + escapeExpression(((helper = helpers.maxMonthlyBandwidthMetric || (depth0 && depth0.maxMonthlyBandwidthMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"maxMonthlyBandwidthMetric","hash":{},"data":data}) : helper)))
    + " max <br> per month </small></div>\n          ";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <div class=\"status\"><span class=\""
    + escapeExpression(((helper = helpers.connectivity || (depth0 && depth0.connectivity)),(typeof helper === functionType ? helper.call(depth0, {"name":"connectivity","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = helpers.connectivity || (depth0 && depth0.connectivity)),(typeof helper === functionType ? helper.call(depth0, {"name":"connectivity","hash":{},"data":data}) : helper)))
    + "</span></div>\n        ";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <div class=\"status toggle\" id=\""
    + escapeExpression(((helper = helpers.stateId || (depth0 && depth0.stateId)),(typeof helper === functionType ? helper.call(depth0, {"name":"stateId","hash":{},"data":data}) : helper)))
    + "\"><span class=\""
    + escapeExpression(((helper = helpers.state || (depth0 && depth0.state)),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + " on-button\">On</span> | <span class=\""
    + escapeExpression(((helper = helpers.state || (depth0 && depth0.state)),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + " off-button\">Off</span></div>\n        ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "      <div class=\"network on\">\n        <header>\n          <img src=\""
    + escapeExpression(((helper = helpers.imageSource || (depth0 && depth0.imageSource)),(typeof helper === functionType ? helper.call(depth0, {"name":"imageSource","hash":{},"data":data}) : helper)))
    + "\" alt=\"router-on\" class=\"icon\" />\n          <div class=\"speed\">\n            <div class=\"upload\"><span class=\"upload-speed\">"
    + escapeExpression(((helper = helpers.uploadSpeed || (depth0 && depth0.uploadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"uploadSpeed","hash":{},"data":data}) : helper)))
    + "</span><span> "
    + escapeExpression(((helper = helpers.uploadSpeedMetric || (depth0 && depth0.uploadSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"uploadSpeedMetric","hash":{},"data":data}) : helper)))
    + "</span></div>\n            <div class=\"download\"><span class=\"download-speed\">"
    + escapeExpression(((helper = helpers.downloadSpeed || (depth0 && depth0.downloadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"downloadSpeed","hash":{},"data":data}) : helper)))
    + "</span><span> "
    + escapeExpression(((helper = helpers.downloadSpeedMetric || (depth0 && depth0.downloadSpeedMetric)),(typeof helper === functionType ? helper.call(depth0, {"name":"downloadSpeedMetric","hash":{},"data":data}) : helper)))
    + "</span></div>\n          </div>\n        </header>\n        <div class=\"title\">\n          <h2>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.pingSpeed), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.devices), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.maxBandwidthPercent), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.maxMonthlyBandwidth), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        </div>\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.connectivity), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n\n      </div>\n";
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
templates['settings'] = template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "        <br>\n        <br>\n        <h4>Router</h4>\n        <p><a href=\"./changePassword.html\">Change Router Credentials - admin password &gt;</a></p>\n        <p>Software Version: "
    + escapeExpression(((helper = helpers.softwareVersion || (depth0 && depth0.softwareVersion)),(typeof helper === functionType ? helper.call(depth0, {"name":"softwareVersion","hash":{},"data":data}) : helper)))
    + "</p>\n        <p>Date of version update: "
    + escapeExpression(((helper = helpers.softwareVersionUpdateDate || (depth0 && depth0.softwareVersionUpdateDate)),(typeof helper === functionType ? helper.call(depth0, {"name":"softwareVersionUpdateDate","hash":{},"data":data}) : helper)))
    + "</p>\n        <p>Date last checked for update: "
    + escapeExpression(((helper = helpers.lastCheckedDate || (depth0 && depth0.lastCheckedDate)),(typeof helper === functionType ? helper.call(depth0, {"name":"lastCheckedDate","hash":{},"data":data}) : helper)))
    + "</p>\n        <p><a href=\"#\">Check for update &gt;</a></p>\n        <br>\n        <br>\n\n        <h4>ISP Speeds</h4>\n        <p>*This helps us optimize your router.</p>\n        <p>ISP Download Speed: <span id=\"ispDownloadSpeed\" class=\"editable\">"
    + escapeExpression(((helper = helpers.ispDownloadSpeed || (depth0 && depth0.ispDownloadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"ispDownloadSpeed","hash":{},"data":data}) : helper)))
    + "</span> mb/s</p>\n        <p>ISP Upload Speed: <span id=\"ispUploadSpeed\" class=\"editable\">"
    + escapeExpression(((helper = helpers.ispUploadSpeed || (depth0 && depth0.ispUploadSpeed)),(typeof helper === functionType ? helper.call(depth0, {"name":"ispUploadSpeed","hash":{},"data":data}) : helper)))
    + "</span> mb/s</p>\n        <br>\n        <br>\n\n        <h4>Private Wifi</h4>\n        <p><a href=\"./changeSSID.html\">Set network SSID &gt;</a></p>\n        <p><a href=\"./changeNetworkPassword.html\">Set network password &gt;</a></p>\n        <br>\n        <h4>Choose band</h4>\n        <p><span class=\"selector\"><select id=\"routerBand\">RouterBand</select></span> ghz</p>\n        <p>Channel <span class=\"selector\"><select id=\"routerChannel\">RouterChannel</select></span> ghz</p>\n        <p>Channel bandwidth <span class=\"selector\"><select id=\"routerChannelBandwidth\">RouterChannelBandwidth</select></span> ghz</p>\n        <br>\n        <br>\n\n        <h3>VPN/TOR Configuration</h3>\n        <p><span class=\"selector\"><select id=\"routerVpnConfiguration\">RouterVpnConfiguration</select></span></p>\n        <br>\n        <br>\n\n\n        <h4>Open Wireless</h4>\n        <p>Real min time bandwidth <span class=\"editable\" id=\"openwirelessBandwidth\">"
    + escapeExpression(((helper = helpers.openwirelessBandwidth || (depth0 && depth0.openwirelessBandwidth)),(typeof helper === functionType ? helper.call(depth0, {"name":"openwirelessBandwidth","hash":{},"data":data}) : helper)))
    + "</span>%</p>\n        <p>*I'm willing to tolerate up to 15% degradation in internet speeds so that I can contribute to openwireless</p>\n        <br>\n        <p>Maximum total data/month <span class=\"editable\" id=\"openwirelessData\">"
    + escapeExpression(((helper = helpers.openwirelessData || (depth0 && depth0.openwirelessData)),(typeof helper === functionType ? helper.call(depth0, {"name":"openwirelessData","hash":{},"data":data}) : helper)))
    + "</span> ghz</p>\n        <p><a href=\"#\">Reset total data used this month &gt;</a></p>\n        <p>Change data auto-reset date [Datepicker]</p>\n        <br>\n        <h4>Choose band</h4>\n        <p><span class=\"selector\"><select id=\"openwirelessBand\">OpenwirelessBand</select></span> ghz</p>\n        <p>Channel <span class=\"selector\"><select id=\"openwirelessChannel\">OpenwirelessChannel</select></span> ghz</p>\n        <p>Channel bandwidth <span class=\"selector\"><select id=\"openwirelessChannelBandwidth\">OpenwirelessChannelBandwidth</select></span> ghz</p>\n        <br>\n        <h4>Encryption</h4>\n        <p><span class=\"selector\"><select id=\"openwirelessEncryption\">OpenwirelessEncryption</select></span></p>\n        <br>\n\n        <h4>Transfer Protocol</h4>\n        <p><span class=\"selector\"><select id=\"transferProtocol\">TransferProtocol</select></span></p>\n        <br>\n\n        <h4>VPN/TOR Configuration</h4>\n        <p><span class=\"selector\"><select id=\"openwirelessVpnConfiguration\">OpenwirelessVpnConfiguration</select></span></p>\n        <br>\n        <br>\n\n        <h4>IP Info</h4>\n        <p>WAN IP: "
    + escapeExpression(((helper = helpers.wanIp || (depth0 && depth0.wanIp)),(typeof helper === functionType ? helper.call(depth0, {"name":"wanIp","hash":{},"data":data}) : helper)))
    + "</p>\n        <p>LAN IP: "
    + escapeExpression(((helper = helpers.lanIp || (depth0 && depth0.lanIp)),(typeof helper === functionType ? helper.call(depth0, {"name":"lanIp","hash":{},"data":data}) : helper)))
    + "</p>\n        <br>\n        <br>\n\n        <h4>SSH Keys</h4>\n        <p id=\"SSH\">Upload your ssh keys for command line access</p>\n        <br>\n        <br>\n";
},"useData":true});
})();