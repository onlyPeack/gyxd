import request from '@/utils/request'
import Vue from "vue"
export function page(data) {
  return request({
    url: '/api/wms/stockOutAnalysis/supplierPay',
    method: 'post',
    data
  })
}
