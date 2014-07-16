var ssidModule = (function() {
  var form;
  var ssid;
  var ssidPassphrase;
  var ssidError;
  var ssidPassphraseError;
  var genericError;
  var submit;

  var init = function() {
    initializeFields();
    initializeForm();
  };

  var initializeFields = function(){
    form = $('form');
    ssid = $('#ssid');
    ssidPassphrase = $('#ssidPassphrase');
    ssidError = $('#ssidError');
    ssidPassphraseError = $('#ssidPassphraseError');
    genericError = $('#genericError');
    submit = $('#submit');
    $(submit).prop('disabled', false);
 };

  var initializeForm = function(){
    form.submit(function(event){
      $("input[type=submit]").addClass("submitting");
      event.preventDefault();
      ssidError.hide();
      ssidPassphraseError.hide();
      genericError.hide();
      ssid.removeClass('error');
      ssidPassphrase.removeClass('error');

      if(helperModule.checkEmptyField(ssid, ssidError, "SSID")){
        return;
      }

      if(helperModule.checkEmptyField(ssidPassphrase, ssidPassphraseError, "passphrase")){
        return;
      }
        
      if ($(ssidPassphrase).val().length < 8) {
        $(ssidPassphraseError).text("Passphrase must be at least 8 characters.");
        $(ssidPassphraseError).show();
        return false;
      }

      setSSID();
    });
  };

  var setSSID = function() {
    $(submit).val("Submitting...");
    $(submit).prop('disabled', true);  

    requestModule.submitRequest({
      url: "/cgi-bin/routerapi/set_private_ssid",
      successCallback: setSSIDSuccess,
      data: {
        "jsonrpc": "2.0",
        "method": "set_private_ssid",
        "params": [ssid.val(), ssidPassphrase.val()],
        "id": 1
      }
    });
  };

  var setSSIDSuccess = function(response) {
    $("input[type=submit]").removeClass("submitting");
    var template = Handlebars.templates.setSSID;
    $('.formDiv').hide();
    $("#restarting").html(template({ssid: response.ssid}));
    $('#restarting').show();
  };

  return {
    init: init
  }
})();

$(document).ready(function() {
  ssidModule.init();
});
