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
    url: '/api/mini/t-goods-warehouse-radiation/page',
    method: 'get',
    params: query
  })
}

/**
 *创建仓库辐射
 * @param data
 */
export function createObj(data) {
  return request({
    url: '/api/mini/t-goods-warehouse-radiation/create',
    method: 'post',
    data: data
  })
}

/**
 *修改优惠券
 * @param data 修改的优惠券数据
 */
export function updateCoupon(data) {
  return request({
    url: '/api/mini/t-goods-warehouse-radiation/'+data.id,
    method: 'put',
    data: data
  })
}

/**
 *删除仓库辐射
 * @param ids 需要删除的仓库辐射id
 */
export function deleteCoupon(ids) {
  return request({
    url: '/api/mini/t-goods-warehouse-radiation/deleteBatch/'+ids,
    method: 'get',
  })
}

/**
 *优惠券使用统计
 * @param query 查询条件
 */
export function computeCoupon(query) {
  return request({
    url: '/api/mini/ums-member-coupon/manager/pageUse',
    method: 'get',
    params:query
  })
}

/**
 *修改优惠券启用状态
 * @param data
 */
export function updateCouponStatus(data) {
  return request({
    url: '/api/mini/ums-member-coupon/manager/update',
    method: 'post',
    data:data
  })
}
