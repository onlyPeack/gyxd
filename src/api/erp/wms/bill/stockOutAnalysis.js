import request from '@/utils/request'
import Vue from "vue"
export function findAnalysisList(obj) {
  return request({
    url: '/api/wms/stockOutAnalysis/findAnalysisList',
    method: 'get',
    params: obj
  })
}

export function findAreaAnalysisList(obj) {
  return request({
    url: '/api/wms/stockOutAnalysis/findAreaAnalysisList',
    method: 'get',
    params: obj
  })
}


