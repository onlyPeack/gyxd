/*
 * @Author: your name
 * @Date: 2020-09-22 08:42:05
 * @LastEditTime: 2020-09-22 08:42:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ms-clound-erp-ui-v4\src\api\erp\wms\bill\purchaseStockInCancel.js
 */
import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/wms/wms-purchase-stock-in-cancel/auditBill',
    method: 'post',
    data: obj
  })
}
