module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            express: {
                files: ['api.js'],
                tasks: ['express'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+
                }
            }
        },
        express: {
            options: {
            },
            dev: {
                options: {
                    script: 'api.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('dev', ['express:dev', 'watch']);
};
