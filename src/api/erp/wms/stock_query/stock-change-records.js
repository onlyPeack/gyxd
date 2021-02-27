import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-change-records/page',
    method: 'get',
    params: query
  })
}

export function summary(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-change-records/summary',
    method: 'get',
    params: query
  })
}
