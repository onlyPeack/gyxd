import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/brand/page',
    method: 'get',
    params: query
  })
}

export function allBrand() {
  return request({
    url: '/api/goods/brand/allBrand',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/brand',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/brand/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/brand/' + id,
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
    url: '/api/goods/brand/' + id,
    method: 'put',
    data: obj
  })
}

export function pageBycategoryId(id) {
  return request({
    url: '/api/goods/brand/selectByCategoryId' + id,
    method: 'get'
  })
}
