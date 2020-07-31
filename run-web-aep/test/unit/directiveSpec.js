'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-5 16:20:47
 * @description      common directive test
 * @jasmine
 * @param {Function} describe - 声明语法.
 * @param {Function} beforeEach - 在describe函数中每个Spec执行之前执行.
 * @param {Function} beforeAll - 在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 */

describe('Unit Test: Directives', () => {

    beforeEach(inject.strictDi());

    beforeEach(module('aep'));

    // beforeEach(module('ngMock'));

    beforeEach(module('ngMockE2E'));

    describe('misPagination', () => {

        let elm, scope, $httpBackend, $http,
            localeData = {
                "data": {
                    "MSG_10000": "由于您长时间没有活动，系统已将您的登录凭证强行注销，请重新登录！",
                    "MSG_10001": "网络错误,请刷新重试！",
                    "MSG_10002": "很抱歉，没有查询到符合条件的记录！",
                    "MSG_10003": "开始时间不能大于结束时间！",
                    "MSG_20000": "设备创建成功！",
                    "MSG_20001": "设备创建失败，请刷新重试！",
                    "MSG_20002": "创建数据点成功！",
                    "MSG_20003": "编辑数据点成功！",
                    "MSG_20004": "请输入正确的属性值！",
                    "MSG_20005": "属性值位数不正确！",
                    "MSG_20006": "创建产品成功！",
                    "MSG_20007": "编辑产品成功！",
                    "MSG_20008": "创建子设备成功！",
                    "MSG_20009": "创建子设备失败！",
                    "MSG_20010": "编辑子设备成功！",
                    "MSG_20011": "编辑子设备失败！",
                    "MSG_20400": "请求参数：网关ID、设备名称、设备编号或设备描述不合法！",
                    "MSG_20409": "由于您的设备没有上报过数据或者版本号低于初始版本号，导致无法下发数据！",
                    "MSG_30000": "由于您的黑白名单API调用失败，发生了未预料的异常！",
                    "MSG_30001": "由于您长时间没有活动，登录凭证已过期，系统已将您的登录凭证强行注销，请重新登录！",
                    "MSG_30002": "由于您的应用权限验证失败，发生了未预料的异常！",
                    "MSG_30003": "由于您的网关错误，发生了未预料的异常！",
                    "MSG_30005": "由于您的当前的接口权限验证失败，发生了未预料的异常！",
                    "MSG_30006": "由于您的账号异常(被停用或被删除)，系统已将您的登录凭证强行注销，请重新登录！",
                    "MSG_30007": "激活失败，请联系管理员！",
                    "MSG_30008": "由于查询到您没有登录，无法获取相应的权限操作，请您正常登录！",
                    "MSG_30009": "请检查您的网络连接情况，刷新重试！",
                    "MSG_30400": "请求参数有误,请先检查写入数据，稍后再试！",
                    "MSG_30401": "当前请求需要用户验证，稍后再试！",
                    "MSG_30403": "请求被拒,请您稍后再试！",
                    "MSG_30404": "请求失败, 没有找到相关资源，请稍后再试！",
                    "MSG_30406": "请求的资源的内容特性无法满足请求头中的条件,请稍后再试！",
                    "MSG_30409": "由于和被请求的资源的当前状态之间存在冲突，请求无法完成，请检查写入，稍后再试！",
                    "MSG_30415": "对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝！",
                    "MSG_30500": "服务内部错误，请稍后再试！",
                    "MSG_40000": "没有查询到设施类型！",
                    "MSG_40001": "查询设施类型失败！",
                    "MSG_40002": "告警列表加载失败，请刷新重试！",
                    "MSG_40003": "查询命令类型失败！",
                    "MSG_40004": "没有查询到工单类型！",
                    "MSG_40005": "查询工单类型失败！",
                    "MSG_40006": "没有查询到问题类型！",
                    "MSG_40007": "查询问题类型失败！",
                    "MSG_40008": "工单处理成功！",
                    "MSG_40009": "工单处理失败！",
                    "MSG_40010": "无法修复工单处理成功！",
                    "MSG_40011": "无法修复工单处理失败！",
                    "MSG_40012": "审批成功！",
                    "MSG_40013": "审批失败！",
                    "MSG_40014": "查询设备类型失败!",
                    "MSG_40015": "没有查询到设备类型！",
                    "MSG_40016": "远程命令成功！",
                    "MSG_40017": "远程命令失败！",
                    "MSG_40018": "单张图片不能超过10M!",
                    "MSG_40019": "上传图片数量超过最大限制（5张）！",
                    "MSG_40020": "上传图片失败！",
                    "MSG_40021": "接收告警工单成功！",
                    "MSG_40022": "接收告警工单失败，请确认是否有权限！",
                    "MSG_40023": "查询应用类型失败！",
                    "MSG_40024": "没有查询到应用类型！",
                    "MSG_40025": "查询资源类型失败！",
                    "MSG_40026": "没有查询到资源类型！",
                    "MSG_40027": "未查到对应应用使用方或者应用使用方已停用！",
                    "MSG_40028": "单张图片不能超过300KB！",
                    "MSG_40029": "删除产品成功！",
                    "MSG_40030": "删除网关成功！",
                    "MSG_40031": "删除网关子设备成功！",
                    "MSG_40032": "删除应用成功！",
                    "MSG_40033": "创建应用钥匙成功！",
                    "MSG_40034": "编辑应用钥匙成功！",
                    "MSG_40035": "删除应用钥匙成功！",
                    "MSG_40036": "更改设备控制权限成功！",
                    "MSG_40037": "更改网关控制权限成功！",
                    "MSG_40038": "绑定设备到应用钥匙成功！",
                    "MSG_40039": "绑定网关到应用钥匙成功！",
                    "MSG_40040": "绑除设备成功！",
                    "MSG_40041": "绑除网关成功！",
                    "MSG_40042": "创建设备成功！",
                    "MSG_40043": "创建设备失败，请稍后重试！",
                    "MSG_40044": "编辑设备成功！",
                    "MSG_40045": "编辑设备失败，请稍后重试！",
                    "MSG_40046": "创建应用成功！",
                    "MSG_40047": "编辑应用成功！",


                    "MSG_MODAL_title": "提示信息",
                    "MSG_CONFIRM_DELETE_IMG": "确定删除该图片？",
                    "MSG_CONFIRM_APPROVE_PASS": "确定同意工单申请？",
                    "SELECT_FACILITY_DEFAULT_OPTION": "--请选择设施类型--",
                    "SELECT_DEVICE_DEFAULT_OPTION": "--请选择设备类型--",
                    "SELECT_FLOW_STATE_DEFAULT_OPTION": "--请选择流程状态--",
                    "SELECT_COMMAND_DEFAULT_OPTION": "--请选择命令类型--",
                    "SELECT_ORDER_DEFAULT_OPTION": "--请选择工单类型--",
                    "SELECT_QUESTION_DEFAULT_OPTION": "--请选择问题类型--",
                    "SELECT_BIND_STATE_DEFAULT_OPTION": "--请选择绑定状态--",
                    "SELECT_ACCESS_TYPE_DEFAULT_OPTION": "--请选择应用类型--",
                    "SELECT_ACCESS_SOURCE_DEFAULT_OPTION": "--请选择资源类型--",
                    "SELECT_ACCESS_DEFAULT_OPTION": "--请选择应用--",
                    "SELECT_PEOPLE_DEFAULT_OPTION": "--请选择人员类型--",
                    "SELECT_SMS_DEFAULT_OPTION": "--请选择是否接收短信--",

                    "LGN_BTN_LOGIN": "登录",
                    "LGN_INPUT_USERNAME": "邮箱/用户名",
                    "LGN_INPUT_PASSWORD": "密码",
                    "LGN_LINK_REGISTER": "立即注册",
                    "LGN_LINK_FORGOT_PASSWORD": "忘记密码？",
                    "LGN_TYPE_PERSON": "个人",
                    "LGN_TYPE_COMPANY": "企业",
                    "LFN_FOOTER_COPYRIGHT": "Copyright © 2018 成都四方信息技术有限公司 | 版权所有",

                    "FG_LINK_FORGET_PASSWORD": "忘记密码",
                    "FG_FIND_EMAIL": "通过邮箱找回",
                    "FG_FIND_TELEPHONE": "通过手机+帐号找回",
                    "FG_VERIFY_USERNAME_INFO": "请输入正确的邮箱地址/手机号",
                    "FG_CAPTCHA_INFO": "请输入验证码",
                    "FG_BTN_RESEND": "重新发送",
                    "FG_BTN_BACK": "返回上一步",
                    "FG_VERIFY_PASSWORD_INFO": "请输入不低于6位数密码(只能为英文和数字)",
                    "FG_VERIFY_PASSWORD": "请再次输入密码",
                    "FG_SETTING_NEW_PASSWORD": "设置新密码",

                    "REG_BTN_REGISTER": "注册",
                    "REG_VERIFY_EMAIL": "请输入正确的邮箱地址（必填）",
                    "REG_TITLE_USERNAME": "用户名",
                    "REG_TITLE_PASSWORD": "设置密码",
                    "REG_TITLE_CONFIRM_PASSWORD": "确认密码",
                    "REG_TOOLTIP_PASSWORD": "英文字母和数字，长度6-30位（必填）",
                    "REG_TOOLTIP_CONFIRM_PASSWORD": "请再次输入密码（必填）",
                    "REG_BTN_AGREE": "同意",
                    "REG_LINK_TERM": "《IoT-AEP平台服务条款》",
                    "REG_INFO_REGISTER_SUCCESS": "恭喜您，注册成功！",

                    "ACTION_BTN_PREVIOUS": "上一步",
                    "ACTION_BTN_NEXT": "下一步",
                    "ACTION_BTN_COMPLETE": "完成",

                    "NETWORK_STATUS_CHECK": "当前您的网络状态异常，离线或脱机工作，请先检查网络情况，刷新重试！",
                    "BROWSER_VERSION_CHECK": "为了带给您良好的用户体验，强烈建议您使用火狐浏览器、谷歌浏览器、IE 10及以上版本浏览器访问本平台！",
                    "OPTION_SELECT_CHECK": "您单次操作最大数量限制为1000条，请您确认选择条数之后再操作？",

                    "TOP_LOGO_TITLE": "AEP-使能平台",
                    "TOP_LINK_MANAGE": "管理控制台",
                    "TOP_LINK_HOMEPAGE": "AEP首页",
                    "TOP_PERSONAL_TITLE": "点击进入个人中心",
                    "TOP_LINK_LOGOUT": "注销",
                    "TOP_INFO_LOGOUT": "您确定注销账号并退出登录？",
                    "TOP_INFO_LOGOUT_ERROR": "注销账号并退出登录失败，请刷新重试！",
                    "TOP_NAV_HOME": "首页",
                    "TOP_NAV_SOLUTION": "解决方案",
                    "TOP_NAV_CUSTOMER": "客户和动态",
                    "TOP_NAV_DEVELOP_DOCUMENT": "开发文档",
                    "TOP_NAV_DEVELOP_CENTER": "开发者中心",

                    "SIDEBAR_MENU_ACCESS": "设备接入服务",
                    "SIDEBAR_MENU_LOC": "户外资源管理服务",
                    "SIDEBAR_MENU_OPERATION": "运营服务",
                    "SIDEBAR_MENU_MAINTAIN": "运维服务",
                    "SIDEBAR_MENU_DATA_CLOUD": "大数据云服务",

                    "FOOTER_LINK_ABOUT": "关于我们",
                    "FOOTER_LINK_SERVICE": "服务协议",
                    "FOOTER_LINK_LANGUAGE_CN": "简体中文",
                    "FOOTER_LINK_LANGUAGE_EN": "English",
                    "FOOTER_LINK_FRIEND": "友情链接",
                    "FOOTER_LINK_CONTRACT": "联系我们",
                    "FOOTER_LINK_SUCCESS_CASES": "成功案例",
                    "FOOTER_LINK_COMPANY_INTRODUCE": "我们是谁",
                    "FOOTER_LINK_JOIN_TEAM": "加入我们",
                    "FOOTER_LINK_LOCMAN_HOMEPAGE": "LOCMAN官网",
                    "FOOTER_LINK_SEFON_FORUM": "四方技术论坛",
                    "FOOTER_LINK_PARTNER": "合作伙伴",
                    "FOOTER_LINK_PRODUCT_EXPERIENCE": "产品体验",
                    "FOOTER_LINK_TELEPHONE": "电话：400-960-8848",
                    "FOOTER_LINK_FAXES": "传真：028-85191155",
                    "FOOTER_COPYRIGHT": "Copyright © 2018 成都四方信息技术有限公司 | 四川省成都市高新区高朋大道11号22C座 | 版权所有 | 蜀ICP备12022557号-4",
                    "PAGINATION_BTN_PREVIOUS": "上一页",
                    "PAGINATION_BTN_NEXT": "下一页",
                    "PAGINATION_INFO_DATA_ERROR": "数据加载失败",
                    "PAGINATION_INFO_LOAD_RETRY": "请检查您的网络连接 或 稍后重试"
                }
            };

        beforeEach(module('app/views/comDirective/module_pagination.html', 'app/views/comDirective/module_pagination.html'));

        beforeEach(inject(function ($rootScope, $compile, _$http_, _$httpBackend_) {
            $http = _$http_;

            $httpBackend = _$httpBackend_;

            elm = angular.element(`<div class="pagination-container">
                                <div class="pagination_info">
                                    <span class="error-info" ng-if="emptyStatus && !errorStatus">
                                        {{'MSG_10002' | translate}}
                                        <i class="fa fa-refresh" aria-hidden="true" ng-click="refresh()"></i>
                                    </span>
                                    <span class="error-info" ng-if="errorStatus">
                                        {{'PAGINATION_INFO_DATA_ERROR' | translate }}<br/>{{'PAGINATION_INFO_LOAD_RETRY' | translate }}
                                        <i class="fa fa-refresh" aria-hidden="true" ng-click="refresh()"></i>
                                    </span>
                                </div>
                                <div class="pagination_content" ng-show="!emptyStatus && !errorStatus">
                                    <span class="page-total" ng-if="recordTotal>0">共&nbsp;{{recordTotal}}&nbsp;条</span>
                                    <!--<span class="page-number" ng-if="pageTotal>1">页码：{{pageIndex}} / {{pageTotal}}</span>-->
                                    <select class="page-selected-size" ng-model="pageSize"
                                            ng-options="ps.value as ps.name for ps in pageSizes"
                                            ng-change="pageSizeChange()" ng-show="recordTotal > 10">
                                    </select>
                                    <div ng-show="pageTotal > 0">
                                        <ul uib-pagination total-items="recordTotal" ng-model="pageIndex" max-size="6" class="pagination-sm"
                                            items-per-page="pageSize"  force-ellipses="true"
                                            boundary-link-numbers="true"  previous-text="{{'PAGINATION_BTN_PREVIOUS' | translate}}" next-text="{{'PAGINATION_BTN_NEXT'| translate}}"  ng-change="pageChanged()"></ul>
                                    </div>
                                    <div class="redirect_page_info" ng-show="pageTotal > 6">
                                        <form ng-submit="changeByPageIndex()">
                                            前往&nbsp;<input type="number" min="1" ng-model="pageIndexInput" required/>&nbsp;页
                                        </form>
                                    </div>
                                </div>
                            </div>`);

            scope = $rootScope.$new();

            $compile(elm)(scope);

           // scope.$digest();
        }));

        beforeEach( ()=> {
            $httpBackend.whenGET('./mocks/locale-CN.json')
                .respond(() => {
                        return [200, localeData];
                    }
                );

            scope.errorStatus = false;

            scope.emptyStatus = true;
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should create error and warning info', inject(($compile, $rootScope) => {
            let data, content = elm.find('.pagination_content .pagination_info');

            expect($httpBackend).not.toEqual(null);
            expect(content.length).toBe(0);

            $http.get('./mocks/locale-CN.json').then(function (response) {
                data = response.data;
            });

            $httpBackend.flush();

            expect(data).toEqual(localeData);
        }));
    })

    // describe('clickDisable',()=>{
    //
    //     let ele, scope;
    //
    //     beforeEach(inject(($compile, $rootScope) => {
    //         scope = $rootScope;
    //         ele = angular.element(`<button type="submit" click-disable="save()"></button>`);
    //         $compile(ele)(scope);
    //         scope.$apply();
    //     }));
    //
    //     it('The directives of clickDisable is used to avoid repeating requests for short periods of time', ()=>{
    //         scope.save();
    //     });
    //     expect(ele.getAttribute('disabled')).toBeTruthy());
    //
    // });
});