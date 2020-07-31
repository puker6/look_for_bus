
'use strict';

financeModule
    .factory("financeService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            //银行管理列表
            findBankList: function (params) {
                let url = apiUrl.environment + '/company/finance/findBankList';
                return $http.post(url,params);
            },
            //获取银行不分页
            findBanks: function (params) {
                let url = apiUrl.environment + '/company/finance/findBanks';
                return $http.post(url,params);
            },
            //银行添加/修改
            adupBank: function (params) {
                let url = apiUrl.environment + '/company/finance/adupBank';
                return $http.post(url,params);
            },
            //银行判断是否能修改
            isAllowModify: function (params) {
                let url = apiUrl.environment + '/company/finance/isAllowModify';
                return $http.post(url,params);
            },
            //银行查询
            bankFindById: function (params) {
                let url = apiUrl.environment + '/company/finance/bankFindById';
                return $http.post(url,params);
            },
            //删除银行
            delBank: function (params) {
                let url = apiUrl.environment + '/company/finance/delBank';
                return $http.post(url,params);
            },
            //单位启用银行账本
            openBankAccount: function (params) {
                let url = apiUrl.environment + '/company/finance/openBankAccount';
                return $http.post(url,params);
            },
            /** 银行日记账列表 */
            //银行日记账列表
            findBankTradeList: function (params) {
                let url = apiUrl.environment + '/company/finance/findBankTradeList';
                return $http.post(url,params);
            },
            //获取对方户名/摘要
            findTransNamesAndRemarks: function (params) {
                let url = apiUrl.environment + '/company/finance/findTransNamesAndRemarks';
                return $http.post(url,params);
            },
            //银行帐添加
            addBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/addBtl';
                return $http.post(url,params);
            },
            //获取余额
            findBalanceByBankInfo: function (params) {
                let url = apiUrl.environment + '/company/finance/findBalanceByBankInfo';
                return $http.post(url,params);
            },
            //删除银行账
            delBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/delBtl';
                return $http.post(url,params);
            },
            //银行账审核-审核通过
            checkYesBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/checkYesBtl';
                return $http.post(url,params);
            },
            //银行账审核-审核不通过
            checkNoBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/checkNoBtl';
                return $http.post(url,params);
            },
            //银行账查询
            findBtlById: function (params) {
                let url = apiUrl.environment + '/company/finance/findBtlById';
                return $http.post(url,params);
            },
            //银行账下账
            downBtlMoney: function (params) {
                let url = apiUrl.environment + '/company/finance/downBtlMoney';
                return $http.post(url,params);
            },
            //银行账修改
            modifyBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/modifyBtl';
                return $http.post(url,params);
            },
            //获取 预收账款科目或者 应收账款科目
            getCreateReimCourse: function (params) {
                let url = apiUrl.environment + '/company/finance/getCreateReimCourse';
                return $http.post(url,params);
            },
            //银行账关联员工报账
            linkStaffReim: function (params) {
                let url = apiUrl.environment + '/company/finance/linkStaffReim';
                return $http.post(url,params);
            },
            linkBankTrade: function (params) {
                let url = apiUrl.environment + '/company/finance/linkBankTrade';
                return $http.post(url,params);
            },
            //银行账锁定/解锁
            lockBankTrade: function (params) {
                let url = apiUrl.environment + '/company/finance/lockBankTrade';
                return $http.post(url,params);
            },
            //凭证锁定/解锁
            operCheckReim: function (params) {
                let url = apiUrl.environment + '/company/finance/operCheckReim';
                return $http.post(url,params);
            },
            //开放银行账查询
            openSelBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/openSelBtl';
                return $http.post(url,params);
            },
            //银行账互转
            transEachOther: function (params) {
                let url = apiUrl.environment + '/company/finance/transEachOther';
                return $http.post(url,params);
            },
            //银行账导入
            importfeeBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/importfeeBtl';
                // return $http.post(url,params);
                return $http({
                    method: 'POST',
                    url: url,
                    data: params,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identityidentity
                });
            },
            // 银行账添加时获取金额类型列表
            findMtypes: function (params) {
                let url = apiUrl.environment + '/company/finance/findMtypes';
                return $http.post(url,params);
            },
            // 导出-银行日记账列表
            expBtlBankEx: function (params) {
                let url = apiUrl.environment + '/company/finance/expBtlBankEx';
                // return $http({
                //     method: 'POST',
                //     url: url,
                //     data: params,
                //     headers: {'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                //     transformRequest: angular.identityidentity
                // });
                return $http.post(url,params);
            },
            // 银行日记账生成凭证
            createReimBtl: function (params) {
                let url = apiUrl.environment + '/company/finance/createReimBtl';
                return $http.post(url,params);
            },
        
            // 获取-单位科目交易记录-分页列表
            findCourseTrades: function (params) {
                let url = apiUrl.environment + '/company/finance/findCourseTrades';
                return $http.post(url,params);
            },
            // 科目期初余额设置
            firstBalanceSet: function (params) {
                let url = apiUrl.environment + '/company/finance/firstBalanceSet';
                return $http.post(url,params);
            },

            //凭证记录表列表
            findReimList: function (params) {
                let url = apiUrl.environment + '/company/finance/findReimList';
                return $http.post(url,params);
            },
            //获取科目列表
            findCourses: function (params) {
                let url = apiUrl.environment + '/company/finance/findCourses';
                return $http.post(url,params);
            },
            //凭证添加时获取凭证摘要列表
            findReimRemarks: function (params) {
                let url = apiUrl.environment + '/company/finance/findReimRemarks';
                return $http.post(url,params);
            },
             //修改凭证记录
             modifyReim: function (params) {
                let url = apiUrl.environment + '/company/finance/modifyReim';
                return $http.post(url,params);
            },
             //获取客户基本信息
             getCustomBaseInfo: function (params) {
                let url = apiUrl.environment + '/company/cus/getCustomBaseInfo';
                return $http.post(url,params);
            },
            //单位删除凭证记录
            delReim: function (params) {
                let url = apiUrl.environment + '/company/finance/delReim';
                return $http.post(url,params);
            },
            //通过id获取凭证信息
            findReimById: function (params) {
                let url = apiUrl.environment + '/company/finance/findReimById';
                return $http.post(url,params);
            },
            // 审核报销凭证(支持多条审核)
            checkReimburse: function (params) {
                let url = apiUrl.environment + '/company/finance/checkReimburse';
                return $http.post(url,params);
            },
            //核销凭证(支持多条核销)
            confirmReim: function (params) {
                let url = apiUrl.environment + '/company/finance/confirmReim';
                return $http.post(url,params);
            },
            //撤销财务记账凭证(只能撤销已审核的记录)
            cancelReim: function (params) {
                let url = apiUrl.environment + '/company/finance/cancelReim';
                return $http.post(url,params);
            },
            // 银行账关联财务记账凭证（凭证列表接口已核销）记录
            linkReim: function (params) {
                let url = apiUrl.environment + '/company/finance/linkReim';
                return $http.post(url,params);
            },
            //获取所有科目列表
            findFeeCourses: function (params) {
                let url = apiUrl.environment + '/company/finance/findFeeCourses';
                return $http.post(url,params);
            },
            //获取一级科目列表
            findRootCourse: function (params) {
                let url = apiUrl.environment + '/company/finance/findRootCourse';
                return $http.post(url,params);
            },
            //添加科目
            addFeeCourse: function (params) {
                let url = apiUrl.environment + '/company/finance/addFeeCourse';
                return $http.post(url,params);
            },
            //编辑科目
            updateCourse: function (params) {
                let url = apiUrl.environment + '/company/finance/updateCourse';
                return $http.post(url,params);
            },
            //获取二三级科目列表
            getCourseByParentId: function (params) {
                let url = apiUrl.environment + '/company/finance/getCourseByParentId';
                return $http.post(url,params);
            },
            //新增子级科目时根据parentId获取科目已关联记录
            findCourseLink: function (params) {
                let url = apiUrl.environment + '/company/finance/findCourseLink';
                return $http.post(url,params);
            },
            // 删除科目
            deleteCourse: function (params) {
                let url = apiUrl.environment + '/company/finance/deleteCourse';
                return $http.post(url,params);
            },
            // 改变科目状态
            changeCourseStatus: function (params) {
                let url = apiUrl.environment + '/company/finance/changeCourseStatus';
                return $http.post(url,params);
            },
            // 通过ID获取科目信息
            getCourseById: function (params) {
                let url = apiUrl.environment + '/company/finance/getCourseById';
                return $http.post(url,params);
            },
            // 检验科目名称是否可用
            checkCourseName: function (params) {
                let url = apiUrl.environment + '/company/finance/checkCourseName';
                return $http.post(url,params);
            },
            // 业务收款
            getMainCarOrderForCollection: function (params) {
                let url = apiUrl.environment + '/company/finance/getMainCarOrderForCollection';
                return $http.post(url,params);
            },
            // 取消业务收款
            cancelConfirmCollection: function (params) {
                let url = apiUrl.environment + '/company/finance/cancelConfirmCollection';
                return $http.post(url,params);
            },
            // 业务付款
            getCarOrderListForPayment: function (params) {
                let url = apiUrl.environment + '/company/finance/getCarOrderListForPayment';
                return $http.post(url,params);
            },
            // 取消业务付款
            cancelConfirmPayment: function (params) {
                let url = apiUrl.environment + '/company/finance/cancelConfirmPayment';
                return $http.post(url,params);
            },
            // 单位业务收款
            serviceGath: function (params) {
                let url = apiUrl.environment + '/company/finance/serviceGath';
                return $http.post(url,params);
            },
            // 单位业务付款
            servicePay: function (params) {
                let url = apiUrl.environment + '/company/finance/servicePay';
                return $http.post(url,params);
            },



            /** 员工报账 */
            // 添加员工报账
            addStaffReimburse: function (params) {
                let url = apiUrl.environment + '/company/finance/addStaffReimburse';
                return $http.post(url,params);
            },
            // 获取-单位员工报账列表-分页
            findStaffReimList: function (params) {
                let url = apiUrl.environment + '/company/finance/findStaffReimList';
                return $http.post(url,params);
            },
            // 通过id获取员工报账信息
            findStaffReimById: function (params) {
                let url = apiUrl.environment + '/company/finance/findStaffReimById';
                return $http.post(url,params);
            },
            // 单位修改员工报账
            modifyStaffReimburse: function (params) {
                let url = apiUrl.environment + '/company/finance/modifyStaffReimburse';
                return $http.post(url,params);
            },
            // 单位删除员工报账
            delStaffReim: function (params) {
                let url = apiUrl.environment + '/company/finance/delStaffReim';
                return $http.post(url,params);
            },
            // 审核员工报账(支持多条审核)
            checkStaffReimburse: function (params) {
                let url = apiUrl.environment + '/company/finance/checkStaffReimburse';
                return $http.post(url,params);
            },
            // 拒绝员工报账
            checkRefuse:function (params) {
                let url = apiUrl.environment + '/company/finance/checkRefuse';
                return $http.post(url,params);
            },
            // 生成凭证
            createReim:function (params) {
                let url = apiUrl.environment + '/company/finance/createReim';
                return $http.post(url,params);
            },
            // 获取车牌号
            getAllPlateNum:function (params) {
                let url = apiUrl.environment + '/company/vehicle/getAllPlateNum';
                return $http.post(url,params);
            },

        }
    }])