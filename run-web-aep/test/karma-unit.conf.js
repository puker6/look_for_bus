// Karma configuration
// Generated on Tue Sep 04 2018 16:03:16 GMT+0800 (中国标准时间)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'src/libs/jquery/jquery-3.1.1.min.js', watched: false},
            {pattern: 'src/libs/angular/angular.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-animate.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-route.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-cookies.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-mocks.js', watched: false},
            {pattern: 'src/libs/angular/angular-messages.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-locale_zh.js', watched: false},
            {pattern: 'src/libs/angular-translate/angular-translate.js', watched: false},
            {pattern: 'src/libs/angular-translate/angular-translate-loader-static-files.js', watched: false},
            {pattern: 'src/libs/angular-ui/angular-ui-router.min.js',watched: false},
            {pattern: 'src/libs/angular-ui/ui-bootstrap-tpls-2.5.0.min.js', watched: false},
            {pattern: 'src/libs/angular-ui/ui-grid.min.js', watched: false},
            {pattern: 'src/libs/angular-ui/ui-switch.min.js', watched: false},
            {pattern: 'src/libs/angular/angular-tree-control.min.js', watched: false},
            {pattern: 'src/libs/angular-scroll/jquery.nanoscroller.min.js', watched: false},
            {pattern: 'src/libs/angular-scroll/scrollable.js',watched: false},
            {pattern: 'src/libs/lodash/lodash.min.js', watched: false},
            {pattern: 'src/libs/md5/spark-md5.min.js', watched: false},
            {pattern: 'src/libs/image-compress/lrz.all.bundle.js', included: false},
            {pattern: 'src/libs/baidu/echarts.js', included: false},
            {pattern: 'src/libs/datetimepicker/jquery.datetimepicker.full.min.js', included: false},
            {pattern: 'app/views/**/*.html',watched: false},
            {pattern: 'src/css/*', included: false},
            {pattern: 'i18n/*.json', watched: false},
            {pattern: 'app/launcher.js', included: true},
            {pattern: 'app/router.js', included: true},
            {pattern: 'app/shared/**/*.js', included: true},
            {pattern: 'app/components/**/*.js', included: true},
            // {pattern: 'app/components/**/**/*.js', included: true},
            {pattern: 'test/unit/*Spec.js', included: true},
            // {pattern: 'test/e2e/*Spec.js'},
        ],


        // list of files / patterns to exclude
        exclude: [
            'src/images/*',
            'src/theme/**/*',
            'build/start/index.html',
            'app/mocks/*',
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/*.js': ['coverage'],
            'app/shared/**/*.js':['coverage'],
            'app/components/**/*.js':['coverage'],
            'app/views/**/*.html': ['ng-html2js']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir:  'coverage/',
            file: 'coverage.html'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress','coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'/*, 'Firefox', 'Safari', 'IE'*/],

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-ng-html2js-preprocessor'
        ],

        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};
