import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url:'/api/mall/home/brand/list',
    method:'get',
    params:params
  })
}

export function update(data) {
  return request({
    url:'/api/mall/home/brand/update',
    method:'post',
    data:data
  })
}

export function updateRecommendStatus(data) {
  return request({
    url:'/api/mall/home/brand/update/recommendStatus',
    method:'post',
    data:data
  })
}

export function deleteHomeBrand(data) {
  return request({
    url:'/api/mall/home/brand/delete',
    method:'post',
    data:data
  })
}

export function createHomeBrand(data) {
  return request({
    url:'/api/mall/home/brand/create',
    method:'post',
    data:data
  })
}

export function updateHomeBrandSort(params) {
  return request({
    url:'/api/mall/home/brand/update/sort/'+params.id,
    method:'post',
    params:params
  })

}

