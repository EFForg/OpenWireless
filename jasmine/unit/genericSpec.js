describe("Utility Functions", function() {

  describe("Is Empty", function(){
    it("should return false if there is a value", function(){
      expect(isEmpty("value")).toBeFalsy();
    });

    it("should return true if the value is null", function(){
      expect(isEmpty(null)).toBeTruthy();
    });

    it("should return true if the value is empty spaces", function(){
      expect(isEmpty(" ")).toBeTruthy();
    });

    it("should return true if the value is empty string", function(){
      expect(isEmpty("")).toBeTruthy();
    });
  });
});
