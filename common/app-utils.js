/**
*常用工具类
*作者 carson2440
*/
var utils = {
	showToast:function (title, duration = 1800, mask = false, icon = 'none'){
		//统一提示方便全局修改
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},
	//判断对象下是否有属性keystr
	hasKey: function ( obj, keysStr ) { //keysStr:"a" or keysStr:a.c.d
		let keysStrArray = keysStr.split( "." );
		let temp = obj;
		for ( var i = 0; i < keysStrArray.length; i++ ) {
			temp = temp[ keysStrArray[ i ] ];
			if ( temp == undefined ) {
				return false;
			}
		}
		return true;
	},
	isNumber: function ( checkVal ) {
		var reg_exp = /^[0-9]+$/;
		if ( checkVal == "" ) {
			return false;
		}
		return reg_exp.test( checkVal );

	},

	// 判断是否是数组
	isArray: function ( obj ) {
		return Object.prototype.toString.call( obj ) === '[object Array]';
	},

	// 判断是否为空
	isNotEmpty: function ( obj ) {
		let result =  ( typeof ( obj ) == 'undefined' ) ? true : ( ( obj == null ) ? true : obj === "" );
		return !result; 
	},

	// 判断是否为字符串
	isString: function ( obj ) {
		return typeof obj !== "undefined" && obj !== null && ( typeof obj === "string" || obj.constructor === String );
	},

	// 判断是否是对象
	isObject: function ( obj ) {
		return obj !== null && typeof obj === 'object';
	},
	// 邮箱验证
	isEmail: function ( email ) {
		return ( email.search( /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/ ) !=
			-1 );
	},

	isInteger: function ( obj ) {
		return Math.floor( obj ) === obj
	},
	isMobile: function ( check ) {
		var reg = /^1\d{10}$/;
		return reg.test( check );
	},

	getNowDay: function ( check ) { //获取当前时间
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if ( month < 10 ) {
			month = "0" + month;
		}
		if ( day < 10 ) {
			day = "0" + day;
		}
		var nowDate = year + "-" + month + "-" + day;
		return nowDate;
	},
	//格式化时间
	formatDateTime: function ( value ) {
		if ( value ) {

			var date = new Date( value );
			Y = date.getFullYear(),
				m = date.getMonth() + 1,
				d = date.getDate(),
				H = date.getHours(),
				i = date.getMinutes(),
				s = date.getSeconds();
			if ( m < 10 ) {
				m = '0' + m;
			}
			if ( d < 10 ) {
				d = '0' + d;
			}
			if ( H < 10 ) {
				H = '0' + H;
			}
			if ( i < 10 ) {
				i = '0' + i;
			}
			if ( s < 10 ) {
				s = '0' + s;
			}
			var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
			// var t = m + '月' + d + '日 ' + H + ':' + i;
			// var t = Y + '-' + m + '-' + d;
			return t;
		} else {
			return '';
		}
	},
	//2020-11-06
	formatDate: function ( date ) {
		if ( date ) {
			var date = new Date( date );
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? ( '0' + d ) : d;
			return y + '-' + m + '-' + d; //这里可以写格式
		} else {
			return '';
		}
	}

}
module.exports = utils;