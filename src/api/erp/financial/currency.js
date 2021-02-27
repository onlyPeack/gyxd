import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/currency/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/currency',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/currency/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/currency/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/currency/' + id,
    method: 'put',
    data: obj
  })
}
