'use strict';
/**

 * gulp-less                自动编译less生成css
 * lessPluginCleanCss       压缩清理css
 * less-plugin-autoprefix   自动配置浏览器兼容前缀
 * gulp-ngdocs              自动生成API文档
 * gulp-sourcemaps          资源地图路径
 * gulp-notify              当本地异常提示错误
 * gulp-plumber             提示报错行号
 * open                     打开浏览器
 * gulp-connect             连接服务
 * gulp-ng-html2js          压缩所有html-template合并为js文件
 * gulp-minify-html         压缩html文件
 * gulp-concat              压缩js文件
 * gulp-uglify              压缩js文件
 * gulp-ng-annotate         处理angularJs依赖注入的插件
 * gulp-babel               ES6转换为ES5语法
 * gulp-rev                 对文件MD5命名
 * gulp-rev-collector       文件路径替换
 * gulp-strip-debug         除去js代码中的console和debugger输出
 * imagemin                 图片压缩
 * imagemin-pngquant        深度压缩png文件
 * imagemin-jpegtran        深度压缩JPEG文件
 * cache                    只压缩修改文件
 * run-sequence             控制多个任务进行顺序执行或者并行执行
 * clean                    删除文件
 * gulp-asset-rev           给编译的文件添加版本号（格式如：a.js?v=xxxx）
 * gulp-rename              给文件重命名
 */

const gulp = require('gulp'),

    less = require('gulp-less'),

    sourcemaps = require('gulp-sourcemaps'),

    notify = require('gulp-notify'),

    plumber = require('gulp-plumber'),

    openURL = require('open'),

    gulp_connect = require('gulp-connect'),

    lessPluginCleanCss = require('less-plugin-clean-css'),

    lessPluginAutoPrefix = require('less-plugin-autoprefix'),

    ngHtml2Js = require("gulp-ng-html2js"),

    minifyHtml = require("gulp-minify-html"),

    concat = require("gulp-concat"),

    uglify = require("gulp-uglify"),

    ngAnnotate = require('gulp-ng-annotate'),

    babel = require("gulp-babel"),

    assetRev = require('gulp-asset-rev'),

    rev = require('gulp-rev'),

    revCollector = require('gulp-rev-collector'),

    rename = require('gulp-rename'),

    stripDebug = require('gulp-strip-debug'),

    imagemin = require('gulp-imagemin'),

    runSequence = require('run-sequence'),

    cache = require('gulp-cache'),

    clean = require('gulp-clean'),

    eslint = require('gulp-eslint'),

    changed = require('gulp-changed'),

    browserSync = require('browser-sync').create(),

    reload = browserSync.reload,

    htmlmin = require('gulp-htmlmin'),

    webserver = require('gulp-webserver'),

    config = require('./config/gulpPluginConfig');

//压缩css
let cleanCss = new lessPluginCleanCss(config.cleanCSS),

    //配置浏览器版本
    autoPrefix = new lessPluginAutoPrefix(config.autofix),

    /*编译输入路径配置*/
    buildInputConfig = {
        jsInputPatch: ['./app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js']
    },

    //编译生成输出路径配置
    destConfig = {
        'ironTowerThemePatch': './src/css/ironTower',
        'darkLightThemePatch': './src/css/darkLight',
        'htmlPatch': './**/*.html',
        'jsPatch': './**/*.js',
        'cssPatch': './src/css/**/*.css',
        'buildJs': './build/js',
        'buildSrc': './build/src',
        'buildTpl': './build/templates',
        'buildJson': './build/json',
        'buildTranslate': './build/i18n'
    };

//定义一个存放所有less对象的数组
let lessArrs = [];

