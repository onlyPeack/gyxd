import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-bank-account/page',
    method: 'get',
    params: query
  })
}

export function pageAll() {
  return request({
    url: '/api/financial/financial-bank-account/pageAll',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/financial-bank-account',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/financial-bank-account/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/financial-bank-account/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/financial-bank-account/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/financial/financial-bank-account/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}

