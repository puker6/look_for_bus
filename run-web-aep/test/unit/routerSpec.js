'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-6 14:28:31
 * @description      common router test
 * @jasmine
 * @param {Function} describe - 声明语法.
 * @param {Function} beforeEach - 在describe函数中每个Spec执行之前执行.
 * @param {Function} beforeAll - 在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 */

describe('Unit Test: Routes', () => {

    let $httpBackend, location, route, rootScope, $routeProvider;

    beforeEach(() => {

        module('aep');

        inject(($injector, _$location_, _$route_, _$rootScope_, _$routeProvider_) => {

            $httpBackend = $injector.get('$httpBackend');

            location = _$location_;

            route = _$route_;

            rootScope = _$rootScope_;

            $routeProvider = _$routeProvider_;
        });
    });


    // describe('portal route', () => {
    //     beforeEach(module(() => {
    //         // $httpBackend.expectGET('GET','app/views/portal.html').response(200, 'portal HTML');
    //         // $httpBackend.flush();
    //         $routeProvider.when('GET', 'app/views/portal.html').response('portal');
    //         $routeProvider.when('GET', 'app/views/error/error404.html').response('404');
    //     }));
    //
    //     it('portal page should loaded successfully', () => {
    //         location.path('/portal');
    //         rootScope.$digest();
    //         expect(route.current.controller).toBe('portalController');
    //     });
    //
    //     it('should redirect to the index path on non-existent route', () => {
    //         location.path('app/views/error/error404.html');
    //         rootScope.$digest();
    //         expect(route.current.controller).toBe('portalController');
    //     });
    // })

});