//定义编译less为css的通用函数
function lesscompiler(name, lessPath, destPatch) {
    name = 'less-' + name;
    lessPath = lessPath + '.less';
    lessArrs.push(name);
    gulp.task(name, function () {
        gulp.src(lessPath).pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        // .pipe(sourcemaps.init())
            .pipe(less({
                plugins: [autoPrefix, cleanCss]
            }))
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(destPatch));
    });
}
//监听less变化
gulp.task('watch', function () {
    //livereload.listen();
    gulp.watch('**/*.less', lessArrs);
    // gulp.watch(destConfig.htmlPatch, ['server:reload-html']);
    // gulp.watch(destConfig.jsPatch, ['server:reload-js']);
    gulp.watch(destConfig.cssPatch, ['server:reload-css']);
});
//本地服务器任务，在DEV环境启动开始默认浏览器服务
gulp.task('run-dev', function (cb) {
    /*F1*/
    gulp_connect.server({
        root: ['./'],
        livereload: true,
        port: 8000,
        fallback: 'index.html'
    });
    openURL(`http://localhost:8000`);

    /*F2*/
    // browserSync.init({
    //     server: {
    //         baseDir: './',
    //         index: 'index.html'
    //     },
    //     open: 'external',
    //     injectChanges: true
    // });

    /*F3*/
    /*    gulp.src('./')
     .pipe(webserver({
     livereload: true,
     directoryListing: true,
     open: true,
     fallback: 'index.html'
     }));*/
});

//服务器任务，在DEV环境监听html文件变化，刷新当前页面服务
gulp.task('server:reload-html', function () {
    gulp.src(destConfig.htmlPatch)
        .pipe(gulp_connect.reload());
});

//服务器任务，在DEV环境监听js文件变化，刷新当前页面
gulp.task('server:reload-js', function () {
    gulp.src(destConfig.jsPatch)
        .pipe(gulp_connect.reload());
});

//服务器任务，在DEV环境监听css文件变化，刷新当前页面
gulp.task('server:reload-css', function () {
    gulp.src(destConfig.cssPatch)
        .pipe(gulp_connect.reload());
});

//PROD环境环境编译任务，build html合并为一个js文件输出到PROD生产环境
// gulp.task('build:template-compile', function () {
//     return gulp.src('./app/**/*.html')
//         .pipe(plumber({
//             errorHandler: notify.onError('Build Template Error: <%= error.message %>')
//         }))
//         .pipe(minifyHtml({
//             empty: true,
//             spare: true,
//             quotes: true
//         }))
//         .pipe(ngHtml2Js({
//             moduleName: function (file) {
//                 let pathParts = file.path.split('/');
//                 let folder = pathParts[pathParts.length - 2];
//                 return folder.replace(/-[a-z]/g, function (match) {
//                     return match.substr(1).toUpperCase();
//                 });
//             }
//         }))
//         .pipe(concat('template.tpl.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(destConfig.buildJs));
// });

//PROD环境环境编译任务，build html文件输出到PROD生产环境
gulp.task('build:template-output', function () {
    return gulp.src('./app/views/**/*.html')
    // .pipe(htmlmin(config.htmlmin))
        .pipe(gulp.dest(destConfig.buildTpl));
});

//PROD环境环境编译任务，build images文件输出到PROD生产环境
gulp.task('build:image-min-output', function () {
    return gulp.src('./src/images/*.{png,jpg,jpeg,gif,svg,ico}')
    //imagemin  version < 3 使用
    // .pipe(cache(imagemin({
    //     interlaced: true,
    //     progressive: true,
    //     svgoPlugins: [{removeViewBox: true}],
    //     use: [imageminPngquant()]
    // })))
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest(destConfig.buildSrc + '/images'));
});

//PROD环境环境编译任务，build 静态音频文件输出到PROD生产环境
gulp.task('build:audio-output', function () {
    return gulp.src('./src/audio/*')
        .pipe(gulp.dest(destConfig.buildSrc + '/audio'));
});

