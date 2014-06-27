# Exports a function which returns an object that overrides the default &
#   plugin file patterns (used widely through the app configuration)
#
# To see the default definitions for Lineman's file paths and globs, see:
#
#   - https://github.com/testdouble/lineman/blob/master/config/files.coffee
#

module.exports = (lineman) ->
  grunt = lineman.grunt

  js:
    uncompressedDist: "dist/#{grunt.file.readJSON('package.json').name}.js"
    spec: [
      "spec/**/*.js",
      "!spec/prereq/**"
    ]
  coffee:
    spec: [
      "spec/**/*.coffee",
      "!spec/prereq/**"
    ]

