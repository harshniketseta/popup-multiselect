module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      options: {
        laxcomma: true
      },
      javascripts: ['src/javascripts/**/*.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/javascripts/<%= pkg.name %>.js',
        dest: 'dist/javascripts/<%= pkg.name %>.min.js'
      }
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'dist/stylesheets/popupMultiSelect.css': 'src/stylesheets/popupMultiSelect.scss'
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/stylesheets',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/stylesheets',
          ext: '.min.css'
        }]
      }
    }
  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "sass" task.
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Load the plugin that provides the "cssmin" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Defining tasks for js and css.
  grunt.registerTask('js', ['jshint', 'uglify']);
  grunt.registerTask('css', ['sass', 'cssmin']);

  // Default task(s).
  grunt.registerTask('default', ['js', 'css']);
};