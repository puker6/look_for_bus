

### 运行方式
1. 先安装node客户端 (v8版本，版本太高有些包可能不兼容)，保证node 和 npm 环境;
2. 若缺少相关包,在根目录下(EP)打开命令行 npm install 下载安装gulp以及相关包;
3. 安装配置好了以后本地环境（run-web-aep目录下）运行 npm run dev 或 gulp dev ; 
4. 项目打包 npm run build:dev 或者 gulp build:dev ;
5. 清空 gulp clear-all;

## 整体项目采用  angular +  angular-ui +  bootstrap + jquery + karma + jasmine等，构建工具使用gulp

### 项目编译发布

## 编译文件目录如下
```
 --i18n                          //国际化语言库
    --locale-CN.json             // 简体中文国际化语言包
 --js                            //业务逻辑代码文件夹
    --bundle-***.min.js          //编译的应用层代码
 --json                          //mock JSON数据
    --****                       //各服务下的菜单静态数据
--src                            //静态资源夹    
    --audio                      //静态音频文件夹
    --css                        //静态样式文件夹
    --images                     //静态图片资源文件夹
    --libs                       //静态第三方外部资源文件夹
--templates                      //静态模板资源文件夹
 index.html                      //静态文件入口
```


## 项目编译

1. 首先更新git版本库最新代码，然后修改config目录下config_server_url.dev.js里面config对象里面参数，menuConfig参数看是否发在线还是离线菜单，schemaVersion参数dev修改为prod，然后在cmd项目路径下运行gulp build:dev;
2. 编译代码执行成功之后，项目文件会新增build文件夹，此文件夹就是打包后的文件，可拷贝出来部署到服务器;
3. 最后cmd项目路径下，执行gulp clear-all 命令清除编译文件;

##  项目整体架构 

1. 项目整体目录如下

```
 --app   //app 路由以及业务逻辑的目录
    --components      // 页面组件
    --json           // 静态mock数据
    --shared        // 公共组件
    --views        // 页面组件模板
    launcher.js   // 入口文件
    router.js     // 路由
 --src  
   --css         // 页面样式，gulp自动生成
   --images      //页面图标
   --theme       //页面公共样式
   --libs        // 引入的库及插件
 favicon.ico     //fontAwesome入口文件
 gulpfile.js     //gulp配置文件 
 index.html      //静态文件入口
 .gitignore      //git忽略上传文件
 package.json
 README.md // 说明文档
```


2. 新建less文件配置

1. 首先，在less文件夹中新建自定义的.less文件，然后在base.less中引入你创建的less文件
```
    @import "*.less"
```
3. 运行
在在根目录下(EnablePlatform)打开命令行
```
    gulp
```
4. 新建模块流程
比如添加一个新的菜单子项模块，
router.js（配置好你的路由以及状态，然后确认你是否需要你launcher.js中的apiUrl设置端口号）;
 →根据你设置的路由里面的控制器，在components里面创建你的控制器、指令、以及局部服务、过滤器等;
 →在views里面创建你再去在routers绑定的html template;
 →在json文件夹中menuLists.json参考其他配置添加你的主菜单项;
 


##  注意事项

 1. 使用webstorm编辑器下，可能EScript6语法的代码会在编辑器里面报错，需要在编辑器设备里面切换js的语法支撑

##  新增通用组件

 1. 使用$.misMsg(string)显示2秒消失的提示框，自定义提示框delay时间，显示位置以及样式颜色等，具体语法如下：
```
    $.misMsg.defaults({
       containerClassName: "",              //容器样式
       className: "",                       //内容样式
       openClassName: "",                   //开启动画样式
       closeClassName: "",                  //关闭动画样式
       closeDelay: 3000,                    //显示时长
       clickToClose: true,                  //默认是否自动关闭
       closeCallback: function () { },      //回调函数
       content: "",                         //内容
       element: null,                       //顶层元素，默认body
       position: "top"                      //提示框位置
    });
```
      
 2. 使用$.misAlert(data,options),默认1分钟自动消失，点击关闭和右上角X消失，options可以是对象也可以是回调函数，可以不传值，具体语法如下：
 ```
    let info = {
                title: "提示信息",
                 content: result.resultStatus.resultMessage
      };
      
      $.misAlert(info);
```
3. 使用外部滚动轴插件
 ```
<scrollable always-visible="true"></scrollable>  --- E
   
scrollable="{alwaysVisible='true'}"              ---A
```
等方式引用，详细介绍请查阅https://github.com/maxaon/angular-nanoscroller。

4. 使用分页组件，包括小于1页分页数时总条数显示，大于1页分页数时显示页码，以及大于10页分页数快捷跳转页码，页码首尾页、上下页调转。
使用方式如下：
在接口文档系统中心，产品线主页，我书写一个模拟动态demo流程，
首先，在你的页面添加指令，实例在produce_line.html的
```
<mis-pagination record-total="model.totalCount" page-index="model.pageNo"
   page-size="model.pageSize" page-total="model.totalPage" page-state="curState"></mis-pagination>
```
然后在控制器里面将指令需要的参数绑定，实例在productLineController里面，并且在router上配置你的路由参数。
```
//参数配置
 $scope.model = {
         pageState: "main.product_document", //路由状态
         totalCount: 60, //查询结果总条数
         pageNo: 1,    //当前页数
         pageSize: 10,    //每页最大限制条数
         totalPage: 6     //总页数
    };
 ```  
最后，位置的样式根据引用页面调整。

 5. 使用$.misConfirm(data,callback),默认不自动消失，点击关闭和右上角 X 消失，callback是回调函数，可以不传值，具体语法如下：
 ```
    let info = {
                title: "提示信息",
                 content: result.resultStatus.resultMessage
      };
      
      $.misConfirm(info，function(){
        //确定操作回调函数
      });
```
6. 使用$.misShow3DLoader() 和$.misShowLoader() 调用loading动画加载，$.misHide3DLoader() 和 $.misHideLoader()关闭加载loading动画，具体语法如下：
 ```
    //加载动画
    $.misShow3DLoader();
    $.misShowLoader();
    //关闭动画
    $.misHide3DLoader();
    $.misHideLoader();
```



