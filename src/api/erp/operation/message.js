import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/ums-member-note/page',
    method: 'get',
    params: query
  })
}

export function updObj(query) {
  return request({
    url: '/api/mini/ums-member-note/'+query.id,
    method: 'put',
    data: query
  })
}

export function addObj(query) {
  return request({
    url: '/api/mini/ums-member-note/create',
    method: 'post',
    data: query
  })
}

export function deleteBatch(ids) {
  return request({
    url: '/api/mini/ums-member-note/deleteBatch/'+ids,
    method: 'get',
  })
}

