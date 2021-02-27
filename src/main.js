import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import AvueUeditor from 'avue-plugin-ueditor'
Vue.use(AvueUeditor)
import '@/styles/index.scss' // global css
import echarts from 'echarts';
require('echarts/extension/bmap/bmap')
import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
// import vueAxios from 'vue-axios'
import china from 'echarts/map/json/china.json'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import _ from 'lodash'
import moment from 'moment'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
window.echarts = echarts;
echarts.registerMap('china', china)
Vue.use(Viewer)
// Vue.use(vueAxios,axios)
Vue.prototype.$axios = axios;
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
Vue.prototype.$moment = moment;//赋值使用
Vue.prototype._ = _
Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

import Print from 'vue-print-nb'
Vue.prototype.$echarts = echarts;
Vue.use(Print); //注册

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.vueSet = function (obj, index, val) {
  Vue.set(obj, index, val)
}

Vue.config.productionTip = false

//税率
Vue.prototype.taxRateOptions = [{
  value: '0',
  label: '0%'
}, {
  value: '13',
  label: '13%'
}, {
  value: '16',
  label: '16%'
}, {
  value: '17',
  label: '17%'
}, {
  value: '18',
  label: '18%'
}, {
  value: '19',
  label: '19%'
}, {
  value: '20',
  label: '20%'
}];

//默认税率
Vue.prototype.defaultTaxRate = '13';

//币别
Vue.prototype.currencyOptions = [{
  value: '1',
  label: '人民币'
}, {
  value: '2',
  label: '加元'
}, {
  value: '3',
  label: '澳元'
}];
//消息提示
Vue.prototype.vueMessage = function (type, message) {
  Element.Message({
    message: message,
    type: type,
    duration: 3 * 1000
  });
};
//日期
Vue.prototype.pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
};

//入库状态
Vue.prototype.storageStatusOptions = [{
  value: 0,
  label: '待入库'
}, {
  value: 1,
  label: '部分入库'
}, {
  value: 2,
  label: '全部入库'
}];

//出库状态
Vue.prototype.storageOutStatusOptions = [{
  value: 0,
  label: '待出库'
}, {
  value: 1,
  label: '部分出库'
}, {
  value: 2,
  label: '全部出库'
}];

//订货状态
Vue.prototype.orderGoodsStatusOptions = [{
  value: 0,
  label: '待订货'
}, {
  value: 1,
  label: '部分订货'
}, {
  value: 2,
  label: '全部订货'
}];

//回款状态
Vue.prototype.returnMoneyStatusOptions = [{
  value: 0,
  label: '待回款'
}, {
  value: 1,
  label: '部分回款'
}, {
  value: 2,
  label: '全部回款'
}];

//开票状态
Vue.prototype.invoiceStatusOptions = [{
  value: 0,
  label: '待开票'
}, {
  value: 1,
  label: '部分开票'
}, {
  value: 2,
  label: '全部开票'
}];

//收货状态
Vue.prototype.receiptStatusOptions = [{
  value: 0,
  label: '待收货'
}, {
  value: 1,
  label: '部分收货'
}, {
  value: 2,
  label: '全部收货'
}];

//状态
Vue.prototype.statusOptions = [{
  value: 1,
  label: '暂存'
}, {
  value: 2,
  label: '流转中'
}, {
  value: 3,
  label: '作废'
}, {
  value: 4,
  label: '正常'
}, {
  value: 5,
  label: '回退'
}];
/**
 *  过滤对象中字符串类型的前后空格
 */
