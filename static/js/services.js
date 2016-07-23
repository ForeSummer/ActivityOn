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
    service('UserService', function () {
        this.id = null;
        this.userId = null;
        console.log("init");
        this.create = function (sessionId, userId) {
            console.log("Session create");
            this.id = sessionId;
            this.userId = userId;
        };
        this.destory = function () {
            console.log("Session destory");
            this.id = null;
            this.userId = null;
        };
        this.isLogged = function() {
            return this.userId
        } 

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
