import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/crm/repairApplication/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  return request({
    url: '/api/crm/repairApplication/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/crm/repairApplication/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/crm/repairApplication/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/crm/repairApplication/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/crm/repairApplication/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/crm/repairApplication/auditBill',
    method: 'post',
    data: obj
  })
}
export function resetBill(id) {
  return request({
    url: '/api/crm/repairApplication/resetBill?id=' + id,
    method: 'get'
  })
}
