"use strict";

function String2Date(str) {
  var time = new Date(str.replace(/ /, "T"));
  return new Date(time.getTime() - new Date().getTimezoneOffset() * 60 * 60 * 1000);
}

var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
