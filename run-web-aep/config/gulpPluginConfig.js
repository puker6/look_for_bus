/**
 * Created by w-rain on 2018/10/29.
 */

/*gulp-htmlmin 压缩 html*/
exports.htmlmin = {
    removeComments: true,
    collapseWhitespace: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
};

/*gulp-autoprefixer 添加浏览器前缀*/
exports.autofix = {
    browsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4',
        'bb >= 10'
    ],
    cascade: true,
    remove: true
};

/*gulp-clean-css 压缩 css*/
exports.cleanCSS = {
    compatibility: 'ie8',
    keepSpecialComments: '*',
    advanced: true
};

/*gulp-uglify 压缩 js*/
exports.uglify = {
    mangle: {
        except: ['require', 'exports', 'module', '$']
    }
};