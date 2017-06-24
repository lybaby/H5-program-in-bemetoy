module.exports = function(grunt){
    
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        
        concat: {
            options: {
                //定义一个用于插入合并输出文件之间的字符
                separator: "\n\n"
            },
            allsrc : {
                src: ['./js/main.js', 'js/comm/*.js', 'js/helper/*.js', 'js/page/*.js'],
                dest: '../static/js/main.src.js'
            },
            alllib : {
                src: [
                    '../static/lib/zepto-1.1.6.min.js',
                    '../static/lib/require.js'
                ],
                dest: '../static/js/zepto-require.min.js'
            }
        },
        
        jshint: {
            //定义用于检测的文件
            files: ['js/*.js'],
            //配置JSHint (参考文档:http://www.jshint.com/docs)
            options: {
                //你可以在这里重写jshint的默认配置选项
                globals: {
                    jQuery: true,
                 console: true,
                    define:true,
                    module: true
                }
            }
        },
        
        uglify: {
            all : {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    '../static/js/main-1.0.min.js' : ['../static/js/main.src.js']
                }
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    '../static/css/style.min.css': ["../static/css/style.css"]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build', ['cssmin', 'concat:allsrc', 'uglify:all', 'concat:alllib']);
    grunt.registerTask('test', ['jshint']);
};



