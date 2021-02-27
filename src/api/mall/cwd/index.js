import request from '@/utils/request'
import Vue from "vue"
export function create(data) {
  return request({
    url: '/api/mall/cms/customerWarehouse/create',
    method: 'post',
    data: data
  })
}

export function list(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mall/cms/customerWarehouse/list',
    method: 'get',
    params: params
  })
}

export function deletes(data) {
  return request({
    url: '/api/mall/cms/customerWarehouse/delete',
    method: 'post',
    data: data
  })
}
