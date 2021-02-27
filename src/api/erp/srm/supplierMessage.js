import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/supplierMessage/page',
    method: 'get',
    params: query
  })
}

export function messageSave(supplierCode, auditStatus,deliverStatus) {
  return request({
    url: '/api/srm/supplierMessage/messageSave?supplierCode=' + supplierCode + "&auditStatus=" + auditStatus+ "&deliverStatus=" + deliverStatus,
    method: 'post'
  })
}
export function addObj(obj) {
  return request({
    url: '/api/srm/supplierMessage',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/srm/supplierMessage/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/srm/supplierMessage/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/srm/supplierMessage/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/srm/supplierMessage/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/srm/supplierMessage/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/hrm/supplierMessage/deleteBill/?id=' + id,
    method: 'post'
  })
}
