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

function getTimeLeap(start, end) {
  var str;
  var time;

  var year1 = parseInt(start.slice(0, 4));
  var month1 = parseInt(start.slice(5, 7));
  var day1 = parseInt(start.slice(8, 10));
  var hour1 = parseInt(start.slice(11, 13));
  var minute1 = parseInt(start.slice(14, 16));

  var year2 = parseInt(end.slice(0, 4));
  var month2 = parseInt(end.slice(5, 7));
  var day2 = parseInt(end.slice(8, 10));
  var hour2 = parseInt(end.slice(11, 13));
  var minute2 = parseInt(end.slice(14, 16));

  
  if(day1 == day2) {
    time = 60 * (hour2 - hour1) + minute2 - minute1;
    if(time < 60) {
      if(time > 3) {
        str = time + '分钟前';
        return str;
      }
      str = '刚刚';
      return str;
    }
    time = (time / 60 + 0.5).toFixed(0);
    if(time < 24) {
      str = time + '小时前';
      return str;
    }
  }
  else {
    if(day2 - day1 > 5) {
      str = '很久以前';
      return str;
    }
    time = day2 - day1;
    str = time + '天前';
    return str;
  }
}

var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

var act_types = [{"id": 0, "name": "体育"}, {"id": 1, "name": "调查"}, {"id": 2, "name": "编程"}, {"id": 3, "name": "学习"}, {"id": 4, "name": "娱乐"}, {"id": 5, "name": "django"}, {"id": 6, "name": "其他"}];

function anime() {
  $(".knob").knob();
  var val,up=0,down=0,i=0
  ,$idir = $("div.idir")
  ,$ival = $("div.ival")
  ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
  ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
  $("input.infinite").knob(
  {
    'min':0
    ,'max':20
    ,'stopper':false
    ,'change':function(v){
      if(val>v){
        if(up){
          decr();
          up=0;
        }else{up=1;down=0;}
      }else{
        if(down){
          incr();
          down=0;
        }else{down=1;up=0;}
      }
      val=v;
    }
  });
};