//PROD环境环境编译任务，build 外部库文件输出到PROD生产环境
gulp.task('build:lib-output', function () {
    // return gulp.src(
    //     ['!./src/libs/angular-ui/?(angular-ui-router|ui-grid|ui-bootstrap-tpls-2.5.0).min.js', '!./src/libs/angular/?(angular-locale_zh|angular-mocks).js',
    //         '!./src/libs/angular-ui/*.{css,eot,svg,ttf,woff}', '!./src/libs/angular-ui/slider.js', '!./src/libs/angular/?(angular|angular-animate|angular-cookies|angular-messages|angular-route|angular-sanitize).min.js',
    //         '!./src/libs/bootstrap/*', '!./src/libs/angular-translate/*', '!./src/libs/**/*.map', '!./src/libs/baidu/?(echarts|echarts.min).js', '!./src/libs/jquery/*', '!./src/libs/lodash/*', '!./src/libs/md5/*',
    //         '!./src/libs/angular-esri/?(angular-esri-core|angular-esri-map).js', '!./src/libs/socket.io/*', '!./src/libs/datetimepicker/**', '!./src/libs/base64/*', '!./src/libs/mqtt/*', '!./src/libs/font-awesome/*',
    //         '!./src/css/animate.css', './src/libs/**/*'])
    // return gulp.src(
    //     ['./src/libs/angular/angular-tree-control.min.js','./src/libs/angular-esri','./src/libs/angular-arcode','./src/libs/angular-scroll','./src/libs/angular-ui/ui-switch.min.js','./src/libs/arcgis',
    //     './src/libs/baidu/?(china|MarkerClusterer_min).js','./src/libs/font-ali','./src/libs/image-compress','./src/libs/rabbitmq'])
    return gulp.src(['./src/libs/**/*'])
        .pipe(gulp.dest(destConfig.buildSrc + '/libs'));
});

//PROD环境环境编译任务，build 静态JSON文件输出到PROD生产环境
gulp.task('build:json-output', function () {
    return gulp.src('./app/mocks/*')
        .pipe(gulp.dest(destConfig.buildJson));
});

//PROD环境环境编译任务，build 静态本地国际化JSON文件输出到PROD生产环境
gulp.task('build:i18n-output', function () {
    return gulp.src('./i18n/*')
        .pipe(gulp.dest(destConfig.buildTranslate));
});

