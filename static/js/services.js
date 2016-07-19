'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('act.services', []).
    value('version', '0.1').
    service('CsrfService', ['$cookies' ,function($cookies){
        return {
            'val': function() {
                return $cookies.csrftoken;
            },
            'set_csrf': function(data) {
                data['csrfmiddlewaretoken'] = $cookies.csrftoken;
            },
            'set_csrf_array': function(data){
                data.push({'csrfmiddlewaretoken': $cookies.csrftoken});
            },
            'format_error': function(error) {
                if(error.code == 1){
                    error.type = 'success';
                }else{
                    error.type = 'danger';
                }
                error.show = true;
                //console.log(error.message);
                return error;
            }
        };
    }]).
    service('UserService', ['urls', '$http', '$cookies', 'CsrfService', function(urls, $http, $cookies, $csrf){
        var user = {};
        var student_id = '';
        var applied = false;
        if($cookies.username){
            user.username = $cookies.username;
        }
        if($cookies.status){
            user.status = $cookies.status;
        }
        if($cookies.role){
            user.role = $cookies.role;
        }
        var get_user_status = function(){
            $.get(urls.api + '/user/status', function(data){
                user = data;
                //user.student_id = user.student_id?user.student_id:'';
                student_id = user.student_id;
            });
        };
        get_user_status();
        var set_student_id = function(id){
            get_user_status();
            //student_id = id;
            return id;
        };
        var set_apply = function(){
            applied = ture;
            return ture;
        };
        return {
            'set_apply':function(){
                return set_apply();
            },
            'applied':function(){
                return applied;
            },
            'student_id': function(){
                //console.log('[student_id]>>' + user.student_id);
                return user.student_id;
                //return  student_id;
            },
            'set_student_id': function(id){
                return set_student_id(id);
            },
            'username': function(){
                return user.username;
            },
            'refresh': function(){
                $.get(urls.api + '/user/status', function(data){
                    user = data;
                });
            },
            'status': function(){
                return user.status;
            },
            'role': function(){
                if(!('role' in user)){
                    return 1;
                }
                return user.role;
            },
            'roles': function(){ //What's this?
                return user.roles;
            },
            'school_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 4;
            },
            'department_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 3;
            },
            'logout': function(){
                user = {};
                var param = {};
                $csrf.set_csrf(param);
                $http.post(urls.api + '/user/logout', $.param(param)).success(function(data){
                    //console.log(data);
                    window.location.reload();
                });
            }
        };
    }]).
    filter('cut', function(){
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }).
    filter('uri', function(){
        return function(value) {
            return encodeURIComponent(value);
        };
    }).
    filter('id2date', function(){
        return function(value) {
            var secs = parseInt(value.substring(0,8), 16)*1000;
            var tmp_date = new Date(secs);
            return tmp_date.getFullYear() + '年' + (tmp_date.getMonth() + 1) + '月' + tmp_date.getDate() + '日';
        };
    });
