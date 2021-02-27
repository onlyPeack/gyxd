import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/purchase/purchase-receipt-goods-notice-cancle/auditBill',
    method: 'post',
    data: obj
  })
}
