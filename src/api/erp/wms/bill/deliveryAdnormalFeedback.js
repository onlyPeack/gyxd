/*
 * @Author: your name
 * @Date: 2020-09-23 11:34:32
 * @LastEditTime: 2020-09-23 16:01:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ms-clound-erp-ui-v4\src\api\erp\wms\bill\deliveryAdnormalFeedback.js
 */
import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/wms/wms-delivery-abnormal-feedback/auditBill',
    method: 'post',
    data: obj
  })
}
