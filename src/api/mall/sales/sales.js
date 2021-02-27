import request from '@/utils/request'

export function selectSalesSummary(id,params) {
  return request({
    url: '/api/sales/sales-summary/selectSalesSummary/'+id,
    method: 'GET',
    params:params
  })
}

export function selectParagraphSummary() {
  return request({
    url: '/api/sales/sales-summary/selectParagraphSummary',
    method: 'GET',
  })
}

export function selectFinancialSummary() {
  return request({
    url: '/api/sales/sales-summary/selectFinancialSummary',
    method: 'GET',
  })
}

export function selectElectricitySummary(id,params) {
  return request({
    url: '/api/sales/sales-summary/selectElectricitySummary/'+id,
    method: 'GET',
    params:params
  })
}

export function shopManager() {
  return request({
    url: '/api/sales/indexData/shopManager',
    method: 'GET',
  })
}

export function salesman() {
  return request({
    url: '/api/sales/indexData/salesman',
    method: 'GET',
  })
}
export function purchase() {
  return request({
    url: '/api/sales/indexData/purchase',
    method: 'GET',
  })
}
