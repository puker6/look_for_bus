'use strict';

businessModule.controller('orderUpdateController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','businessService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,businessService) {

        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.paramsIds = [];
        $scope.limitNumShow = true;
        if(Array.isArray($scope.params.orderId)===false){
            $scope.paramsIds.push($scope.params.orderId)
        }else{
            $scope.paramsIds = $scope.params.orderId;
        }
        $scope.init = function(){
            $scope.getClientList();
            $scope.getServiceManList(); 
        };
        $scope.getClientList = function(){
            let requestParams = {
                page:1,
                rows:100,
                find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum,
                unitName:'',
                serviceMan:'',
                recomMan:'',
            }
            businessService.getClientList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.clientList = res.data.data;
                    $scope.getOrderMsgById();
                }
            });
        };
        $scope.serviceManList = [];
        $scope.getServiceManList = function(){
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            businessService.getServiceManList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.serviceManList = res.data.data;
                    let info = {
                        realName:userMsg.company.baseUserId.realName,
                        phone:userMsg.company.baseUserId.phone
                    }
                    $scope.serviceMan = info.realName;
                    $scope.serviceManList.push(info);
                }
            })
        };
        $scope.selectClient = function(){
            $scope.ownerPersonList = [];
            for(let i in $scope.clientList){
                if($scope.clientId===($scope.clientList[i].id).toString()){
                    $scope.serviceMan = $scope.clientList[i].serviceMan;
                    if($scope.clientList[i].personInCharge!==null &&$scope.clientList[i].personInCharge.length!==0){
                        $scope.ownerPersonList = $scope.clientList[i].personInCharge;
                    }else{
                        let info = {
                            name:$scope.clientList[i].baseUserId.realName,
                            phone:$scope.clientList[i].baseUserId.phone,
                            companyName:$scope.clientList[i].unitName
                        }
                        $scope.ownerPersonList.push(info);
                    }
                    $scope.ownerPerson = $scope.ownerPersonList[0].name;
                }
            }
        };
        $scope.getOrderMsgById = function(){
            let requestParams = {
                id:$scope.paramsIds[0]
            }
            businessService.getOrderMsgById(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.orderMsg = res.data.data;
                    $scope.linkName = $scope.orderMsg.carOrderBase.routeLink.split("-")[0];
                    $scope.linkPhone = $scope.orderMsg.carOrderBase.routeLink.split("-")[1];
                    $scope.stime = $scope.orderMsg.stime;
                    $scope.etime = $scope.orderMsg.etime;
                    $scope.needSeats = $scope.orderMsg.needSeats;
                    $scope.needCars = $scope.orderMsg.needCars;
                    $scope.price = $scope.orderMsg.price;
                    $scope.disPrice = $scope.orderMsg.disPrice;
                    $scope.routeDetail = $scope.orderMsg.routeDetail;
                    $scope.note = $scope.orderMsg.note;
                    $scope.reasonTime = $scope.orderMsg.reasonTime;
                    $scope.limitNum = $scope.orderMsg.limitNum;
                    $scope.otherPrice = $scope.orderMsg.otherPrice;
                    $scope.otherPriceNote = $scope.orderMsg.otherPriceNote;
                    $scope.remDriverCharge = $scope.orderMsg.remDriverCharge;
                    $scope.serviceMan = $scope.orderMsg.carOrderBase.serviceMan;
                    $scope.ownerPerson = $scope.orderMsg.carOrderBase.dutyService;
                    for(let i in $scope.clientList){
                        if($scope.orderMsg.carOrderBase.baseUserId.uname===$scope.clientList[i].baseUserId.uname){
                            $scope.clientId = ($scope.clientList[i].id).toString();
                        }
                    }
                    if($scope.needSeats>9){
                        $scope.limitNumShow = false;
                    }
                    $scope.selectClient();
                }
            })
        };
        $scope.saveUpdateOrderMsg = function(){
            $.misShow3DLoader()
            let requestParams = {
                companyCusId:$scope.clientId||'',
                dutyService:$scope.ownerPerson ||'',
                idList:$scope.paramsIds,
                mainOrderNum:$scope.params.mainOrderNum,
                routeNo:$scope.orderMsg.routeNo,
                routeLink:$scope.linkName +"-"+$scope.linkPhone||"",
                serviceMan:$scope.serviceMan ||"",
                stime:$scope.stime ||"",
                etime:$scope.etime||"",
                needSeats:$scope.needSeats ||"",
                needCars:$scope.needCars ||"",
                price:$scope.price ||0,
                disPrice:$scope.disPrice ||0,
                routeDetail:$scope.routeDetail ||"",
                note:$scope.note||"",
                reasonTime:$scope.reasonTime ||"",
                limitNum:$scope.limitNum||"",
                otherPrice:$scope.otherPrice ||0,
                otherPriceNote:$scope.otherPriceNote ||"",
                remDriverCharge:$scope.remDriverCharge ||0
            }
            businessService.saveUpdateOrderMsg(requestParams).then(function(res){
                if(res.data.code===1){
                    $.misMsg(res.data.msg);
                    $state.go("aep.loc.order_list")
                }else{
                    $.misMsg(res.data.msg);
                }
            }).finally(function(){
                $.misHide3DLoader()
            });
        };
        $scope.backPage = function(){
            $state.go("aep.loc.order_list");
        };
        $.datetimepicker.setLocale('ch');
        $('#stime,#etime').datetimepicker({
            format: "Y-m-d H:i",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            minDate: new Date(),
            step: 1,  //时间间隔为1
        });
        $scope.init();
    }])