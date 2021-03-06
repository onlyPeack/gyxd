import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/series/page',
    method: 'get',
    params: query
  })
}

export function pageAll(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/series/pageAll',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mini/series',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mini/series/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mini/series/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/mini/series/' + id,
    method: 'put',
    data: obj
  })
}
