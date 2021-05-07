import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/cmsStoreyGood/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mini/cmsStoreyGood',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mini/cmsStoreyGood/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mini/cmsStoreyGood/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/mini/cmsStoreyGood/' + id,
    method: 'put',
    data: obj
  })
}

export function insertBatch(obj) {
  return request({
    url: '/api/mini/cmsStoreyGood/insertBatch',
    method: 'post',
    data: obj
  })
}

export function deleteBatch(obj) {
  return request({
    url: '/api/mini/cmsStoreyGood/deleteBatch',
    method: 'get',
    params: obj
  })
}

