//0->  JAN !st 1970 00:00:00 am
//moment is a time library
// var date = new Date().getUTCFullYear();
var moment = require('moment');
var date = moment();
var timestamp = date.format(' do MMM YYYY h:mm A');
console.log(timestamp);