Vue.prototype.filterObjSpace = function (obj) {
  for (var key in obj) {
    if ((typeof obj[key]) == 'string') {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
};
//付款条件
Vue.prototype.repayConditionOptions = [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}];

//发票类型
Vue.prototype.invoiceTypeOptions = [{value: '0', label: '增值税普通'},{value: '1', label: '增值税专用'} ];

//付款形式
Vue.prototype.paymentFormOptions = [{value: '0', label: '直接付款'}, {value: '1', label: '预付款'}];

//回款形式
Vue.prototype.moneybackFormOptions = [{value: '0', label: '直接收款'}, {value: '1', label: '预收款'}];

//单据页面-提交、暂存
Vue.prototype.dataFormOnSubmit = function (_this, subFun, subFunSuccessName, subFunName) {
  console.log('subFun:' + subFun);
    _this.$refs['dataForm'].validate(async (valid) => {
    if (valid) {
      if (subFunName == 'tempAddBill') {
        _this.isTemporaryLoading = true;
      } else {
        _this.isFormLoading = true;
      }

      var list = [];
      for (var i in _this.items) {
        if (_this.items[i].skuNo && _this.items[i].skuNo != '') {
          list.push(_this.items[i]);
        }
      }
      _this.dataForm.items = list;
      await subFun(_this.dataForm).then(response => {
        console.log('response');
        console.log(response);
        if (subFunName == 'tempAddBill') {
          _this.isTemporaryLoading = false;
        } else {
          _this.isFormLoading = false;
        }
        if (!response) {
          return;
        }

        if (response.code == '2000') {
          _this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
          _this.$emit(subFunSuccessName);
        } else {
          _this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      }).catch(res => {
        if (subFunName == 'tempAddBill') {
          _this.isTemporaryLoading = false;
        } else {
          _this.isFormLoading = false;
        }
      })
    } else {
      return false;
    }
  })
};

//单据页面-同意、驳回、重新流转
Vue.prototype.auditBill = function (_this, formName, subFun, subFunSuccessName) {
  if (_this[formName].taskMap.opinion == '同意') {
    _this.isAgreeLoading = true;
  } else {
    _this.isRejectLoading = true;
  }
  subFun(_this[formName]).then((response,reject) => {
    if (_this[formName].taskMap.opinion == '同意') {
      _this.isAgreeLoading = false;
    } else {
      _this.isRejectLoading = false;
    }
    if (response.code == '2000') {
      _this.$notify({
        title: '成功',
        message: '操作成功',
        type: 'success',
        duration: 2000
      });
      _this.$emit(subFunSuccessName);
    } else if (response.code == '401') {
      _this.$notify({
        title: '失败',
        message: response.data || response.msg,
        type: 'warning',
        duration: 2000
      })
    } else {
      _this.$notify({
        title: '失败',
        message: response.msg,
        type: 'warning',
        duration: 2000
      })
    }
  }).catch(res => {
    if (_this[formName].taskMap.opinion == '同意') {
      _this.isAgreeLoading = false;
    } else {
      _this.isRejectLoading = false;
    }
  })
};

//单据页面-根据单据状态控制按钮的显示与隐藏
Vue.prototype.controlButtonShow = function (row) {
  var billStatus;
  if (row.billStatus) {
    billStatus = row.billStatus;
  } else {
    if (row.mainDTO && row.mainDTO.billStatus) {
      billStatus = row.mainDTO.billStatus;
    }
  }
  if (!billStatus) {
    return;
  }

  //add_bill:新增 edit_bill:编辑 delete_bill:删除 import_bill:导入 export_bill:导出
  if (billStatus == 1 || billStatus == 5) {
    //状态1：暂存   新增 编辑 删除 导入 导出
    //状态5：驳回  新增 编辑 删除 导入 导出
    if (document.getElementById('edit_bill')) {
      document.getElementById('edit_bill').style.display = 'inline-block';
    }
    if (document.getElementById('delete_bill')) {
      document.getElementById('delete_bill').style.display = 'inline-block';
    }
    if (document.getElementById('import_bill')) {
      document.getElementById('import_bill').style.display = 'inline-block';
    }
  } else if (billStatus == 2 || billStatus == 4) {
    //状态2：流转  新增 导出
    //状态4：正常  新增 导出
    if (document.getElementById('edit_bill')) {
      document.getElementById('edit_bill').style.display = 'none';
    }
    if (document.getElementById('delete_bill')) {
      document.getElementById('delete_bill').style.display = 'none';
    }
    if (document.getElementById('import_bill')) {
      document.getElementById('import_bill').style.display = 'none';
    }
  }

};

//文本框的输入事件
Vue.prototype.handleInputFun = function ($event, item, key) {
  if (key == 'qty') {
    item[key] = ($event || '').replace(/\D/g, '');
  } else {
    item[key] = ($event || '').replace(/[^\d^\.]+/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  }
};

function onInput(el, ele, binding, vnode) {
  function handle() {
     let val = ele.value
       // modifiers为修饰符对象，传入了float，则其float属性为true
       if (binding.modifiers.float) {
         // 清除"数字"和"."以外的字符
           val = val.replace(/[^\d.]/g, '')
         // 只保留第一个, 清除多余的
         val = val.replace(/\.{2,}/g, '.')
         // 第一个字符如果是.号，则补充前缀0
         val = val.replace(/^\./g, '0.')
          } else {
      val = ele.value.replace(/[^\d]/g, '')
    }
    ele.value = val
  }

  return handle
}
const numberInput= {
  bind(el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  },
}
Vue.directive('number-input', numberInput)

//数字金额大写转换
Vue.prototype.digitUppercase = function (n) {
  var fraction = ['角', '分'];
  var digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor((Math.round((n * 100)) / 10) * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};

import {getFloat} from '@/utils/util';
/**
 *  表格汇总
 *  sumColumnList 需要汇总的字段
 *  len 保留几位小数
 */
Vue.prototype.getSummariesMethod = function (param, sumColumnList, len) {
  if (!len) {
    len = 4;
  }
  const str = ',' + sumColumnList.join(',') + ',';
  const {columns, data} = param;
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    if (!values.every(value => isNaN(value))) {
      if (str.indexOf(',' + column.property + ',') > -1) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return getFloat(prev + curr, len);
          } else {
            return getFloat(prev, len);
          }
        }, 0).toFixed(4);
        sums[index] += ' ';
      }
    } else {
      sums[index] = ' ';
    }
  });
  return sums;
};
// 数字(金额)转大写
Vue.prototype.convertCurrency = function(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '整';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
};
/**
 * 精确计算小数加法
 * @param data1 数1
 * @param data2 数2
 * @returns {number} 计算结果
 */
