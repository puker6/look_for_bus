'use strict';

systemCenterModule.controller('amountCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','logisticsService','officeService','systemCenterService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,logisticsService,officeService,systemCenterService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        $scope.params.flag==='add'?$scope.title = "添加金额类型":$scope.title ="编辑金额类型";
        
        

        //查询
        $scope.mtypeFindById = function(){
            let requestParams = {
                id:$scope.params.amountId||''
            }
            systemCenterService.mtypeFindById(requestParams).then(function(res){
                // console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 类型名称 */
                    $scope.typeName  = result.typeName;
                }
            })
        }

        // 添加
        $scope.saveData = function(){
            if($scope.params.flag === 'edit'){
                // 修改-提交
                let requestParams = {
                    updId: $scope.params.amountId ||'',
                    /** 类型名称 */
                    typeName: $scope.typeName || "",
                }
                systemCenterService.adupMtype(requestParams).then(function(res){
                    // console.log(res)
                    if(res.data.code ===1){
                        $state.go("aep.loc.amount_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })       
            }else{
                // 添加-提交
                let requestParams = {
                    updId:'',
                    /** 类型名称 */
                    typeName: $scope.typeName || ""
                }
                systemCenterService.adupMtype(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.amount_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                        console.log(res.data.msg)
                    }
                })
            }
        }


        $scope.backPage = function(){
            $state.go("aep.loc.amount_list");
        };

        ($scope.init = function(){
            if($scope.params.flag==='edit'){
                $scope.mtypeFindById();
            }
        })();

        // $scope.init();
    }])