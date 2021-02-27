import request from '@/utils/request'
import Vue from "vue"

export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlementBilling/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/companySettlementBilling/selectPageByItem',
    method: 'get',
    params: query
  })
}


export function putObj(id, obj) {
  return request({
    url: '/api/wms/companySettlementBilling/' + id,
    method: 'put',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/wms/companySettlementBilling/getBill?id=' + id,
    method: 'get'
  })
}

export function addBill(obj) {
  return request({
    url: '/api/wms/companySettlementBilling/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/wms/companySettlementBilling/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/wms/companySettlementBilling/deleteBill/?id=' + id,
    method: 'post'
  })
}
