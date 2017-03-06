#1前言

本文主要介绍互联网化平台RevaNowWeb的使用说明。

##1.1 构建工具为fis3 ,前端框架采用Angularjs+bootstrap+less，包含以下功能：
    构建单页面应用:单页面提供了最佳的响应速度，同时可以减轻服务器压力。\<br>  
    应用打包：开发出的功能能生成最适合访问的页面，同时对js、css文件进行压缩，使体积更小。\<br>  
    前端MVC：使客户端开发更结构化。\<br>  
    包管理器bower：管理第三方依赖，只需要一个命令即可更新。\<br>  
    css预处理器Less：使用结构化的方式管理css，自动优化开发后的css。\<br>  
    应用打包部署：本次主要根据fis3插件fis3-postpackager-loader生成resourcemap(具体内容详见打包生成index.html文件)，实现按单独文件夹或文件部署解决模块之间耦合问题。\<br>  
    缓存文件：解决生产环境缓存问题方式由原来的md5改为时间戳方式\<br>  

#2具体说明

##2.1依赖环境搭建
    安装nodejs：开发环境依赖node运行环境，在使用之前确保已经有可用的nodejs运行环境。\<br> 
    安装git：开发平台bower使用git进行网页依赖库的下载，在使用之前确保已经有可用的git\<br> 
    安装fis3(前台构建工具)：cmd执行 npm install –g fis3\<br> 
    安装bower(前台包管理器)：cmd执行 npm install –g bower\<br> 

##2.2前台开发环境安装
安装之前确保已经有git和nodejs环境。\<br> 
执行以下命令：(我们假定工作目录为d:\work 后续命令都在在此目录下执行)\<br> 
打开cmd
d:
cd work
   git@gitlab.com:lewatek/RevaNowWeb.git
   cd RevaNowWeb
   npm install
   bower install

###2.2.1前台开发环境目录结构说明
####目录:
bower_components：通过bower安装的前台依赖包（禁止修改）\<br> 
node_modules：通过npm安装的node依赖包，主要用于页面编译（禁止修改）\<br> 
  lib :js引用以及异步加载js文件\<br> 
  page：前端开发环境框架（谨慎修改）\<br> 

app：开发人员工作目录（可修改）\<br> 
    common：存放项目共用组件的地方，根据项目情况开发\<br> 
router：存放项目节点路由文件\<br> 
main：项目需在inde.html 中引入的js、css文件（谨慎修改）\<br> 
       style：存放项目样式图片的地方\<br> 
       views：项目功能节点存放地址，结构由项目团队自行决定\<br> 
       ·：存放项目导航栏文件\<br> 
       
###2.2.2启动前台开发服务器
Cmd执行：d :
          cd work/ RevaNowWeb
          cd tasks
          node connect.js
启动平台
Cmd 执行：d :
          cd work/ RevaNowWeb
          fis3 release dev –w(将文件部署到dev环境)
浏览器输入：http://dev.revanow.com/

###2.2.3前台开发流程
####1.开发新页面流程
在app/pages新建xxx文件夹，在文件夹中新增xxx.html
修改app/common/router/router.js中增加URL与xxx.html文件的映射关系。
####2.页面加入控制层流程
在app/pages/xxx中新增xxx.js.
采用按需加载方式不需要再页面中指定controller，详见router.js
####3.控制层数据模型操作
定义：数据模型——$scope,网络服务——$http
在控制层，由数据模型获得数据,如：var name = $scope.UserVO.username
在控制层，向数据模型提交数据,如：$scope.UserVO.username ='国家主席';
在控制层进行http网络接口调用，如：$http.post('//localhost:8080/api/user', UserVO)
#3插件介绍
 fis3-hook-commonjs：fis3模块化开发工具
   fis.hook('commonjs') 
 fis3-postpackager-loader：静态资源前段加载器，用来分析页面中使用的和依赖的资源(js或css)，并将这些资源做一定优化后插入页面中(如将零散文件合并)（https://github.com/fex-team/fis3-postpackager-loader）。
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

 fis-parser-less-2.x：支持less编译为css
fis.match('*.less', {   parser: fis.plugin('less-2.x'),   rExt: '.css' })
 fis3-hook-releative：支持产出文件为引用相对路径 
  fis.hook('relative')
 fis3-deploy-skip-packed：将产出的文件过滤掉已被打包的。
  fis.match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            fis.plugin('local-deliver', {
                to: 'dist'
            })
        ]
    })
 fis3-deploy-replace：将产出的文件做文本替换
  fis .match('*', {
        deploy:
            fis.plugin('replace', {
                from: '${TableauEnvironmentIndicator}',
                to: ""
            }),
        ]
    })
