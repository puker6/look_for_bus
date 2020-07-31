'use strict';

financeModule.controller('reimCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','$timeout','$interval','financeService','officeService','logisticsService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,$timeout,$interval,financeService,officeService,logisticsService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // let userMsgMyself = JSON.parse($cookies.get(appSettings.userMsgMyself)) || '';
        console.log(userMsg)
        $scope.userMsg = userMsg;
        $scope.params.flag==='add'?$scope.title = "添加员工报账记录":$scope.title ="编辑员工报账记录";

        //日期选择
        $('#gainTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });

        

        $scope.backPage = function(){
        $state.go("aep.loc.reim_list");
        };


        // 获取报销人账号
        $scope.getCustomBaseInfo = function(){
            financeService.getCustomBaseInfo().then(function(res){
                if(res.data.code===1){
                    $scope.unameList = res.data.data;
                }
            })
        };

        // 获取员工列表
        $scope.getServiceManList = function(){
            let requestParams = {
                staffState: "NORMAL,TRY"
            }
            officeService.getServiceManList(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $scope.employeeList = res.data.data;
                    console.log($scope.employeeList)
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                }
            })
        };

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

        // 获取车牌号
        $scope.getAllPlateNum = function(){
            let requestParams = {
                status: '0,1,2,3',
            } 
            financeService.getAllPlateNum(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    let arr = res.data.plateNums;
                    $scope.carNumberList = arr.filter(ele => ele.status !=='3');
                    console.log(res.data);
                }
            })
        };
        //查询员工报账信息
        $scope.findStaffReimById = function(){
            let requestParams = {
                id:$scope.params.reimId ||''
            }
           financeService.findStaffReimById(requestParams).then(function(res){
               console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 收入金额 */
                    $scope.incomeMoney  = result.gathMoney;
                    /** 支出金额 */
                    $scope.payMoney = result.payMoney;
                    /** 摘要 */
                    $scope.remark = result.remark;
                    $scope.getServiceManList();
                    $scope.getAllPlateNum();
                    $scope.companyCusCombo();
                    /** 经办人 */
                    $scope.unameUser =result.reimUser.uname;
                    /** 往来客户 */
                    $scope.unameOpen = result.operUser.uname;
                    $scope.plateNum = result.plateNum;
                    /** 图片 */
                    $scope.imgUrlArr.businessImgUrl = [result.reimVoucherUrl];
                    $scope.resFileUrl = {
                        businessImgUrl:result.reimVoucherUrl,
                    };
                }
            })
        }

        $scope.resFileUrl = {  //服务器返回图片路径集合
            businessImgUrl:'',
        };

        $scope.imgUrlArr = {  //图片base64集合
            businessImgUrl:[],
        };

        $scope.addPic = function (v) {
            document.getElementById(v).click();
        };
        $scope.multipleFileUpload = function(e,id){
            let file = document.querySelector('input[id='+id+']').files;
                lrz(file[0]).then(function (rst) {        //获取图片base64编码，用于页面展示
                    if(id==='businessImg'){
                        $scope.imgUrlArr.businessImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.businessImgUrl);
                    }
                    return rst;
                })
                
            let formData = new FormData();
                formData.append('file', file[0]);  //获取图片文件流格式参数
                formData.append('userName', userMsg.company.baseUserId.uname); //加入参数userName
    
            logisticsService.imgUpload(formData).then(function(res){    //接口调用
                if(res.data.code===1){
                    $scope.resFileUrl.businessImgUrl = res.data.url;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        //添加start  ===============================================================
        let itemId = 1;
        $scope.addReimListArr = [
            {
                modal:{
                    unameS:$scope.userMsg.loginStaff.uname,
                    unameW:$scope.userMsg.loginStaff.uname,
                    carNumS:'',
                    remark:'',
                    incomeMoney:'0',
                    payMoney:'0',
                    photoUrl:'',
                    photo:'',
                    img_Id:itemId
                }
            }
        ];
        $scope.addItem = function(){
            itemId++;
            let info = {
                modal:{
                    unameS:$scope.userMsg.loginStaff.uname,
                    unameW:$scope.userMsg.loginStaff.uname,
                    carNumS:'',
                    remark:'',
                    incomeMoney:'0',
                    payMoney:'0', 
                    photoUrl:'',
                    photo:'',
                    img_Id:itemId
                }
            }
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            $scope.addReimListArr.push(info);
            console.log($scope.addReimListArr)
        };
        $scope.cancelItem = function(index,obj){
            if($scope.addReimListArr.length < 2){
                $.misMsg("至少添加一条数据");
            }else{
                $scope.addReimListArr.splice(index, 1);
            }
            
            console.log($scope.addReimListArr)
        };
        //添加图片
        $scope.addItemPic = function(v){
            document.getElementById(v).click();
        };
        $scope.itemFileUpload = function (ev){
            let thisElment = $(ev)[0];
            var file=$(ev)[0].files[0];
            console.log(file)
            if(file){
                var reader=new FileReader();  //调用FileReader
                reader.readAsDataURL(file); //将文件读取为 DataURL(base64)
                reader.onload=function(evt){   //读取操作完成时触发。
                    for(let i in $scope.addReimListArr){
                        if(Number(thisElment.id)===$scope.addReimListArr[i].modal.img_Id){
                            console.log("aaaaa")
                            $scope.addReimListArr[i].modal.photoUrl = evt.target.result;
                            $scope.$apply();

                        }
                        if(Number(thisElment.id)===$scope.addReimListArr[i].modal.img_Id){
                            let formData = new FormData();
                            formData.append('file', file);  //获取图片文件流格式参数
                            formData.append('userName', userMsg.baseUserId.uname); //加入参数userName
    
                            logisticsService.imgUpload(formData).then(function(res){    //接口调用
                                if(res.data.code===1){
                                    $scope.addReimListArr[i].modal.photo = res.data.url;
                                }else{
                                    $.misMsg(res.data.msg);
                                }
                            })
                        }
                    }
                };
                
            }
        };
        //添加end ===============================================================
         // 修改凭证记录
         $scope.bc = function(){
            if($scope.params.flag === 'edit'){
                // 修改-提交
                let requestParams = {
                    /** id */
                    updId:$scope.params.reimId,
                    /** 收入金额 */
                    gathMoney: $scope.incomeMoney,
                    /** 支出金额 */
                    payMoney: $scope.payMoney,
                    /** 摘要 */
                    remark: $scope.remark ||"",
                    /** 车牌号 */
                    plateNum: $scope.plateNum ||"",
                    /** 经办人 */
                    jbrUname: $scope.unameUser,
                    /** 往来客户 */
                    cusUname: $scope.unameOpen,
                    /** 图片*/
                    voucherUrl: $scope.resFileUrl.businessImgUrl ||"", 
                }
                financeService.modifyStaffReimburse(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.reim_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                
            }else if($scope.params.flag === 'add'){
                let hList = []; 
                let fd = true;
                let fg = true;
                for(var i=0;i<$scope.addReimListArr.length;i++){
                    if(!(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.incomeMoney)) || !(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.payMoney))){
                        $.misMsg("金额必须是数字");
                        fd = false;
                        break;
                    }else if(($scope.addReimListArr)[i].modal.unameW != '' && ($scope.addReimListArr)[i].modal.unameS != '' &&  ($scope.addReimListArr)[i].modal.payMoney == 0 && ($scope.addReimListArr)[i].modal.incomeMoney == 0){
                        $.misMsg("收入支出必填一项");
                        fg = false;
                        break;
                    }
                    else if(($scope.addReimListArr)[i].modal.unameW == '' &&($scope.addReimListArr)[i].modal.unameS == '' && ($scope.addReimListArr)[i].modal.carNumS == '' && ($scope.addReimListArr)[i].modal.remark == '' && ($scope.addReimListArr)[i].modal.payMoney == 0 && ($scope.addReimListArr)[i].modal.incomeMoney == 0){
                        $scope.addReimListArr.splice($scope.addReimListArr.length, i);
                    }else{
                        hList.push((($scope.addReimListArr)[i].modal.unameS)+'='+(($scope.addReimListArr)[i].modal.unameW)+'='+(($scope.addReimListArr)[i].modal.carNumS || null)+'='+($scope.addReimListArr)[i].modal.incomeMoney+'='+($scope.addReimListArr)[i].modal.payMoney+'='+(($scope.addReimListArr)[i].modal.remark || null)+'='+(($scope.addReimListArr)[i].modal.photo  || null))
                        fd = true;
                    }
                }
                if(fd && fg){
                    console.log(hList)
                    $scope.staffReimInfo  = hList.join("@");
                    console.log($scope.staffReimInfo)
                    let requestParams = {
                        staffReimInfo: $scope.staffReimInfo || ""
                        // uname:$scope.uname
                    }
                    console.log(requestParams)
                    financeService.addStaffReimburse(requestParams).then(function(res){
                        if(res.data.code ===1){
                            $state.go("aep.loc.reim_list");
                            $.misMsg(res.data.msg);
                        }else{
                            $.misMsg(res.data.msg);
                        }
                    })
                }
            }
        };
        ($scope.init = function(){
            $scope. getCustomBaseInfo();
            $scope.getServiceManList();
            $scope.getAllPlateNum();
            $scope.companyCusCombo();
            if($scope.params.flag==='edit'){
                $scope.findStaffReimById();
                $scope.revise = true;
                $scope.add = false;
            }else if($scope.params.flag==='add'){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.revise = false;
                $scope.add = true;
                // console.log(userMsgMyself)
            }
        })();


        
    }])