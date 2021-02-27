import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/crm/creditSpecial/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/crm/creditSpecial',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/crm/creditSpecial/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/crm/creditSpecial/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/crm/creditSpecial/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/crm/creditSpecial/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/crm/creditSpecial/auditBill',
    method: 'post',
    data: obj
  })
}
export function deleteBill(id) {
  return request({
    url: '/api/crm/creditSpecial/deleteBill/?id=' + id,
    method: 'post'
  })
}
