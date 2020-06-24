/**
数据验证
作者 carson2440
*/
var checker = {
	//判断对象下是否有属性keystr
	hasKey: function(obj, keysStr) { //keysStr:"a" or keysStr:a.c.d
		let keysStrArray = keysStr.split(".");
		let temp = obj;
		for (var i = 0; i < keysStrArray.length; i++) {
			temp = temp[keysStrArray[i]];
			if (temp == undefined) {
				return false;
			}
		}
		return true;
	},
	isNumber: function(checkVal) {
		var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
		return reg.test(checkVal);
	},
	isInteger: function(obj) {
		 return Math.floor(obj) === obj
	},
	isMobile: function(check){
		return true;
	},
	isEmail: function(check){
		return true;
	},
	isEmail: function(check){
		return true;
	},
}
module.exports = checker;
