'use strict';

financeModule.controller('bankManageCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "添加银行":$scope.title ="编辑银行";

        $scope.backPage = function(){
        $state.go("aep.loc.bank_manage");
        };

        // 获取科目列表
        $scope.findCourses = function(){
            let requestParams = {
                tips: 'last',
            } 
            financeService.findCourses(requestParams).then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.feeCourseList = res.data.data;
                console.log($scope.feeCourseList)
            })
        };

        // 检验账号-输入框的格式是否正确
        $scope.$watch('cardNo',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if($scope.cardNo.length > 19){
                    $scope.seats = oldValue;
                    return false;
                }else if(!(/^[1-9]\d*$/.test($scope.cardNo))){
                    $scope.cardNo = oldValue;
                    return false;
                }
            }
        });
        //查询银行信息
        $scope.bankFindById = function(){
            let requestParams = {
                id:$scope.params.bankManageId ||''
            }
           financeService.bankFindById(requestParams).then(function(res){
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 账户名称 */
                    $scope.bankName  = result.bankName;
                    /** 开户行 */
                    $scope.cardName = result.cardName;
                    /** 账号 */
                    $scope.cardNo= result.cardNo;
                }
            })
        }


        // 添加/修改银行
        $scope.saveData = function(){
            if($scope.params.flag === 'edit'){
                // 修改-提交
                let requestParams = {
                    updId:$scope.params.bankManageId ||'',
                    /** 账户名称 */
                    bankName: $scope.bankName || "",
                    /** 开户行 */
                    cardName: $scope.cardName || "",
                    /** 账号 */
                    cardNo: $scope.cardNo || ""
                }
                financeService.adupBank(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.bank_manage");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }else{
                 // 添加-提交
                 let requestParams = {
                    /** 账户名称 */
                    bankName: $scope.bankName || "",
                    /** 开户行 */
                    cardName: $scope.cardName || "",
                    /** 账号 */
                    cardNo: $scope.cardNo || "",
                    /** 关联科目 */
                    courseId: $scope.courseId || ""
                }
                financeService.adupBank(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.bank_manage");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                            
                   
                
                
            }
        };

        ($scope.init = function(){
            $scope.findCourses();
            if($scope.params.flag==='edit'){
                $scope.bankFindById();
            }
        })();


        
    }])