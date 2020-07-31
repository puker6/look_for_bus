'use strict';

businessModule.controller('orderListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','businessService','locLayoutService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,businessService,locLayoutService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // $scope.orderStatus = "";
        // $scope.orderSource = "";
        // $scope.orderPayStatus = "";
        // $scope.compositor = "DESC";
        $scope.companyVehicleId = "";
        $scope.isActive = 0;
        $scope.keyword = params.keyword ||"";
        $scope.orderPayStatus = params.orderPayStatus ||"";
        $scope.orderSource = params.orderSource ||"";
        $scope.orderStatus = params.orderStatus ||"";
        $scope.startTime = params.startTime ||"";
        $scope.endTime = params.endTime ||"";
        $scope.compositor = params.compositor ||"DESC";
        $scope.timeType = params.timeType ||"";
        $scope.driver = params.driver ||"";
        $scope.seats = params.seats ||"";
        $scope.dutyMan = params.dutyMan ||"";
        $scope.suppMan = params.suppMan ||"";
        $scope.plateNum = params.plateNum ||"";
        $scope.routeType = params.routeType ||"";
        $scope.serviceType = params.serviceType ||"";
        $scope.isExternal = params.isExternal||"0";
        //派单变量初始化
        $scope.manualRunArea = "0";
        $scope.manualForce = "0";
        $scope.sendOrderPromptMsg = "";
        $scope.offlineDriverGath = 0;
        $scope.offlineSendPrice = 0;
        $scope.modalStatistic = {
            shGathPrice: 0,
            totalPrice: 0,
            carCount: 0,
            totalTravelPrepayPrice: 0,
            pageTotalPrice: 0,
            totalSelfPrepayPrice: 0,
            externalPrice: 0,
            totalAlGathPrice: 0
        }
        $(".ui-grid-viewport").scrollTop($(".sub-page-container")[0].offsetTop);
        //主订单状态集合
        $scope.orderStateArr = [
            {id:'NOT_CONFIRM',name:'未确认用车'},
            {id:'NOT_DIS_CAR',name:'未派单'},
            {id:'FINISHED_DIS_CAR',name:'已完成派单'},
            {id:'CANCELED',name:'已取消'},
        ];
        //子订单状态集合
        $scope.sonOrderStateArr = [
            {id:'NOT_DIS_CAR',name:'未派单'},
            {id:'JL_NOT_CONFIRM',name:'经理未确认派车'},
            {id:'DRIVER_NOT_CONFIRM',name:'师傅未确认'},
            {id:'DRIVER_CONFIRMED',name:'师傅已确认'},
            {id:'AL_TRAVEL',name:'已出行'},
            {id:'COMPLETED',name:'已完成'},
            {id:'CANCELED',name:'已取消'},
            {id:'REFUSED',name:'已拒绝'},
        ]
        $scope.orderFromArr = [
            {id:'PC_COMPANY',name:'电脑端-单位'},
            {id:'PC_PERSONAL',name:'电脑端-个人'},
            {id:'MOBILE_COMPANY',name:'移动端-单位'},
            {id:'MOBILE_PERSONAL',name:'移动端-个人'},
        ];
        $scope.orderPayStateArr = [
            {id:'UNPAID',name:'未付款'},
            {id:'DEPOSIT_PAID',name:'已付定金'},
            {id:'FULL_PAID',name:'全额已付'},
        ];
        // $scope.seatNumArr = [
        //     {id:"5",name:"5 座"},
        //     {id:"7",name:"7 座"},
        //     {id:"17",name:"17 座"},
        //     {id:"19",name:"19 座"},
        //     {id:"22",name:"22 座"},
        //     {id:"23",name:"23 座"},
        //     {id:"36",name:"36 座"},
        // ];
        $scope.manualSeats = "22";
        $scope.avgSpeedArr = [
            {id:"30",name:"30 km/h"},
            {id:"40",name:"40 km/h"},
            {id:"50",name:"50 km/h"},
            {id:"60",name:"60 km/h"},
            {id:"70",name:"70 km/h"},
        ];
        $scope.serviceTypeArr = [
            {id:'COUNTY_SER',name:'县际业务'},
            {id:'CITY_SER',name:'市际业务'},
            {id:'PROVINCE_SER',name:'省际业务'}
        ];
        $scope.manualAvgSpeed = '40';
        
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
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        $scope.init = function(){
            $scope.getOrderList();
        };
        //获取主订单列表
        $scope.getOrderList = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                row:parseInt(params.size) || 200,
                find:$scope.keyword ||"",
                orderPayStatus:$scope.orderPayStatus ||"",
                orderSource:$scope.orderSource ||"",
                orderStatus:$scope.orderStatus ||"",
                startTime:$scope.startTime ||"",
                endTime:$scope.endTime ||"",
                compositor:$scope.compositor ||"DESC",
                timeType:$scope.timeType ||"",
                driver:$scope.driver ||"",
                seats:$scope.seats ||null,
                dutyMan:$scope.dutyMan ||"",
                suppMan:$scope.suppMan ||"",
                plateNum:$scope.plateNum ||"",
                routeType:$scope.routeType||"",
                serviceType:$scope.serviceType||"",
                isExternal:$scope.isExternal ||"0"
            }
            businessService.getOrderList(requestParams).then(function(res){
                $scope.result = res.data;
                
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||200;
                    angular.forEach($scope.gridOptions.data, function(item){
                        let mainPlateNum = [];
                        angular.forEach($scope.orderStateArr, function(data){
                            if(data.id===item.mainOrderBase.status)item.mainOrderBase.statusName = data.name;
                        })
                        angular.forEach($scope.serviceTypeArr, function(data){
                            if(data.id===item.serviceType)item.serviceTypeName = data.name;
                        })
                        angular.forEach(item.mainCars, function(obj){
                            mainPlateNum.push(obj.plateNum)
                        })
                        item.plateNumName = mainPlateNum.join(',')
                        if(item.isExternal===0)item.isExternalName = "未外调";
                        if(item.isExternal===1)item.isExternalName = "已外调";
                        if(item.isExternal===2)item.isExternalName = "外调已锁定";
                        if(item.mainOrderBase.routeType==="TRAVEL_BC")item.mainOrderBase.routeTypeName = "旅游包车";
                        if(item.mainOrderBase.routeType==="ONE_WAY")item.mainOrderBase.routeTypeName = "单程接送";
                    }); 
                    $scope.modalStatistic = {
                        shGathPrice: $scope.result.statics.shGathPrice,
                        totalPrice: $scope.result.statics.totalPrice,
                        carCount: $scope.result.statics.carCount,
                        totalTravelPrepayPrice: $scope.result.statics.totalTravelPrepayPrice,
                        pageTotalPrice: $scope.result.statics.pageTotalPrice,
                        totalSelfPrepayPrice: $scope.result.statics.totalSelfPrepayPrice,
                        externalPrice: $scope.result.statics.externalPrice,
                        totalAlGathPrice: $scope.result.statics.totalAlGathPrice,
                    }
                    
                }
            },function () {
                $scope.model.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
            });
        };
        $scope.gridOptions.columnDefs = [
            {name: 'orderNum', displayName: '订单号',minWidth: 160, enablePinning: false},
            {name: 'mainOrderBase.routeTypeName', displayName: '行程类型',minWidth: 100, enablePinning: false},   
            // {name: 'mainOrderBase.statusName', displayName: '订单状态',minWidth: 120, enablePinning: false},  
            {
                name: 'mainOrderBase.status', displayName: '订单状态',minWidth: 120,
                cellTemplate: ` <span class="gridoptions-table-span" ng-class="{'gridoptions-span-danger':row.entity.mainOrderBase.status==='NOT_CONFIRM'}">{{row.entity.mainOrderBase.statusName}}</span>`
            },           
            {name: 'isExternalName', displayName: '外调状态',minWidth: 100, enablePinning: false},
            {name: 'plateNumName', displayName: '已派车辆',minWidth: 250, enablePinning: false,
                cellTemplate: ` <span class="gridoptions-table-span" title="{{row.entity.plateNumName}}">{{row.entity.plateNumName}}</span>`},
            {name: 'mainOrderBase.routeLink', displayName: '行程联系人',minWidth: 140, enablePinning: false},
            {name: 'routeDetail', displayName: '行程详情',minWidth: 300, enablePinning: false,
                cellTemplate: ` <span class="gridoptions-table-span" tooltip-class="customTooltip" tooltip-placement="auto top" uib-tooltip="{{row.entity.routeDetail}}">{{row.entity.routeDetail}}</span>`},
            {name: 'mainOrderBase.companyName', displayName: '用车方名称',minWidth: 120, enablePinning: false},
            {name: 'mainOrderBase.confirmCollectionName', displayName: '收款确认人',minWidth: 120, enablePinning: false},
            {name: 'mainOrderBase.dutyService', displayName: '用车负责人',minWidth: 100, enablePinning: false},
            {name: 'mainOrderBase.serviceMan', displayName: '业务员',minWidth: 80, enablePinning: false},
            {name: 'stime', displayName: '出发时间',minWidth: 140, enablePinning: false},
            {name: 'etime', displayName: '到达时间',minWidth: 140, enablePinning: false},
            {name: 'needCars', displayName: '需要车辆数',minWidth: 120, enablePinning: false},
            {name: 'needSeats', displayName: '需要座位数',minWidth: 120, enablePinning: false},
            {name: 'price', displayName: '订单价格',minWidth: 100, enablePinning: false},
            {name: 'alGathPrice', displayName: '已收金额',minWidth: 120, enablePinning: false},
            {name: 'travelPrepayPrice', displayName: '旅网金额',minWidth: 120, enablePinning: false},
            {name: 'selfPrepayPrice', displayName: '自网金额',minWidth: 120, enablePinning: false},
            {name: 'serviceTypeName', displayName: '业务类型',minWidth: 120, enablePinning: false},

            {name: 'addTime', displayName: '添加时间',minWidth: 140, enablePinning: false},
            
            {
                name: '操 作', width: 120,enableColumnMoving: false,pinnedRight:true,enablePinning: false,cellClass: 'grid-status-label',
                cellTemplate: `<a class="handle-click-a" ng-click="grid.appScope.lookSubOrder(row.entity)">查看子订单</a>`
            }
        ];

        //确认用车
        $scope.confirmUseCar = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要操作的数据！");
            }else{
                let requestParams = {
                    mainOrderId:selectedRows[0].entity.id||""
                }
                businessService.orderConfirmUserCar(requestParams).then(function(res){
                    if(res.data.code===1){
                        $scope.getOrderList();
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }    
        };
        //确认主订单收款价格
        $scope.actionGathering = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要操作的数据！");
            }else{
                if(selectedRows[0].entity.mainOrderBase.status==='NOT_CONFIRM'){
                    $.misMsg("请先确认用车！");
                    return;
                }
                $scope.mainGatheringId = selectedRows[0].entity.id;
                let requestParams = {
                mainOrderid:$scope.mainGatheringId||'',
	            // confirmCollectionName:$scope.mainGatheringName||''
            }
            businessService.confirmCollection(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.gatheringActionShow = false;
                    $scope.getOrderList();
                    $.misMsg(res.data.msg);
                }else{
                    $.misMsg(res.data.msg);
                }
            })
                // $scope.gatheringActionShow = true;
                
            } 
            
        };
        $scope.confirmGathering = function(){
            // if($scope.mainGatheringName===''||$scope.mainGatheringName===null||$scope.mainGatheringName===undefined){
            //     $.misMsg("收款人姓名不能为空！");
            //     return;
            // }
            // let requestParams = {
            //     mainOrderid:$scope.mainGatheringId||'',
	        //     // confirmCollectionName:$scope.mainGatheringName||''
            // }
            // businessService.confirmCollection(requestParams).then(function(res){
            //     if(res.data.code===1){
            //         $scope.gatheringActionShow = false;
            //         $scope.getOrderList();
            //         $.misMsg(res.data.msg);
            //     }else{
            //         $.misMsg(res.data.msg);
            //     }
            // })
        };
        //确认子订单付款价格
        $scope.actionPayment = function(){
            if($scope.checkedSubOrderArr.length===0 ||$scope.checkedSubOrderArr.length>1){
                $.misMsg("请选择一条订单数据！");
            }else{
                // $scope.paymentActionShow = true;
                if($scope.checkedSubOrderArr[0].carOrderBase.status==='NOT_CONFIRM'){
                    $.misMsg("请先操作主订单确认用车！");
                    return;
                }
                if($scope.checkedSubOrderArr[0].isExternal===0){
                    $.misMsg("未外调的订单不能确认付款价格！");
                    return;
                }
                $scope.sonPaymentId = $scope.checkedSubOrderArr[0].id;
                let requestParams = {
                    id:$scope.sonPaymentId||'',
                    // confirmPayMentName:$scope.sonPaymentName||''
                }
                businessService.confirmPayment(requestParams).then(function(res){
                    if(res.data.code===1){
                        // $scope.paymentActionShow = false;
                        getSubOrderList($scope.mainOrderNum);
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }
        };
        // $scope.confirmPayment = function(){
        //     if($scope.sonPaymentName===''||$scope.sonPaymentName===null||$scope.sonPaymentName===undefined){
        //         $.misMsg("付款人姓名不能为空！");
        //         return;
        //     }
        //     let requestParams = {
        //         id:$scope.sonPaymentId||'',
	    //         confirmPayMentName:$scope.sonPaymentName||''
        //     }
        //     businessService.confirmPayment(requestParams).then(function(res){
        //         if(res.data.code===1){
        //             // $scope.paymentActionShow = false;
        //             getSubOrderList($scope.mainOrderNum);
        //             $.misMsg(res.data.msg);
        //         }else{
        //             $.misMsg(res.data.msg);
        //         }
        //     })
        // };
        //前往修改页面
        $scope.updateOrder = function(){
            for(let i=0;i<$scope.checkedSubOrderArr.length;i++){
                for(let j=$scope.checkedSubOrderArr.length-1;j>-1;j--){
                    if($scope.checkedSubOrderArr[i].routeNo !==$scope.checkedSubOrderArr[j].routeNo){
                        $.misMsg("只能选择同一程的订单进行修改！")
                        return;
                    }
                }
            }
            let ids = [];let idString;
            if($scope.checkedSubOrderArr.length===0){
                $.misMsg("请选择订单数据！")
            }else{
                for(let i in $scope.checkedSubOrderArr){
                    ids.push($scope.checkedSubOrderArr[i].id)
                }
                idString = ids.join(',')
                $state.go("aep.loc.order_update",{orderId:ids,mainOrderNum:$scope.mainOrderNum,objArr:$scope.checkedSubOrderArr,mainStatue:$scope.mainOrderStatus})
            }
        };
        //删除订单
        $scope.deleteOrder = function(){
            let ids = [];
            if($scope.checkedSubOrderArr.length===0){
                $.misMsg("请选择订单数据！")
            }else{
                for(let i in $scope.checkedSubOrderArr){
                    ids.push($scope.checkedSubOrderArr[i].id)
                }
                let requestParams = {
                    idList:ids,
                    mainOrderNum:$scope.mainOrderNum
                }
                businessService.deleteOrder(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }
        };
        //获取全部车辆（车牌号）
        $scope.getVehicleList = function(){
            let requestParams = {
                status:0
            }
            businessService.getVehicleList(requestParams).then(function(res){
                $scope.vehicleList = res.data.plateNums;
            })
        };
        //获取全部座位数
        $scope.getAllSeatList = function(){
            businessService.getAllSeatList().then(function(res){
                $scope.seatNumArr = res.data.seats;
            })
        };
        $scope.closeConfirm = function(v){
            if(v==='subOrderShow'){
                $scope.getOrderList();
                $scope.subOrderShow = false;
            }
            if(v==='manualSendOrderShow')$scope.manualSendOrderShow = false;
            if(v==='sendOrderDialogShow')$scope.sendOrderDialogShow = false;
            if(v==='manualConfirmShow')$scope.manualConfirmShow = false;
            if(v==='sendModalShow')$scope.sendModalShow = false;
            // if(v==='gatheringActionShow')$scope.gatheringActionShow = false;
            // if(v==='paymentActionShow')$scope.paymentActionShow = false;
        };
        $scope.subOrderShow = false;
        
        $scope.cancelOrder = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要操作的数据！");
            }else{
                // let info = {
                //     title:"提示信息",
                //     content:"是否确定取消所选订单 ？ "
                // }
                // $.misConfirm(info,function(){
                let requestParams = {
                    mainOrderId:selectedRows[0].entity.id
                }
                businessService.cancelOrderMsg(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $scope.getOrderList();
                    }else{
                        $.misMsg(res.data.msg)
                    }
                })
                // })
            }
        };
        $scope.searchKey = function(){
            $scope.isActive = 0;
            $scope.getOrderList();
            params.keyword = $scope.keyword ||"";
            params.orderPayStatus = $scope.orderPayStatus ||"";
            params.orderSource = $scope.orderSource ||"";
            params.orderStatus = $scope.orderStatus ||"";
            params.startTime = $scope.startTime ||"";
            params.endTime = $scope.endTime ||"";
            params.compositor = $scope.compositor ||"";
            params.timeType = $scope.timeType ||"";
            params.driver = $scope.driver ||"";
            params.seats = $scope.seats ||"";
            params.dutyMan = $scope.dutyMan ||"";
            params.suppMan = $scope.suppMan ||"";
            params.plateNum = $scope.plateNum ||"";
            params.routeType = $scope.routeType ||"";
            params.serviceType = $scope.serviceType ||"";
        };
        //查看子订单
        $scope.lookSubOrder = function(obj){
            $scope.subOrderShow = true;
            
            $scope.mainOrderNum = obj.orderNum;//主订单号
            $scope.mainOrderRouteType = obj.mainOrderBase.routeType;//主订单行程类型
            $scope.mainOrderStatus = obj.mainOrderBase.status;//主订单状态
            getSubOrderList($scope.mainOrderNum);
        };
    //     var a = [];
    //     var b = [3,8,2,2,8,10,11,1,1,9,7,1];//要分类的数组
    //    for (var i = 0; i < b.length; i++) {       
    //       if (!a[b[i]]) {
    //           a[b[i]] = [b[i]];
    //         } else {
    //               a[b[i]].push(b[i]);
    //         }
    //      }
        
        function getSubOrderList(mainOrderNum){
            $scope.subOrderClassify = [];
            let requestParams = {
                mainOrderNum:mainOrderNum
            }
            businessService.getSubOrderList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.subOrderList = res.data.data;
                    angular.forEach($scope.subOrderList, function(item){
                        angular.forEach($scope.sonOrderStateArr, function(data){
                            if(data.id===item.status)item.statusName = data.name;
                        })
                        if(item.isExternal===0)item.isExternalName = "未外调";
                        if(item.isExternal===1)item.isExternalName = "已外调";
                        if(item.isExternal===2)item.isExternalName = "外调已锁定";
                        if (!$scope.subOrderClassify[item.routeNo]) {
                            $scope.subOrderClassify[item.routeNo] = [item];
                        } else {
                            $scope.subOrderClassify[item.routeNo].push(item);
                        }
                    });
                    $scope.checkedSubOrderArr = [];
                }
            })
        };
        
        $scope.checkedSubOrderArr = [],//子订单选中集合
        $scope.checkedAccountAll  =false;
        //选择checkbox事件
        $scope.checkedBoxChanged = function(obj){
            if(obj){
                if(obj.checked){
                    for (var i = 0; i < $scope.checkedSubOrderArr.length; i++) {
                        if($scope.checkedSubOrderArr[i].id===obj.id){
                            $scope.checkedSubOrderArr.splice(i,1)
                        }
                    }
                    $scope.checkedSubOrderArr.push(obj);//记录此条数据
                    $scope.subOrderNum = obj.orderNum;
                }else{
                    
                    for(let i=0;i< $scope.checkedSubOrderArr.length;i++){
                        if(obj.id === $scope.checkedSubOrderArr[i].id){
                            $scope.checkedSubOrderArr.splice(i,1);
                        }
                    }
                    
                }
            }
        };
        // let mockData = [
        //     {msg:"派单成功",code:1,},
        //     {msg:'code=1是否再次通过智能派单调起该接口',code:1,cancelNum:'取消订单号'},
        //     {msg:'code=0请手动派单',code:0},
        //     {msg:'code=-1继续派车还是下一辆车',code:-1,currPlateNum:'取消车牌号',nextSeats:20,cancelNum:"取消订单号"},
        //     {msg:'code=-2选择一辆调确认派单接口',code:-2,carOne:{plateNum:'川A66666',cancelNum:'取消订单号'},carTwo:{plateNum:'川A77777',cancelNum:'取消订单号'}},
        //     {msg:'code=-3 选择更大车型',code:-3,nextSeats:30}
        // ];
        function isRepeat(arr){
            var hash = {};
            for(var i in arr) {
                if(hash[arr[i].routeNo])
                return true;
                hash[arr[i].routeNo] = true;
            }
            return false;
        }
        //智能派单获取数据
        $scope.aiSendOrder = function(){
            if($scope.mainOrderStatus==='NOT_CONFIRM'){
                $.misMsg('请先确认主订单！')
                return;
            }
            for(let i in $scope.checkedSubOrderArr){
                if($scope.checkedSubOrderArr[i].isExternal===2){
                    $.misMsg('存在【外调已锁定】状态订单，请重新选择！')
                    return;
                }
            }
            if($scope.mainOrderRouteType==="ONE_WAY"&&$scope.checkedSubOrderArr.length>1){
                $.misMsg("单程接送只能单个派单！")
                return;
            }
            let resOrderNumArr = [],resOrderNum;
            if($scope.checkedSubOrderArr.length===0){
                $.misMsg("请选择订单数据！")
            }else{
                if(isRepeat($scope.checkedSubOrderArr)===true){
                    $.misMsg("只能选择不同行程的订单进行派单！")
                    return;
                }
                // for(let i=0;i<$scope.checkedSubOrderArr.length;i++){
                //     for(let j=$scope.checkedSubOrderArr.length-1;j>-1;j--){
                //         if($scope.checkedSubOrderArr[i].routeNo ===$scope.checkedSubOrderArr[j].routeNo){
                //             $.misMsg("只能选择同一行程的订单进行派单！")
                //             return;
                //         }
                //     }
                // }
                for(let i in $scope.checkedSubOrderArr){
                    resOrderNumArr.push($scope.checkedSubOrderArr[i].orderNum);
                }
                $scope.resOrderNum = resOrderNumArr.join(",");
                $scope.aiResOrderNum = resOrderNum;
                $scope.resAinotContainPn = '';
                $scope.resAiSeats = '';
                $scope.sendModalShow = true;
                // aiSendOrderData(resOrderNum,resAinotContainPn,resAiSeats,0);
            }
        };
        //智能派车选择获取车辆模式
        $scope.chooseSendModal = function(v){
            $scope.sendModalShow = false;
            aiSendOrderData($scope.resOrderNum,$scope.resAinotContainPn,$scope.resAiSeats,v);
        };
        
        //智能派单调用接口
        function aiSendOrderData(orderNum,notContainPn,seats,sendModel){
            $.misShowLoader();
            let requestParams = {
                firstCar:1,
                notContainPn:notContainPn||'',
                seats:seats ||'',
                sendOrderNum:orderNum,
                sendModel:sendModel
            }
            businessService.aiSendOrderData(requestParams).then(function(res){
            // locLayoutService.getMenu().then(function (res) {
                if(res.data.code===1&&res.data.cancelNum===undefined){
                    let info = {
                        title: "提示信息",
                        content: res.data.msg
                    };
                    $.misAlert(info);
                    // $.misMsg(res.data.msg)
                }else if(res.data.code===1&&res.data.cancelNum!==undefined){
                    $scope.codeFlag = res.data.code;
                    $scope.sendOrderPromptMsg = res.data.msg;
                    $scope.sendOrderDialogShow = true;
                    $scope.sendOrderYes = function(){
                        $scope.sendOrderDialogShow = false;
                        $scope.codeFlag = 99;
                        aiSendOrderData(res.data.cancelNum,"","",sendModel);
                        
                    };
                }else if(res.data.code===0){
                    let info = {
                        title: "提示信息",
                        content: res.data.msg
                    };
                    $.misAlert(info);
                }else if(res.data.code===-1){
                    $scope.codeFlag = res.data.code;
                    $scope.sendOrderPromptMsg = res.data.msg;
                    $scope.sendOrderDialogShow = true;

                    let resCancelNum;
                    if(res.data.cancelNum===0||res.data.cancelNum==="0"){
                        resCancelNum = "";
                    }else{
                        resCancelNum = res.data.cancelNum;
                    }
                    //确认派车
                    $scope.keepSendOrder = function(){
                        confirmSendOrder(resCancelNum,res.data.currPlateNum,$scope.resOrderNum);
                    };
                    //下一辆车
                    $scope.nextGetCar = function(){
                        $scope.sendOrderDialogShow = false;
                        $scope.codeFlag = 99;
                        aiSendOrderData(resCancelNum,res.data.currPlateNum,res.data.nextSeats,sendModel)
                    };
                }else if(res.data.code===-2){
                    $scope.codeFlag = res.data.code;
                    $scope.sendOrderPromptMsg = res.data.msg;
                    $scope.sendOrderDialogShow = true;
                    $scope.carOneObj = res.data.carOne;
                    $scope.carTwoObj = res.data.carTwo;
                    let resOneCancelNum,resTwoCancelNum;
                    if(res.data.carOne.cancelNum===0||res.data.carOne.cancelNum==="0"){
                        resOneCancelNum = "";
                    }else{
                        resOneCancelNum = res.data.carOne.cancelNum;
                    }
                    if(res.data.carTwo.cancelNum===0||res.data.carTwo.cancelNum==="0"){
                        resTwoCancelNum = "";
                    }else{
                        resTwoCancelNum = res.data.carTwo.cancelNum;
                    }
                    //选择第一辆
                    $scope.chooseCarOne = function(){
                        confirmSendOrder(resOneCancelNum,res.data.carOne.plateNum,$scope.resOrderNum);
                    };
                    //选择第二辆
                    $scope.chooseCarTwo = function(){
                        confirmSendOrder(resTwoCancelNum,res.data.carTwo.plateNum,$scope.resOrderNum);
                    };

                }else if(res.data.code===-3){
                    $scope.codeFlag = res.data.code;
                    $scope.sendOrderPromptMsg = res.data.msg;
                    $scope.sendOrderDialogShow = true;
                    $scope.chooseBigCar = function(){
                        $scope.sendOrderDialogShow = false;
                        $scope.codeFlag = 99;
                        console.log($scope.aiResOrderNum)
                        aiSendOrderData($scope.resOrderNum,"",res.data.nextSeats,sendModel)
                    };
                }
            }).finally(function(){
                $.misHideLoader() 
            })
        };
        //线上确认派车
        function confirmSendOrder(cancelNum,plateNum,sendOrderNum){
            let requestParams = {
                cancelNum:cancelNum,
                plateNum:plateNum,
                sendOrderNum:sendOrderNum
            }
            businessService.confirmOnlineSendOrder(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.sendOrderDialogShow = false;
                    $scope.codeFlag = 99;
                    $.misMsg(res.data.msg)
                    getSubOrderList($scope.mainOrderNum);
                }else{
                    $.misMsg(res.data.msg)
                }
            }).finally(function(){
                $.misHideLoader() 
            })
        };
        
        //人工派单
        $scope.manualSendOrder = function(){
            if($scope.mainOrderStatus==='NOT_CONFIRM'){
                $.misMsg('请先确认主订单！')
                return;
            }
            if($scope.mainOrderRouteType==="ONE_WAY"&&$scope.checkedSubOrderArr.length>1){
                $.misMsg("单程接送只能单个派单！")
                return;
            }
            if(isRepeat($scope.checkedSubOrderArr)===true){
                $.misMsg("只能选择不同行程的订单进行派单！")
                return;
            }
            for(let i in $scope.checkedSubOrderArr){
                if($scope.checkedSubOrderArr[i].isExternal===2){
                    $.misMsg('存在【外调已锁定】状态订单，请重新选择！')
                    return;
                }
                for(let j in $scope.seatNumArr){
                    if($scope.checkedSubOrderArr[i].needSeats===Number($scope.seatNumArr[j])){
                        $scope.manualSeats = $scope.seatNumArr[j];
                    }
                }
            }
            if($scope.checkedSubOrderArr.length===0){
                $.misMsg("请选择订单数据！")
            }else{
                $scope.getVehicleList();
                $scope.getAllSeatList();
                $scope.showTabOne = true;
                $scope.manualSendOrderShow = true;
                getPartunitList();
            }
        };
        //获取业务车队
        function getPartunitList(){
            let requestParams = {
                cusType:"PARTUNIT"
            }
            businessService.getOffLinPartunitList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.partunitList = res.data.data;
                }else{
                    $.misMsg(res.data.msg)
                }
            })
        };
        //选择业务车队获取业务负责人
        $scope.selectOfflineSuppCar = function(){
            $scope.ownerPersonList = [];
            for(let i in $scope.partunitList){
                if($scope.offlineSuppCar===($scope.partunitList[i].id).toString()){
                    $scope.serviceMan = $scope.partunitList[i].serviceMan;
                    if($scope.partunitList[i].personInCharge!==null &&$scope.partunitList[i].personInCharge.length!==0){
                        $scope.ownerPersonList = $scope.partunitList[i].personInCharge;
                    }else{
                        let info = {
                            name:$scope.partunitList[i].baseUserId.realName,
                            phone:$scope.partunitList[i].baseUserId.phone,
                            companyName:$scope.partunitList[i].unitName
                        }
                        $scope.ownerPersonList.push(info);
                    }
                    $scope.offlineSuppCarHead = $scope.ownerPersonList[0].name;
                }
            }
        };
        //人工派单线上获取车辆
        let manualNotContainPn = "";
        $scope.manualNotContainPnArr = [];
        $scope.searchSendVehicle = function(v,manualNotContainPn){
            let resSendOrderNum = [];
            for(let i in $scope.checkedSubOrderArr){
                resSendOrderNum.push($scope.checkedSubOrderArr[i].orderNum);
            }
            let requestParams = {
                avgSpeed:$scope.manualAvgSpeed||0,
                notContainPn:manualNotContainPn ||"",
                plateNum:$scope.manualPlateNum ||"",
                runArea:$scope.manualRunArea ||0,
                seats:$scope.manualSeats ||"",
                selfOwned:$scope.manualSelfOwned||"",
                force:v,
                sendOrderNum:resSendOrderNum.join(",")||""
            }
            businessService.manualSendOrderGetCar(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.sendOrderPromptMsg = "查询到车辆 "+res.data.data.plateNumber+" ，请继续操作。"
                    $scope.manualConfirmShow = true;
                    //继续派车
                    $scope.offineKeepSendOrder = function(){
                        confirmSendOrder("",res.data.data.plateNumber,resSendOrderNum.join(","))
                        $scope.manualConfirmShow = false;
                        manualSendOrderShow = false;
                    };
                    //下一辆车
                    $scope.offlineNextGetCar = function(){
                        $scope.manualNotContainPnArr.push(res.data.data.plateNumber)
                        $scope.searchSendVehicle(v,$scope.manualNotContainPnArr.join(','));
                    };
                    // $.misMsg(res.data.msg)
                }else{
                    $.misMsg(res.data.msg)
                }
            }).finally(function(){
                $.misHideLoader() 
            })
        };
        //人工线下获取车辆
        $scope.manualOffLineSave = function(){
            $.misShowLoader() 
            let resSubOrderArr = [],resSuppCar,resSuppCarHead;
            for(let i in $scope.checkedSubOrderArr){
                resSubOrderArr.push($scope.checkedSubOrderArr[i].orderNum)
            }
            for(let i in $scope.partunitList){
                if(Number($scope.offlineSuppCar)===$scope.partunitList[i].id){
                    resSuppCar = $scope.partunitList[i].unitName;
                }
            }
            for(let i in $scope.ownerPersonList){
                if($scope.offlineSuppCarHead===$scope.ownerPersonList[i].name){
                    resSuppCarHead = $scope.ownerPersonList[i].phone+","+$scope.ownerPersonList[i].name;
                }
            }
            let requestParams = {
                suppCarHead:resSuppCarHead ||"",
                suppCar:resSuppCar ||"",
                sendPrice:$scope.offlineSendPrice ||0,
                sendPlateNum:$scope.offlinePlateNum ||"",
                driverInfo:$scope.offlineDriverPhone+','+$scope.offlineDriverName||"",
                driverGath:$scope.offlineDriverGath ||0,
                sendOrderNum:resSubOrderArr.join(',')||""
            }
            businessService.manualOfflineSendOrder(requestParams).then(function(res){
                if(res.data.code===1){
                    $.misMsg(res.data.msg)
                    $scope.manualSendOrderShow = false;
                    getSubOrderList($scope.mainOrderNum);
                }else{
                    $.misMsg(res.data.msg)
                }
            }).finally(function(){
                $.misHideLoader() 
            })
        };
        $scope.checkTab = function(){
            $scope.showTabOne = !$scope.showTabOne;
        };
        $scope.closeManualSendConfirm = function(){
            $scope.manualSendOrderShow = false;
        };
        //外调操作
        $scope.confirmCar = function(v){
            let ids = [];
            if($scope.checkedSubOrderArr.length===0){
                $.misMsg("请选择订单数据！");
                return;
            }
            for(let i in $scope.checkedSubOrderArr){
                ids.push($scope.checkedSubOrderArr[i].id)
            }
            let requestParams = {
                mainOrderNum:$scope.mainOrderNum,
                idList:ids
            }
            //外调
            if(v==='setExternal'){
                businessService.orderSetExternal(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                //取消外调
            }else if(v==='cancelExternal'){
                businessService.orderCancelExternal(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                //锁定外调
            }else if(v==='lockExternal'){
                businessService.orderLockExternal(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                //解锁外调
            }else if(v==='unlockExternal'){
                businessService.orderUnlockExternal(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }else if(v==='JLConfirm'){
                if($scope.checkedSubOrderArr.length>1){
                    $.misMsg("请选择一条数据");
                }else if($scope.checkedSubOrderArr[0].status !=='JL_NOT_CONFIRM'){
                    $.misMsg("请确认该订单状态处于【经理未确认派车】");
                }
                let JLparams = {
                    carOrderId:$scope.checkedSubOrderArr[0].id
                }
                businessService.JLConfirmSendOrder(JLparams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        getSubOrderList($scope.mainOrderNum);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }
        };
        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };
        $scope.compileOrder = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.order_compile",{flag:v,orderId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else{
                    $state.go("aep.loc.order_compile",{flag:v,orderId:selectedRows[0].entity.id})
                }
            }
        };
        $.datetimepicker.setLocale('ch');
        $('#startTime,#endTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            // minDate: new Date(),
            step: 1,  //时间间隔为1  分钟
        });
        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        $scope.init();
    }])