//PROD环境编译任务，压缩、混淆js文件加hash编码并生成 rev-manifest.json文件名对照映射输出到PROB生产环境
gulp.task('build:js-dev-compile', function () {
    let buildUrl = ['./config/config_server_url.dev.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

gulp.task('build:js-test-compile', function () {
    let buildUrl = ['./config/config_server_url.test.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

gulp.task('build:js-prod-compile', function () {
    let buildUrl = ['./config/config_server_url.prod.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

gulp.task('build:js-iron-compile', function () {
    let buildUrl = ['./config/config_server_url.iron.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

gulp.task('build:js-SHGX-compile', function () {
    let buildUrl = ['./config/config_server_url.SHGX.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

gulp.task('build:js-SZDX-compile', function () {
    let buildUrl = ['./config/config_server_url.SZDX.js', './app/launcher.js', './app/router.js', './app/shared/**/*.js', './app/components/**/*.js', '!./app/components/maintain/metadataCenter/*.js'];
    return gulp.src(buildUrl)
        .pipe(plumber({
            errorHandler: notify.onError('Build js Error: <%= error.message %>')
        }))
        // .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(changed(buildUrl.toString()))
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(destConfig.buildJs));

});

//PROD环境编译压缩的js文件添加版本号输出到生成环境
gulp.task('build:js-rev', function () {
    return gulp.src(destConfig.buildJs + '/*.js')
        .pipe(rev())
        .pipe(gulp.dest(destConfig.buildJs))
        .pipe(rev.manifest({
            path: 'rev-manifest-js.json'
        }))
        .pipe(gulp.dest(destConfig.buildJson + '/rev'));
});

//PROD环境编译任务，给css文件加hash编码并生成 rev-manifest.json文件名对照映射输出到PROD生产环境
gulp.task('build:css-compile', function () {
    return gulp.src(['./src/css/**/*.css'])
        .pipe(rev())
        .pipe(gulp.dest(destConfig.buildSrc + '/css'))
        .pipe(rev.manifest({
            path: 'rev-manifest-css.json'
        }))
        .pipe(gulp.dest(destConfig.buildJson + '/rev'));
});

//PROD环境编译任务， Html替换css、js文件版本输出到PROD生产环境
gulp.task('build:html-rev', function () {
    return gulp.src(['./build/json/rev/*.json', './config/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./build'));
});

//PROD环境编译任务， 重复编译打包命令时清理加上hash码的文件
gulp.task('build:hash-file-clean', function () {
    return gulp.src(['./build/js/*', './build/json/rev/*', './build/src/css/*'])
        .pipe(clean());
});

//PROD环境编译任务，清理发布时打包的文件
gulp.task('clear-all', function () {
    return gulp.src(['./build'])
        .pipe(clean());
});

//PROD环境编译任务，清理发布时打包的文件 './build/src/libs/socket.io/*', './build/src/libs/datetimepicker/**', './build/src/libs/base64/*', './build/src/libs/jquery', './build/src/libs/lodash', './build/src/libs/md5', './build/src/libs/angular-translate','./build/src/libs/bootstrap/'
gulp.task('build:remove-empty-folder', function () {
    return gulp.src(['./build/src/libs/socket.io', './build/src/libs/datetimepicker', './build/src/libs/base64', './build/src/libs/jquery', './build/src/libs/lodash', './build/src/libs/md5', '!./build/src/libs/font-awesome',
        './build/src/libs/angular-translate', './build/src/libs/bootstrap', './build/src/libs/mqtt', './build/json/rev'])
        .pipe(clean());
});

//PROD环境编译任务，执行html、js、css打包压缩编译混淆输出到PROD生产环境
gulp.task('build:dev', function (callback) {
    runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'], 'build:hash-file-clean',
        ['build:js-dev-compile', 'build:css-compile'], ['build:js-rev'],
        'build:html-rev', callback);
});

// gulp.task('build:test', function (callback) {
//     runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'], 'build:hash-file-clean',
//         ['build:js-test-compile', 'build:css-compile'], ['build:js-rev'],
//         'build:html-rev', 'build:remove-empty-folder', callback);
// });

// gulp.task('build:prod', function (callback) {
//     runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'],
//         'build:hash-file-clean',
//         ['build:js-prod-compile', 'build:css-compile'], ['build:js-rev'],
//         'build:html-rev', 'build:remove-empty-folder', callback);
// });

// gulp.task('build:iron', function (callback) {
//     runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'],
//         'build:hash-file-clean',
//         ['build:js-iron-compile', 'build:css-compile'], ['build:js-rev'],
//         'build:html-rev', 'build:remove-empty-folder', callback);
// });

// gulp.task('build:shgx', function (callback) {
//     runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'],
//         'build:hash-file-clean',
//         ['build:js-SHGX-compile', 'build:css-compile'], ['build:js-rev'],
//         'build:html-rev', 'build:remove-empty-folder', callback);
// });

// gulp.task('build:szdx', function (callback) {
//     runSequence(['less-darkLightTheme', 'less-ironTowerTheme'], ['build:image-min-output', 'build:template-output', 'build:lib-output', 'build:json-output', 'build:i18n-output', 'build:audio-output'],
//         'build:hash-file-clean',
//         ['build:js-SZDX-compile', 'build:css-compile'], ['build:js-rev'],
//         'build:html-rev', 'build:remove-empty-folder', callback);
// });

//DEV环境编译任务，编译基础less到DEV开发环境
lesscompiler('ironTowerTheme', 'src/theme/ironTower/base', destConfig.ironTowerThemePatch);
lesscompiler('darkLightTheme', 'src/theme/darkLight/base', destConfig.darkLightThemePatch);

/*run 本地环境的配置开发模式*/
gulp.task('dev', () => {
    gulp.run(['less-darkLightTheme', 'less-ironTowerTheme', 'run-dev', 'watch'])
});