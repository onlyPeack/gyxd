import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-receipt-apply/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-receipt-apply/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/financial/financial-receipt-apply/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function getPrintData(deliverType,billNo) {
  return request({
    url: `/api/financial/financial-receipt-apply/getPrintData?deliverType=${deliverType}&billNo=${billNo}`,
    method: 'get',
  })
}

export function addBill(obj) {
  return request({
    url: '/api/financial/financial-receipt-apply/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/financial/financial-receipt-apply/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/financial/financial-receipt-apply/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/financial-receipt-apply/auditBill',
    method: 'post',
    data: obj
  })
}
