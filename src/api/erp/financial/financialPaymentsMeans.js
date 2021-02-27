import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/payments-means/page',
    method: 'get',
    params: query
  })
}

export function pageRe(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/payments-means/pageRe',
    method: 'get',
    params: query
  })
}


export function pageAll() {
  return request({
    url: '/api/financial/payments-means/pageAll',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/payments-means',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/payments-means/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/payments-means/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/payments-means/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/financial/payments-means/updateStatus?id=' + id + '&status=' + status,
    method: 'post'
  })
}
