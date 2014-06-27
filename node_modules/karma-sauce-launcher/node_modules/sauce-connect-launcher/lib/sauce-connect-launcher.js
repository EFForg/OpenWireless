var
  fs = require("fs"),
  path = require("path"),
  _ = require("lodash"),
  async = require("async"),
  http = require("http"),
  AdmZip = require("adm-zip"),
  spawn = require("child_process").spawn,
  jarfile = path.normalize(__dirname + "/Sauce-Connect.jar"),
  zipfile = path.normalize(__dirname + "/Sauce-Connect-latest.zip"),
  readyfile = path.normalize(__dirname + "/readyfile"),
  exists = fs.existsSync || path.existsSync,
  openProcesses = [],
  logger = console.log,
  cleanup_registered = false;

function killProcesses() {
  _.each(openProcesses, function (proc) {
    proc.emit("exit");
    proc.kill("SIGTERM");
  });
  openProcesses = [];
}

// Make sure all processes have been closed
// when the script goes down
function closeOnProcessTermination() {
  if (cleanup_registered) {
    return;
  }
  cleanup_registered = true;
  process.on("exit", function () {
    logger("Shutting down");
    killProcesses();
  });
}


function download(options, callback) {
  var req = http.request({
      host: "saucelabs.com",
      port: 80,
      path: "/downloads/Sauce-Connect-latest.zip"
    });

  function removeZip() {
    try {
      logger("Removing Sauce-Connect-latest.zip");
      fs.unlinkSync(zipfile);
    } catch (e) {}
    _.defer(process.exit.bind(null, 0));
  }

  logger("Missing Sauce Connect local proxy, downloading dependency");
  logger("This will only happen once.");

  req.on("response", function (res) {
    var len = parseInt(res.headers["content-length"], 10),
      prettyLen = (len / (1024 * 1024) + "").substr(0, 4);

    logger("Downloading ", prettyLen, " MB");

    res.pipe(fs.createWriteStream(zipfile));

    // cleanup if the process gets interrupted.
    process.on("exit", removeZip);
    process.on("SIGHUP", removeZip);
    process.on("SIGINT", removeZip);
    process.on("SIGTERM", removeZip);

    function done() {
      // write queued data before closing the stream
      logger("Removing Sauce-Connect-latest.zip");
      fs.unlinkSync(zipfile);
      logger("Sauce Connect installed correctly");
      callback(null);
    }

    res.on("end", function () {
      logger("Unzipping Sauce-Connect-latest.zip");
      setTimeout(function () {
        try {
          var zip = new AdmZip(zipfile);
          zip.extractAllTo(__dirname, true);
        } catch (e) {
          console.log("ERROR Unzipping file", e);
        }
        done();
      }, 1000);
    });

  });

  req.end();
}



function run(options, callback) {

  function ready() {
    logger("Testing tunnel ready");
    closeOnProcessTermination();
    callback(null, child);
  }

  callback = _.once(callback);
  logger("Opening local tunnel using Sauce Connect");
  var child,
    watcher,
    args = ["-jar", jarfile, options.username || process.env.SAUCE_USERNAME, options.accessKey || process.env.SAUCE_ACCESS_KEY],
    dataActions = {
      "Please wait for 'You may start your tests' to start your tests": function connecting() {
        logger("Creating tunnel with Sauce Labs");
      },
      //"Connected! You may start your tests": ready,
      "This version of Sauce Connect is outdated": function outdated() {

      },
      "Exception: ": function error(data) {
        if (data.indexOf("HTTP response code: 401") !== -1) {
          logger("Invalid Sauce Connect Credentials");
          return callback(new Error("Invalid Sauce Connect Credentials. " + data), child);
        }
        logger("Sauce Connect Error");
        callback(new Error(data), child);
      },
      "Finished shutting down tunnel remote VM: ": function shutDown() {

      }
    };

  if (options.port) {
    args.push("-P", options.port);
  }

  if (options.proxy) {
    args.push("--proxy", options.proxy);
  }

  if (options.directDomains) {
    if (_.isArray(options.directDomains)) {
      options.directDomains = options.directDomains.join(",");
    }
    args.push("--direct-domains", options.directDomains);
  }

  if (options.fastFailRegexps) {
    if (_.isArray(options.fastFailRegexps)) {
      options.fastFailRegexps = options.fastFailRegexps.join(",");
    }
    args.push("--fast-fail-regexps", options.fastFailRegexps);
  }

  if (options.logfile) {
    args.push("-l", options.logfile);
  }

  if (options.tunnelIdentifier) {
    args.push("--tunnel-identifier", options.tunnelIdentifier);
  }

  args.push("--readyfile", readyfile);

  // Watching file as directory watching does not work on
  // all File Systems http://nodejs.org/api/fs.html#fs_caveats
  watcher = fs.watchFile(readyfile, {persistent: false}, function () {
    fs.exists(readyfile, function (exists) {
      if (exists) {
        ready();
      }
    });
  });

  watcher.on("error", callback);

  child = spawn("java", args);

  child.stdout.on("data", function (data) {
    data = data.toString().trim();
    if (options.verbose && data !== "") {
      console.log(data);
    }

    _.each(dataActions, function (action, key) {
      if (data.indexOf(key) !== -1) {
        action(data);
        return false;
      }
    });
  });

  child.on("exit", function (code, signal) {
    // Java exits with code 143 on SIGTERM; this is not an error, it comes from child.close
    if (code === 143) {
      return;
    }

    var message = "Closing Sauce Connect Tunnel";
    if (code > 0) {
      message = "Could not start Sauce Connect. Exit code " + code + " signal: " + signal;
      callback(new Error(message));
    }
    logger(message);
  });

  openProcesses.push(child);

  child.close = function (closeCallback) {
    if (closeCallback) {
      child.on("close", function () {
        closeCallback();
      });
    }
    child.kill("SIGTERM");
  };
}

function downloadAndStartProcess(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = {};
  }
  logger = options.logger || function () {};

  function checkForZip(next) {
    if (!exists(zipfile)) {
      download(options, next);
    } else {
      // the zip is being downloaded, poll for the jar to be ready
      async.doUntil(function wait(cb) {
        _.delay(cb, 1000);
      }, async.apply(exists, jarfile), next);
    }
  }

  async.waterfall([
    function checkForJar(next) {
      if (exists(jarfile)) {
        next(null);
      } else {
        checkForZip(next);
      }
    },
    async.apply(run, options)
  ], callback);

}



module.exports = downloadAndStartProcess;
module.exports.kill = killProcesses;


