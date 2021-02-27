import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/issueReceipt/selectPage',
    method: 'get',
    params: query
  })
}


export function tempAddBill(obj) {
  return request({
    url: '/api/financial/issueReceipt/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/financial/issueReceipt/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(query) {
  return request({
    url: '/api/financial/financial-acceptance-register/findAllPage',
    method: 'get',
    params:query
  })
}
export function getBillDetail(query) {
  return request({
    url: '/api/financial/issueReceipt/getBill',
    method: 'get',
    params:query
  })
}
export function getSalesBill(query) {
  return request({
    url: '/api/financial/sales-collections/selectPageByItem',
    method: 'get',
    params: query
  })
}
export function batchDelBill(ids) {
  return request({
    url: '/api/financial/issueReceipt/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/issueReceipt/auditBill',
    method: 'post',
    data: obj
  })
}
