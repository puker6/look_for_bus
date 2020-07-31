'use strict';

financeModule.controller('reimListSelectController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService) {
        // console.log($state.params)
        $scope.params = $state.params;
        //日期选择
        $('#sTime,#eTime').datetimepicker({
            format: "Y-m-d H:i:s",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        let params = $state.params;
        $scope.bankMoney = params.bankMoney;
        $scope.voucherNumberBank = params.voucherNumberBank;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.title = "结账(关联报销)"
        $scope.gridOptions = {
            enableGridMenu: true, 
            rowHeight: 42, 
            enableColumnResizing: true,
            enableVerticalScrollbar : 0,
            enableHorizontalScrollbar:2,
            multiSelect:false,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        // 审核状态
        $scope.isCheckArr = [
            {id:'-1',name:'已驳回'},
            {id:'0',name:'未审核'},
            {id:'1',name:'已审核'},
            {id:'2',name:'已核销'},
            {id:'3',name:'已关联'},
        ]; 
        // 收支状态
        $scope.feeStatusArr = [
            {id:'0',name:'收入'},
            {id:'1',name:'支出'},
        ]; 
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };
        $scope.findReimList1 = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                /** 科目名称 */
                courseName:$scope.courseName || "",
                /** 添加结束时间 */
                eTime:$scope.eTime || "",
                /** 审核状态 */
                isCheck:$scope.isCheck || "",
                /** 银行名称 */
                myBank:$scope.myBank || "",
                /** "操作编号 */
                operMark:$scope.operMark || "",
                /** 开支 */
                reimIsCar:$scope.reimIsCar || "",
                /** 凭证金额 */
                reimMoney:$scope.reimMoney || "",
                /** 车牌号 */
                reimPlateNum:$scope.reimPlateNum || "",
                /** 摘要 */
                reimZy:$scope.reimZy || "",
                /** 添加开始时间 */
                sTime:$scope.sTime || "",
                /** 状态 */
                status:$scope.status || "",
                /** 报销人账号 */
                uname:$scope.uname || "",
                /** 凭证编号 */
                vouNum:$scope.vouNum || "",

            } 
            financeService.findReimList(requestParams).then(function(res){
                // console.log(res)
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.isCheckArr, function(data){
                            if((data.id).toString()===(item.isCheck).toString())item.isCheck = data.name;
                        });
                        angular.forEach($scope.feeStatusArr, function(data){
                            if((data.id).toString()===(item.feeStatus).toString())item.feeStatus = data.name;
                        });
                    });
                }
            },function () {
                $scope.model.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
            });
        };
        $scope.searchKey = function(){
            params.keyword = $scope.keyword ||'';
            $scope.findBankTradeList();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };
        $scope.gridOptions.columnDefs = [
            {name: 'voucherNum', displayName: '凭证号码',minWidth: 100, enablePinning: false},
            {name: 'feeCourseId.courseName', displayName: '科目名称',minWidth: 100, enablePinning: false},
            {name: 'gainTime', displayName: '记账时间',minWidth: 100, enablePinning: false},
            {name: 'remark', displayName: '摘要',minWidth: 100, enablePinning: false},
            {name: 'isCheck', displayName: '审核状态',minWidth: 100, enablePinning: false},
            {name: 'totalMoney', displayName: '金额',minWidth: 100, enablePinning: false},
            {name: 'deptId', displayName: '业务部门',minWidth: 100, enablePinning: false},
            {name: 'feeStatus', displayName: '收入',minWidth: 100, enablePinning: false},
            {name: 'transferInfo', displayName: '对方户名/对方账号',minWidth: 100, enablePinning: false},
            {name: 'plateNum', displayName: '车牌号',minWidth: 100, enablePinning: false},
            {name: 'myBankInfo', displayName: '我的银行户名/我的银行账号',minWidth: 100, enablePinning: false},
            {name: 'refuseReason', displayName: '驳回原因',minWidth: 100, enablePinning: false},
            {name: 'verificationMoney', displayName: '已核销金额',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '开始时间',minWidth: 100, enablePinning: false},
            {name: 'carOrderReim', displayName: '子订单引用',minWidth: 100, enablePinning: false},
            {name: 'mainOrderReim', displayName: '主订单引用',minWidth: 100, enablePinning: false},
            {name: 'reqsrc', displayName: '数据来源',minWidth: 100, enablePinning: false},
            {name: 'reimUserId.realName', displayName: '报销人',minWidth: 100, enablePinning: false},
            {name: 'operMark', displayName: '标识号',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '操作备注',minWidth: 100, enablePinning: false},
        ];

        // 提交报销
        $scope.tjLinkReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要报销的数据！");
            }else{
                let voucherNumberPz = selectedRows[0].entity.voucherNumber;
                let totalMoneyPz = selectedRows[0].entity.totalMoney;
                if($scope.bankMoney != totalMoneyPz){
                    $.misMsg("凭证金额必须和选择银行账记录金额相等");
                }else if( $scope.voucherNumberBank != voucherNumberPz ){
                    $.misMsg("凭证号必须相等");
                }else if(selectedRows[0].entity.isCheck != '已核销'){
                    $.misMsg("选择已核销的凭证记录");
                }else{
                    let idsList =[];
                    angular.forEach(selectedRows, function(data){
                    idsList.push(data.entity.id)
                    });
                $scope.ids = idsList.join(",");
                    let requestParams = {
                        btlId:$scope.params.reimListId,
                        reimId:selectedRows[0].entity.voucherNumber.id
                    }
                    financeService.linkReim(requestParams).then(function(res){    //接口调用
                        if(res.data.code ===1){
                            $state.reload();
                            $.misMsg(res.data.msg);
                        }else{
                            $.misMsg(res.data.msg);
                        }
                    })
                }
            }
        };
        ($scope.init = function(){
            $scope.findReimList1();
        })();
    }])