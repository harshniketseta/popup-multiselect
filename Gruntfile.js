module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      options: {
        laxcomma: true
      },
      javascripts: ["src/javascripts/popup-multiselect.js"]
    },
    uglify: {
      options: {
        banner:
          "/*!\n" +
          " * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n" +
          ' * Copyright 2011-<%= grunt.template.today("yyyy") %>, Author: <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
          " * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n" +
          " */\n"
      },
      build: {
        src: "src/javascripts/popup-multiselect.js",
        dest: "dist/javascripts/popup-multiselect.min.js"
      }
    },
    sass: {
      // Task
      dist: {
        // Target
        options: {
          // Target options
          style: "expanded"
        },
        files: {
          // Dictionary of files
          "dist/stylesheets/popup-multiselect.css": "src/stylesheets/popup-multiselect.scss"
        }
      }
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "dist/stylesheets",
            src: ["popup-multiselect.css", "!*.min.css"],
            dest: "dist/stylesheets",
            ext: ".min.css"
          }
        ]
      }
    },
    watch: {
      all: {
        options: {
          livereload: true
        },
        files: [
          "src/stylesheets/popup-multiselect.scss",
          "src/javascripts/popup-multiselect.js"
        ],
        tasks: ["default"]
      }
    }
  });

  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks("grunt-contrib-jshint");

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Load the plugin that provides the "sass" task.
  grunt.loadNpmTasks("grunt-contrib-sass");

  // Load the plugin that provides the "cssmin" task.
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // Defining tasks for js and css.
  grunt.registerTask("scripts", ["jshint", "uglify"]);
  grunt.registerTask("styles", ["sass", "cssmin"]);

  // Default task(s).
  grunt.registerTask("default", ["scripts", "styles"]);
};
