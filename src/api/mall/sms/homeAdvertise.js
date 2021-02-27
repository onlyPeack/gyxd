import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url:'/api/mall/home/advertise/list',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/api/mall/home/advertise/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeAdvertise(data) {
  return request({
    url:'/api/mall/home/advertise/delete',
    method:'post',
    data:data
  })
}
export function createHomeAdvertise(data) {
  return request({
    url:'/api/mall/home/advertise/create',
    method:'post',
    data:data
  })
}
export function getHomeAdvertise(id) {
  return request({
    url:'/api/mall/home/advertise/'+id,
    method:'get',
  })
}

export function updateHomeAdvertise(id,data) {
  return request({
    url:'/api/mall/home/advertise/update/'+id,
    method:'post',
    data:data
  })
}
