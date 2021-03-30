import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/ums-member-feedback/page',
    method: 'get',
    params: query
  })
}

export function updObj(query) {
  return request({
    url: '/api/mini/ums-member-feedback/'+query.id,
    method: 'put',
    data: query
  })
}

export function deleteBatch(ids) {
  return request({
    url: '/api/mini/ums-member-feedback/deleteBatch/'+ids,
    method: 'get',
  })
}
