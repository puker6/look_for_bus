'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-7 09:57:58
 * @description      common interceptor test
 * @jasmine
 * @param {Function} describe - 声明语法.
 * @param {Function} beforeEach - 在describe函数中每个Spec执行之前执行.
 * @param {Function} beforeAll - 在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 */

describe('Unit Test: interceptors', () => {

    let authorizeInterceptor, userService, $httpProvider;

    let token = 'token-74bf5840fce640eba7e2d3a325f86fd7';

    beforeEach(() => {
        module('aep', (_$httpProvider_) => {
            $httpProvider = _$httpProvider_;
        });
        inject(($injector) => {
            authorizeInterceptor = $injector.get('authorizeInterceptor');
            userService = $injector.get('userService');
        });
    });

    // beforeEach(() => {
    //     inject(($provide) => {
    //         $provide.factory('userService', () => {
    //             return {
    //                 getToken: jasmine.createSpy('userLogin').and.returnValue(token)
    //             }
    //         })
    //     })
    // });

    describe('authorizeInterceptor', () => {
        let url = 'http://api.locman.cn:8002/user/', config;
        it('should be defined', () => {
            expect(authorizeInterceptor).toBeDefined();
        });
        it('should be added as an interceptor', () => {
            expect($httpProvider.interceptors).toContain('authorizeInterceptor');
        });
        it('should have a handler for request', () => {
            expect(angular.isFunction(authorizeInterceptor.request)).toBeTruthy();
        });
        it('should have a handler for response', () => {
            expect(angular.isFunction(authorizeInterceptor.response)).toBeTruthy();
        });
        it('should have a handler for responseError', () => {
            expect(angular.isFunction(authorizeInterceptor.responseError)).toBeTruthy();
        });

        describe('when request config that need authentication', () => {
            beforeEach(() => {
                url += token;
                config = {url: url, headers: {Token: token}};
                authorizeInterceptor.request(config);
            });
            it('should append Token to url', () => {
                expect(config.headers["Token"]).toBe(token);
            })
        })
    });

});