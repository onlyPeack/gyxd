import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mall/home/inform/list',
    method: 'get',
    params: params
  })


}
