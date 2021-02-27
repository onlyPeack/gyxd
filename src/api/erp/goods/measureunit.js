import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/measureunit/page',
    method: 'get',
    params: query
  })
}

export function all() {
  return request({
    url: '/api/goods/measureunit/all',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/measureunit',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/measureunit/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/measureunit/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/goods/measureunit/' + id,
    method: 'put',
    data: obj
  })
}

