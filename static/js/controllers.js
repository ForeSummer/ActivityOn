'use strict';

/* Controllers */

angular.module('act.controllers', []).
    controller('HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, session){
        console.log('HomepageCtrl');
        if (!$user.islogged) {
            window.location = '/user/login';
            console.log('turn to login fail');
        }
        
        //search access
        $scope.search = "";
        $scope.getResult = function() {
            $http.post(urls.api + '').success(function(){

            });
        };
        //logout
        $scope.logout = function(){
            $http.get(urls.api + '  /user/logout').success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.error.code == 1){
                    session.destory();
                    window.location = urls + '/user/login';
                }
            });
        };
        //get message list
        $scope.messageList = function() {
            console.log("233");
            //window.location = urls + '/user/messages';
        };
        //get user info
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/' + session.userId + "/info").success(function(data) {
                $scope.avatarUrl = data.url;
                $scope.nickname = data.nickname;
            });
        };
    }]).
    controller('UserLoginCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session){
        console.log('UserLoginCtrl');
        $('.header-container').hide();
        $('.footer-container').hide();

        //for new user regist
        $scope.privateemail = "";
        $scope.password = "";
        $scope.confirm = "";
        $scope.openemail = "";
        $scope.nickname = "";
        //for user log in
        $scope.user_name = "";
        $scope.user_password = "";

        //error use
        $scope.errormessage = "";
        //use for check form of emails
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

        $scope.login_user = function(){
            var param = {
                'user_name': $scope.user_name,
                'user_password': $scope.user_password
            };
            console.log(param);
            $http.post(urls.api + "/user/login", $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    //success
                    session.create(0, res.UID);
                    //$('.header-container').show();
                    //$('.footer-container').show();
                    //window.location = '/user/homepage';
                    console.log("login succeed");
                }
                else {
                    $scope.user_name = "";
                    $scope.user_password = "";
                    $scope.errormessage = "用户名密码错误！";
                }
            });
        };
           

        
        $scope.regist_user = function() {
            //check password&confirm
            if($scope.password != $scope.confirm) {
                $scope.password = "";
                $scope.confirm = "";
                $scope.errormessage = "两次输入密码不一致，请再次输入！";
                console.log($scope.errormessage);
                return;
            }
            if($scope.password.length>18 || $scope.password.length<6) {
                $scope.password = "";
                $scope.confirm = "";
                $scope.errormessage = "请输入长度为6~18的密码！";
                console.log($scope.errormessage);
                return;
            }
            if ($scope.nickname.length>16 || $scope.nickname.length<6) {
                $scope.nickname = "";
                $scope.errormessage = "请输入长度为6~16字节的昵称！";
                console.log($scope.errormessage);
                return;
            }
            if(!reg.test($scope.privateemail)) {
                $scope.privateemail = "";
                $scope.errormessage = "请输入正确的登录邮箱！";
                console.log($scope.errormessage) ;
                return;
            }
            if(!reg.test($scope.openemail)) {
                $scope.openemail = "";
                $scope.errormessage = "请输入正确的公开邮箱！";
                console.log($scope.errormessage);
                return;
            }
            var param = {
                'privateemail': $scope.privateemail,
                'password': $scope.password,
                'openemail': $scope.openemail,
                'nickname': $scope.nickname
            };
            console.log(param);
            $http.post(urls.api + "/user/regist", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    session.create(data.id,data.userid);
                    $('.header-container').show();
                    $('.footer-container').show();
                    window.location = '/user/homepage';
                }
                else {
                    $scope.password = "";
                    $scope.confirm = "";
                    if(data.ErrorCode == 0) {
                        $scope.privateEmail = "";
                    }
                    else {
                        $scope.nickname = "";
                    }
                }
            });
        };

        $scope.alertError = function() {

        }
    }]).
    controller('UserInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session){
        console.log('UserInfoCtrl');
        $scope.isMe = true;
        $scope.user_name = "NickName";
        $scope.user_publicEmail = "email@wtf.com"
        $scope.user_info = "个人简介orz凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数";
        $scope.user_inact = ["写前期文档", "应付中期检查", "交大作业"];
        $scope.user_follow = ["李俊杰", "卫国扬", "唐人杰", "某某某", "abc", "一个很长的名字作为测试", "日了狗了", "可以的很django"];
        $scope.user_followed = ["你一点都不django", "django强无敌", "毕竟django", "python"];
        $scope.user_publicEmailLink = "mailto:" + $scope.user_publicEmail;
        //console.log($routeParams.user_id);
        if ($routeParams.user_id == session.id) {
            $scope.isMe = true;
        } else {
            $scope.isMe = true;
        }
        $scope.edit_user_info = function () {
            window.location = '/user/modify';
        }
    }]).
    controller('UserModifyInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session){
        console.log('UserModifyInfoCtrl');
        $scope.user_name = "假装有用户名";
        $scope.user_pass = "123456";
        $scope.confirm = "123456";
        $scope.user_publicEmail = "django@python.css";
        $scope.user_info = "假装有一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的个人信息介绍";
        $scope.errormessage = "";
        $scope.modifyInfo = function () {
            if ($scope.user_pass != $scope.confirm) {
                $scope.user_pass = "";
                $scope.confirm = "";
                $scope.errormessage = "两次输入密码不一致，请再次输入！";
            }
            var param = {
                'nickname': $scope.user_name,
                'password': $scope.user_pass,
                'openemail': $scope.user_publicEmail,
                'info': $scope.user_info
            };
            $http.post(urls.api + "/user/info/modify", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.error.code == 1){
                    session.create(data.id,data.userid);
                    $('.header-container').show();
                    $('.footer-container').show();
                    window.location = urls + '/user/homepage';
                }
            });
        }
    }]).
    controller('ActivityLoginCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityLoginCtrl');

        /*$scope.backpage = $routeParams.backpage;
        $scope.act_info = {
            act_id: '',
            security_key: ''
        };
        $scope.error=$csrf.format_error({code:1, message: '请输入安全码，以验证您的活动管理身份。'});
        $scope.act_info.act_id = $routeParams.act_id;
        $scope.get_act_info = function(flag){
            $http.get(urls.api+'/activity/'+$scope.act_info.act_id+'/info?security_key=' + $scope.act_info.security_key).success(function(data){
                if(!('security_key' in data) || data.security_key == ''){
                    if(flag == 'auto'){
                        return;
                    }
                    $scope.error = $csrf.format_error({code: -1, message: "安全码有误，请确认后重新输入。"});
                }else{
                    $location.url('/act/' + $scope.act_info.act_id + '/' + $scope.backpage);
                }
            });
        };
        $scope.get_act_info('auto');
        $("#act_id").click(function() { $(this).select(); } );*/
    }]).
    controller('ActivityManageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityManageCtrl');
        
        /*$scope.stepfour = $routeParams.step == 'four';
        $scope.act_info = {
            act_id: '',
            name: '',
            security_key: ''
        };

        $scope.act_info.act_id = $routeParams.act_id;
        $cookies.act_url = '/act/' + $scope.act_info.act_id + '/manage';
        $scope.get_act_info = function(){
            var params = '';
            if($routeParams.security_key){
                params = '?security_key=' + $routeParams.security_key;
            };
            $http.get(urls.api+'/activity/'+$scope.act_info.act_id+'/info' + params).success(function(data){
                if(data.error.code == 10){
                    $scope.info_error = $csrf.format_error(data.error);
                    return ;
                }
                if(!('security_key' in data) || data.security_key == ''){
                    $location.url('/act/' + $scope.act_info.act_id + '/login?backpage=manage');
                }
                //Remove the security key from the url
                if($routeParams.security_key){
                    $location.url('/act/' + $scope.act_info.act_id + '/manage');
                }
                $scope.act_info = data;
                //console.log(data);
                $scope.act_info.name = data.name;
                //console.log(data.name);
                $scope.act_info.security_key = data.security_key;
                $scope.act_info.s_form_show = data.s_form;
                $scope.act_info.auth_user_show = $scope.act_info.auth_user == 1?true:false;

                $scope.act_info.reg_start_show = data.reg_start ? String2Date(data.reg_start) : '';
                $scope.act_info.reg_end_show   = data.reg_start ? String2Date(data.reg_end  ) : '';
            });
        };
        
        $scope.save_act_info = function(type){
            //console.log($scope.act_info);
            $scope.act_info.auth_user = $scope.act_info.auth_user_show?1:0;
            var param = $scope.act_info;
            param.s_form = JSON.stringify(param.s_form_show);
            $csrf.set_csrf(param);
            if($scope.act_info.reg_start_show != ''){
                param.reg_start = $filter('date')($scope.act_info.reg_start_show, 'yyyy-MM-dd HH:mm:ss');
            }else{
                param.reg_start = '';
            }
            if($scope.act_info.reg_end_show != ''){
                param.reg_end = $filter('date')($scope.act_info.reg_end_show, 'yyyy-MM-dd HH:mm:ss');
            }else{ 
                param.reg_end = '';
            }
            if($scope.act_info.reg_start_show>$scope.act_info.reg_end_show)
            {
                $scope.errorhu = {
                    'message':'截止时间要后于开始时间',
                    'type':'fail',
                    'show':'true'
                };
                if(type == 'base'){
                    $scope.error = $csrf.format_error($scope.errorhu);
                }else{
                    $scope.more_error = $csrf.format_error($scope.errorhu);
                }
            }
            else
            {
                $http.post(urls.api + '/activity/' + $scope.act_info.act_id + '/set', $.param(param)).success(function(data){
                //console.log(data);
                if(type == 'base'){
                    $scope.error = $csrf.format_error(data.error);
                }else{
                    $scope.more_error = $csrf.format_error(data.error);
                }
            });
            }

        };

        $scope.send_manage_info = function(){
            var param = {
                email: $scope.act_info.email
            };
            $csrf.set_csrf(param);
            $http.post(urls.api + '/activity/' + $scope.act_info.act_id + '/send_base', $.param(param)).success(function(data){
                //console.log(data);
                $scope.error = $csrf.format_error(data.error);
            });
        };
        $scope.more_show = false;
        $scope.show_more = function(){
            $scope.more_show = !$scope.more_show;
        };
        $scope.qr_url = 'http://qr.liantu.com/api.php?w=350&el=m&text=' + urls.host + '/regist/' +$scope.act_info.act_id;
        $("#regist_url").click(function() { $(this).select(); } );
        $scope.get_act_info();*/
    }]).
    controller('RegStatisticCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('RegStatisticCtrl');
        
    }]).
    controller('SetEmailCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location',function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('SetEmailCtrl');
        /*$scope.stepthree = true;
        $scope.act_info = {
            act_id: $routeParams.act_id,
            email: ''
        };
        $scope.send_manage_info = function(){
            var param = {
                email: $.trim($scope.act_info.email)
            };
            if(param.email == ''){
                return;
            }
            $csrf.set_csrf(param);
            $http.post(urls.api + '/activity/' + $scope.act_info.act_id + '/send_base', $.param(param)).success(function(data){
                //console.log(data);
                if(data.error.code==1){
                    $location.url('/act/' + $scope.act_info.act_id + '/manage?step=four');
                }
            });
        };*/
    }]).
    controller('FormViewCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('FormViewCtrl');
        /*$scope.formdata = {};
        $scope.steptwo = $routeParams.step == 'two';
        $scope.edit_show = false;
        $scope.act_info = {
            act_id: $routeParams.act_id
        };
        $scope.show_edit = function(){
            $scope.edit_show = true;
        };
        
        $http.get(urls.api+'/activity/'+$scope.act_info.act_id+'/info').success(function(data){
            $scope.act_info = data;
            $scope.act_info.s_form_show = data.s_form;
        });
        var json_format_form = function(form){
            var allow_key_list = {
                'type': '',
                'label': '',
                'required': '',
                'display': '',
                'explanation': '',
                'extra_list': ''
            };
            var res = [];
            for(var index in form){
                var tmp_unit = {};
                var form_unit = form[index];
                for(var key in form_unit){
                    if(!(key in allow_key_list)){
                        continue;
                    }
                    tmp_unit[key] = form_unit[key];
                }
                res.push(tmp_unit);
            }
            return JSON.stringify(res);
        };

        $scope.fixed_pattern = function(type){
            if(type == 0){
                $scope.act_info.s_form_show = [{
                    "explanation":"请填写您的姓名",
                    "required":true,
                    "type":"text",
                    "display":"姓名",
                    "label":"name"
                },{
                    "explanation":"请填写您的邮箱",
                    "required":true,
                    "type":"text",
                    "display":"邮箱",
                    "label":"email"
                }];
            }else if(type == 1){
                $scope.act_info.s_form_show = [{
                    "explanation":"请填写您的姓名",
                    "required":true,
                    "type":"text",
                    "display":"姓名",
                    "label":"name"
                },{
                    "explanation":"请填写您的手机号",
                    "required":true,
                    "type":"text",
                    "display":"手机号",
                    "label":"cellphone"
                },{
                    "explanation":"请填写您的邮箱",
                    "required":true,
                    "type":"text",
                    "display":"邮箱",
                    "label":"email"
                }];
            }else if(type == 2){
                $scope.act_info.s_form_show = [{
                    "explanation":"请填写您的姓名",
                    "required":true,
                    "type":"text",
                    "display":"姓名",
                    "label":"name"
                },{
                    "explanation":"请填写您的手机号",
                    "required":true,
                    "type":"text",
                    "display":"手机号",
                    "label":"cellphone"
                }];
            }
        };
        $scope.save_form = function(){
            var param = $scope.act_info;
            param.s_form = json_format_form(param.s_form_show);
            //console.log(param.s_form);
            $csrf.set_csrf(param);
            $http.post(urls.api + '/activity/' + $scope.act_info.act_id + '/set', $.param(param)).success(function(data){
                //console.log(data);
                $scope.error = $csrf.format_error(data.error);
                if(data.error.code == 1 && $scope.steptwo){
                    $location.url('/act/' + $scope.act_info.act_id + '/setemail');
                };
            });
        };
        var check_list = function(form_list){
            var check_list = [];
            for(var index in form_list){
                if($.inArray(form_list[index]['label'], check_list) >= 0){
                    return false;
                }
                check_list.push(form_list[index]['label']);
            }
            return true;
        };*/

    }]).
	
    controller('ActivityStatisticCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('ActivityStatisticCtrl');
        /*$scope.act_info = {
            act_id: $routeParams.act_id
        };
        $scope.reg_list = [];
        $scope.download_url = urls.api + '/activity/' + $scope.act_info.act_id + '/export_csv';

        $scope.get_act_info = function(){
            var params = '';
            if($routeParams.security_key){
                params = '?security_key=' + $routeParams.security_key;
            };
            $http.get(urls.api+'/activity/'+$scope.act_info.act_id+'/info' + params).success(function(data){
                if(data.error.code == 10){
                    $scope.info_error = $csrf.format_error(data.error);
                    return ;
                }
                if(!('security_key' in data) || data.security_key == ''){
                    $location.url('/act/' + $scope.act_info.act_id + '/login?backpage=statistic');
                }
                //Remove the security key from the url
                if($routeParams.security_key){
                    $location.url('/act/' + $scope.act_info.act_id + '/statistic');
                }
                $scope.act_info = data;
                //console.log(data);
                $scope.act_info.name = data.name;
                //console.log(data.name);
                $scope.act_info.security_key = data.security_key;
				$scope.act_info.email = data.email;
              
                $scope.act_info.reg_start_show = $scope.act_info.reg_start?new Date($scope.act_info.reg_start):'';
                $scope.act_info.reg_end_show = $scope.act_info.reg_end?new Date($scope.act_info.reg_end):'';

            });
        };

        $scope.get_act_registrations = function(){
            $http.get(urls.api + '/registration/' + $scope.act_info.act_id + '/list').success(function(data, status){
                //console.log(data);
                $scope.reg_list = data.list;
                $scope.length = data.list.length;
            });
        };
		
		$scope.delete_act_registration = function(student_id){
			//console.log(student_id);
			var param = {};
			$csrf.set_csrf(param);
			$http.post(urls.api + '/registration/' + student_id + '/delete', $.param(param)).success(function(data){
				//console.log(data);
				$scope.reg_list = data.list;
				$scope.get_act_registrations();
			});
		};
        
        $scope.get_act_info();
        $scope.get_act_registrations();*/
    }]).
	controller('InstructionCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        //console.log('InstructionCtrl');
        
    }]).
    controller('ActivityRegistCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$timeout', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $timeout){
        /*if($location.path().indexOf('/regist/') != 0){
            $location.url('/regist/' + $routeParams.act_id);
        }
        //console.log('ActivityRegistCtrl');
        $scope.act_info = {
            act_id: $routeParams.act_id
        };
        $scope.formdata = {};
        var timer_p = {};
        var start_timer = function(){
            ////console.log($scope.server_time);
            $scope.server_time = new Date($scope.server_time.getTime() + 1000);
            //console.log($scope.server_time);
            //$scope.show_time = $scope.server_time.replace(/(.+) (.+)/, "$1T$2Z");
            timer_p = $timeout(start_timer, 1000);
        };
        var refresh_p = {};
        $scope.sync_time = new Date();
        $scope.server_time = new Date();
        $scope.current_num = 0;
        var refresh_current_num = function(){
            $http.get(urls.api + '/registration/' + $scope.act_info.act_id + '/current_num').success(function(data){
                $scope.current_num = data.current_num;
            });
        };
        
        var get_server_time = function(){
            refresh_current_num();
            $http.get(urls.api + '/server_time').success(function(data){
                //console.log(data);
                $scope.sync_time = data.current_time;
                $scope.server_time = String2Date(data.current_time);
                $timeout.cancel(timer_p);
                start_timer();
                $timeout(get_server_time, 20000);
            });
        };
        get_server_time();

        $scope.show_time = false;
        $scope.get_act_info = function(){
            $http.get(urls.api + '/activity/' + $scope.act_info.act_id + '/info').success(function(data){
                //console.log(data);
                $scope.act_info = data;
                if($scope.act_info.reg_start || $scope.act_info.reg_start){
                    $scope.time = "本次报名起止时间："+$scope.act_info.reg_start +"~"+$scope.act_info.reg_end;
                    $scope.show_time = true;
                }
                else{
                    $scope.time = "本次报名无时间限制";
                    $scope.show_time = false;
                }

                if($scope.act_info.auth_user==1 && $user.student_id() == '')
                    $location.url('/auth/'+$routeParams.act_id);
                $scope.student_id = $user.student_id();
                //console.log($user.student_id());
            });
        };
        $scope.get_act_info();
        var format_form_data = function(formdata){
            var res = [];
            for(var key in $scope.act_info.s_form){
                res.push({
                    label: $scope.act_info.s_form[key].label,
                    data: formdata[$scope.act_info.s_form[key].label]
                });
            }
            return JSON.stringify(res);
        };
        var set_base_info = function(param, formdata){
            param.email = formdata.email?formdata.email:'';
            param.cellphone = formdata.cellphone?formdata.cellphone:'';
            param.name = formdata.name?formdata.name:'';
        };
        $scope.submit_registration = function(){
            var param = {
                'form_data': format_form_data($scope.formdata)
            };
            set_base_info(param, $scope.formdata);
            
            //console.log(param);
            $csrf.set_csrf(param);
            $http.post(urls.api + '/registration/' + $scope.act_info.act_id + '/reg', $.param(param)).success(function(data, status){
                //console.log(data);
                $scope.error = $csrf.format_error(data.error);
                refresh_current_num();
            });
        };
        $scope.logout_user = function(){
            $user.logout();
        };*/
    }]).
    controller('FixCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        //console.log('FixCtrl');
        $scope.show_fix = false;
        if($location.host() == 'wq.zhixing.today'){
            $scope.show_fix = true;
        }
    }]).
    controller('HeaderCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('HeaderCtrl');
        /*$scope.$on('$routeChangeStart', function(next, current) {
            $scope.show_backto = $cookies.act_url?true:false;
            $scope.back_page_url = $cookies.act_url?$cookies.act_url:'';
        });*/
    }])
    .controller('DevCtrl', ['$scope', '$http', 'urls', 'CsrfService', function($scope, $http, urls, $csrf){
        ////console.log('DevCtrl');
        /*$scope.api_url = '/test';
        $scope.param_list = [];
        $scope.add_param = function(){
            $scope.param_list.push({'key':'', 'value':''});
        };
        $scope.response = {};
        $scope.api_post = function(){
            var param_dict = {};
            for(var index in $scope.param_list){
                param_dict[$scope.param_list[index]['key']] = $scope.param_list[index]['value'];
            }
            //console.log(param_dict);
            $csrf.set_csrf(param_dict);
            $http.post(urls.api + $scope.api_url, $.param(param_dict)).success(function(data){
                //console.log(data);
                $scope.response = data;
            });
        };
        $scope.api_get = function(){
            var param_url = '';
            for(var index in $scope.param_list){
                if(index != 0){
                    param_url += '&';
                }else{
                    param_url = '?';
                }
                param_url += $scope.param_list[index]['key'] + '=' + $scope.param_list[index]['value'];
            }
            //console.log(param_url);
            $http.get(urls.api + $scope.api_url + param_url).success(function(data){
                //console.log(data);
                $scope.response = data;
            });
        };
        $scope.clean_param = function(){
            $scope.param_list = [];
        };*/
    }])
    .controller('authenticationCtrl',['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        //console.log('authenticationCtrl');
        /*$scope.act_info = {
            act_id: $routeParams.act_id
        };
        $scope.formdata = {};
        $scope.get_act_info = function(){
            $http.get(urls.api + '/activity/' + $scope.act_info.act_id + '/info').success(function(data){
                //console.log(data);
                $scope.act_info = data;
            });
        };
        $scope.get_act_info();
        $scope.userauth=function(){
            var param_dict={
                "student_id": $scope.act_info.stuID,
                "password": $scope.act_info.password
            };
            $csrf.set_csrf(param_dict);
            $http.post(urls.api+'/user/auth_student',$.param(param_dict)).success(function(data){
                //console.log(data);
                $scope.act_info=data;
                $scope.error = $csrf.format_error(data.error);
                if(data.error.code == 1){
                    $user.set_student_id(data.student_id);
                    $location.url('/regist/' + $routeParams.act_id);
                }
            });
        };*/
    }]);
