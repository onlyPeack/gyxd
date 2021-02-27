import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-sales-invoice/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-sales-invoice/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/financial/financial-sales-invoice/tempAddBill',
    method: 'post',
    data: obj
  })
}
export function getPrintDataOld(deliverType,billNo) {
  return request({
    url: `/api/financial/financial-sales-invoice/getPrintData?deliverType=${deliverType}&billNo=${billNo}`,
    method: 'get',
  })
}
export function getPrintData(deliverType,billNo) {
  return request({
    url: `/api/financial/financial-sales-invoice/placeAnOrderHTML?expressId=${deliverType}&billNo=${billNo}`,
    method: 'get',
  })
}
export function addBill(obj) {
  return request({
    url: '/api/financial/financial-sales-invoice/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/financial/financial-sales-invoice/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/financial/financial-sales-invoice/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/financial-sales-invoice/auditBill',
    method: 'post',
    data: obj
  })
}
