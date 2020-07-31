

(()=> {
    "use strict";

    angular
        .module('aep')
        .config(['$stateProvider', '$urlRouterProvider', routerConfig]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['aep'], {strictDi: true});
    });

    function routerConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('', '/login');

        $stateProvider
            .state('portal', {
                url: '/portal',
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'portal/portal.html',
                        controller: 'portalController'
                    }
                }
            })
            .state('aep', {
                url: '',
                abstract: true,
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'layout/layout.html',
                        controller: 'layoutController'
                    }
                },
                params: {}
            })
            // .state('aep.overview', {
            //     url: '/overview',
            //     views: {
            //         'layout': {
            //             templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'overview/overview.html',
            //             controller: 'overviewController'
            //         }
            //     },
            //     params: {}
            // })
            .state('aep.main', {
                url: '/iot',
                views: {
                    'layout': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'aep/layout/layout.html',
                        controller: 'iotLayoutController'
                    }
                }
            })


            .state('aep.loc', {
                url: '/loc',
                views: {
                    'layout': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/layout/layout.html',
                        controller: 'locLayoutController'
                    }
                }
            })
            .state('aep.loc.dashboard', {
                url: '/dashboard?port',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/dashboard/dashboard.html',
                        controller: 'dashboardController'
                    }
                },
                params: {port: ''}
            })

            .state('aep.loc.client_list', {
                url: '/client/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/business/clientList.html',
                        controller: 'clientListController'
                    }
                },
                params: {page: "1", size: "12", keyword: '',unitName:'',serviceMan:'',recomMan:''}
            })
            .state('aep.loc.client_compile', {
                url: '/client/compile?page&?size&?keyword&?flag&?clientId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/business/clientCompile.html',
                        controller: 'clientCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',clientId:''}
            })
            .state('aep.loc.order_list', {
                url: '/order/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/business/orderList.html',
                        controller: 'orderListController'
                    }
                },
                params: {
                    page: "1", 
                    size: "200",
                    keyword: '',
                    orderStatus:'',
                    orderSource:'',
                    orderPayStatus:'',
                    driver:'',
                    seats:'',
                    dutyMan:'',
                    suppMan:'',
                    plateNum:'',
                    timeType:'',
                    startTime:'',
                    endTime:'',
                    compositor:'',
                    routeType:'',
                    serviceType:''
                }
            })
            .state('aep.loc.order_compile', {
                url: '/order/compile?page&?size&?keyword&?flag&?orderId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/business/orderCompile.html',
                        controller: 'orderCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',orderId:'',flag:''}
            })
            .state('aep.loc.order_update', {
                url: '/order/update?page&?size&?keyword&?flag&?orderId&?mainOrderNum&?mainStatue',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/business/orderUpdate.html',
                        controller: 'orderUpdateController'
                    }
                },
                params: {page: "", size: "", keyword: '',orderId:'',mainOrderNum:'',flag:'',objArr:'',mainStatue:''}
            })
            .state('aep.loc.vehicle_list', {
                url: '/vehicle/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/logistics/vehicleList.html',
                        controller: 'vehicleListController'
                    }
                },
                params: {page: "1", size: "12", keyword: ''}
            })
            .state('aep.loc.vehicle_compile', {
                url: '/vehicle/compile?page&?size&?keyword&?flag?vehicleId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/logistics/vehicleCompile.html',
                        controller: 'vehicleCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',vehicleId:''}
            })
            .state('aep.loc.group_list', {
                url: '/group/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/logistics/groupList.html',
                        controller: 'groupListController'
                    }
                },
                params: {page: "1", size: "12", keyword: ''}
            })
            .state('aep.loc.group_compile', {
                url: '/group/compile?page&?size&?keyword?flag&?groupId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/logistics/groupCompile.html',
                        controller: 'groupCompileController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.employee_list', {
                url: '/employee/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/office/employeeList.html',
                        controller: 'employeeListController'
                    }
                },
                params: {page: "1", size: "12", keyword: ''}
            })
            .state('aep.loc.employee_compile', {
                url: '/employee/compile?page&?size&?flag&?employeeId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/office/employeeCompile.html',
                        controller: 'employeeCompileController'
                    }
                },
                params: {page: "", size: "", flag: '',employeeId:''}
            })
            .state('aep.loc.cash_bills', {
                url: '/cash/bills?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/cashBills.html',
                        controller: 'cashBillsController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.bank_manage', {
                url: '/bank/manage?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/bankManage.html',
                        controller: 'bankManageController'
                    }
                },
                params: {page: "1", size: "12", keyword: ''}
            })
            .state('aep.loc.bank_manage_compile', {
                url: '/bank/manage/compile?page&?size&?keyword&?flag?bankManageId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/bankManageCompile.html',
                        controller: 'bankManageCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',bankManageId:''}
            })
            .state('aep.loc.bank_account', {
                url: '/bank/account?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/bankAccount.html',
                        controller: 'bankAccountController'
                    }
                },
                params: {page: "1", size: "12", keyword: ''}
            })
            .state('aep.loc.bank_account_compile', {
                url: '/bank/account/compile?page&?size&?keyword&?flag?bankAccountId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/bankAccountCompile.html',
                        controller: 'bankAccountCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',bankAccountId:''}
            })
            .state('aep.loc.reim_list', {
                url: '/reim/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/reimList.html',
                        controller: 'reimListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.reim_list_select', {
                url: '/reim/list/select?page&?size&?keyword?reimListId&?bankMoney&?voucherNumberBank',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/reimListSelect.html',
                        controller: 'reimListSelectController'
                    }
                },
                params: {page: "", size: "", keyword: '',reimListId:'',bankMoney:'',voucherNumberBank:''}
            })
            .state('aep.loc.reim_compile', {
                url: '/reim/compile?page&?size&?keyword&?flag?reimId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/reimCompile.html',
                        controller: 'reimCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',reimId:''}
            })
            .state('aep.loc.main_reim', {
                url: '/main/reim?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/mainReimList.html',
                        controller: 'mainReimListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.main_reim_compile', {
                url: '/main/reim/compile?page&?size&?keyword&?flag?mainReimId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/mainReimCompile.html',
                        controller: 'mainReimCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',mainReimId:''}
            })
            .state('aep.loc.course_list', {
                url: '/course/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/courseList.html',
                        controller: 'courseListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.course_compile', {
                url: '/course/compile?page&?size&?keyword&?flag&?courseId&?level&?levelName&?parentid',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/courseCompile.html',
                        controller: 'courseCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',courseId:'',level:'',levelName:'',parentid:''}
            })
            .state('aep.loc.collection_list', {
                url: '/collection/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/collectionList.html',
                        controller: 'collectionListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.payment_list', {
                url: '/payment/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/paymentList.html',
                        controller: 'paymentListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.amount_list', {
                url: '/amount/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/systemCenter/amountList.html',
                        controller: 'amountListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.amount_compile', {
                url: '/amount/compile?page&?size&?keyword&?flag?amountId',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/systemCenter/amountCompile.html',
                        controller: 'amountCompileController'
                    }
                },
                params: {page: "", size: "", keyword: '',flag:'',amountId:''}
            })
            .state('aep.loc.customer_list', {
                url: '/customer/list?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/systemCenter/customerList.html',
                        controller: 'customerListController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.course_trades', {
                url: '/course/trades?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/courseTrades.html',
                        controller: 'courseTradesController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.course_setting', {
                url: '/course/setting?page&?size&?keyword',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/finance/courseSetting.html',
                        controller: 'courseSettingController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('aep.loc.statistic_one', {
                url: '/statistic/list?page&?size',
                views: {
                    'locbody': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'locMan/statistic/statistic_one.html',
                        controller: 'statisticOneController'
                    }
                },
                params: {page: "", size: "", keyword: ''}
            })
            .state('login', {
                url: '/login',
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'login/login.html',
                        controller: 'loginController'
                    }
                },
                params: {
                    title: "登录",
                    msg: '',
                    isverify: 'false'
                }
            })
            .state('register', {
                url: '/register',
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'register/register.html',
                        controller: 'registerController'
                    }
                },
                params: {
                    title: "注册",
                    msg: ''
                }
            })
            // .state('registerJump', {
            //     url: '/registerJump',
            //     views: {
            //         'aep': {
            //             templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'register/registerJump.html',
            //             controller: 'registerJumpController',
            //         }
            //     },
            //     params: {
            //         title: "注册跳转",
            //         msg: '',
            //         secret: ''
            //     }
            // })
            // .state('terms', {
            //     url: '/terms',
            //     views: {
            //         'aep': {
            //             templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'register/terms.html',
            //             controller: 'termsController'
            //         }
            //     },
            //     params: {
            //         title: "服务条款",
            //         msg: ''
            //     }
            // })
            // .state('forgetPassword', {
            //     url: '/forgetPassword',
            //     views: {
            //         'aep': {
            //             templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'forgetPassword/forgetPassword.html',
            //             controller: 'forgetPasswordController'
            //         }
            //     },
            //     params: {
            //         title: "忘记密码",
            //         msg: ''
            //     }
            // })
            // .state('forgetPasswordJump', {
            //     url: '/forgetPasswordJump',
            //     views: {
            //         'aep': {
            //             templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'forgetPassword/forgetPasswordJump.html',
            //             controller: 'forgetPasswordJumpController'
            //         }
            //     },
            //     params: {
            //         title: "忘记密码",
            //         msg: ''
            //     }
            // })
            .state('print', {
                url: '/print?page&?size&?keyword&?state&?status&?id',
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'aep/deviceManage/devicePrint.html',
                        controller: 'devicePrintController'
                    }
                },
                params: {page: "", size: '', keyword: '', state: '', status: '', id: ''}
            })
            .state('otherwise', {
                url: '*path',
                views: {
                    'aep': {
                        templateUrl: (config.schemaVersion === 'prod' ? './templates/' : './app/views/') + 'error/error404.html',
                        controller: 'errorController'
                    }
                },
                params: {
                    title: "404"
                }
            })

    }
})();

