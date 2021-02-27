import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-summary/selectPage',
    method: 'get',
    params: query
  })
}
