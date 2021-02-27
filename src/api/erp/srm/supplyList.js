import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/srm-supply-list/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/srm-supply-list/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function addBill(obj) {
  return request({
    url: '/api/srm/srm-supply-list/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/srm/srm-supply-list/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/srm/srm-supply-list/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function selectListCat(supplierCode) {
  return request({
    url: `/api/srm/srm-supply-list/selectListCat?supplierCode=${supplierCode}`,
    method: 'get',
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/srm/srm-supply-list/auditBill',
    method: 'post',
    data: obj
  })
}

export function updatePoint(ids, point) {
  return request({
    url: '/api/srm/srm-supply-list/updatePoint?ids=' + ids + "&point=" + point,
    method: 'post'
  })
}
