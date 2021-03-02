import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/goods-product/page',
    method: 'get',
    params: query
  })
}
