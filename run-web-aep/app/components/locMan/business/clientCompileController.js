'use strict';

businessModule.controller('clientCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','businessService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,businessService,officeService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "新增客户":$scope.title ="编辑客户";
        $scope.cusType = "";
        $scope.isDepend = "0";
        $scope.isSupply = "0";
        $scope.unitSimple = "";
        $scope.serviceContent = "";
        $scope.extendShow = false;
        
        $scope.imgUrlArr = {  //图片base64集合
            idCardFrontImgUrl:[],
            idCardBackImgUrl:[],
            businessImgUrl:[],
        };
        $scope.resFileUrl = {  //服务器返回图片路径集合
            idCardFrontImgUrl:'',
            idCardBackImgUrl:'',
            businessImgUrl:'',
        };
        $scope.clientTypeList = [
            {id:'TRAVEL',name:'旅行社'},
            {id:'OILSTATION',name:'加油站'},
            {id:'REPAIR',name:'维修厂'},
            // {id:'FLEET',name:'业务车队'},
            {id:'PARTUNIT',name:'合作单位'},
            {id:'SCHOOL',name:'学校'},
            {id:'COMPANY',name:'公司'},
            {id:'GOVERNMENT',name:'政府'},
            {id:'PERSONAL',name:'个人'},
            {id:'OTHER',name:'其他'},
        ];
        $scope.getServiceManList = function(){
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            businessService.getServiceManList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.serviceManList = res.data.data;
                }
            })
        };
        $scope.checkIsSupplier = function(v){
            if(v==="1"){
                $scope.extendShow = true;
            }else{
                $scope.extendShow = false;
            }
        };
        $scope.addPic = function (v) {
            document.getElementById(v).click();
        };
        $scope.multipleFileUpload = function(e,id){
            let file = document.querySelector('input[id='+id+']').files;
                lrz(file[0]).then(function (rst) {        //获取图片base64编码，用于页面展示
                    if(id==='idCardFrontImg'){
                        $scope.imgUrlArr.idCardFrontImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.idCardFrontImgUrl);
                    }else if(id==='idCardBackImg'){
                        $scope.imgUrlArr.idCardBackImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.idCardBackImgUrl);
                    }else if(id==='businessImg'){
                        $scope.imgUrlArr.businessImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.businessImgUrl);
                    }
                    return rst;
                })
                
            let formData = new FormData();
                formData.append('file', file[0]);  //获取图片文件流格式参数
                formData.append('userName', userMsg.company.baseUserId.uname); //加入参数userName
    
            officeService.imgUpload(formData).then(function(res){    //接口调用
                if(res.data.code===1){
                    if(id==='idCardFrontImg')$scope.resFileUrl.idCardFrontImgUrl = res.data.url;
                    if(id==='idCardBackImg')$scope.resFileUrl.idCardBackImgUrl = res.data.url;
                    if(id==='businessImg')$scope.resFileUrl.businessImgUrl = res.data.url;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        $scope.getClientMsgById = function(){
            let requestParams = {
                id:$scope.params.clientId||''
            }
            businessService.getClientMsgById(requestParams).then(function(res){
                if(res.data.code===1){
                    let result = res.data.data;
                    $scope.allClientData = res.data.data;
                    console.log($scope.allClientData)
                    $scope.cusType = result.cusType;
                    $scope.unitName = result.unitName;
                    $scope.realName = result.baseUserId.realName;
                    $scope.realphone = result.baseUserId.phone;
                    $scope.serviceMan = result.serviceMan;
                    $scope.cusRole = result.cusRole;
                    $scope.isDepend = (result.isDepend).toString();
                    $scope.unitSimple = result.unitSimple;
                    $scope.isSupply = (result.isSupply).toString();
                    if($scope.isSupply==="0" ||$scope.isSupply===0){
                        $scope.extendShow = false;
                    }else{
                        $scope.extendShow = true;
                    }
                    $scope.businessNum = result.businessNum;
                    $scope.serviceContent = result.serviceContent;
                    $scope.idCard = result.idCard;
                    // $scope.imgUrlArr.idCardFrontImgUrl.push(result.idCardFrontImg);
                    // $scope.imgUrlArr.idCardBackImgUrl.push(result.idCardBackImg);
                    // $scope.imgUrlArr.businessImgUrl.push(result.businessImg);
                    result.idCardFrontImg==='' ||result.idCardFrontImg===null?$scope.imgUrlArr.idCardFrontImgUrl = []:$scope.imgUrlArr.idCardFrontImgUrl.push(result.idCardFrontImg);
                    result.idCardBackImg===''||result.idCardBackImg===null?$scope.imgUrlArr.idCardBackImgUrl = []:$scope.imgUrlArr.idCardBackImgUrl.push(result.idCardBackImg);
                    result.businessImg===''||result.businessImg===null?$scope.imgUrlArr.businessImgUrl = []:$scope.imgUrlArr.businessImgUrl.push(result.businessImg);
                    $scope.resFileUrl = {
                        idCardFrontImgUrl:result.idCardFrontImg,
                        idCardBackImgUrl:result.idCardBackImg,
                        businessImgUrl:result.businessImg,
                    };
                }
            })
        };
        $scope.verifyPhone = function(event){
            let requestParams = {
                phone:$scope.realphone
            }
            businessService.verifyPhoneRepetition(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.verifyPhoneShow = false;
                }else{
                    $scope.verifyPhoneShow = true;
                    $scope.verifyPhoneMsg = res.data.msg;
                }
            })
        };
        $scope.fillCompany = function(){
            if($scope.realName === ''||$scope.realName===undefined ||$scope.realName===null){
                $scope.unitName = "";
            }else{
                $scope.unitName = $scope.realName+"的公司";
            }
            
        };
        
        $scope.backPage = function(){
            $state.go("aep.loc.client_list");
        };
        
        $scope.saveData = function(){
            $.misShow3DLoader()
            let requestParams = {
                unitNum: userMsg.company.unitNum ||"",
                unitName: $scope.unitName ||"",
                cusType: $scope.cusType ||"",
                isDepend: $scope.isDepend ||"1",
                cusRole:$scope.cusRole || "",
                serviceMan: $scope.serviceMan ||"",
                recomMan: $scope.serviceMan ||"",
                serviceContent :$scope.serviceContent ||"",
                unitSimple: $scope.unitSimple||"",
                businessNum :$scope.businessNum||"",
                idCard :$scope.idCard||"",
                idCardFrontImg:$scope.resFileUrl.idCardFrontImgUrl||"",  
                idCardBackImg :$scope.resFileUrl.idCardBackImgUrl||"",
                businessImg:$scope.resFileUrl.businessImgUrl||"",
                isSupply:$scope.isSupply
            }
            if($scope.params.flag==='add'){    //新增
                let addBaseUserId =  {
                    phone: $scope.realphone ||"",
                    realName: $scope.realName ||""
                }
                requestParams.baseUserId = addBaseUserId;
                businessService.addClientMsg(requestParams).then(function(res){
                    if(res.data.code===1){
                        $state.go("aep.loc.client_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                }).finally(function(){
                    $.misHide3DLoader()
                });
            }else{   //修改
                let editBaseUserId = {
                    phone: $scope.realphone ||"",
                    realName: $scope.realName ||"",
                    id: $scope.allClientData.baseUserId.id,
                    uname: $scope.allClientData.baseUserId.uname ||null,
                    regWay: $scope.allClientData.baseUserId.regWay ||null,
                    ustate: $scope.allClientData.baseUserId.ustate ||null,
                    nickName: $scope.allClientData.baseUserId.nickName ||null,
                    headImg: $scope.allClientData.baseUserId.headImg ||null,
                    atime: $scope.allClientData.baseUserId.atime ||null
                }
                requestParams.baseUserId = editBaseUserId;
                requestParams.id = $scope.allClientData.id;
                requestParams.addTime = $scope.allClientData.addTime;
                requestParams.address = $scope.allClientData.address;
                requestParams.addressLonlat = $scope.allClientData.addressLonlat;
                requestParams.isDel = $scope.allClientData.isDel;
                requestParams.personInCharge = $scope.allClientData.personInCharge ||null;
                businessService.editClientMsg(requestParams).then(function(res){
                    if(res.data.code===1){
                        $state.go("aep.loc.client_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                }).finally(function(){
                    $.misHide3DLoader()
                });
            }
            
        };
        ($scope.init = function(){
            $scope.getServiceManList();
            if($scope.params.flag==='edit'){
                $scope.getClientMsgById();
            }
        })();
        // $scope.init();
    }])