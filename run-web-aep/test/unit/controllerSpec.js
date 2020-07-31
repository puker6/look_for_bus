'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-7 16:36:42
 * @description      controller tests
 * @jasmine
 * @param {Function} describe - 声明语法.
 * @param {Function} beforeEach - 在describe函数中每个Spec执行之前执行.
 * @param {Function} beforeAll - 在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 */

describe('Unit Test: Controllers', () => {

    beforeEach(module('aep'));

    let $controller, $rootScope, $state, $scope = {}, userService, forgetPasswordService;

    describe('loginController', () => {

        let mockService;

        beforeEach(() => {

            // module(function ($stateProvider) {
            //     $stateProvider.state('app', {abstract: true});
            //     $stateProvider.state('aep.overview', {url: '/overview'});
            // });

            // module( ($provide)=> {
            //     $provide.factory('userService',  ()=> {
            //         return {
            //             userLogin: jasmine.createSpy('userLogin').and.callFake((arg, success, fail)=> {
            //                 signInSuccess ? success({
            //                     Token: '62a5947ab2aba9eae57e48e3a5b3459d644f06c7'
            //                 }) : fail() || jasmine.createSpy(Function);
            //             })
            //         };
            //     });
            //     // $provide.factory('authService',  ($q)=> {
            //     //     let deferred = $q.defer();
            //     //     deferred.resolve({});
            //     //     return {
            //     //         setToken: jasmine.createSpy('setToken'),
            //     //         identity: jasmine.createSpy('identity').and.returnValue(deferred.promise)
            //     //     };
            //     // });
            // });

            inject((_$controller_, _$rootScope_, _$state_, $injector) => {
                $rootScope = _$rootScope_;

                $state = _$state_;

                $scope = _$rootScope_.$new();

                userService = $injector.get('userService');

                forgetPasswordService = $injector.get('forgetPasswordService');

                $controller = _$controller_('loginController', {
                    $scope: $scope
                });
            });

        });

        // describe('.disableLoginBtn()',  ()=> {
        //
        //     it('when signin form invalid, save button should be disabled',  ()=> {
        //         $scope.formSignin = {
        //             $invalid: true
        //         };
        //         initController();
        //         expect($scope.disableLoginBtn()).toBeTruthy();
        //     });
        //
        //     it('when captcha not filled, save button should be disabled',  ()=> {
        //         $scope.formSignin = {
        //             $invalid: false
        //         };
        //         $scope.captcha = {
        //             getCaptchaData: function () {
        //                 return {
        //                     valid: false
        //                 }
        //             }
        //         };
        //         initController();
        //         expect($scope.disableLoginBtn()).toBeTruthy();
        //     });
        //
        //     it('when captcha filled, and signin form valid, save button should be enabled', function () {
        //         $scope.formSignin = {
        //             $invalid: false
        //         };
        //         $scope.captcha = {
        //             getCaptchaData: function () {
        //                 return {
        //                     valid: true
        //                 }
        //             }
        //         };
        //         initController();
        //         expect($scope.disableLoginBtn()).toBeFalsy();
        //     });
        //
        // });

        it('should be defined', () => {
            expect($controller).toBeDefined();
        });

        describe('login successfully', () => {

            beforeEach(() => {
                $scope.flag = true;
                $scope.isCaption = false;
                $scope.Validation = true;
                $scope.ValidationGray = "";
                $scope.accessSecret = {};

                $scope.model = {
                    loginAccount: 'tangheng@sefon.com',
                    password: 'C33367701511B4F6020EC61DED352059',
                    userType: 'individual'
                };

                $scope.login();
            });

            it('should create flag is true', () =>{
                    expect($scope.flag).toBeTruthy();
            });

            it('should create isCaption is true', () =>{
                expect($scope.isCaption).not.toBeTruthy();
            });

            it('should create flag is true', () =>{
                expect($scope.Validation).toBeTruthy();
            });

            it('should create ValidationGray is true', () =>{
                expect($scope.ValidationGray).toEqual("");
            });

            // it('userService.userLogin should be called', () => {
            //     expect(userService.userLogin).toHaveBeenCalled();
            // });

            // it('userService.userLogin should post username, password, and userType',  ()=> {
            //     expect(userService.userLogin).toHaveBeenCalledWith(jasmine.objectContaining({
            //         username: 'tangheng@sefon.com',
            //         password: 'C33367701511B4F6020EC61DED352059',
            //         userType: 'individual'
            //     }), jasmine.any(Function));
            // });

            // it('should set token and identity',  () =>{
            //     expect(authService.setToken).toHaveBeenCalled();
            //     expect(authService.identity).toHaveBeenCalled();
            // });

            // it('should go home page', ()=> {
            //     $rootScope.$apply();
            //     expect($state.current.name).toBe('aep.overview');
            // });

        });

    });


});