'use strict';



angular.module('aep')
    .factory('userService', ["$http", "apiUrl", ($http, apiUrl) => {
        return {

        }
    }])
    .factory('permissions', ['$rootScope', '$q', function ($rootScope, $q) {
        let permissionList;
        return {
            setPermissions: function (permissions) {
                permissionList = permissions;
                $rootScope.$broadcast('permissionsChanged')
            },
            hasPermission: function (permissions) {
                let defer = $q.defer();
                let permissionFlag = false;
                if (permissions.indexOf(",") === -1) {
                    for (let i = 0, pl = permissionList.length; i < pl; i++) {
                        if (typeof (permissionList[i]) !== 'undefined' && permissionList[i] === permissions.toUpperCase())
                            permissionFlag = true;
                    }
                } else {
                    let items = permissions.split(","), count = 0;
                    for (let i = 0, pl = permissionList.length; i < pl; i++) {
                        if (typeof (permissionList[i]) !== 'undefined') {
                            for (let j = 0; j < items.length; j++) {
                                if (typeof (permissionList[i]) !== 'undefined' && permissionList[i] === items[j].toUpperCase()) {
                                    count++;
                                }
                            }
                        }
                    }
                    if (count === items.length) {
                        permissionFlag = true;
                    }
                }
                if (!permissionFlag)
                    defer.reject();
                else
                    defer.resolve();
                return defer.promise;
            }
        }
    }])
    .factory('destroyCache', ['$cookies', 'appSettings', '$translate', function ($cookies, appSettings, $translate) {
        return {
            clearCache: function () {
                let cookiesObj = $cookies.getAll();
                _.forEach(cookiesObj, function (value, key) {
                    $cookies.remove(key);
                });
                localStorage.clear();
            }
        }
    }])
    .factory('optionService', [function () {
        return {
            convertURL: (url) => {
                let timestamp = Number(new Date());
                if (url.indexOf("?") >= 0) {
                    url = url + "&timestamp=" + timestamp;
                } else {
                    url = url + "?timestamp=" + timestamp;
                }
                return url;
            },
            checkNetworkStatus: () => {
                let isOnline = true, isAjaxOnline = true;
                let EventUtil = {
                    addHandler: function (element, type, handler) {

                        if (element.addEventListener) {

                            element.addEventListener(type, handler, false);

                        } else if (element.attachEvent) {

                            element.attachEvent("on" + type, handler);

                        } else {

                            element["on" + type] = handler;

                        }

                    }
                };

                EventUtil.addHandler(window, "offline", function () {
                    isOnline = false;
                });

                (function () {
                    function getImgError() {
                        isAjaxOnline = false;
                    }

                    let timestamp = Number(new Date());
                    let url = 'https://www.baidu.com/img/bd_logo1.png?' + timestamp,
                        content = `<img class="img-hidden" src="${url}" style="display: none;" onerror="getImgError()"/>`;

                    $(document).ready(function () {
                        let existent = $(body).find(".img-hidden");
                        if (existent.length === 0) {
                            $("body").append(content);
                        }
                    })
                })();

                if (!isOnline && !isAjaxOnline) {
                    let info = {
                        title: '网络异常',
                        content: $translate.instant('NETWORK_STATUS_CHECK')
                    };
                    return $.misAlert(info);
                }
            },
            findObjectDiff: (original, update) => {
                let diff = {};
                if (Object.keys(original).length === Object.keys(update).length) {
                    for (let key in original) {
                        if (original[key] !== update[key] && !_.isNil(update[key])) {
                            diff[key] = update[key];
                        }
                    }
                } else {
                    console.info("Object length not equal!");
                }
                return diff;
            },
            isObject: (str) => {
                if (typeof str === 'string') {
                    try {
                        let obj = JSON.parse(str);
                        if (obj) {
                            return Object.prototype.toString.call(obj) === '[object Object]';
                        }
                    } catch (e) {
                        return false;
                    }
                }
            }
        }
    }])
    .factory('authorizeInterceptor', ['$rootScope', '$q', '$cookies', '$translate', 'appSettings', '$injector', 'destroyCache', 'optionService',
        function ($rootScope, $q, $cookies, $translate, appSettings, $injector, destroyCache, optionService) {
            let info = {
                title: "提示信息",
                content: $translate.instant('MSG_10001')
            };
            
            return {
                request: function (config) {
                    if (config.method === 'GET' && config.url !== '') {
                        if (config.url.indexOf(".css") === -1 && config.url.indexOf(".js") === -1 && config.url.indexOf(".html") === -1 && config.url.indexOf(".json") === -1 && config.url.indexOf("ui-grid") === -1 && config.url.indexOf(".woff2?v=4.7.0") === -1 && config.url.indexOf(".woff") === -1) {
                            config.url = optionService.convertURL(config.url);
                        }
                        config.transformRequest = function (obj) {
                            let str = [];
                            for (let p in obj) {
                                str.push(encodeURIComponent(p) + "-" + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }
                    config.url = encodeURI(config.url);
                    config.headers = config.headers || {};
                    config.headers['Authentication-Timestamp'] = (new Date().toJSON());
                    // let authentication = $cookies.get(appSettings.token);
                    let authentication = $cookies.get(appSettings.uuid);
                    
                    if (authentication !== undefined) {
                        let reg = new RegExp('"',"g");  
                        let newStr = authentication.replace(reg, "");
                        config.headers["uuid"] = newStr;
                        config.headers["X-Token"] = newStr;
                    }
                    return config;
                },
                requestError: function (err) {
                    $.misMsg($translate.instant('MSG_30009'));
                    return $q.reject(err);
                },
                response: function (config) {
                    let state = $injector.get('$state');
                    if(config.data.resultStatus!==undefined){
                        if(config.data.resultStatus.resultCode==="0009"){
                            state.go('login');
                            $.misMsg("登录失效，请重新登录！");
                        }
                    }
                    
                    config.headers = config.headers || {};
                    return config;
                },
                responseError: function (rejection) {
                    let state = $injector.get('$state');
                    switch (rejection.status) {
                        // case -1:
                        //     if (state.current.name !== 'newLogin') {
                        //         state.go('newLogin');
                        //         $.misMsg("登录失效，请重新登录！");
                        //     }
                        case 300:
                            // $.misMsg($translate.instant('MSG_30000'));
                            break;
                        case 301:
                            destroyCache.clearCache();
                            if (state.current.name !== 'login') {
                                if (state.current.name === 'registerJump') {
                                    state.go('login', {msg: $translate.instant('MSG_30007')});
                                } else {
                                    state.go('login', {msg: $translate.instant('MSG_30001')});
                                }
                            }
                            break;
                        case 302:
                            $.misMsg($translate.instant('MSG_30002'));
                            break;
                        case 303:
                            $.misMsg($translate.instant('MSG_30003'));
                            break;
                        case 305:
                            $.misMsg($translate.instant('MSG_30005'));
                            break;
                        case 306:
                            destroyCache.clearCache();
                            if (state.current.name !== 'login') {
                                state.go('login', {msg: $translate.instant('MSG_30006')});
                            } else {
                                state.reload('login', {msg: $translate.instant('MSG_30006')});
                            }
                            break;
                        case 400:
                            if (rejection.config.extendedData && rejection.config.extendedData.errorInfo) {
                                rejection.data.errMessage = rejection.config.extendedData.errorInfo.get(rejection.status);
                            } else {
                                info.content = $translate.instant('MSG_30400');
                                $.misAlert(info);
                            }
                            break;
                        case 401:
                            destroyCache.clearCache();
                            if (state.current.name !== 'login') {
                                if (state.current.name === 'registerJump') {
                                    state.go('login', {msg: $translate.instant('MSG_30007')});
                                } else {
                                    state.go('login', {msg: $translate.instant('MSG_30001')});
                                }
                            }
                            break;
                        case 403:
                            info.content = $translate.instant('MSG_30403');
                            $.misAlert(info);
                            break;
                        case 404:
                            if (rejection.config.extendedData && !rejection.config.extendedData.isAlert) {
                                return $q.reject(rejection);
                            } else {
                                info.content = $translate.instant('MSG_30404');
                                $.misAlert(info);
                            }
                            break;
                        case 406:
                            info.content = $translate.instant('MSG_30406');
                            $.misAlert(info);
                            break;
                        case 409:
                            if (rejection.config.extendedData && rejection.config.extendedData.errorInfo) {
                                rejection.data.errMessage = rejection.config.extendedData.errorInfo.get(rejection.status);
                            } else {
                                info.content = $translate.instant('MSG_30409');
                                $.misAlert(info);
                            }
                            break;
                        case 415:
                            info.content = $translate.instant('MSG_30415');
                            $.misAlert(info);
                            break;
                        case 500:
                            info.content = $translate.instant('MSG_30500');
                            $.misAlert(info);
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }])
    .service('comService', ['$q', '$http', '$cookies', '$state', '$translate', 'destroyCache', function ($q, $http, $cookies, $state, $translate, destroyCache) {
        this.checkPrentTree = function (mappedArr, obj) {
            var tag = false;
            for (var i = 0; i < mappedArr.length; i++) {
                if ((mappedArr[i]._id === obj.parentId && mappedArr[i]._id !== obj._id) || obj.parentId === '') {
                    tag = true;
                    break;
                }
            }
            if (!tag) {
                return obj._id;
            } else {
                return '';
            }
        };
        this.deleteobj = function (mappedArr, tem) {
            if (tem.length === 0) {
                return;
            }
            for (var i = 0; i < mappedArr.length; i++) {
                for (var j = 0; j < tem.length; j++) {
                    if (mappedArr[i]._id === tem[j]) {
                        mappedArr.splice(i, 1);
                        i -= 1;
                        break;
                    }
                }
            }
        };
        this.checkTree = function (mappedArr) {
            var tempObj = mappedArr;
            var tem = [];
            for (var i = 0; i < tempObj.length; i++) {
                if ('parentId' in tempObj[i]) {
                    var value = this.checkPrentTree(mappedArr, tempObj[i]);
                    if (value !== '') {
                        tem.push(value);
                    }
                }
            }
            //剔除不合法对象
            this.deleteobj(mappedArr, tem);

        };
        this.convertTreeData = function (arr) {
            //校验树的正确性
            this.checkTree(arr);
            let tree = [],
                mappedArr = {},
                arrElem,
                mappedElem;
            for (let i = 0, len = arr.length; i < len; i++) {
                arrElem = arr[i];
                mappedArr[arrElem._id] = arrElem;
                mappedArr[arrElem._id]['children'] = [];
            }
            for (let _id in mappedArr) {
                if (mappedArr.hasOwnProperty(_id)) {
                    mappedElem = mappedArr[_id];
                    if (mappedElem.parentId && mappedElem.parentId !== '') {
                        mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
                    }
                    else {
                        tree.push(mappedElem);
                    }
                }
            }
            for (let i = 0; i < tree.length; i++) {
                for (let j = i + 1; j < tree.length; j++) {
                    if (Number(tree[i].sourceNum) > Number(tree[j].sourceNum)) {
                        let tmp = tree[i];
                        tree[i] = tree[j];
                        tree[j] = tmp;
                    }
                }
            }
            return tree;
        };
        this.getTreeNode = function (arr, nodeId) {
            let parentNode = null, node = null, parentNodeArr = [];
            //1.第一层 root 深度遍历整个JSON
            for (let i = 0; i < arr.length; i++) {
                if (node) {
                    break;
                }
                let obj = arr[i];
                //没有就下一个
                if (!obj || !obj._id) {
                    continue;
                }
                //2.有节点就开始找，一直递归下去
                if (obj._id === nodeId) {
                    //找到了与nodeId匹配的节点，结束递归
                    node = obj;
                    break;
                } else {
                    //3.如果有子节点就开始找
                    if (obj.children && obj.children.length > 0) {
                        //4.递归前，记录当前节点，作为parent 父亲
                        parentNode = obj;
                        //递归往下找
                        this.getTreeNode(obj.children, nodeId);
                    } else {
                        //跳出当前递归，返回上层递归
                        continue;
                    }
                }
            }

            //5.如果木有找到父节点，置为null，因为没有父亲
            if (!node) {
                parentNode = null;
            }

            if (parentNode !== null) {
                parentNodeArr.push(parentNode);
            }

            //6.返回结果obj
            return {
                parentNodeArr: parentNodeArr,
                node: node
            };
        };
        this.getAllNodeByTreeNode = function (arr, nodeId) {
            let nodeArr = [];
            for (let i = 0, len = arr.length; i < len; i++) {
                let obj = arr[i];
                if (obj.parentId === nodeId) {
                    nodeArr.push(obj._id);
                    let org = this.getAllNodeByTreeNode(arr, obj._id);
                    if (org !== null && org.length > 0) {
                        nodeArr = nodeArr.concat(org);
                    }
                }
            }
            return nodeArr;
        };
        //获取时间段2个日期之间的日期列表 wangyu 2016-7-1
        this.getRangeDateList = function (start, end) {

            function getDate(dateStr) {
                let tempDate = new Date();
                let list = dateStr.split("-");
                tempDate.setFullYear(list[0]);
                tempDate.setMonth(list[1] - 1);
                tempDate.setDate(list[2]);
                return tempDate;
            }


            if (start === end) {
                let dateLists = [start];
            } else {
                let startTime = getDate(start);

                let endTime = getDate(end);

                if (startTime > endTime) {

                    let tempDate = startTime;

                    startTime = endTime;

                    endTime = tempDate;

                }

                startTime.setDate(startTime.getDate() + 1);

                var dateLists = [start], id = 1;

                while (!(startTime.getFullYear() === endTime.getFullYear() && startTime.getMonth() === endTime.getMonth() && startTime.getDate() === endTime.getDate())) {

                    dateLists[id] = startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + startTime.getDate();

                    id++;

                    startTime.setDate(startTime.getDate() + 1);
                }

                dateLists[dateLists.length] = end;

                for (let i = 0; i < dateLists.length; i++) {
                    let temp = dateLists[i].split("-");
                    dateLists[i] = new Date(temp[0], temp[1] - 1, temp[2]);
                    dateLists[i] = dateLists[i].Format("yyyy-MM-dd");
                }
            }

            return dateLists;
        };
    }])
    .service('userPrivilegeService', ['$q', '$http', '$cookies', '$state', '$translate', 'userService', 'appSettings', 'destroyCache', function ($q, $http, $cookies, $state, $translate, userService, appSettings, destroyCache) {
        let deferred = null, loading = false, permissionList = null;
        this.logout = function () {
            let info = {
                title: $translate.instant('TOP_LINK_LOGOUT'),
                content: $translate.instant('TOP_INFO_LOGOUT')
            };
            $.misConfirm(info, function () {
                let token = $cookies.get(appSettings.token),
                    flag = $state.current.name === 'portal',
                    serviceSideBar = localStorage.getItem('serviceSideBar');
                userService.userLogout(token).then(function (res) {
                    if (res.data.resultStatus.resultCode === "0000") {
                        destroyCache.clearCache();
                        if (flag) {
                            $state.reload();
                        }
                        else {
                            if (serviceSideBar === 'loc') {
                                $state.go('locman_login');
                            } else {
                                $state.go('login');
                            }
                        }
                    } else {
                        $.misMsg($translate.instant('TOP_INFO_LOGOUT_ERROR'));
                    }
                });
            });
        };
        this.getButtonPrivilegeList = function (reload, errorHandle) {
            if (loading)
                return deferred.promise;
            deferred = $q.defer();
            if ((reload || permissionList === null) && !loading) {
                loading = true;
                let requestParam = {
                    roleId: $cookies.get(appSettings.roleId),
                    menuId: $cookies.get(appSettings.menuId)
                };
                userService.getButtonPrivilegeList(requestParam).then(function (res) {
                    permissionList = res.data.value || [];
                    permissionList = permissionList.filter(function (v) {
                        return v !== '';
                    });
                    permissionList = _.uniq(permissionList);
                    deferred.resolve(permissionList);
                }, function (res) {
                    deferred.reject(res);
                }).finally(function () {
                    loading = false;
                });
            } else
                deferred.resolve(permissionList);
            return deferred.promise;
        };
        this.hasPermission = function (permissions) {
            let defer = $q.defer();
            this.getButtonPrivilegeList(true).then(function (res) {
                let permissionFlag = false, permissionList = res;
                if (permissions.indexOf(",") === -1) {
                    for (let i = 0, pl = permissionList.length; i < pl; i++) {
                        if (typeof (permissionList[i]) !== 'undefined' && permissionList[i] === permissions.toUpperCase())
                            permissionFlag = true;
                    }
                } else {
                    let items = permissions.split(","), count = 0;
                    for (let i = 0, pl = permissionList.length; i < pl; i++) {
                        if (typeof (permissionList[i]) !== 'undefined') {
                            for (let j = 0; j < items.length; j++) {
                                if (typeof (permissionList[i]) !== 'undefined' && items[j].toUpperCase() === permissionList[i]) {
                                    count++;
                                }
                            }
                        }
                    }
                    if (count === items.length) {
                        permissionFlag = true;
                    }
                }
                if (!permissionFlag)
                    defer.reject();
                else
                    defer.resolve();

            });
            return defer.promise;
        }
    }])
    .service('dateCalculateService', ['$q', function ($q) {
        this.getRangeDateList = function (start, end) {
            function getDate(dateStr) {
                let tempDate = new Date();
                let list = dateStr.split("-");
                tempDate.setFullYear(list[0]);
                tempDate.setMonth(list[1] - 1);
                tempDate.setDate(list[2]);
                return tempDate;
            }

            let dateLists;
            if (start === end) {
                dateLists = [start];
            } else {
                let startTime = getDate(start);
                let endTime = getDate(end);
                if (startTime > endTime) {
                    let tempDate = startTime;
                    startTime = endTime;
                    endTime = tempDate;
                }
                startTime.setDate(startTime.getDate() + 1);
                dateLists = [start];
                let id = 1;
                while (!(startTime.getFullYear() === endTime.getFullYear() && startTime.getMonth() === endTime.getMonth() && startTime.getDate() === endTime.getDate())) {
                    dateLists[id] = startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + startTime.getDate();
                    id++;
                    startTime.setDate(startTime.getDate() + 1);
                }
                dateLists[dateLists.length] = end;
                for (let i = 0; i < dateLists.length; i++) {
                    let temp = dateLists[i].split("-");
                    dateLists[i] = new Date(temp[0], temp[1] - 1, temp[2]);
                    dateLists[i] = dateLists[i].Format("yyyy-MM-dd");
                }
            }
            return dateLists;
        };
    }])
    .service('browserVersionService', function () {
        this.getBrowserBoolean = function () {

            let isBrowserVersion = true;

            function subStrToNumber(val) {
                let n;

                n = val.substring(0, 2);

                n = parseInt(n);

                return n;
            }

            function getBrowserVersion() {
                let Sys = {}, ua = navigator.userAgent.toLowerCase(), s, v = {
                    name: "",
                    version: ""
                };

                (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


                if (Sys.ie) {
                    v.name = "ie";
                    v.version = subStrToNumber(Sys.ie);
                }

                if (Sys.firefox) {
                    v.name = "firefox";
                    v.version = subStrToNumber(Sys.firefox);
                }

                if (Sys.chrome) {
                    if (Sys.chrome === "46.0.2486.0") {
                        v.name = "edge";
                    } else {
                        v.name = "chrome"
                    }
                    v.version = subStrToNumber(Sys.chrome);
                }

                if (Sys.safari) {
                    v.name = "safari";
                    v.version = subStrToNumber(Sys.safari);
                }

                if (Sys.opera) {
                    v.name = "opera";
                    v.version = subStrToNumber(Sys.opera);
                }

                return v;
            }

            let obj = getBrowserVersion();

            if (obj.name === "ie") {
                if (obj.version < 10) {
                    isBrowserVersion = false;
                }
            }
            return isBrowserVersion;
        }
    });
