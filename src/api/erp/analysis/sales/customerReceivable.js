import request from '@/utils/request'
import Vue from "vue"
export function page(data) {
  return request({
    url: '/api/wms/stockOutAnalysis/customerReceivable',
    method: 'post',
    data
  })
}

export function customerAccountBalance(data) {
  return request({
    url: '/api/wms/stockOutAnalysis/customerAccountBalance',
    method: 'post',
    data
  })
}
