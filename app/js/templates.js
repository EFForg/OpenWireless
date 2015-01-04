(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dashboard'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " <small>(";
  if (helper = helpers.ssid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ssid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</small>";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"ping\">";
  if (helper = helpers.pingSpeed) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pingSpeed); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            <small> ";
  if (helper = helpers.pingSpeedMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pingSpeedMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ping to eff.org\n            </small>\n            </div>\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"devices\"><span class=\"device-count\">";
  if (helper = helpers.devices) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.devices); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                <small> devices</small>\n            </div>\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"bandwidth\">";
  if (helper = helpers.maxBandwidthPercent) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.maxBandwidthPercent); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "%\n                <small> max <br> bandwidth</small>\n            </div>\n        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"data-use\"><span id=\"monthlyBandwidth\">";
  if (helper = helpers.monthlyBandwidthUsage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.monthlyBandwidthUsage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                <small> of </small>\n                ";
  if (helper = helpers.maxMonthlyBandwidth) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.maxMonthlyBandwidth); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                <br>\n                <small> ";
  if (helper = helpers.maxMonthlyBandwidthMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.maxMonthlyBandwidthMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " max\n                </small>\n            </div>\n        ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"status\"><span class=\"";
  if (helper = helpers.connectivity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.connectivity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.connectivity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.connectivity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n    ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"status toggle\" id=\"";
  if (helper = helpers.stateId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stateId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><span class=\"on-button ";
  if (helper = helpers.state) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.state); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">On</span> | <span\n                class=\"off-button ";
  if (helper = helpers.state) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.state); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Off</span></div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"network on\">\n    <header>\n        <img src=\"";
  if (helper = helpers.imageSource) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imageSource); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"router-on\" class=\"icon\"/>\n\n        <div class=\"speed\">\n            <div class=\"upload\">&#8673; <span class=\"upload-speed\">";
  if (helper = helpers.uploadSpeed) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uploadSpeed); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span> ";
  if (helper = helpers.uploadSpeedMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uploadSpeedMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n            <div class=\"download\">&#8675; <span class=\"download-speed\">";
  if (helper = helpers.downloadSpeed) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.downloadSpeed); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span> ";
  if (helper = helpers.downloadSpeedMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.downloadSpeedMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n        </div>\n    </header>\n    <div class=\"title\">\n        <h2>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.ssid), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.pingSpeed), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.devices), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.maxBandwidthPercent), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.activateDataCap), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.connectivity), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['lastLogin'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<p>Last Login From: <span>";
  if (helper = helpers.address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> on <span>";
  stack1 = (helper = helpers.datetime || (depth0 && depth0.datetime),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.timestamp), options) : helperMissing.call(depth0, "datetime", (depth0 && depth0.timestamp), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span></p>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['lastUpdate'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "is available";
  }

function program3(depth0,data) {
  
  
  return "not available";
  }

  buffer += "<div id=\"check-for-updates\">\n  <div class=\"message\">\n    <p>Update ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.updateAvailable), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " : last checked <span id=\"date\">";
  stack1 = (helper = helpers.datetime || (depth0 && depth0.datetime),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.lastCheckDate), options) : helperMissing.call(depth0, "datetime", (depth0 && depth0.lastCheckDate), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span></p>\n    <img id=\"checkForUpdate\" src=\"images/update.png\" alt=\"update\"/>\n  </div>\n\n  <div class=\"loading-message\"><p>Loading...</p></div>\n</div>\n";
  return buffer;
  });
templates['setSSID'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1>Restarting</h1>\n<p>SSID updated. Your router is now restarting.<p>\n<p>Please connect to your new network <b>";
  if (helper = helpers.ssid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ssid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b> when it becomes available.</p>\n<a class=button href='dashboard.html'>Dashboard</a>\n";
  return buffer;
  });
templates['settings-dropdown'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n          <option>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n        ";
  return buffer;
  }

  buffer += "        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['settings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n              ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.exists), {hash:{},inverse:self.program(7, program7, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              <div id=\"enterSshKey\">\n                Paste an SSH public key. Hint: ~/.ssh/id_rsa.pub.<br/>\n                You can change this until your first successful SSH login,\n                after which it will be locked to prevent tampering. Further\n                updates can be made via SSH login.\n                <textarea id='input-SSH'>";
  if (helper = helpers.contents) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contents); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea><br>\n                <div class=\"controls\">\n                  <button id='submit-SSH'>Submit</button>\n                  <button id='cancel-SSH'>Cancel</button>\n                </div>\n              </div>\n            ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n              SSH enabled\n              <span class='setting'>\n                Key '<span id=keyComment>";
  if (helper = helpers.comment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.comment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>'\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.locked), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              </span>\n              ";
  return buffer;
  }
function program3(depth0,data) {
  
  
  return "\n                <span title=\"You've successfully logged in with this key once.\n                  You can only edit it via SSH or failsafing your router.\">\n                  ( locked )</span>\n                ";
  }

function program5(depth0,data) {
  
  
  return "\n                <a class=\"links edit-ssh\">Edit</a>\n                ";
  }

