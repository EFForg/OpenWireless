module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    watch: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('test', ['karma']);
};
