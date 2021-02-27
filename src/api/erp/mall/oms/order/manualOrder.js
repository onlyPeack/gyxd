import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-manual/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-manual/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/mall/oms-order-manual/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/mall/oms-order-manual/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/mall/oms-order-manual/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/mall/oms-order-manual/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/mall/oms-order-manual/auditBill',
    method: 'post',
    data: obj
  })
}

//更新作废采购发票
export function updatePurchaseInvoice(id) {
  return request({
    url: '/api/mall/oms-order-manual/updatePurchaseInvoice?id=' + id,
    method: 'delete'
  })
}

export function updateBill(id) {
  return request({
    url: '/api/mall/oms-order-manual/updatePurchaseInvoice?id=' + id,
    method: 'delete',
  })
}
