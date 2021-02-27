import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/sales-collections/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/sales-collections/selectPageByItem',
    method: 'get',
    params: query
  })
}
export function manualGenerateBatchExternalSCBill() {
  return request({
    url: '/api/financial/sales-collections/manualGenerateBatchExternalSCBill',
    method: 'post',
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/financial/sales-collections/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/financial/sales-collections/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/financial/sales-collections/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/financial/sales-collections/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/sales-collections/auditBill',
    method: 'post',
    data: obj
  })
}
