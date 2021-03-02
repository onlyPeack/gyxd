import request from '@/utils/request'
import Vue from "vue"
export function fetchTree(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/cmsStoreyTree/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/api/mini/cmsStoreyTree/all',
    method: 'get'
  })
}
export function addTreeObj(obj) {
  return request({
    url: '/api/mini/cmsStoreyTree',
    method: 'post',
    data: obj
  })
}

export function getTreeObj(id) {
  return request({
    url: '/api/mini/cmsStoreyTree/' + id,
    method: 'get'
  })
}

export function delTreeObj(id) {
  return request({
    url: '/api/mini/cmsStoreyTree/' + id,
    method: 'delete'
  })
}

export function putTreeObj(id, obj) {
  return request({
    url: '/api/mini/cmsStoreyTree/' + id,
    method: 'put',
    data: obj
  })
}
