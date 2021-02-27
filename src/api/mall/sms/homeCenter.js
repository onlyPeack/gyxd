import request from '@/utils/request'
import Vue from "vue"
export function fetchList(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mall/home/centre/page',
    method: 'get',
    params: params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/api/mall/home/centre/update/status/' + id,
    method: 'post',
    params: params
  })
}

export function deleteHomeCentre(data) {
  return request({
    url: '/api/mall/home/centre/delete',
    method: 'post',
    data: data
  })
}

export function createHomeCentre(data) {
  return request({
    url: '/api/mall/home/centre/create',
    method: 'post',
    data: data
  })
}

export function updateHomeCentre(id, data) {
  return request({
    url: '/api/mall/home/centre/update/' + id,
    method: 'post',
    data: data
  })
}

export function getHomeCentre(id) {
  return request({
    url: '/api/mall/home/centre/select/' + id,
    method: 'post',
  })
}

export function changePayStatus(id) {
  return request({
    url: '/api/mall/home/centre/changePayStatus?id=' + id,
    method: 'post'
  })
}

export function createShopUser(id) {
  return request({
    url: '/api/mall/home/centre/createShopUser?customerCode=' + id,
    method: 'post'
  })
}

export function createEnterpriseAndShopUserUsingPOST(id) {
  return request({
    url: '/api/crm/customer/createEnterpriseAndShopUser?customerCode=' + id,
    method: 'post'
  })
}
