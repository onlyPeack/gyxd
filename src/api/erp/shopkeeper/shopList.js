import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/member_shop/selectByItem',
    method: 'get',
    params: query
  })
}

export function selectDetailById(id) {
  return request({
    url: '/api/mini/member_shop/selectDetailById?id='+id,
    method: 'get',
  })
}

export function turnoverAnalysisByShopId(id) {
  return request({
    url: '/api/mini/order/turnoverAnalysisByShopId?id='+id,
    method: 'get',
  })
}

/**
 * 分页查看团队店铺
 * @param params
 */
export function selectTeamShopInfo(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mini/member_shop/selectTeamShopInfo',
    method: 'get',
    params,
  })
}

/**
 * 分页查看店铺会员
 * @param params
 */
export function selectMemberInfo(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mini/member_shop/selectMemberInfo',
    method: 'get',
    params,
  })
}

export function auditStatus(id,status) {
  return request({
    url: '/api/mini/member_shop/auditStatus?id='+id+'&status='+status,
    method: 'get',
  })
}

/**
 * 店铺操作日志
 * @param params
 */
export function selectOperationLog(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url: '/api/mini/member/selectOperationLog',
    method: 'get',
    params
  })
}

/**
 * 查看店铺优惠券
 * @param id
 */
export function selectCoupon(id) {
  return request({
    url: '/api/mini/ums-member-coupon/selectCoupon?id='+id,
    method: 'get',
  })
}
