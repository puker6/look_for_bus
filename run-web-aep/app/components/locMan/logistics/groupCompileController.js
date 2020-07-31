'use strict';

logisticsModule.controller('groupCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','logisticsService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,logisticsService,officeService,) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        $scope.params.flag==='add'?$scope.title = "添加小组":$scope.title ="编辑小组";
        
        

        //查询小组信息
        $scope.findGroupById = function(){
            let requestParams = {
                id:$scope.params.groupId||''
            }
            logisticsService.findGroupById(requestParams).then(function(res){
                // console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 小组名称 */
                    $scope.groupName  = result.groupName;
                    /** 联系人姓名 */
                    $scope.linkName = result.linkName;
                    /** 联系人电话 */
                    $scope.linkPhone = result.linkPhone;
                }
            })
        }

        // 添加小组
        $scope.saveData = function(){
            if($scope.params.flag === 'edit'){
                // 检测小组是否存在
                let requestParams = {
                    groupName:$scope.groupName,
                    groupId: $scope.params.groupId
                }
                logisticsService.findGroupByName(requestParams).then(function(res){
                    if(res.data.code === 1){
                        $.misMsg(res.data.msg);
                    }else{
                            // 添加-提交
                            let requestParams = {
                                id: $scope.params.groupId ||'',
                                /** 小组名称 */
                                groupName: $scope.groupName || "",
                                /** 联系人姓名 */
                                linkName: $scope.linkName || "",
                                /** 联系人电话 */
                                linkPhone: $scope.linkPhone || ""
                            }
                            logisticsService.subGroupAdup(requestParams).then(function(res){
                                // console.log(res)
                                if(res.data.code ===1){
                                    $state.go("aep.loc.group_list");
                                    $.misMsg(res.data.msg);
                                }else{
                                    $.misMsg(res.data.msg);
                                }
                            })
                        
                    }
                })
            }else{
                 // 检验小组是否存在
                    let requestParams = {
                        groupName:$scope.groupName
                    }
                    logisticsService.findGroupByName(requestParams).then(function(res){
                        if(res.data.code === 1){
                            $.misMsg(res.data.msg);
                        }else{
                                // 添加-提交
                                let requestParams = {
                                    id:'',
                                    /** 小组名称 */
                                    groupName: $scope.groupName || "",
                                    /** 联系人姓名 */
                                    linkName: $scope.linkName || "",
                                    /** 联系人电话 */
                                    linkPhone: $scope.linkPhone || ""
                                }
                                logisticsService.subGroupAdup(requestParams).then(function(res){
                                    // console.log(res)
                                    if(res.data.code ===1){
                                        $state.go("aep.loc.group_list");
                                        $.misMsg(res.data.msg);
                                    }else{
                                        $.misMsg(res.data.msg);
                                        console.log(res.data.msg)
                                    }
                                })
                            
                        }
                    })
                
                
            }
        }


        $scope.backPage = function(){
            $state.go("aep.loc.group_list");
        };

        ($scope.init = function(){
            if($scope.params.flag==='edit'){
                $scope.findGroupById();
            }
        })();

        // $scope.init();
    }])