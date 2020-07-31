'use strict';

logisticsModule.controller('vehicleListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','logisticsService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,logisticsService,) {

        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#startTime,#endTime').datetimepicker({
            format: "Y-m-d H:i:s",      //格式化日期
            timepicker: true,    //打开时间选项
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
        // 车辆性质
        $scope.carUsageArr = [
            {id:'TRAVELTRANS',name:'旅游客运'},
            {id:'TRAVELTRANSNET',name:'旅游客运上网'},
            {id:'HIGHWAYTRANS',name:'公路客运'},
            {id:'HIGHWAYTRANSNET',name:'公路客运上网'},
            {id:'LEASE',name:'租赁'},
        ];
        // 车辆类型
        $scope.vehicleTypeArr = [
            {id:'BUS',name:'大巴车'},
            {id:'MINIBUS',name:'中巴车'},
            {id:'MPV',name:'商务车'},
            {id:'SUV',name:'越野车'},
            {id:'CAR',name:'轿车'},
            {id:'OTHERS',name:'其他'},
        ]; 
        // 车辆状态
        $scope.statusArr = [
            {id:'0',name:'正常'},
            {id:'1',name:'维修'},
            {id:'2',name:'报停'},
            {id:'3',name:'下线'},
        ]; 
        // 动力来源
        $scope.powerSourceArr = [
            {id:'GASOLINE',name:'汽油'},
            {id:'DIESEL',name:'柴油'},
            {id:'CNG',name:'CNG'},
            {id:'NEWENERGY',name:'新能源'},
        ]; 
        // 可跑区域
        $scope.runningAreaArr = [
            {id:'0',name:'不限区域'},
            {id:'1',name:'省际包车'},
            {id:'2',name:'市际包车'},
            {id:'3',name:'县际包车'},
        ]; 

        // 获取车辆品牌
        $scope.getAllCarBrand = function(){
            logisticsService.getAllCarBrand().then(function(res){
                // console.log(res)
                if(res.data.code === 1){
                    let result = res.data;
                    $scope.allCarBrand = result.data;
                    // console.log($scope.allCarBrand)
                }
            })
            
        }
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

    


        $scope.vehicleListFind = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum ||"",
                phone:$scope.phone ||"",
                plateNumber:$scope.plateNumber ||"",
                seats:$scope.seats ||"",
                belongCompany:$scope.belongCompany ||"",
                carUsage:$scope.carUsage ||"",
                groupName:$scope.groupName||"",
                startTime:$scope.startTime||"",
                endTime:$scope.endTime||"",

            } 
            logisticsService.vehicleListFind(requestParams).then(function(res){
                // console.log(res)
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    // $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){  
                        // item.baseUserId.all = item.baseUserId.phone+'/'+ item.baseUserId.realName;
                        angular.forEach($scope.carUsageArr, function(data){
                            if(data.id===item.carUsage)item.carUsage = data.name;
                        });
                        angular.forEach($scope.vehicleTypeArr, function(data){
                            if(data.id===item.vehicleType)item.vehicleType = data.name;
                        });
                        angular.forEach($scope.statusArr, function(data){
                            if((data.id).toString()===(item.status).toString())item.status = data.name;
                        });
                        angular.forEach($scope.powerSourceArr, function(data){
                            if(data.id===item.powerSource)item.powerSource = data.name;
                        });
                        angular.forEach($scope.runningAreaArr, function(data){
                            if((data.id).toString()===(item.runningArea).toString())item.runningArea = data.name;
                        });
                        angular.forEach($scope.allCarBrand, function(data){
                            if(data.id===item.brandId)item.brandId = data.carBrand;
                        })
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
            // console.log(params.keyword)
            $scope.vehicleListFind();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {
                name: '主驾驶员', width: 200,enableColumnMoving: false,pinnedRight:true,enablePinning: false,cellClass: 'grid-status-label',
                cellTemplate: `
                <div class="handle-click-a" ng-if="row.entity.baseUserId">
                <a class="handle-click-a">{{row.entity.baseUserId.phone}}【{{row.entity.baseUserId.realName}}】</a>
                <a class="handle-click-a">下线</a>
                </div>
                <a class="handle-click-a" ng-if="!row.entity.baseUserId" ng-click="grid.appScope.setDriver(row.entity)">未设置主驾驶员</a>`
            },
            // {name: 'travelLicensePhotoURL', displayName: '图片',minWidth: 150, enablePinning: false,
            // cellTemplate: `<a class="handle-click-a" ng-if="row.entity.travelLicensePhotoURL" ng-click="grid.appScope.lookImg(row.entity)"><i class="fa fa-search">&nbsp;</i></a>
            // <a class="handle-click-a" ng-if="!row.entity.travelLicensePhotoURL">无</a>`},
            {name: 'plateNumber', displayName: '车牌号',minWidth: 100, enablePinning: false},
            {name: 'seats', displayName: '座位数',minWidth: 80, enablePinning: false},
            {name: 'carUsage', displayName: '车辆性质',minWidth: 100, enablePinning: false},
            {name: 'belongCompanyName', displayName: '所属公司',minWidth: 140, enablePinning: false},             
            {name: 'purchaseDate', displayName: '购车日期',minWidth: 150, enablePinning: false},
            {name: 'vehicleType', displayName: '车辆类型',minWidth: 100, enablePinning: false},
            {name: 'status', displayName: '车辆状态',minWidth: 100, enablePinning: false},
            // {name: 'brandId', displayName: '车辆品牌',minWidth: 100, enablePinning: false},
            {name: 'powerSource', displayName: '动力来源',minWidth: 140, enablePinning: false},             
            {name: 'mileage', displayName: '续航里程',minWidth: 100, enablePinning: false},
            {name: 'fuel', displayName: '正常油耗',minWidth: 100, enablePinning: false},
            {name: 'dockedAddress', displayName: '停靠地址全称',minWidth: 100, enablePinning: false},
            {name: 'drivingType', displayName: '驾照需求',minWidth: 100, enablePinning: false},
            {name: 'belongComapnySimName', displayName: '所属公司简称',minWidth: 140, enablePinning: false},             
            {name: 'runningArea', displayName: '可跑区域',minWidth: 150, enablePinning: false},
        ];

        // 增加或者修改
        $scope.compileVehicle = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            // console.log(v)
            if(v==='add'){
                $state.go("aep.loc.vehicle_compile",{flag:v,vehicleId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else if(selectedRows.length >1){
                    $.misMsg("请选择一条需要修改的数据！");
                }else{
                    $state.go("aep.loc.vehicle_compile",{flag:v,vehicleId:selectedRows[0].entity.id})
                }
            }
        }
        // 删除
        $scope.deleteVehicle = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定删除所选车辆 ？ "
                }
                $.misConfirm(info,function(){
                    angular.forEach(selectedRows,function(data){
                        dataList.push(data.entity.id)
                    })
                    $scope.delectIds = dataList.join(",")
                    let requestParams = {
                        id:$scope.delectIds
                    }
                    logisticsService.vehicleDelete(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            console.log(res)
                            $.misMsg(res.data.msg);
                            $state.reload();
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                })
            }
        };
        // 设置为主驾驶员
        $scope.setDriver = function(obj){
            // console.log(obj)
            $scope.driverId = obj.id;
            $scope.driverShow = true;
            // 获取驾驶员列表
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            logisticsService.getDriverList(requestParams).then(function(res){
                let result = res.data.data;
               
                $scope.driverList = result;
            })
        };

        // 查看图片
        $scope.lookImg = function(obj){
            console.log(obj);
        }

        $scope.setDriverBtn = function(){
            if($scope.driverSelect == '' ||$scope.driverSelect == undefined){
                $.misMsg("请选择驾驶员");
            }else{
                let requestParams = {
                    uname:$scope.driverSelect
                }
                logisticsService.checkBeforeSetDriver(requestParams).then(function(res){
                    if(res.data.code === 0){
                        $.misMsg(res.data.msg);
                        return false;
                    }else if(res.data.code === 1){
                        let requestParams = {
                            id:$scope.driverId,
                            uname:$scope.driverSelect
                        }
                        logisticsService.setDriver(requestParams).then(function(res){
                            if (res.data.code === 1) {
                                $.misMsg(res.data.msg);
                                $state.reload();
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        })
                    }
                })
            }
        }



        $scope.closeConfirm = function(){
            $scope.driverShow = false;
        }

        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        ($scope.init = function(){
            $scope.vehicleListFind();
            $scope.getAllCarBrand();
        })();
    }])