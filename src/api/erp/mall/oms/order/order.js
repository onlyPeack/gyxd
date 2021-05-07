import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/order-erp/selectPage',
    method: 'get',
    params: query
  })
}

export function getAuditOrderTask(masterOrderId) {
  return request({
    url: '/api/mini/order/getAuditOrderTask?masterOrderId='+ masterOrderId,
    method: 'post',
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/api/mini/order-erp/select?id=' + id,
    method: 'get'
  })
}

export function updateReceiverInfo(obj) {
  return request({
    url: '/api/mini/order/updateReceiver',
    method: 'post',
    data: obj
  })
}

export function updateOrderNote(obj) {
  return request({
    url: '/api/mini/order/updateNote',
    method: 'post',
    data: obj
  })
}


export function closeOrder(obj) {
  return request({
    url: '/api/mini/order/update/close',
    method: 'post',
    data: obj
  })
}

export function deleteOrder(obj) {
  return request({
    url: '/api/mini/order/delete',
    method: 'post',
    data: obj
  })
}
export function auditOrderTask(obj) {
  return request({
    url: '/api/mini/order/auditOrderTask',
    method: 'post',
    data: obj
  })
}
export function auditOrder(obj) {
  return request({
    url: '/api/mini/order/auditOrderFirst',
    method: 'post',
    data: obj
  })
}


export function updateOrderLabel(obj) {
  return request({
    url: '/api/mini/order/updateOrderLabel',
    method: 'post',
    data: obj
  })
}

export function deliverMainOrder(obj, note) {
  return request({
    url: `/api/mini/order/deliverMainOrder?masterOrderSns=${obj}&note=${note}`,
    method: 'post'
  })
}


export function deliverSubOrder(obj, note) {
  return request({
    url: `/api/mini/order/deliverSubOrder?orderSns=${obj}&note=${note}`,
    method: 'post'
  })
}

export function doEntrustPay(orderSn) {
  return request({
    url: `/api/mini/order/doEntrustPay?masterOrderSn=${orderSn}`,
    method: 'get'
  })
}

export function cancelFutureOrderPart(obj) {
  return request({
    url: '/api/mini/order/cancelFutureOrderPart',
    method: 'post',
    data: obj
  })
}
export function closeNowOrderSub(obj) {
  return request({
    url: '/api/mini/order/closeNowOrderSub',
    method: 'post',
    data: obj
  })
}

export function closeOrderFull(obj) {
  return request({
    url: '/api/mini/order/closeOrderFull',
    method: 'post',
    data: obj
  })
}

export  function checkLogistics(expressId,mailNo,checkPhoneNo) {
 return request({
   url: `/api/mini/order/newLogistics?expressId=${expressId}&mailNo=${mailNo}&checkPhoneNo=${checkPhoneNo}`,
   method: 'get'
 })
}

export  function upload(data) {
 return request({
   url: `/api/mini/order/upload`,
   method: 'post',
   data
 })
}

export  function upload1(params) {
 return request({
   url: `/api/mini/order/upload`,
   method: 'get',
   params
 })
}

export  function futuresLogistics(orderSn) {
 return request({
   url: `/api/mall/orderLogistics/selectPage?orderSn=`+orderSn,
   method: 'get',
 })
}

export  function auditOrderForce(id) {
 return request({
   url: `/api/mini/order/auditOrderForce?id=${id}`,
   method: 'post',
 })
}

export  function pushOrder(data) {
 return request({
   url: `/api/mini/order/pushOrder`,
   method: 'post',
   data
 })
}