function program7(depth0,data) {
  
  
  return "\n              SSH not enabled <a class=\"setting links edit-ssh\">Enable</a>\n              ";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n             <div id=\"DataCap\">\n               <p>\n		            <label for=\"openwirelessData\">Max total data per month</label>\n            	    <span class=\"setting\"><span class=\"editable\" id=\"openwirelessData\">";
  if (helper = helpers.openwirelessData) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.openwirelessData); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> MB </span>\n	             </p>\n               <p>\n		              <span id=\"usage\">Usage counter reset </span><span class=\"subheading\"><a id=\"reset-usage\" href=\"#\" class=\"links\">Reset usage counter</a></span>\n               </p>\n             </div>\n          ";
  return buffer;
  }

  buffer += "        <h2>Administration\n          <span class=\"subheading\">\n            <a href=\"./changePassword.html\" class=\"links\">Change admin password</a>\n          </span>\n        </h2>\n        <div class=\"section\">\n          <p id=\"SSH\">\n            ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.sshKey) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.sshKey); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.sshKey) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </p>\n          <p>Software Version <span class=\"setting\"> ";
  if (helper = helpers.softwareVersion) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.softwareVersion); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></p>\n          <p>Software Version date <span class=\"setting\"> ";
  stack1 = (helper = helpers.datetime || (depth0 && depth0.datetime),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.softwareVersionUpdateDate), options) : helperMissing.call(depth0, "datetime", (depth0 && depth0.softwareVersionUpdateDate), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span></p>\n        </div>\n\n        <h2>ISP Speeds\n          <span class=\"subheading\">Set these to help optimize your router</span>\n        </h2>\n        <div class=\"section\">\n          <p>ISP Download Speed <span class=\"setting\" ><span id=\"ispDownloadSpeed\" class=\"editable\">";
  if (helper = helpers.ispDownloadSpeed) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ispDownloadSpeed); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> Mb/s </span></p>\n          <p>ISP Upload Speed <span class=\"setting\" ><span id=\"ispUploadSpeed\" class=\"editable\">";
  if (helper = helpers.ispUploadSpeed) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ispUploadSpeed); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> Mb/s </span></p>\n        </div>\n\n        <h2>Private WiFi\n          <span class=\"subheading\">\n            <label for=routerSsid>SSID</label>\n            <span>";
  if (helper = helpers.routerSsid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.routerSsid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> &nbsp &nbsp\n            <a href=\"./setSSID.html\" class=\"links\">Edit</a>\n          </span>\n        </h2>\n\n        <div class=\"section\">\n          <p>\n            <label for=\"routerBand\">Frequency Band</label>\n              <select class=\"setting\" id=\"routerBand\">RouterBand</select>\n          </p>\n          <p>\n            <label for=\"routerChannel\">Channel</label>\n	            <select class=\"setting\" id=\"routerChannel\">RouterChannel</select>\n          </p>\n          <p>\n            <label for=\"routerChannelBandwidth\">Channel bandwidth</label>\n              <select class=\"setting\" id=\"routerChannelBandwidth\">RouterChannelBandwidth</select>\n	        </p>\n          <p>\n            <label for=\"routerVpnConfiguration\">VPN/TOR Configuration</label>\n              <select class=\"setting\" id=\"routerVpnConfiguration\">RouterVpnConfiguration</select>\n	        </p>\n        </div>\n\n        <h2>Open Wireless</h2>\n        <div class=\"section\">\n          <p>\n            <label for=openwirelessBandwidth>Max bandwidth fraction</label>\n            <span class=\"setting\"><span class=\"editable\" id=\"openwirelessBandwidth\">";
  if (helper = helpers.openwirelessBandwidth) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.openwirelessBandwidth); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> % </span>\n          </p>\n          <p>\n            <label for=\"openwirelessActivateDataCap\">Activate Data Cap</label>\n            <select class=\"setting\" id=\"openwirelessActivateDataCap\">openwirelessActivateDataCap</select>\n          </p>\n\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.openwirelessActivateDataCap), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n	  <br>\n\n          <p>\n            <label for=\"openwirelessBand\">Frequency Band</label>\n	            <select class=\"setting\" id=\"openwirelessBand\">OpenwirelessBand</select>\n          </p>\n          <p>\n            <label for=\"openwirelessChannel\">Channel</label>\n            <select class=\"setting\" id=\"openwirelessChannel\">OpenwirelessChannel</select>\n          </p>\n          <p>\n            <label for=\"openwirelessChannelBandwidth\">Channel bandwidth</label>\n            <select class=\"setting\" id=\"openwirelessChannelBandwidth\">OpenwirelessChannelBandwidth</select>\n          </p>\n          <p>\n            <label for=\"openwirelessVpnConfiguration\">VPN/TOR Configuration</label>\n            <select class=\"setting\" id=\"openwirelessVpnConfiguration\">OpenwirelessVpnConfiguration</select>\n          </p>\n          <p>\n            <label for=\"openwirelessEncryption\">WiFi security</label>\n            <select class=\"setting\" id=\"openwirelessEncryption\">OpenwirelessEncryption</select>\n          </p>\n        </div>\n";
  return buffer;
  });
})();