import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url:'/api/mall/home/address/list',
    method:'get',
    params:params
  })
}

// export function updateStatus(id,params) {
//   return request({
//     url:'/api/mall/home/centre/update/status/'+id,
//     method:'post',
//     params:params
//   })
// }

export function deleteHomeAddress(data) {
  return request({
    url:'/api/mall/home/address/delete',
    method:'post',
    data:data
  })
}

export function createHomeAddress(data) {
  return request({
    url:'/api/mall/home/address/create',
    method:'post',
    data:data
  })
}


export function updateHomeAddress(id,data) {
  return request({
    url: '/api/mall/home/address/update/'+id,
    method: 'post',
    data:data
  })
}
export function getHomeAddress(id) {
  return request({
    url: '/api/mall/home/address/select/' + id,
    method: 'post'
  })
}
