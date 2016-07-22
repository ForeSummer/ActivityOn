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
    factory('UserService', function ($http, Session) {
        var userService = {};
        var islogin = Session.id && Session.userId  >= 2;
        userService.login = function(user_id, user_password) {
            var param = {
                'id': user_id,
                'password': user_password
            };
            $http.post(urls.api + "/user/login_1", $.param(param)).success(function(res){
                if(data.error.code == 1){
                    //success
                    Session.create(res.data.id, res.data.user_id);
                    return 1;
                }
                else {
                    //error
                    return 0;
                }
            });
        }

        userService.isLogged = function() {
            return islogin;
        }

        return userService;
    }).
    service('Session', function () {
        this.id = null;
        this.userId = null;
        this.create = function (sessionId, userId) {
            this.id = sessionId;
            this.userId = userId;
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
        };
        return this;
    }).
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
