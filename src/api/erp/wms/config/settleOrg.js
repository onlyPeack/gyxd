import request from '@/utils/request'
import Vue from 'vue'

export function page(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query)
  }
  return request({
    url: '/api/wms/settlementOrg/page',
    method: 'get',
    params: query
  })
}

export function consignorPage(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query)
  }
  return request({
    url: '/api/wms/consignor/page',
    method: 'get',
    params: query
  })
}

export function findSelfConsignor() {
  return request({
    url: '/api/wms/consignor/findSelfConsignor',
    method: 'get'
  })
}

export function getNewAccount() {
  return request({
    url: '/api/wms/settlementOrg/getNewAccount',
    method: 'get'
  })
}

export function getSumAmount() {
  return request({
    url: '/api/wms/settlementOrg/getSumAmount',
    method: 'get'
  })
}
