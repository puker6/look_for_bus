'use strict';

financeModule.controller('bankAccountCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "添加银行账":$scope.title ="编辑银行账";
        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#tradeTime').datetimepicker({
            format: "Y-m-d H:i:00",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        
        $scope.backPage = function(){
        $state.go("aep.loc.bank_account");
        };

        // 获取对方户名/摘要/
        $scope.findTransNamesAndRemarks = function(){
            financeService.findTransNamesAndRemarks().then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.transNamesList = res.data.transNames;
                $scope.datas = res.data.transNames;
                $scope.remarksList = res.data.remarks;
            })
        };
        // 获取焦点选择框出现
        $scope.focusName = function(){
            $scope.transNamesList = $scope.datas;
            if($scope.transNamesList !=''){
                $scope.transNameSelectShow = true;
            }
           
        }

        // 获取金额类型
        $scope.findMtypes = function(){
            financeService.findMtypes().then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.findMtypesList = res.data.mTypes;
                console.log($scope.findMtypesList)
            })
        };

        // $scope.blurName = function(){
        //     $scope.transNamesList = $scope.datas;
        //     let transNameSelect = $scope.transNameSelect;
        //     console.log(transNameSelect)
        //     if(transNameSelect == undefined){
        //         $scope.transNameSelectShow = false;
        //     }else{
        //     $scope.transName = ($scope.transNameSelect[0].split("/"))[0];
        //     $scope.transNum = ($scope.transNameSelect[0].split("/"))[1];
        //     }
            
        // }
        
        //将下拉选的数据值赋值给文本框
        $scope.optionClick = function(){
            $scope.transNameSelectShow = false;
            let transNameSelect = $scope.transNameSelect[0];
            $scope.transName = (transNameSelect.split("/"))[0];
            if((transNameSelect.split("@"))[1] =="null" || (transNameSelect.split("@"))[1] == ""){
                $scope.transNum = "";
            }else{
                $scope.transNum = (transNameSelect.split("@"))[1];
                // $scope.transNamesList = $scope.datas;
            }
        }
        $scope.transNameInput = function(){
            let transNameSelect = $scope.transNameSelect[0];
            $scope.transName = (transNameSelect.split("/"))[0];
            if((transNameSelect.split("@"))[1] =="null" || (transNameSelect.split("@"))[1] == ""){
                $scope.transNum = "";
            }else{
                $scope.transNum = (transNameSelect.split("@"))[1];
                // $scope.transNamesList = $scope.datas;
            }
            $scope.transNameSelectShow = false;
        }

        //获取的数据值与下拉选逐个比较，如果包含则放在临时变量副本，并用临时变量副本替换下拉选原先的数值，如果数据为空或找不到，就用初始下拉选项副本替换
        $scope.changeKeyValue=function(v){
            var newDate=[]; //临时下拉选副本
        //如果包含就添加
        angular.forEach($scope.transNamesList ,function(data){
           if(data.indexOf(v)>=0){
            newDate.unshift(data);
            }
        });
        //用下拉选副本替换原来的数据
        $scope.transNamesList=newDate;
        //如果不包含或者输入的是空字符串则用初始变量副本做替换
            if($scope.transNamesList.length==0 || ''==v){
                // $scope.transNamesList = $scope.datas
                $scope.transNum ='';
                $scope.transNamesList=$scope.datas;
                $scope.transNameSelectShow = false
            }else if(v !=''){
                $scope.transNameSelectShow = true;
                $scope.transNameSelect='';
            }
        };

        // 选中对方户名/账号时添加到input中
        // $scope.transNameInput = function(){
        //     let transNameSelect = $scope.transNameSelect;
        //     $scope.transName = (transNameSelect.split("/"))[0];
        //     $scope.transNum = (transNameSelect.split("/"))[1];
        // }

        // 选中摘要时添加到input中
        $scope.remarkInput = function(){
            let remarkSelect = $scope.remarkSelect;
            $scope.remark = remarkSelect;
        }
        // 获取我的银行
        $scope.findBanks = function(){
            let requestParams = {
                isOpen: '1',
            } 
            financeService.findBanks(requestParams).then(function(res){
                // console.log(res)
                if(res.data.code ===1){
                    let result = res.data.banks;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    $scope.myBankList = result ;
                }
            })
        };

        // 根据所选的银行信息来获取余额余额
        $scope.myBankSelect = function(){
            $scope.tradeMoney = '';
            let requestParams = {
                bankName:($scope.myBank.split("/"))[0],
                bankNo:($scope.myBank.split("/"))[1]
            }
            financeService.findBalanceByBankInfo(requestParams).then(function(res){
               if(res.data.code ===1){
                    $scope.balanceYe = res.data.balance;
                    $scope.balanceJs = res.data.balance;
                    $scope.balance = $scope.balanceYe
                }else{
                    $scope.balanceYe = '';
                    $scope.balanceJs = '';
                    $scope.balance = '';
                }
            })
        };

        // 支出状态改变
        $scope.tradeStatusSelect = function(){
            $scope.tradeMoney = '';
            $scope.balance = $scope.balanceYe
        }

        // 余额随交易金额变化
        $scope.tradeMoneyInput = function(){
            if($scope.tradeStatus == "0"){
                $scope.balance = Number($scope.balanceJs) + Number($scope.tradeMoney)
                if($scope.tradeMoney == undefined){
                    $scope.balance = $scope.balanceYe
                }else{
                    $scope.balance = Number($scope.balanceJs) + Number($scope.tradeMoney)
                }
            }else{
                $scope.balance =  Number($scope.balanceJs) - Number($scope.tradeMoney)
                if($scope.tradeMoney == undefined){
                    $scope.balance = $scope.balanceYe
               }else{
                    $scope.balance =  Number($scope.balanceJs) - Number($scope.tradeMoney)
               }
            }
        }

        //查询银行信息
        $scope.findBtlById = function(){
            let requestParams = {
                id:$scope.params.bankAccountId ||''
            }
           financeService.findBtlById(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 我的银行 */
                    $scope.myBank  = result.myBankName+'/'+result.myBankNum;
                    /** 金额类型 */
                    $scope.moneyType = (result.moneyTypeId.id).toString();
                    /** 对方户名 */
                    $scope.transName= result.transName;
                    /** 对方账号 */
                    $scope.transNum = result.transNum;
                    /** 交易时间 */
                    $scope.tradeTime = result.tradeTime;
                    /** 交易金额-收入tradeInMoney/收入tradeOutMoney */
                    if(result.tradeInMoney == ''){
                        $scope.tradeMoney= result.tradeOutMoney;
                        $scope.tradeStatus = "1";
                    }else{
                        $scope.tradeMoney = result.tradeInMoney;
                        $scope.tradeStatus = "0";

                    }
                    /** 余额 */
                    $scope.balance = result.balance;
                    /** 摘要 */
                    $scope.remark = result.remark;
                }
            })
        }

        // 添加/修改银行
        $scope.saveData = function(v){
            if($scope.params.flag === 'edit'){
                // 修改-提交
                let requestParams = {
                    /** id */
                    updId:$scope.params.bankAccountId,
                    /** 金额类型 */
                    moneyType: $scope.moneyType,
                    /** 摘要 */
                    remark: $scope.remark || "",
                }
                financeService.modifyBtl(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.bank_account");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }else{
                 // 添加-提交
                 // 检验余额的格式是否正确
                if(!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test($scope.balance))){
                    $.misMsg("余额不允许为负，请检查账单记录");
                }else{
                    let requestParams = {
                        /** 交易后余额 */
                        balance: ($scope.balance).toString(),
                        /** 金额类型  */
                        moneyType: $scope.moneyType || "",
                        /** 我的银行 */
                        myBank: $scope.myBank  || "",
                        /** 摘要 */
                        remark: $scope.remark || "",
                        /** 交易金额 */
                        tradeMoney: $scope.tradeMoney  || "",
                        /** 交易状态 */
                        tradeStatus: parseInt($scope.tradeStatus),
                        /** 交易时间 */
                        tradeTime: $scope.tradeTime  || "",
                        /** 对方户名 */
                        transName: $scope.transName  || "",
                        /** 对方账号 */
                        transNum: $scope.transNum  || ""
                    }
                    financeService.addBtl(requestParams).then(function(res){
                        if(res.data.code ===1){
                            if(v == '1'){
                                $state.go("aep.loc.bank_account");
                                $.misMsg(res.data.msg);
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        }else{
                            $.misMsg(res.data.msg);
                        }
                    })
                }

            }
        };


        ($scope.init = function(){
            // 选择框
            // $("#search-form").comboSelect();
            $scope.findTransNamesAndRemarks();
            $scope.findBanks();
            $scope.findMtypes();
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            if($scope.params.flag==='edit'){
                $scope.findBtlById();
                $scope.findBanks();
                $scope.findMtypes();
            }else if($scope.params.flag==='add'){
                $scope.tradeStatus = "0" // 默认收入
            }
        })();
    }])