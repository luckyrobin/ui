module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
//        less文件处理
        less: {
            compile: {
                options: {
                    // 是否压缩css
                    compress: false,
                    // 是否启用 source map
                    sourceMap: true,
                    sourceMapRootpath: "../"
                },
                files: [
                    {
                        // 不一一指定目标文件
                        expand: true,
                        // 源目录
                        cwd: 'less/',
                        // 源文件后缀
                        src: '*.less',
                        // 目标路径
                        dest: 'css/',
                        // 目标后缀
                        ext: '.css'
                    }
                ]
            }
        },

        // 监控文件变化
        watch: {
            livereload: {
                // 指定要监控的文件
                files: ['less/*', 'js/*', '*.html'],
                // less变动，立即编译
                tasks: ["less"],
                options: {
                    // 自动刷新浏览器
                    livereload: true
                }
            }
        },
        //      静态服务器 自动刷新
        connect: {
            options: {
                port: 9999,
                hostname: '*',
                livereload: true
            },
            dev: {
                options: {
                    middleware: function (connect, op) {
                        return [
                            // Serve static files.
                            connect.static(op.base),
                            // Make empty directories browsable.
                            connect.directory(op.base)
                        ];
                    }
                }
            }
        },

        // 复制文件
        copy: {
            main: {
                files: [
                    {expand: true, src: ['js/*.js'], dest: 'build/'},
                    {expand: true, src: ['*.html'], dest: 'build/'}
                ]
            }
        },
        //      css属性排序
        csscomb: {
            mu: {
                expand: true,
                cwd: 'css/',
                src: ['*.css'],
                dest: 'css/',
                ext: '.css'
            }
        },
        //清理文件
        clean: {
            build: {
                src: 'build/'
            }
        }

    });

//    加载所需模块
    grunt.loadNpmTasks('yhd-grunt-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-clean');

//    自定义spriter模块
    grunt.task.registerTask('spriter', function () {
        var done = this.async();
        var spriter = require('ispriter');
        var configFile = 'config.json';
        spriter.merge(configFile);
    });

//    开发时task
    grunt.task.registerTask('default', ['less', 'connect', 'watch']);

//    构建task
    grunt.task.registerTask('build', ['csscomb', 'clean', 'copy', 'spriter']);
};