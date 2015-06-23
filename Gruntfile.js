module.exports = function(grunt){

    var firstPass = true;

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'src/client/conf.js',
                    include: '../main',
                    findNestedDependencies: true,
                    optimize: 'none',
                    out: 'build/client/main.js',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs'),
                            amdclean = require('amdclean'),
                            outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            'filePath': outputFile
                        }));
                    }
                }
            }
        },

        exec: {
            buildServer: {
                cmd: 'go build -o src/server.exe -v src/server.go'
            },
            startDevServer: {
                cmd: 'cd src && server.exe'
            },
            startBuildServer: {
                cmd: 'cd build && server.exe'
            },
            updateSeleniumServer: {
                cmd: 'node node_modules/protractor/bin/webdriver-manager update'
            },
            startSeleniumServer: {
                cmd: 'node node_modules/protractor/bin/webdriver-manager start'
            },
            testClient: {
                cmd: 'cd test/unit/client && node ../../../node_modules/karma/bin/karma start'
            },
            testE2e: {
                cmd: 'cd test/e2e && node ../../node_modules/protractor/bin/protractor protractor.conf.js'
            },
            startAppEngine: {
                cmd: 'cd build && goapp serve'
            },
            deployAppEngine: {
                cmd: 'appcfg.py --oauth2 update build'
            }
        },

        copy: {
            serverExe: {
                src: 'src/server.exe',
                dest: 'build/server.exe'
            },
            clientIndex: {
                src: 'src/client/index.html',
                dest: 'build/client/index.html'
            },
            clientAppCache: {
                src: 'src/client/app.appcache',
                dest: 'build/client/app.appcache'
            },
            styleBuild: {
                src: 'src/client/style.css',
                dest: 'build/client/style.css'
            },
            appEngine: {
                src: 'src/app.*',
                dest: 'build/',
                flatten: true,
                expand: true
            }
        },

        processhtml: {
            clientIndex: {
                files: {
                    'build/client/index.html': ['build/client/index.html']
                }
            }
        },

        uglify: {
            mainJsBuild: {
                files: {
                    'build/client/main.js': ['build/client/main.js']
                }
            }
        },

        clean: {
            mainJsBuild: ['build/client/main.js'],
            styleBuild: ['build/client/style.css'],
            serverBuild: ['build', 'src/server.exe'],
            clientBuild: ['build/client'],
            clientTest: ['test/unit/client/coverage/*','test/unit/client/results/*'],
            sass: ['src/client/**/*.css'],
            e2e: ['test/e2e/results/*'],
            appEngine: ['build/app.*']
        },

        compass: {
            dev: {
                options: {
                    outputStyle: 'compressed',
                    cssPath: 'src/client',
                    sassPath: 'src/client',
                    watch: true,
                    trace: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('buildServer', ['exec:buildServer', 'copy:serverExe']);
    grunt.registerTask('cleanServerBuild', ['clean:serverBuild']);

    grunt.registerTask('buildClient', ['requirejs:compile', 'uglify:mainJsBuild', 'copy:clientAppCache', 'copy:styleBuild', 'copy:clientIndex', 'processhtml:clientIndex', 'clean:mainJsBuild', 'clean:styleBuild']);
    grunt.registerTask('testClient', ['exec:testClient']);
    grunt.registerTask('cleanClientBuild', ['clean:clientBuild']);
    grunt.registerTask('cleanClientTest', ['clean:clientTest']);

    grunt.registerTask('buildAll', ['buildServer', 'buildClient']);
    grunt.registerTask('cleanAllBuild', ['cleanServerBuild', 'cleanClientBuild']);

    grunt.registerTask('watchSass', ['compass:dev']);
    grunt.registerTask('cleanSass', ['clean:sass']);

    grunt.registerTask('startDevServer', ['exec:startDevServer']);
    grunt.registerTask('startBuildServer', ['exec:startBuildServer']);

    grunt.registerTask('updateSeleniumServer', ['exec:updateSeleniumServer']);
    grunt.registerTask('startSeleniumServer', ['exec:startSeleniumServer']);

    grunt.registerTask('testE2e', ['exec:testE2e']);
    grunt.registerTask('cleanE2e', ['clean:e2e']);

    grunt.registerTask('buildAppEngine', ['copy:appEngine']);
    grunt.registerTask('cleanAppEngine', ['clean:appEngine']);
    grunt.registerTask('startAppEngine', ['exec:startAppEngine']);
    grunt.registerTask('deployAppEngine', ['exec:deployAppEngine']);

    grunt.registerTask('nuke', ['cleanAllBuild', 'cleanClientTest', 'cleanSass', 'cleanE2e', 'cleanAppEngine']);

};