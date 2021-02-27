import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/attachment/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/srm/attachment',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/srm/attachment/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/srm/attachment/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/srm/attachment/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/srm/attachment/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/srm/attachment/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/srm/attachment/deleteBill/?id=' + id,
    method: 'post'
  })
}
export function deleteFile(id) {
  return request({
    url: '/api/srm/attachment/'+id,
    method: 'delete'
  })
}
export function selectSupplierAttachment(query) {
  return request({
    url: '/api/srm/attachment/selectSupplierAttachment',
    method: 'get',
    params: query
  })
}
