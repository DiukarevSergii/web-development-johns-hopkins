'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    var yeomanConfig = {
        // app: 'app',
        app: 'module4-solution',
        // app: 'form',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: {liveCSS: false}
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/elements/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/elements/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/styles/**/{,*/}*.css',
                    '.tmp/scripts/app.js',
                    '<%= yeoman.app %>/elements/**/*.html',
                    '<%= yeoman.app %>/elements/**/*.json'
                ]
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/**/*.js', '<%= yeoman.app %>/elements/SBehaviors.js'],
                tasks: ['browserify:server']
            },
            styles: {
                files: [
                    '<%= yeoman.app %>/css/styles.css',
                    '<%= yeoman.app %>/styles/**/{,*/}*.css',
                    '<%= yeoman.app %>/elements/{,*/}*.css'
                ],
                tasks: ['copy:styles', 'postcss:watch']
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('pixrem')(),
                    require('autoprefixer')({browsers: ['last 4 versions', 'not ie < 11']}),
                    require('cssnano')({zindex: false})
                ]
            },
            watch: {
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: ['**/*.css', '!bower_components'],
                    dest: '.tmp'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['**/*.css', '!bower_components'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        connect: {
            options: {
                port: 3000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: {
                        target: 'http://localhost:<%= connect.options.port %>/test'
                    },
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    },
                    keepalive: true
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp',
            afterBuild: ['<%= yeoman.dist %>/scripts/**/*.js', '!<%= yeoman.dist %>/scripts/app.min.js']
        },
        vulcanize: {
            elements: {
                options: {
                    inlineScripts: true,
                    inlineCss: true,
                    stripComments: true,
                    abspath: '',
                    excludes: ["app/bower_components/polymer/polymer.html"]
                },
                files: {
                    'app/elements/s-elements.vulcanized.html': ['app/elements/s-elements.html']
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        minifyHtml: {
            options: {
                quotes: true,
                empty: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        uglify: {
            js: {
                options: {
                    screwIE8: true,
                    sourceMap: false
                },
                files: {
                    '<%= yeoman.dist %>/scripts/app.min.js': ['<%= yeoman.dist %>/scripts/app.js'],
                    '<%= yeoman.dist %>/elements/behaviors.min.js': ['<%= yeoman.app %>/elements/SBehaviors.js']
                }
            },
            bower_components: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/bower_components',
                    src: ['{,*/}*.js', '!{,*/}*.min.js'],
                    dest: '<%= yeoman.dist %>/bower_components'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'favicon.ico',
                        'robots.txt',
                        '.htaccess',
                        'styles/*.css',
                        '*.html',
                        '*.css',
                        'scripts/**/*.js',
                        'elements/**/*.{html,css,js,json}',
                        'images/{,*/}*.*',
                        'bower_components/**/*.{html,css,js,json}',
                        '!bower_components/**/{demo,test,src}/*.*'
                    ]
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: ['{styles,elements}/**/*.{css}']
                }]
            }
        },
        jsdoc: {
            dist: {
                src: ['app/scripts/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },
        rename: {
            dev: {
                src: '<%= yeoman.dist %>/scripts/config.dev.js',
                dest: '<%= yeoman.dist %>/scripts/config.js'
            },
            test: {
                src: '<%= yeoman.dist %>/scripts/config.test.js',
                dest: '<%= yeoman.dist %>/scripts/config.js'
            },
            pilot: {
                src: '<%= yeoman.dist %>/scripts/config.pilot.js',
                dest: '<%= yeoman.dist %>/scripts/config.js'
            },
            qa: {
                src: '<%= yeoman.dist %>/scripts/config.qa.js',
                dest: '<%= yeoman.dist %>/scripts/config.js'
            },
            prod: {
                src: '<%= yeoman.dist %>/scripts/config.prod.js',
                dest: '<%= yeoman.dist %>/scripts/config.js'
            }
        },
        browserify: {
            server: {
                options: {
                    transform: ['babelify']
                },
                files: {
                    '.tmp/scripts/app.js': ['./<%= yeoman.app %>/scripts/s.js']
                }
            },
            dist: {
                options: {
                    transform: ['babelify']
                },
                files: {
                    '<%= yeoman.dist %>/scripts/app.js': ['./<%= yeoman.dist %>/scripts/s.js']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.html',
                    '<%= yeoman.dist %>/activate.html': '<%= yeoman.app %>/activate.html',
                    '<%= yeoman.dist %>/reset-password.html': '<%= yeoman.app %>/reset-password.html'
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-vulcanize');

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            // 'vulcanize',
            'browserify:server',
            'copy:styles',
            'postcss:watch',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', function (env) {

        env = env || 'test';

        var builds = {
            dev: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:dev',
                'browserify:dist',
                'uglify',
                'processhtml:dist',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ],
            test: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:test',
                'browserify:dist',
                'uglify:js',
                'uglify:bower_components',
                'processhtml:dist',
                'imagemin',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ],
            pilot: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:pilot',
                'browserify:dist',
                'uglify:js',
                'uglify:bower_components',
                'processhtml:dist',
                'imagemin',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ],
            qa: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:qa',
                'browserify:dist',
                'uglify',
                'processhtml:dist',
                'imagemin',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ],
            beta: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:beta',
                'browserify:dist',
                'uglify',
                'processhtml:dist',
                'imagemin',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ],
            prod: [
                'clean:dist',
                'vulcanize',
                'copy',
                'rename:prod',
                'browserify:dist',
                'uglify',
                'processhtml:dist',
                'imagemin',
                'postcss:dist',
                //'minifyHtml',
                'clean:afterBuild'
            ]
        };

        return grunt.task.run(builds[env]);
    });

    grunt.registerTask('default', [
        'serve'
    ]);


};
