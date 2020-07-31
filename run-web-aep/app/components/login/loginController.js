
(()=>{
    'use strict';

    angular
        .module('aep.login')
        .controller('loginController', loginController);

    loginController.$inject = ["$scope", "$cookies", "$state", "$translate", "appSettings", "loginService"];

    function loginController($scope, $cookies, $state, $translate, appSettings, loginService) {
        // 获取用户的登录信息

        let phone = localStorage.getItem('localData');
        // console.log(phone)
        // if(phone == '' || phone == null){
            $scope.model = {
                phoneNum:'',
                password: '',
                remberMe: false,
            };
        // }else{
        //     let list = phone.split('&');
        //     let lphone = list[0].split("=")[1];
        //     let password = list[1].split("=")[1];
        //     let rember = list[2].split("=")[1];
        //     // console.log(rember)
        //     $scope.model = {
        //         phoneNum: lphone,
        //         password: password,
        //         remberMe: true,
        //     };
        // }
        // 清空input的值
        $scope.delPhonePass = function(){
            $scope.model.phoneNum = '';
            $(".delect-phone-pass").css("display","none");
        }
        $scope.delpassword = function(){
            $scope.model.password = '';
            $(".delect-password").css("display","none");
            let input=document.getElementById("password");
            input.type='password';
            $(".look").css("display","none");
        }
        $scope.delPhone = function(){
            $scope.model.account = '';
            $(".delect-phone").css("display","none");
            $(".getValidCodeByCode").css("color","#ccc");
        }
        $scope.delYan = function(){
            $scope.model.phoneAutnCode = '';
            $(".delect-yan").css("display","none");
        }
        $scope.login = function(){
            // debugger;
            let phone = $scope.model.phoneNum
            let password = $scope.model.password
            if(phone == ''){
                $('.error-tip-phone').css("display","block").html("手机号码不能为空");
               return false;
            }else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){
                 $('.error-tip-phone').css("display","block").html("手机号码错误");
                 return false;
            }else if(password == ''){
                $('.error-tip-pass').css("display","block").html("密码不能为空");
                 return false;
            }else{
                let formDataJson = {
                    lphone: $scope.model.phoneNum,
                    // lpass: SparkMD5.hash($scope.model.password).toUpperCase(),
                    lpass: $scope.model.password,
                    remberMe: $scope.model.remberMe,
                };
                // console.log(SparkMD5.hash($scope.model.password).toUpperCase())
                loginService.userLogin(formDataJson).then(function(res){
                    // console.log(res)
                    if(res.data.company != null || res.data.loginStaff != null){
                        // $cookies.put(appSettings.userMsgMyself, JSON.stringify(res.data.loginStaff));
                        $cookies.put(appSettings.userMsg, JSON.stringify(res.data));
                        $cookies.put(appSettings.uuid, JSON.stringify(res.data.uuid));
                        // 保存用户的登录身份
                        if($scope.model.remberMe == true){
                            // console.log(res.data)
                            // let uuid = res.data.uuid;
                            $.misMsg(res.data.msg);
                            let phone = res.config.data;
                            localStorage.setItem('localData', phone);
                        }
                        $state.go("aep.loc.client_list")
                    }else{
                        $.misMsg(res.data.msg);
                    }
                    
                })
            }
          
        };

        $scope.myKeyup = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.login();
            }
        };


        $scope.checkMode = function(){
            $scope.loginModeShow = !$scope.loginModeShow;
        };
        $scope.goRegister = function(){
            $state.go("register")
        }

            
    }
})();