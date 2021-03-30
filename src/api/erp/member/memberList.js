import request from '@/utils/request'
import Vue from "vue"

/**
 *分页获取所有数据
 * @param query
 */
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member/page',
    method: 'get',
    params: query
  })
}
