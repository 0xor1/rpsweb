module.exports = function(grunt){

    var firstPass = true;

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'build/client/conf.js',
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

        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'build/client/component',
                    src: '**/*.html',
                    dest: 'build/client/component'
                }]
            }
        },

        'json-minify': {
            build: {
                files: 'build/client/**/*.json'
            }
        },

        exec: {
            buildServer: {
                cmd: 'go build -o src/server/server.exe -v src/server/server.go'
            },
            startDevServer: {
                cmd: 'cd src/server && server.exe'
            },
            startBuildServer: {
                cmd: 'cd build/server && server.exe'
            },
            updateSeleniumServer: {
                cmd: 'node node_modules/protractor/bin/webdriver-manager update'
            },
            startSeleniumServer: {
                cmd: 'node node_modules/protractor/bin/webdriver-manager start'
            },
            testClient: {
                cmd: 'cd test/unit && node ../../node_modules/karma/bin/karma start'
            },
            testE2e: {
                cmd: 'cd test/e2e && node ../../node_modules/protractor/bin/protractor protractor.conf.js'
            },
            startBuildAppEngine: {
                cmd: 'cd build && goapp serve'
            },
            startDevAppEngine: {
                cmd: 'cd src && goapp serve'
            },
            deployBuildAppEngine: {
                cmd: 'appcfg.py --oauth2 update build'
            },
            deployDevAppEngine: {
                cmd: 'appcfg.py --oauth2 update src'
            }
        },

        copy: {
            serverExe: {
                src: 'src/server/server.exe',
                dest: 'build/server/server.exe'
            },
            appEngine: {
                src: 'src/app.*',
                dest: 'build/',
                flatten: true,
                expand: true
            },
            fullClient: {
                cwd: 'src/client',
                src: '**',
                dest: 'build/client/',
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
            allClientBuildExceptIndexHtml: ['build/client/**/*', '!build/client/index.html', '!build/client/robots.txt', '!build/client/favicon.ico'],
            buildCss: ['build/client/**/*.css'],
            server: ['build/server', 'src/server/server.exe'],
            clientBuild: ['build/client'],
            clientTest: ['test/unit/coverage/*','test/unit/results/*'],
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
            },
            build: {
                options: {
                    outputStyle: 'compressed',
                    cssPath: 'build/client',
                    sassPath: 'build/client',
                    watch: false,
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
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-json-minify');

    grunt.registerTask('buildServer', ['exec:buildServer', 'copy:serverExe']);
    grunt.registerTask('cleanServer', ['clean:server']);

    grunt.registerTask('buildAppEngine', ['copy:appEngine']);
    grunt.registerTask('cleanAppEngine', ['clean:appEngine']);

    grunt.registerTask('buildClient', ['copy:fullClient', 'clean:buildCss', 'compass:build', 'htmlmin:build', 'json-minify:build', 'requirejs:compile', 'uglify:mainJsBuild', 'processhtml:clientIndex', 'clean:allClientBuildExceptIndexHtml']);
    grunt.registerTask('testClient', ['exec:testClient']);
    grunt.registerTask('cleanClientBuild', ['clean:clientBuild']);
    grunt.registerTask('cleanClientTest', ['clean:clientTest']);

    grunt.registerTask('buildAll', ['buildServer', 'buildAppEngine', 'buildClient']);
    grunt.registerTask('cleanAllBuild', ['cleanServer', 'cleanAppEngine', 'cleanClientBuild']);

    grunt.registerTask('watchSass', ['compass:dev']);
    grunt.registerTask('cleanSass', ['clean:sass']);

    grunt.registerTask('startDevServer', ['exec:startDevServer']);
    grunt.registerTask('startBuildServer', ['exec:startBuildServer']);

    grunt.registerTask('startDevAppEngine', ['exec:startDevAppEngine']);
    grunt.registerTask('startBuildAppEngine', ['exec:startBuildAppEngine']);

    grunt.registerTask('deployBuildAppEngine', ['exec:deployBuildAppEngine']);
    grunt.registerTask('deployDevAppEngine', ['exec:deployDevAppEngine']);

    grunt.registerTask('updateSeleniumServer', ['exec:updateSeleniumServer']);
    grunt.registerTask('startSeleniumServer', ['exec:startSeleniumServer']);

    grunt.registerTask('testE2e', ['exec:testE2e']);
    grunt.registerTask('cleanE2e', ['clean:e2e']);

    grunt.registerTask('nuke', ['cleanAllBuild', 'cleanClientTest', 'cleanSass', 'cleanE2e']);

};