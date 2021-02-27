import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/specificationBase/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/specificationBase',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/specificationBase/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/specificationBase/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/goods/specificationBase/' + id,
    method: 'put',
    data: obj
  })
}

export function all() {
  return request({
    url: '/api/goods/specificationBase/all',
    method: 'get'
  })
}
