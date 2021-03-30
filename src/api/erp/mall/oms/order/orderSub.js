import request from '@/utils/request'
import Vue from "vue"
export function getOrderSubDetail(id) {
  return request({
    url: '/api/mini/order-erp/' + id,
    method: 'get'
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/order-erp/selectPageByItem',
    method: 'get',
    params: query
  })
}
export function selectPageByDetail(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    // url: '/api/mall/oms-order-item/selectPageByItem',
    url: '/api/mini/order-erp/selectPageByDetail',
    method: 'get',
    params: query
  })
}

