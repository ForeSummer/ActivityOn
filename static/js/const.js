"use strict";

function String2Date(str) {
  var time = new Date(str.replace(/ /, "T"));
  return new Date(time.getTime() - new Date().getTimezoneOffset() * 60 * 60 * 1000);
}

function getDate(string) {
	var str = '';
	var date = new Date(string);
  str += date.getFullYear();
  str += '-';
  str += date.getMonth();
  str += '-';
  str += date.getDate();
  return str;
}

function getTimeLeap(before, now) {
  var time;
  var str;
  //get accurency in minute
  if(time < 60) {
    str = time + '分钟前';
    return str;
  }
  time = (time / 60 + 0.5).toFixed(0);
  if(time < 24) {
    str = time + '小时前';
    return str;
  }
  time = (time / 24 + 0.5).toFixed(0);
  if(time < 5) {
    str = time + '天前';
    return str;
  }
  else {
    str = '很久以前';
    return str;
  }
}

var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

var act_types = [{"id": 0, "name": "体育"}, {"id": 1, "name": "调查"}, {"id": 2, "name": "编程"}, {"id": 3, "name": "学习"}, {"id": 4, "name": "娱乐"}, {"id": 5, "name": "django"}, {"id": 6, "name": "其他"}];

