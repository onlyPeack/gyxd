import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url:'/api/mall/home/payChannel/list',
    method:'get',
    params:params
  })
}

export function createHomeCentre(data) {
  return request({
    url:'/api/mall/home/payChannel/create',
    method:'post',
    data:data
  })
}

export function updateHomeCentre(id,data) {
  return request({
    url: '/api/mall/home/centre/payChannel/'+id,
    method: 'post',
    data:data
  })
}
export function getHomeCentre(id) {
  return request({
    url: '/api/mall/home/payChannel/select/'+id,
    method: 'post',
  })
}
