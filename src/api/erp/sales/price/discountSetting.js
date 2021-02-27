import request from '@/utils/request'
import Vue from "vue"
export function addBill(obj) {
  return request({
    url: '/api/sales/sales-discount-setting/',
    method: 'post',
    data: obj
  })
}

export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-discount-setting/selectPage',
    method: 'get',
    params: query
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/sales/sales-discount-setting/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/sales/sales-discount-setting/auditBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/sales/sales-discount-setting/getBill?id=' + id,
    method: 'get'
  })
}
