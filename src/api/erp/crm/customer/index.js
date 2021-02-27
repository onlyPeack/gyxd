import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/crm/customer/page',
    method: 'get',
    params: query
  })
}

export function pagePublicPool(query) {
  return request({
    url: '/api/crm/customer/pagePublicPool',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/crm/customer',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/crm/customer/' + id,
    method: 'get'
  })
}

export function batchDel(ids) {
  return request({
    url: '/api/crm/customer/batchDel?ids=' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/crm/customer/' + id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/crm/customer/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/crm/customer/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/crm/customer/' + id + '/user',
    method: 'get'
  });
}
export function addAddressObj(obj) {
  return request({
    url: '/api/crm/receiveAddress',
    method: 'post',
    data: obj
  })
}

export function getAddressPage(query) {
  return request({
    url: '/api/crm/receiveAddress/page',
    method: 'get',
    params: query
  })
}

export function putAddressObj(id, obj) {
  return request({
    url: '/api/crm/receiveAddress/' + id,
    method: 'put',
    data: obj
  })
}

export function delAddress(id) {
  return request({
    url: '/api/crm/receiveAddress/' + id,
    method: 'delete'
  })
}

export function generatingPublicPool(id) {
  return request({
    url: '/api/crm/customer/generatingPublicPool?timeInterval=' + id,
    method: 'put'
  })
}

export function reallocate(ids, obj) {
  return request({
    url: '/api/crm/customer/reallocate?ids=' + ids,
    method: 'put',
    data: obj
  })
}

export function getMemberInfo(customerCode) {
  return request({
    url: '/api/crm/customer/getMemberInfo?customerCode=' + customerCode,
    method: 'get',
  })
}

export function updateMemberInfo(obj) {
  return request({
    url: '/api/crm/customer/updateMemberInfo',
    method: 'post',
    data: obj
  })
}

export function recordSelect(companyName) {
  return request({
    url: '/api/crm/customer/recordSelect?companyName=' + companyName,
    method: 'get',
  })
}

