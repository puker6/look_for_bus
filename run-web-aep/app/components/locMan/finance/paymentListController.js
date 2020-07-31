'use strict';

financeModule.controller('paymentListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','businessService','logisticsService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,businessService,logisticsService,officeService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.compositor = "ASC"

        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#startTime,#endTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });

        $scope.keyword = params.keyword ||'';
        $scope.gridOptions = {
            enableGridMenu: true, 
            rowHeight: 42, 
            enableColumnResizing: true,
            enableVerticalScrollbar : 0,
            enableHorizontalScrollbar:2,
            multiSelect:true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };
        // 订单状态
        $scope.payStatusArr = [
            {id:'UNPAID',name:'未付款'},
            {id:'DEPOSIT_PAID',name:'已付定金'},
            {id:'FULL_PAID',name:'全款已付'},
        ]; 

        // 客户列表
        $scope.companyCusCombo = function(){
            let requestParams = {
                cusTypeId:""
            }
            officeService.companyCusCombo(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $scope.clientList = res.data.data;
                    console.log($scope.clientList)
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                }
            });
        };
        // 获取驾驶员列表
        $scope.getDriverList = function(){
            
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            logisticsService.getDriverList(requestParams).then(function(res){
                let result = res.data.data;
                $scope.driverList = result;
            })
        };
        // 获取员工列表
        $scope.getEmployeeList = function(){
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 400,
                // find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum
            }
            officeService.getEmployeeList(requestParams).then(function(res){
                if(res.data.code===1){
                    // console.log(res)
                    $scope.employeeList = res.data.data
                }
            })
        };
        $scope.getCarOrderListForPayment = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                /** 时间顺序  */
                compositor:$scope.compositor || "",
                /** 客户（用车方）  */
                customer:$scope.customer || "",
                /** 驾驶员uname  */
                driver:$scope.driver || "",
                /** 用车方负责人  */
                dutyService:$scope.dutyService || "",
                /** 结束时间  */
                endTime:$scope.endTime || "",
                /** 订单号  */
                orderNum:$scope.orderNum || "",
                /** 订单支付状态  */
                payStatus:$scope.payStatus || "",
                /** 车牌号  */
                plateNum:$scope.plateNum || "",
                /** 行程详情  */
                routeDetail:$scope.routeDetail || "",
                /** 业务员  */
                serviceMan:$scope.serviceMan || "",
                /** 开始时间  */
                startTime:$scope.startTime || "",
                /** 搜索时间类型 */
                timeType:$scope.timeType || "",
                /** 供车方（收款方） */
                suppCar:$scope.suppCar || ""

            } 
            financeService.getCarOrderListForPayment(requestParams).then(function(res){
                $scope.result = res.data;
                /** 运价总价 */
                $scope.totalDisPrice = $scope.result.statics.totalDisPrice;
                /** 已付款 */
                $scope.totalAlPayPrice = $scope.result.statics.totalAlPayPrice;
                /** 应付款  */
                $scope.totalPriceY = Number($scope.totalDisPrice)-Number($scope.totalAlPayPrice);
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.payStatusArr, function(data){
                            if(data.id===item.payStatus)item.payStatus = data.name;
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
            $scope.getCarOrderListForPayment();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'disCar.plateNum', displayName: '车牌号',minWidth: 100, enablePinning: false},
            {name: 'disCar.outDriverInfo', displayName: '师傅信息',minWidth: 100, enablePinning: false},
            {name: 'routeDetail', displayName: '行程详情',minWidth: 100, enablePinning: false},
            {name: 'disPrice', displayName: '总价',minWidth: 100, enablePinning: false},
            {name: 'alPayPrice', displayName: '已付金额',minWidth: 100, enablePinning: false},
            {name: 'confirmPaymentName', displayName: '确认车价',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '用车时间',minWidth: 100, enablePinning: false},  
            // {name: '', displayName: '收款方',minWidth: 100, enablePinning: false},
            {name: 'carOrderBase.dutyService', displayName: '用车负责人',minWidth: 100, enablePinning: false},
            {name: 'orderNum', displayName: '订单号',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '下单时间',minWidth: 100, enablePinning: false},
            {name: 'note', displayName: '备注',minWidth: 100, enablePinning: false},
            
            {name: 'otherPriceNote', displayName: '其他费用说明',minWidth: 100, enablePinning: false},  
            {name: 'otherPrice', displayName: '其他费用',minWidth: 100, enablePinning: false},
            {name: 'confirmPaymentName', displayName: '确认付款人姓名',minWidth: 100, enablePinning: false},  
            {name: 'limitNum', displayName: '车辆限号',minWidth: 100, enablePinning: false},
            {name: 'payStatus', displayName: '订单支付状态',minWidth: 100, enablePinning: false},  
            {name: 'price', displayName: '订单收款价格',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '用车时间',minWidth: 100, enablePinning: false},  
            // {name: '', displayName: '收款方',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '用车时间',minWidth: 100, enablePinning: false},  
            // {name: '', displayName: '收款方',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '用车时间',minWidth: 100, enablePinning: false},  
            // {name: '', displayName: '收款方',minWidth: 100, enablePinning: false},
        ];


        // 取消付款
        $scope.paymentQx = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(selectedRows.length > 1){
                $.misMsg("请选择一条收款数据！");
            }else if(selectedRows.length ===0){
                $.misMsg("请选择收款数据！");
            }else{
                let requestParams = {
                    /** 主订单id */
                    id:selectedRows[0].entity.id
                }
                financeService.cancelConfirmPayment(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }
                })
            }
        };

        // 付款弹框
        $scope.paymentBtn = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择订单数据！");
            }else{
                
            }







            // if(selectedRows.length ===0){
            //     $.misMsg("请选择订单数据！");
            // }else
            // {
                // if(selectedRows.length ===1){
                    $('#payMoney').attr('disabled',false);
                    $scope.payShow = true;
                    $scope.idsPay = selectedRows[0].entity.id;
                    $scope.payMoney =Number(selectedRows[0].entity.disPrice)-Number(selectedRows[0].entity.alPayPrice);
                // }
                // else 
                if(selectedRows.length > 1){
                    let idsPayArr = [];
                    let PayArr = []
                    let disPriceArr = [];
                    let alPayPriceArr = [];
                    var eq = true;

                    for(var i=0; i<selectedRows.length; i++){
                        idsPayArr.push(selectedRows[i].entity.carOrderBase.baseUserId.realName);
                        PayArr.push(selectedRows[i].entity.id);
                        disPriceArr.push(selectedRows[i].entity.disPrice);
                        alPayPriceArr.push(selectedRows[i].entity.alPayPrice);
                    }
                    for(var j=0; j<idsPayArr.length;j++){
                        if(idsPayArr[0] != idsPayArr[j]){
                            $.misMsg("必须是同一个客户的订单！");
                            eq = false;
                            break;
                        }else{
                            eq = true;
                        }
                    }
                    if(eq){
                        $('#payMoney').attr('disabled',true);
                        $scope.payShow = true;
                        $scope.idsPay = PayArr.join(",");
                        let disPriceAll = disPriceArr.reduce((total, num) => { return total + num });
                        let alPayPriceAll = alPayPriceArr.reduce((total, num) => { return total + num });
                        $scope.payMoney = Number(disPriceAll) - Number(alPayPriceAll);
                }
               
            }
           
        // }
    }

        // 付款确认
        $scope.saveConfirmPay = function(){
            if(!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test($scope.payMoney))){
                $.misMsg("请正确填入金额");
            }else{
                let requestParams = {
                    /** 订单id,多个逗号拼接 */
                    ids:$scope.idsPay,
                    /** 付款金额 */
                    payMoney:$scope.payMoney || "",
                    /** 付款摘要 */
                    payRemark:$scope.payRemark || ""
                }
                financeService.servicePay(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg)
                    }
                })
            }
        };
        // 取消
        $scope.closeConfirmPay = function(){
            $scope.payShow = false;
        };

        $scope.moreSearchAction = function(){
            $scope.searchPayShow = !$scope.searchPayShow
        };
        ($scope.init = function(){
            $scope.getCarOrderListForPayment();
            $scope.companyCusCombo();
            $scope.getDriverList();
            $scope.getEmployeeList();
        })();



    }])