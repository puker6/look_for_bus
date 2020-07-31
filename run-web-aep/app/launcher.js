

'use strict';

if (config.schemaVersion !== 'prod') loadThemeCss(config.themeConfig);

angular.module('aep.portal', []);
angular.module('aep.login', []);
angular.module('aep.register', []);
angular.module('aep.layout', []);
angular.module('aep.error', []);

const 
    deviceModule = angular.module('aep.device', []),
    mainModule = angular.module('aep.main', ['aep.device']),
    
    dashboardModule = angular.module('aep.dashboard', []),
    businessModule = angular.module('aep.business', []),
    logisticsModule = angular.module('aep.logistics', []),
    officeModule = angular.module('aep.office', []),
    financeModule = angular.module('aep.finance', []),
    statisticModule = angular.module('aep.statistic', []),
    systemCenterModule = angular.module('aep.systemCenter', []),
    
    locManModule = angular.module('aep.locMan', ['treeControl', 'aep.dashboard', 'aep.systemCenter','aep.business','aep.logistics','aep.office', 'aep.finance', 'aep.statistic']),
    maintainModule = angular.module('aep.maintain', []);

angular.module('aep.access', []);

angular
    .module('aep', ['ngRoute', 'ngCookies', 'ui.router', 'ngAnimate', 'ngMessages', 'sun.scrollable', 'pascalprecht.translate', 'ui.bootstrap', 'monospaced.qrcode', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.autoResize', 'aep.portal', 'aep.login', 'aep.register', 'aep.layout', 'aep.error', 'aep.main', 'aep.locMan', 'aep.access'])
    .config(aepAppConfig)
    .run(aepAppRun)
    .constant('appSettings', {
        userMsg: 'aep_userMsg',
        uuid: 'aep_uuid',
        // userId: 'aep_userId',
        // roleId: 'aep_roleId',
        // menuId: 'aep_menuId',
        // organizationId: 'aep_organizationId',
        // organizationName: 'aep_organizationName',
        // accessSecret: 'aep_accessSecret',
        // accessPermission: 'aep_accessPermission',
        // point: 'aep_accessPoint',
        // mixName: 'AEP_MIX_NAME',
        // statusTypes: [{name: '已绑定', value: 'bound'}, {name: '未绑定', value: 'unbound'}],
        // manageStateArr: [{stateName: '已启用', stateValue: 'enable'}, {stateName: '已停用', stateValue: 'disable'}],
        // protocolTypes: [{name: '--请选择协议--', value: ''}, {name: 'MQTT', value: 'MQTT'}, {
        //     name: 'HTTP',
        //     value: 'HTTP'
        // }, {name: '其他', value: 'OTHER'}],
        pageSizes: [{name: '10 条/页', value: 10}, {name: '20 条/页', value: 20}, {
            name: '40 条/页',
            value: 40
        }, {name: '80 条/页', value: 80}]
    })
    .constant('apiUrl', {
        environment: config.environment,
    });

aepAppConfig.$inject = ['$locationProvider', '$httpProvider', '$provide', '$translateProvider'];

aepAppRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', '$cookies', '$translate', 'appSettings', 'permissions', 'userPrivilegeService', 'optionService'];

function loadThemeCss(themeConfig) {
    let cssTag = document.getElementById('loadCss');
    let head = document.getElementsByTagName('head').item(0);
    if (cssTag) head.removeChild(cssTag);
    let css = document.createElement('link');
    css.href = "src/css/" + themeConfig + "/base.css";
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.id = 'loadCss';
    head.appendChild(css);
}

function aepAppConfig($locationProvider, $httpProvider, $provide, $translateProvider) {
    $provide.decorator('$httpBackend', ['$delegate', ($delegate) => {
        return function () {
            let headers = arguments[4];
            let contentType = (headers !== null ? headers['X-Force-Content-Type'] : void 0);
            if (contentType !== null && headers['Content-Type'] === null) {
                headers['Content-Type'] = contentType;
            }
            return $delegate.apply(null, arguments);
        }
    }]);

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
    $translateProvider.useStaticFilesLoader({
        prefix: './i18n/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('CN');
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    $httpProvider.defaults.headers.common = {'Content-Type': 'application/json;charset=utf-8'};
    $httpProvider.interceptors.push('authorizeInterceptor');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $provide.decorator('GridOptions', ['$delegate', 'i18nService', ($delegate, i18nService) => {
            let gridOptions;
            gridOptions = angular.copy($delegate);
            gridOptions.initialize = function (options) {
                let initOptions;
                initOptions = $delegate.initialize(options);
                return initOptions;
            };
            i18nService.setCurrentLang('zh-cn');
            return gridOptions;
        }]
    );
}

function aepAppRun($rootScope, $state, $stateParams, $window, $cookies, $translate, appSettings, permissions, userPrivilegeService, optionService) {
    // for debug route
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //     if (toState.name !== 'login' && toState.name !== 'newLogin' && toState.name !== 'register' && toState.name !== 'registerJump' && toState.name !== 'portal' && toState.name !== 'forgetPassword' && toState.name !== 'forgetPasswordJump' && toState.name !== 'terms'&& toState.name !== 'iron_login_jump') {
    //         let appToken = $cookies.get(appSettings.token);
    //         if (appToken === undefined) {
    //             // return to login page
    //             event.preventDefault();
    //             if (fromState.name) {
    //                 $cookies.remove(appSettings.token);
    //                 $state.go('login', {
    //                     msg: $translate.instant('MSG_30001')
    //                 });
    //             } else {
    //                 $state.go('login', {
    //                     msg: ''
    //                 });
    //             }
    //         }
    //     }
    // });
    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        // solve the problem that scorller won't back to top when state changed.
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        // if (fromState.name === 'aep.access.device_details' && toState.name !== 'aep.access.device_details') {
        //     if (angular.fromJson(localStorage.getItem('deviceShadow'))) {
        //         localStorage.removeItem('deviceShadow');
        //     }
        // }
        // 初始化加载时检测客户端网络是否在线
        // optionService.checkNetworkStatus();
    });

}