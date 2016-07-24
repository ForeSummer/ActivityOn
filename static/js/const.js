"use strict";

function String2Date(str) {
  var time = new Date(str.replace(/ /, "T"));
  return new Date(time.getTime() - new Date().getTimezoneOffset() * 60 * 60 * 1000);
}


var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

var act_types = [{"id": 0, "name": "体育"}, {"id": 1, "name": "调查"}, {"id": 2, "name": "编程"}, {"id": 3, "name": "学习"}, {"id": 4, "name": "娱乐"}, {"id": 5, "name": "django"}, {"id": 6, "name": "其他"}];

