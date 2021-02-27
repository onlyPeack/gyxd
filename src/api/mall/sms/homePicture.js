import request from '@/utils/request'
import Vue from "vue"
export function list(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mall/sms/homePicture/list',
    method: 'get',
    params: params
  })

}

export function update(id, params) {
  return request({
    url: '/api/mall/sms/homePicture/update/' + id,
    method: 'post',
    data: params
  })
}

export function create(data) {
  return request({
    url: '/api/mall/sms/homePicture/create',
    method: 'post',
    data: data
  })
}
