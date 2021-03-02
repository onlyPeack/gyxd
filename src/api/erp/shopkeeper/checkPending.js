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

export function auditStatus(memberId,status) {
  return request({
    url: '/api/mini/member_shop/auditStatus?memberId='+memberId+'&status='+status,
    method: 'get',
  })
}
