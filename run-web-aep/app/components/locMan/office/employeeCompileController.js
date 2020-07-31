'use strict';

officeModule.controller('employeeCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','officeService','businessService','logisticsService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,officeService,businessService,logisticsService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "新增员工":$scope.title ="编辑员工";
        $scope.deptId = "";
        $scope.roleId = "";
        $scope.staffState = "";
        $scope.isDriver = "0";
        $scope.companyFlag = "1";
        $scope.groupId = "";
        $scope.entryCompany = "";
        $scope.extendShow = false;
        $scope.errorTimeMsg = false;
        $scope.takeDriveTime = "";
        $scope.certificateType = "";
        $scope.takeCertificateTime = "";
        $scope.driveType = "";
        
        $scope.resFileUrl = {  //服务器返回图片路径集合
            idCardFrontImgUrl:'',
            idCardBackImgUrl:'',
            driveImgUrl:'',
            certificateImgUrl:''
        };
        
        $scope.imgUrlArr = {  //图片base64集合
            idCardFrontImgUrl:[],
            idCardBackImgUrl:[],
            driveImgUrl:[],
            certificateImgUrl:[]
        };
        //获取部门
        // $scope.deptList = [
        //     {id:'1',name:'后勤中心'},
        //     {id:'2',name:'财务中心'},
        //     {id:'3',name:'客服中心'},
        //     {id:'4',name:'交付中心'},
        //     {id:'5',name:'运营中心'},
        //     {id:'6',name:'技术中心'},
        //     {id:'7',name:'办公室'},
        // ];
        $scope.findDepts = function(){
            officeService.findDepts().then(function(res){
                if(res.data.code===1){
                   $scope.deptList = res.data.data;
                   console.log($scope.deptList)
                }
            })
        }
        // 根据部门获取角色
        $scope.chooseDep = function(){
            let requestParams = {
                deptId:$scope.deptId ||''
            }
            officeService.getRoleList(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $scope.roleList = res.data.data;
                }
            })
            // officeService.findDepts().then(function(res){
            //     if(res.data.code===1){
            //        $scope.deptList = res.data.data;
            //        if($scope.deptId == '1'){
            //         $scope.roleList = $scope.deptList[0].deptRoleId
            //        }else if($scope.deptId == '2'){
            //         $scope.roleList = $scope.deptList[1].deptRoleId
            //        }else if($scope.deptId == '3'){
            //         $scope.roleList = $scope.deptList[2].deptRoleId
            //        }else if($scope.deptId == '4'){
            //         $scope.roleList = $scope.deptList[3].deptRoleId
            //        }else if($scope.deptId == '5'){
            //         $scope.roleList = $scope.deptList[4].deptRoleId
            //        }else if($scope.deptId == '6'){
            //         $scope.roleList = $scope.deptList[5].deptRoleId
            //        }else if($scope.deptId == '7'){
            //         $scope.roleList = $scope.deptList[6].deptRoleId
            //        }
            //     }
            // })
        };
        //默认准驾车型
        $scope.driveTypeList = [
            {id:'A1',name:'A1'},
            {id:'A2',name:'A2'},
            {id:'B1',name:'B1'},
            {id:'B2',name:'B2'},
            {id:'C',name:'C'},
        ];
        // 地图
        function G(id) {
            return document.getElementById(id);
        }

        var map = new BMap.Map("l-map");
        map.centerAndZoom("中国",12);      // 初始化地图,设置城市和地图级别。

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggestId"
            ,"location" : map
        });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        var localSearch = new BMap.LocalSearch(map);
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            $scope.address = myValue;
            G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            setPlace();

        var keyword = myValue;
        localSearch.setSearchCompleteCallback(function (searchResult) {
    　　　　var poi = searchResult.getPoi(0);
            // console.log(poi)
            // 经度
            $scope.longitude = poi.point.lng;
            // console.log(poi.point.lng)
            // 纬度
            $scope.latitude = poi.point.lat;
            // console.log(poi.point.lat);
    　　　　 map.centerAndZoom(poi.point, 13);
    　　});
            localSearch.search(keyword);
        });

        function setPlace(){
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
            });
            local.search(myValue);
        }

        //身份证失去焦点-获取年龄/获取生日
        $scope.ageChange = function(){
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - $scope.idCard.substring(6, 10) - 1;
            if($scope.idCard.substring(10, 12) < month || $scope.idCard.substring(10, 12) == month && $scope.idCard.substring(12, 14) <= day) {
                age++;
            }
            $scope.age = age;
            //获取出生日期
            var birth = $scope.idCard.substring(6, 10) + "-" + $scope.idCard.substring(10, 12) + "-" + $scope.idCard.substring(12, 14);
            $scope.birthdayTime = birth
            //获取性别
            // var gender = ic.slice(14, 17) % 2 ? "1" : "2"; // 1代表男性，2代表女性
            // gender === "1" ? $("#txtSex").val("男") : $("#txtSex").val("女")
        }

        // $scope.driverSelect = function(){
        //     if($scope.roleId == 4){
        //         $scope.extendShow = true;
        //     }else{
        //         $scope.extendShow = false;
        //     }
        // }

        angular.forEach($scope.driveTypeList,function(data){
            $('#driveType_select').append("<option value="+data.id+">"+data.name+"</option>");
            $('#driveType_select').selectpicker('refresh');
            $('#driveType_select').selectpicker('render');
        })
        $scope.init = function(){
            $scope.getServiceManList();
            $scope.getGroupList();
            $scope.getCompanyList();
            $scope.findDepts();
            if($scope.params.flag==='edit'){
                $scope.getEmployeeMsgById();
                
            }
        };
        
        $.datetimepicker.setLocale('ch');
        $('#entryTime,#expireTime,#takeDriveTime,#takeCertificateTime,#birthdayTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            // minDate: new Date(),
            //step: 60,  //时间间隔为1  分钟
        });
        // $('#birthdayTime').datetimepicker({
        //     format: "Y-m-d",      //格式化日期
        //     timepicker: false,    //打开时间选项
        //     todayButton: true,
        //     // minDate: new Date(),
        //     //step: 1,  //时间间隔为1  分钟
        // });
        $scope.checkCompanyFlag = function(v){
            if(v==='1'){
                $scope.companyFlagShow = false;
            }else{
                $scope.companyFlagShow = true;
            }
        };
        $scope.nameDis = false;
        $scope.verifyPhone = function(){
            let requestParams = {
                phone:$scope.realPhone ||""
            }
            officeService.verifyPersonPhone(requestParams).then(function(res){
                if(res.data.code===0){
                    $scope.realName = res.data.data.realName;
                    $scope.nameDis = true;
                    $.misMsg(res.data.msg)
                    // $scope.serviceManList = res.data.data;
                }else{
                    $scope.nameDis = false;
                    $scope.realName = "";
                }
            })
        };
        $scope.timeBlue = function(){
            if($scope.expireTime !==''&&$scope.expireTime!==null&&$scope.expireTime!==undefined&&$scope.entryTime !==''&&$scope.entryTime!==null&&$scope.entryTime!==undefined){
                if($scope.expireTime > $scope.entryTime){
                    $scope.errorTimeMsg = false;
                }else{
                    $scope.errorTimeMsg = true;
                }
            }
        };
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
        $scope.getCompanyList = function(){
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            officeService.getCompanyList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.companyList = res.data.data;
                    $scope.entryCompany = ($scope.companyList[0].id).toString();
                }
            })
        };
        $scope.getGroupList = function(){
            let requestParams = {
                page:1,
                rows:100,
                find:"",
            } 
            logisticsService.groupListFind(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.groupList = res.data.data;
                }
            })
        };
        
        $scope.checkIsDriver = function(v){
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
                    }else if(id==='driveImg'){
                        $scope.imgUrlArr.driveImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.driveImgUrl);
                    }else if(id==='certificateImg'){
                        $scope.imgUrlArr.certificateImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.certificateImgUrl);
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
                    if(id==='driveImg')$scope.resFileUrl.driveImgUrl = res.data.url;
                    if(id==='certificateImg')$scope.resFileUrl.certificateImgUrl = res.data.url;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        $scope.getEmployeeMsgById = function(){
            let requestParams = {
                id:$scope.params.employeeId||''
            }
            officeService.getEmployeeMsgById(requestParams).then(function(res){
                if(res.data.code===1){
                    let result = res.data.data;
                    $scope.allEmployeeData = res.data.data;
                    $scope.realName = result.baseUserId.realName;
                    $scope.realPhone = result.baseUserId.phone;
                    $scope.idCard = result.idCard;
                    $scope.age = result.age;
                    $scope.sex = result.sex;
                    $scope.education = result.education;
                    $scope.address = result.address;
                    $scope.simpleAddress = result.simpleAddress;
                    $scope.birthdayTime = result.birthdayTime;
                    $scope.deptId = (result.deptId.id).toString();
                    $scope.roleId = (result.roleId.id).toString();
                    $scope.chooseDep();
                    if(result.entryCompany===null){
                        $scope.companyFlag = "1";
                        $scope.companyFlagShow = false;
                    }else{
                        $scope.companyFlag = "0";
                        $scope.companyFlagShow = true;
                        $scope.entryCompany = (result.entryCompany.id).toString();
                    }
                    
                    $scope.staffState = result.staffState;
                    $scope.entryTime = result.entryTime;
                    $scope.expireTime = result.expireTime;
                    $scope.socialUnit = result.socialUnit;
                    if(result.groupId !==''&&result.groupId!==null){
                        $scope.groupId = (result.groupId.id).toString();
                    }
                    
                    $scope.isDriver = (result.isDriver).toString();
                    if($scope.isDriver==='1' ||$scope.isDriver===1){
                        $scope.extendShow = true;
                    }else{
                        $scope.extendShow = false;
                    }
                    $scope.takeDriveTime = result.takeDriveTime;
                    $scope.certificateNum = result.certificateNum;
                    $scope.certificateType = result.certificateType;
                    $scope.takeCertificateTime = result.takeCertificateTime;
                    $scope.driveType = (result.driveType).split(',');
                    $('#driveType_select').selectpicker('val',$scope.driveType);
                    $scope.serviceMan = result.serviceMan;
                    $scope.params.flag==='add'?$scope.title = "新增员工":$scope.title ="编辑员工";
                    result.idCardFrontImg===''||result.idCardFrontImg===null?$scope.imgUrlArr.idCardFrontImgUrl = []:$scope.imgUrlArr.idCardFrontImgUrl.push(result.idCardFrontImg);
                    result.idCardBackImg===''||result.idCardBackImg===null?$scope.imgUrlArr.idCardBackImgUrl = []:$scope.imgUrlArr.idCardBackImgUrl.push(result.idCardBackImg);
                    result.driveImg===''||result.driveImg===null?$scope.imgUrlArr.driveImgUrl = []:$scope.imgUrlArr.driveImgUrl.push(result.driveImg);
                    result.certificateImg===''||result.certificateImg===null?$scope.imgUrlArr.certificateImgUrl = []:$scope.imgUrlArr.certificateImgUrl.push(result.certificateImg);
                    // $scope.imgUrlArr.idCardFrontImgUrl.push(result.idCardFrontImg);
                    // $scope.imgUrlArr.idCardBackImgUrl.push(result.idCardBackImg);
                    // $scope.imgUrlArr.driveImgUrl.push(result.driveImg);
                    // $scope.imgUrlArr.certificateImgUrl.push(result.certificateImg);
                    $scope.resFileUrl = {
                        idCardFrontImgUrl:result.idCardFrontImg,
                        idCardBackImgUrl:result.idCardBackImg,
                        driveImgUrl:result.driveImg,
                        certificateImgUrl:result.certificateImg
                    };
                }
            })
        };

        $scope.saveData = function(){
            console.log($scope.driveType)
            $.misShow3DLoader();
            let requestGroupId,resRoleName,resDeptName,resEntryCompany,resDriveType;
            if($scope.driveType===''||$scope.driveType===undefined||$scope.driveType===null){
                resDriveType = "";
            }else{
                resDriveType = $scope.driveType.join(',');
            }
            if($scope.companyFlag==='1'){
                resEntryCompany = null;
            }else{
                resEntryCompany = $scope.entryCompany;
            }
            for(let i in $scope.groupList){
                if($scope.groupId===($scope.groupList[i].id).toString()){
                    requestGroupId = $scope.groupList[i];
                    break;
                }
            }
            for(let i in $scope.roleList){
                if(Number($scope.roleId)===$scope.roleList[i].id){
                    resRoleName = $scope.roleList[i].name;
                }
            }
            for(let i in $scope.deptList){
                if($scope.deptId===$scope.deptList[i].id){
                    resDeptName = $scope.deptList[i].name;
                }
            }
            let requestParams = {  
                unitNum: userMsg.company.unitNum ||"",
                deptId: {
                    id:$scope.deptId ||"",
                    name:resDeptName||""
                },
                roleId: {
                    id:$scope.roleId ||"1",
                    name:resRoleName ||""
                },
                entryTime: $scope.entryTime ||"",
                staffState: $scope.staffState ||"",
                expireTime: $scope.expireTime ||"",
                entryCompany: resEntryCompany||null,
                socialUnit: $scope.socialUnit ||"",
                idCard: $scope.idCard ||"",
                isDriver: $scope.isDriver ||"0",
                takeDriveTime: $scope.takeDriveTime ||"",
                certificateNum: $scope.certificateNum ||"",
                certificateType: $scope.certificateType ||"",
                takeCertificateTime: $scope.takeCertificateTime ||"",
                driveType: resDriveType ||"",
                groupId: requestGroupId ||"",
                isDel:"0",
                idCardFrontImg: $scope.resFileUrl.idCardFrontImgUrl ||"",
                idCardBackImg: $scope.resFileUrl.idCardBackImgUrl ||"",
                driveImg: $scope.resFileUrl.driveImgUrl ||"",
                certificateImg: $scope.resFileUrl.certificateImgUrl ||"",
                // serviceMan: $scope.serviceMan ||"",
                // recomMan: $scope.serviceMan ||""
                /**年龄 */
                age:$scope.age || "",
                /**生日 */
                birthdayTime: $scope.birthdayTime ||"",
                /**性别 */
                sex: $scope.sex || "",
                /**学历 */
                education: $scope.education || "",
                /**停靠地址 */
                address: $scope.address || "",
                /**停靠地址简称 */
                simpleAddress: $scope.simpleAddress || "",
                /** 停靠地址纬度 */
                latitude: $scope.latitude || '',
                /** 停靠地址经度 */
                longitude: $scope.longitude || '',
            }
            if($scope.params.flag==='add'){
                let addBaseUserId = {
                    phone: $scope.realPhone ||"",
                    realName: $scope.realName ||""
                }
                requestParams.baseUserId = addBaseUserId;
                // requestParams.serviceMan = $scope.serviceMan ||"";
                // requestParams.recomMan = $scope.serviceMan ||"";
                requestParams.serviceMan = userMsg.company.baseUserId.realName ||"";
                requestParams.recomMan = userMsg.company.baseUserId.realName ||"";
                officeService.addEmployee(requestParams).then(function(res){
                    if(res.data.code===1){
                        $state.go("aep.loc.employee_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                }).finally(function(){
                    $.misHide3DLoader()
                });
            }else{
                let editBaseUserId = {
                    phone: $scope.realPhone ||"",
                    realName: $scope.realName ||"",
                    id: $scope.allEmployeeData.baseUserId.id,
                    uname: $scope.allEmployeeData.baseUserId.uname ||null,
                    regWay: $scope.allEmployeeData.baseUserId.regWay ||null,
                    ustate: $scope.allEmployeeData.baseUserId.ustate ||null,
                    nickName: $scope.allEmployeeData.baseUserId.nickName ||null,
                    headImg: $scope.allEmployeeData.baseUserId.headImg ||null,
                    atime: $scope.allEmployeeData.baseUserId.atime ||null
                }
                requestParams.baseUserId = editBaseUserId;
                requestParams.id = $scope.params.employeeId;
                requestParams.deptId.pid = $scope.allEmployeeData.deptId.pid ||null;
                requestParams.deptId.atime = $scope.allEmployeeData.deptId.atime ||null;
                requestParams.roleId.description = $scope.allEmployeeData.roleId.description ||null;
                requestParams.roleId.status = $scope.allEmployeeData.roleId.status ||null;
                requestParams.roleId.atime = $scope.allEmployeeData.roleId.atime ||null;
                requestParams.addTime = $scope.allEmployeeData.addTime ||"";
                // console.log(requestParams)
                officeService.editEmployee(requestParams).then(function(res){
                    if(res.data.code===1){
                        $state.go("aep.loc.employee_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                }).finally(function(){
                    $.misHide3DLoader()
                });
            }
            
        };
        $scope.backPage = function(){
            $state.go("aep.loc.employee_list");
        };
        
        $scope.init();
    }])