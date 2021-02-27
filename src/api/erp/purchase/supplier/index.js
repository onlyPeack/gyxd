import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/supplier/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/purchase/supplier',
    method: 'post',
    data: obj
  })
}
export function auditBill(obj) {
  return request({
    url: '/api/purchase/supplier/auditBill',
    method: 'post',
    data: obj
  })
}
export function certificationAuditBill(obj) {
  return request({
    url: '/api/srm/supplierAuth/auditBill',
    method: 'post',
    data: obj
  })
}
export function getObj(id) {
  return request({
    url: '/api/purchase/supplier/' + id,
    method: 'get'
  })
}
export function getAuth(id) {
  return request({
    url: '/api/srm/supplierAuth/' + id,
    method: 'get'
  })
}
export function getSupplierAuth(query,supplierCode) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/supplierAuth/page?supplierCode=' + supplierCode,
    method: 'get',
    params: query
  })
}
export function batchDel(ids) {
  return request({
    url: '/api/purchase/supplier/batchDel?ids=' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/purchase/supplier/' + id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/purchase/supplier/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/purchase/supplier/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/purchase/supplier/' + id + '/user',
    method: 'get'
  });
}

export function updateSupplierBlack(id, blackType) {
  return request({
    url: `/api/purchase/supplier/updateSupplierBlack?id=${id}&blackType=${blackType}`,
    method: 'post',
  })
}
