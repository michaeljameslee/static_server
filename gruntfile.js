module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'serve/',
          hostname: '0.0.0.0',
          protocol: 'http',
          livereload: true,
          open: true
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true, 
            cwd: 'src/',
            src: ['**', '!*.scss'], 
            dest: 'serve/'
          }
        ]
      },
      html: {
        files: [
          {
            expand: true, 
            cwd: 'src/',
            src: ['*.html'], 
            dest: 'serve/'
          }
        ]
      }
    },
    stylelint: {
      options: {
        configFile: 'style.stylelintrc',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        syntax: ''
      },
      src: ['src/*.scss']
    },
    sass: {
      dist: {
        options: {
          loadPath: ['node_modules/foundation-sites/scss']
        },
        files: {
          'serve/new.css': 'src/new.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      copy: {
        files: ['src/*.html'],
        tasks: ['copy:html']
      },
      sass: {
        files: ['src/*.scss'],
        tasks: ['stylelint', 'sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('server', ['copy:main', 'connect', 'watch']);
};
