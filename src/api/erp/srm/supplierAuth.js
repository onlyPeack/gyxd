import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/supplierAuth/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/srm/supplierAuth',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/srm/supplierAuth/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/srm/supplierAuth/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/srm/supplierAuth/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/srm/supplierAuth/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/srm/supplierAuth/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/hrm/supplierAuth/deleteBill/?id=' + id,
    method: 'post'
  })
}
