'use strict';


// Declare app level module which depends on filters, and services
angular.module('act', [
    'ngRoute',
    'ngCookies',
    'angularFileUpload',
    'act.filters',
    'act.services',
    'act.directives',
    'act.controllers',
    //semantic directives
    'ngMaterial'
]).
    constant('urls', {
        'part': '/static/partials',
        'api': '/api',
        'host': location.protocol.concat('//').concat(window.location.hostname.concat(location.port?':'+location.port:''))
    }).
    config(['$interpolateProvider', function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }]).
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }]).
    config(['$routeProvider', '$locationProvider', 'urls', function($routeProvider, $locationProvider, urls) {
        //Route configure
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = '';
        $routeProvider.when('/', {templateUrl: urls.part + '/homepage.html', controller: 'HomepageCtrl', title: '个人主页'});
        $routeProvider.when('/user/login', {templateUrl: urls.part + '/login.html', controller: 'UserLoginCtrl', title: '登陆'});
        $routeProvider.when('/:user_id/info', {templateUrl: urls.part + '/userInfo.html', controller: 'UserInfoCtrl', title: '个人信息'});
        $routeProvider.when('/user/modify', {templateUrl: urls.part + '/userModifyInfo.html', controller: 'UserModifyInfoCtrl', title: '修改个人信息'});
        $routeProvider.when('/user/createAct', {templateUrl: urls.part + '/createActivity.html', controller: '', title: '创建活动'});
        $routeProvider.when('/act/:act_id/manage', {templateUrl: urls.part + '/act_manage.html', controller: 'ActivityManageCtrl', title: "活动管理"});
        $routeProvider.when('/act/:act_id/login', {templateUrl: urls.part + '/act_login.html', controller: 'ActivityLoginCtrl', title: "活动登录"});
        $routeProvider.when('/act/:act_id/regist', {templateUrl: urls.part + '/act_regist.html', controller: 'ActivityRegistCtrl', title: "活动报名"});
        $routeProvider.when('/regist/:act_id', {templateUrl: urls.part + '/act_regist.html', controller: 'ActivityRegistCtrl', title: "活动报名"});
        $routeProvider.when('/auth/:act_id',{templateUrl:urls.part+'/authentication.html',controller:'authenticationCtrl',title:"认证"});
        $routeProvider.when('/act/:act_id/statistic', {templateUrl: urls.part + '/act_statistic.html', controller: 'ActivityStatisticCtrl', title: "报名统计"});
        $routeProvider.when('/form/:act_id/view', {templateUrl: urls.part + '/form_view.html', controller: 'FormViewCtrl', title: "编辑报名表"});
        $routeProvider.when('/act/:act_id/setemail', {templateUrl: urls.part + '/set_email.html', controller: 'SetEmailCtrl', title: "填写邮箱"});
        $routeProvider.when('/dev', {templateUrl: urls.part + '/dev.html', controller: 'DevCtrl', title: 'Dev page'});
        $routeProvider.when('/q1', {templateUrl: urls.part + '/instruction.html', controller: 'InstructionCtrl', title: '导入说明'});
        
        $routeProvider.otherwise({redirectTo: '/'});
    }]).
    run(['$location', '$rootScope', 'urls', function($location, $rootScope, urls){
        //Configure header title of the page
        $rootScope.urls = urls;
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            $rootScope.title = current.$$route.title;
        });
    }]);
