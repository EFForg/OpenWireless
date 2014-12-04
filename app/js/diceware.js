/**
 * diceware.js - generate N distinct words from a dictionary of 7776 possibilities
 */

function Diceware() {
  this.wordlist = [];
  if (typeof Math.log2 === 'undefined') {
    Math.log2 = function(N) {
        return Math.log(N)/Math.log(2) 
    };
  }
}

Diceware.prototype.load = function(callback) {
  var that = this;
  $.get("/data/diceware.wordlist.asc", function(data) {
    var line = '';
    var split = data.split("\n");
    var l = split.length;
    for (var i = 0; i < l; i++) {
      line = split[i];
      if (line === '-----BEGIN PGP SIGNED MESSAGE-----' || line === '') {
          continue;
      }
      if (line === '-----BEGIN PGP SIGNATURE-----') {
          break;
      }
      var myregexp = /^\s*\d+\s*([^\s]+)\s*$/;
      var match = myregexp.exec(line);
      if (match != null) {
        // matched text: match[0]
        // match start: match.index
        // capturing group n: match[n]
        that.wordlist.push(match[1]);
      }
    }
    callback();
  });
}

/**
 * Return a number of diceware words
 * @param int words - the number of words to generate
 */
Diceware.prototype.getWords = function(words) {
  if (!window.crypto || !window.crypto.getRandomValues) {
    return [];
  }
  var diced = [];
  
  for (var i = 0; i < words; ++i) {
    diced.push(this.getSingleWord());
  }
  return diced;
};

// http://stackoverflow.com/questions/18230217/javascript-generate-a-random-number-within-a-range-using-crypto-getrandomvalues 

Diceware.prototype.random = function (min, max) {
    var rval = 0;
    var range = max - min;
    
    var bits_needed = Math.ceil(Math.log2(range));
    if (bits_needed > 53) {
      throw new Exception("We cannot generate numbers larger than 53 bits.");
    }
    var bytes_needed = Math.ceil(bits_needed / 8);
    var mask = Math.pow(2, bits_needed) - 1; 
    // 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111
    
    // Create byte array and fill with N random numbers
    var byteArray = new Uint8Array(bytes_needed);
    window.crypto.getRandomValues(byteArray);
    
    var p = (bytes_needed - 1) * 8;
    for(var i = 0; i < bytes_needed; i++ ) {
      rval += byteArray[i] * Math.pow(2, p);
      p -= 8;   
    }
    
    // Use & to apply the mask and reduce the number of recursive lookups
    rval = rval & mask;
    
    if (rval >= range) {
      // Integer out of acceptable range
      return this.random(min, max);
    }
    // Return an integer that falls within the range
    return min + rval;
}

Diceware.prototype.getSingleWord = function() {
  if (!window.crypto || !window.crypto.getRandomValues) {
    return null;
  }
  var index = this.random(0, this.wordlist.length);
  return this.wordlist[index];
};
