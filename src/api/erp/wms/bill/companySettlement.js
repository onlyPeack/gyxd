import request from '@/utils/request'
import Vue from "vue"

export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlement/selectPage',
    method: 'get',
    params: query
  })
}

export function selectMoneyRecord(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlement/selectMoneyRecord',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlement/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function chooseItemPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlement/chooseItemPage',
    method: 'get',
    params: query
  })
}

export function getBill(id) {
  return request({
    url: '/api/wms/companySettlement/getBill?id=' + id,
    method: 'get'
  })
}

export function addBill(obj) {
  return request({
    url: '/api/wms/companySettlement/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/wms/companySettlement/auditBill',
    method: 'post',
    data: obj
  })
}

export function auditBillIn(obj) {
  return request({
    url: '/api/wms/companySettlement/auditBillIn',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/wms/companySettlement/deleteBill/?id=' + id,
    method: 'post'
  })
}
