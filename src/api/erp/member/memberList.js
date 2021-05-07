import request from '@/utils/request'
import Vue from "vue"

/**
 *分页获取所有数据
 * @param query
 */
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member/page',
    method: 'get',
    params: query
  })
}

/**
 *查询余额
 * @param id
 */
export function queryCapitalAccount(id) {
  return request({
    url: '/api/mini/member/queryCapitalAccount?id='+id,
    method: 'get',
  })
}

/**
 *账户信息和开票信息
 * @param id
 */
export function selectInvoice(id) {
  return request({
    url: '/api/mini/member/selectInvoice?id='+id,
    method: 'get',
  })
}

/**
 *交易记录
 * @param query
 */
export function queryTransactionFlow(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member/queryTransactionFlow',
    method: 'get',
    params:query
  })
}
