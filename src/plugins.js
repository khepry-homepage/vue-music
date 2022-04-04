
export default {
  install(Vue) {
    // 对数字的扩展，将数字(默认单位为秒)转化为时(h)、分(m)、秒(s)
    // 如1200 => 20:00
    Number.prototype.FormatHMS = function () {
      let sec = Math.floor(this % 60);
      let min = Math.floor(this / 60) % 60;
      let hour = Math.floor(this / 3600) % 60;
      return    `
                  ${hour?`${hour<=9?`0${hour}`:hour} :`:''}
                  ${min?`${min<=9?`0${min}`:min}`:'00'} :
                  ${sec?`${sec<=9?`0${sec}`:sec}`:'00'}
                `;
    }

    // 将number转化为以万、亿单位的计数值
    Number.prototype.FormatCH = function() {
      return `${this >= 1e4 ? (this >= 1e8 ? Math.floor(this/1e8)+'亿' : Math.floor(this/1e4)+'万') : this}`
    }

    // 将number格式化为01、02、……、10
    Number.prototype.FormatSeq = function() {
      return `${this <=9 ? `0${this}` : this}`
    }

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.Format = function (fmt) { //author: meizz 
      var o = {
          "M+": this.getMonth() + 1, //月份 
          "d+": this.getDate(), //日 
          "h+": this.getHours(), //小时 
          "m+": this.getMinutes(), //分 
          "s+": this.getSeconds(), //秒 
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
          "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  }
}