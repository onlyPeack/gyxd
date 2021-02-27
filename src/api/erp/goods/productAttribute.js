import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/product-attribute/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/product-attribute/create',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/goods/product-attribute/update',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/product-attribute/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/product-attribute/' + id,
    method: 'delete'
  })
}


