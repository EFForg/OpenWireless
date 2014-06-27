# Exports a function which returns an object that overrides the default &
#   plugin grunt configuration object.
#
# You can familiarize yourself with Lineman's defaults by checking out:
#
#   - https://github.com/testdouble/lineman/blob/master/config/application.coffee
#   - https://github.com/testdouble/lineman/blob/master/config/plugins
#
# You can also ask Lineman's about config from the command line:
#
#   $ lineman config #=> to print the entire config
#   $ lineman config concat.js #=> to see the JS config for the concat task.
#
# lineman-lib-template config options can be found in "config/lib.json"

libConfig = require('./lib')

module.exports = (lineman) ->
  grunt = lineman.grunt
  _ = grunt.util._
  app = lineman.config.application

  if libConfig.generateBowerJson
    app.loadNpmTasks.push("grunt-write-bower-json")
    app.appendTasks.dist.push("writeBowerJson")

  app.uglify.js.files = _({}).tap (config) ->
    config["dist/#{grunt.file.readJSON('package.json').name}.min.js"] = "<%= files.js.uncompressedDist %>"

  meta:
    banner: """
            /* <%= pkg.name %> - <%= pkg.version %>
             * <%= pkg.description || pkg.description %>
             * <%= pkg.homepage %>
             */

            """

  removeTasks:
    common: ["less", "handlebars", "jst", "images:dev", "webfonts:dev", "pages:dev"]
    dev: ["server"]
    dist: ["cssmin", "images:dist", "webfonts:dist", "pages:dist"]

  concat:
    uncompressedDist:
      options:
        banner: "<%= meta.banner %>"
      src: _([
        ("<%= files.js.vendor %>" if libConfig.includeVendorInDistribution),
        "<%= files.coffee.generated %>",
        "<%= files.js.app %>"
      ]).compact()
      dest: "<%= files.js.uncompressedDist %>"


