import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectManagementAnalysis',
    method: 'post',
    data: query
  })
}

export function selectBasicRank() {
  return request({
    url: '/api/mini/member_shop/selectBasicRank',
    method: 'get',
  })
}

export function selectShopRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectShopRank',
    method: 'get',
    params:query
  })
}

export function selectMemberRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectMemberRank',
    method: 'get',
    params:query
  })
}

export function selectOnFrequencyRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectOnFrequencyRank',
    method: 'get',
    params:query
  })
}

export function selectSearchFrequencyRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectSearchFrequencyRank',
    method: 'get',
    params:query
  })
}

export function selectProductSalesRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectProductSalesRank',
    method: 'get',
    params:query
  })
}

export function selectShareFrequencyRank(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectShareFrequencyRank',
    method: 'get',
    params:query
  })
}

/**
 * 订单转化率
 * @param data
 */
export function orderConversion(data) {
  return request({
    url: '/api/mini/oms-order-operate-record/orderConversion',
    method: 'post',
    data
  })
}
