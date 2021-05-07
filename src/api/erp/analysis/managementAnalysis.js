import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectManagementAnalysis',
    method: 'post',
    data: query
  })
}
