"use strict";

function String2Date(str) {
  var time = new Date(str.replace(/ /, "T"));
  return new Date(time.getTime() - new Date().getTimezoneOffset() * 60 * 60 * 1000);
}
