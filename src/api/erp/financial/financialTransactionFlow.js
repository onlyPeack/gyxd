import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-transaction-flow/page',
    method: 'get',
    params: query
  })
}

export function backFunds(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-transaction-flow/backFunds',
    method: 'get',
    params: query
  })
}

export function backFundsByIds(ids) {
  return request({
    url: '/api/financial/financial-transaction-flow/backFundsByIds?ids='+ids,
    method: 'get',
  })
}