Vue.prototype.accAdd=function(data1, data2) {
  let r1, r2, m, c;
  try {  r1 = data1.toString().split(".")[1].length;}catch (e) {  r1 = 0; }
  try { r2 = data2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      data1= Number(data1.toString().replace(".", ""));
      data2= Number(data2.toString().replace(".", "")) * cm;
    } else {
      data1= Number(data1.toString().replace(".", "")) * cm;
      data2= Number(data2.toString().replace(".", ""));
    }
  } else {
    data1= Number(data1.toString().replace(".", ""));
    data2= Number(data2.toString().replace(".", ""));
  }
  return (data1+ data2) / m;
},

  /**
   * 精确计算两数的商
   * @method division
   * @param {Number} v1 有效数值1  被除数
   * @param {Number} v2 有效数值2  除数
   * @return {Number} 两数值的商
   */
  Vue.prototype.division=function(v1,v2){
    var t1=0,t2=0,n1,n2;
    var s1=v1.toString();
    var s2=v2.toString();
    //获取两数的浮点位数
    try{t1=s1.split(".")[1].length}catch(e){}
    try{t2=s2.split(".")[1].length}catch(e){}
    //去除小数点符号，获取整数
    n1=Number(s1.replace(".",""))
    n2=Number(s2.replace(".",""))
    //两整数相除，乘以10为底数的（除数浮点位数-被除数的浮点位数）
    return (n1/n2)*Math.pow(10,t2-t1);
  },

  /**
   * 精确计算小数乘法
   * @param data1 数1
   * @param data2 数2
   * @returns {number} 计算结果
   */
  Vue.prototype.accMulti=function(data1, data2) {
    let baseData = 0;
    try { baseData += data1.toString().split(".")[1].length;} catch (e) {}
    try { baseData += data2.toString().split(".")[1].length;} catch (e) {}
    return Number(data1.toString().replace(".", "")) * Number(data2.toString().replace(".", "")) / Math.pow(10, baseData);
  }

  /**
   * 小数转换百分比数
   */
  Vue.prototype.toPercent=function(point){
  var str=Number(point*100).toFixed(1);
  str+="%";
  return str;
  }

/**
 * 计算时间差
 * @param date1 开始时间
 * @param date2 结束时间
 * @returns {string}
 */
Vue.prototype.duration=function(date1,date2){
    var date3 = new Date(date2).getTime() - new Date(date1).getTime();   //时间差的毫秒数
    //------------------------------
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000))

    //计算出小时数

    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))
    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)
    return days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒"
  }



// toFixed四舍五入
Number.prototype.toFixed = function (n) {
  if (n > 20 || n < 0) {
      throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const number = this;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
  }
  if (typeof (n) == 'undefined' || n == 0) {
      return (Math.round(number)).toString();
  }
  let result = number.toString();
  const arr = result.split('.');
  // 整数的情况
  if (arr.length < 2) {
      result += '.';
      for (let i = 0; i < n; i += 1) {
          result += '0';
      }
      return result;
  }
  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
      return result;
  }
  if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i += 1) {
          result += '0';
      }
      return result;
  }
  result = integer + '.' + decimal.substr(0, n);
  const last = decimal.substr(n, 1);
  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
      const x = Math.pow(10, n);
      result = (Math.round((parseFloat(result) * x)) + 1) / x;
      result = result.toFixed(n);
  }
  return result;
}

/**
 * 获取最近一周
 * @returns {{arr: string[], before: string, after: string}}
 */
Vue.prototype.oneWeek=function(){
  var Date1 = new Date();
  var Date7 = new Date(Date1.getTime() - 168 * 60 * 60 * 1000);
  return {
    before:Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate() + ' 00:00:00',
    after:Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate() + ' 23:59:59',
    arr:[Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate(), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate()]
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
