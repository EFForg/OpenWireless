describe("Helper Functions", function() {

  describe("Is Empty", function(){
    it("should return false if there is a value", function(){
      expect(helperModule.isEmpty("value")).toBeFalsy();
    });

    it("should return true if the value is null", function(){
      expect(helperModule.isEmpty(null)).toBeTruthy();
    });

    it("should return true if the value is empty spaces", function(){
      expect(helperModule.isEmpty(" ")).toBeTruthy();
    });

    it("should return true if the value is empty string", function(){
      expect(helperModule.isEmpty("")).toBeTruthy();
    });
  });
});
