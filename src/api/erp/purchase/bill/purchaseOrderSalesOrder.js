import request from '@/utils/request'
import Vue from "vue"
export function selectByPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/purchase-order-sales-order-middle/selectByPage',
    method: 'get',
    params: query
  })
}

