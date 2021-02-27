import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function queryPrice(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-pricing-adjust/selectPrice',
    method: 'get',
    params: query
  })
}
export function getPrice(code,skuNo) {
  return request({
    url: `/api/sales/sales-pricing-adjust/getPrice?customerCode=${code}&skuNo=${skuNo}`,
    method: 'post',
  })
}
export function getQtyAndPriceType(code,skuNo) {
  return request({
    url: `/api/sales/sales-pricing-adjust/getQtyAndPriceType`,
    method: 'post',
    data:{
      customerCode:code,
      skuNos:[skuNo]
    }
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/sales/sales-idle-pricing-scheme/auditBill',
    method: 'post',
    data: obj
  })
}
