var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'ng-pagination', 'ngStorage', 'starter.controllers', 'ui.select2'])
// app.config(['$qProvider', function ($qProvider) {
//     $qProvider.errorOnUnhandledRejections(false);
// }]);
app.run(function ($rootScope, $location) {
	$rootScope.$on('$routeChangeSuccess', function () {
		ga('send', 'pageview', $location.path());
	});
});
app.config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider) {

	// socialProvider.setFbKey({ appId: "1369477126483771", apiVersion: "v2.4" });
	$urlRouterProvider.otherwise('/index/home');
	$stateProvider
		.state('index', {
			url: "/index",
			abstract: true,
			controller: 'AppCtrl',
			onEnter: function ($state, $localStorage) {
				// console.log($localStorage.session)
				if ($localStorage.session == '' || $localStorage.session == null) {
					$state.go('login');
				}
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'loginCtrl'
		})
		.state('index.home', {
			url: '/home',
			params: { data: null },
			templateUrl: 'templates/home.html',
			controller: 'homeCtrl',
			resolve: {
				lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'appName',
						files: [
							'dist/js/locationpicker.jquery.js',
							'plugins/noti/bootstrap-notify.min.js',
							'dist/js/locationpicker.jquery.js'
						]
					})
				}]
			}
		})
		.state('index.type', {
			url: '/type',
			params: { data: null },
			templateUrl: 'templates/type.html',
			controller: 'typeCtrl',
			resolve: {
				lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'appName',
						files: [
							'plugins/noti/bootstrap-notify.min.js'
						]
					})
				}]
			}
		})
		.state('index.image', {
			url: '/image/:param1',
			templateUrl: 'templates/image.html',
			params: { data: null },
			controller: 'imageCtrl'
		})
		.state('index.update', {
			url: '/update/:param1',
			templateUrl: 'templates/update.html',
			params: { data: null },
			controller: 'updateCtrl',
			resolve: {
				lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'appName',
						files: [
							'dist/js/locationpicker.jquery.js',
						]
					})
				}]
			}
		})

	//check browser support
	// if (window.history && window.history.pushState) {
	// 	//$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

	// 	// to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

	// 	// if you don't wish to set base URL then use this
	// $locationProvider.html5Mode({
	// 	enabled: true,
	// 	requireBase: false
	// });
	// }

})

