import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/payments-methods/page',
    method: 'get',
    params: query
  })
}

export function pageAll() {
  return request({
    url: '/api/financial/payments-methods/pageAll',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/payments-methods',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/payments-methods/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/payments-methods/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/payments-methods/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/financial/payments-methods/updateStatus?id=' + id + '&status=' + status,
    method: 'post'
  })
}
