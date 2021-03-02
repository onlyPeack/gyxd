import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/brand/page',
    method: 'get',
    params: query
  })
}

export function allBrand() {
  return request({
    url: '/api/mini/brand/allBrand',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mini/brand',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mini/brand/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mini/brand/' + id,
    method: 'delete'
  })
}
export function getObjs(id) {
  return request({
    url: '/api/mall/home/brand/' + id,
    method: 'get'
  })
}
export function putObj(id, obj) {
  return request({
    url: '/api/mini/brand/' + id,
    method: 'put',
    data: obj
  })
}

export function pageBycategoryId(id) {
  return request({
    url: '/api/mini/brand/selectByCategoryId' + id,
    method: 'get'
  })
}
