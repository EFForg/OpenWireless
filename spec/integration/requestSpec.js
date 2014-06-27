describe("Request Module", function(){
  it("should submit request with proper URL", function() {
    spyOn($, "ajax");
    var loginData = {"jsonrpc": "2.0"};
    requestModule.submitRequest({'data':loginData, url:"http://192.168.1.1/cgi-bin/luci/rpc/auth", 'successCallback': {}, 'errorCallback': {}});
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/auth");
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(JSON.stringify(loginData));
  });
});
