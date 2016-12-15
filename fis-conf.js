//由于使用了bower，有很多非必须资源。通过set project.files对象指定需要编译的文件夹和引用的资源
fis.set('project.files', ['page/**', 'map.json', 'app/**', 'lib']);
fis.set('statics', '/statics'); //static目录
fis.set('date', new Date);
fis.set('livereload.port', 35729);
/*此处配置需部署的文件夹； */
fis.set('projectFiles', ['page/statics/**', /*index.html*/
    'app/common/**',/*共同部分，谨慎修改*/
    'app/views/push/**',/*本次部署的模块*/
    'app/style/less/push/**'/*部署模块样式*/
]);
fis.set('releaseFile', 'push');
// npm install [-g] fis3-hook-commonjs
fis.hook('commonjs');

/*fis.hook('relative');若使用相对路径将配置放开即可*/

//打包与css sprite基础配置
fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites')
})
fis.match('**.{css,less}', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

/****************异构语言编译*****************/
//less的编译
//npm install [-g] fis-parser-less
fis.match('**/*.less', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('less-2.x', {
        //fis-parser-less option
    })
});
/*************************目录规范*****************************/
fis
    .match("**/*", {
        release: '${statics}/$&'
    }).match(/^\/app\/(.*)\.(js)$/i, {
        //modules下面都是模块化资源
        isMod: true,
        id: '$1', //id支持简写，去掉app和.js后缀中间的部分
        release: '${statics}/$&'
    }).match(/^\/page\/(.*)$/i, {
        //page下面的页面发布时去掉page文件夹
        useCache: false,
        release: '$1'
    }).match(/^\/app\/([^\/]+)\/\1\.(js)$/i, {
        //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
        //直接引用为var $ = require('jquery');
        id: '$1'
    }).match(/^(.*)mixin\.less$/i, {
        //less的mixin文件无需发布
        release: false
    }).match("**/*.tmpl", {
        //前端模板,当做类js文件处理，可以识别__inline, __uri等资源定位标识
        isJsLike: true,
        release: false
    }).match(/.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/, {
        //页面模板不用编译缓存
        useCache: false
    }).match('*', {
        deploy: [
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: ""
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver')
        ]
    }).match('*.{js,css,png,less}', {
        query: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
    })
    // dev环境部署
fis.media('dev').match('*', {
        deploy: [
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: ""
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('http-push', {
                receiver: 'http://dev.revanow.com:8999/receiver',
                to: '/web/revanow/revanowweb' // 注意这个是指的是测试机器的路径，而非本地机器
            })
        ]
    })
    // 测试环境部署单个文件夹或文件
fis.media('qa-mod')
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: ""
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]
    }).set('project.files',
        fis.get('projectFiles')
    ).match('**/views/**(.async).js', {
        release: false
    }).match('**/'+fis.get('releaseFile')+'/**', {
        release: '${statics}/$&'
    }).match('**.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    }).match('**.min.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: null,
        optimizer: null
    }).match('/**(.async).js', {
        preprocessor: null,
        optimizer: null
    }).match('**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    }).match("lib/*.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.min.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.css", {
        //所有页面中引用到的bower css资源
        packTo: "/pkg/vendor.css"
    }).match("bower_components/**/*.less", {
        packTo: "/pkg/vendor.css"
    }).match("app/common/**/*.js", {
        packTo: "/app/common/main.js"
    }).match("app/views/**/*API.js", {
        packTo: "/app/common/main.js"
    });

fis.media('qa')
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: ""
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]
    }).match('**.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    }).match('**.min.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: null,
        optimizer: null
    }).match('/**(.async).js', {
        preprocessor: null,
        optimizer: null
    }).match('**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    }).match("lib/*.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.min.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.css", {
        //所有页面中引用到的bower css资源
        packTo: "/pkg/vendor.css"
    }).match("bower_components/**/*.less", {
        packTo: "/pkg/vendor.css"
    }).match("app/common/**/*.js", {
        packTo: "/app/common/main.js"
    }).match("app/views/**/*API.js", {
        packTo: "/app/common/main.js"
    });

fis.media('demo')
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: "_0"
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]

    }).match('**.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    }).match('**.min.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: null,
        optimizer: null
    }).match('/**(.async).js', {
        preprocessor: null,
        optimizer: null
    }).match('**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    }).match("lib/*.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.min.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.css", {
        //所有页面中引用到的bower css资源
        packTo: "/pkg/vendor.css"
    }).match("bower_components/**/*.less", {
        packTo: "/pkg/vendor.css"
    }).match("app/common/**/*.js", {
        packTo: "/app/common/main.js"
    }).match("app/views/**/*API.js", {
        packTo: "/app/common/main.js"
    });
/**********************生产环境下CSS、JS压缩合并*****************/
//使用方法 fis3 release prod
fis.media('prod')
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: "_1"
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]


    }).match('**.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    }).match('**.min.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: null,
        optimizer: null
    }).match('/**(.async).js', {
        preprocessor: null,
        optimizer: null
    }).match('**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    }).match("lib/*.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.min.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.css", {
        //所有页面中引用到的bower css资源
        packTo: "/pkg/vendor.css"
    }).match("bower_components/**/*.less", {
        packTo: "/pkg/vendor.css"
    }).match("app/common/**/*.js", {
        packTo: "/app/common/main.js"
    }).match("app/views/**/*API.js", {
        packTo: "/app/common/main.js"
    });
/*生产环境部署单个文件夹或文件*/
fis.media('prod-mod')
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: "_1"
            }),
            fis.plugin('replace', {
                from: '${TimeStampIndicator}',
                to: '?t=' + (fis.get('date').getYear() + 1900) + (fis.get('date').getMonth() + 1) + (fis.get('date').getDate())
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]
    }).set('project.files', fis.get('projectFiles')).match('**/views/**(.async).js', {
        release: false
    }).match('**/'+fis.get('releaseFile')+'/**', {
        release: '${statics}/$&'
    }).match('**.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    }).match('**.min.js', {
        //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
        preprocessor: null,
        optimizer: null
    }).match('/**(.async).js', {
        preprocessor: null,
        optimizer: null
    }).match('**.{css,less}', {
        optimizer: fis.plugin('clean-css')
    }).match("lib/*.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.min.js", {
        //所有页面中引用到的bower js资源
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.css", {
        //所有页面中引用到的bower css资源
        packTo: "/pkg/vendor.css"
    }).match("bower_components/**/*.less", {
        packTo: "/pkg/vendor.css"
    }).match("app/common/**/*.js", {
        packTo: "/app/common/main.js"
    }).match("app/views/**/*API.js", {
        packTo: "/app/common/main.js"
    });
