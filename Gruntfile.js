const path = require('path');

const css_path = path.resolve(__dirname, 'public', 'css');  
const scss_path = path.resolve(__dirname, 'public', 'scss');

module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
	files: [{
	  expand: true,
	  cwd: scss_path,
	  src: ['*.scss'],
	  dest: css_path,
	  ext: '.css'
	}]
      }
    },
    cssmin: {
      target: {
	files: [{
	  expand: true,
	  cwd: css_path,
	  src: ['*.css'],
	  dest: css_path,
	  ext: '.min.css'
	}]}
    },
    watch: {
      options: {
	cwd: scss_path
      },
      styles: {
	files: ['**/*.scss'],
	tasks: ['sass']
      }
    }
  });
  

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.registerTask('default', ['sass', 'cssmin']);
};
