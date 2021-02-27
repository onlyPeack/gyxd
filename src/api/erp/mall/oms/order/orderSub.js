import request from '@/utils/request'
import Vue from "vue"
export function getOrderSubDetail(id) {
  return request({
    url: '/api/mall/oms-order-sub/' + id,
    method: 'get'
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-sub/selectPageByItem',
    method: 'get',
    params: query
  })
}
export function selectPageByDetail(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-item/selectPageByItem',
    method: 'get',
    params: query
  })
}

