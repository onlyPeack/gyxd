import request from '@/utils/request'
import Vue from "vue"
export function create(params) {
  return request({
    url: '/api/mall/sms/tablePage/create',
    method: 'post',
    params: params
  })
}

export function update(params) {
  return request({
    url: '/api/mall/sms/tablePage/update',
    method: 'post',
    params: params
  })
}

export function list(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mall/sms/tablePage/list',
    method: 'get',
    params: params
  })
}

export function select(id) {
  return request({
    url: '/api/mall/sms/tablePage/select/' + id,
    method: 'post',
  })
}

export function deletes(data) {
  return request({
    url: '/api/mall/sms/tablePage/delete?ids='+data,
    method: 'post',
  })
}
