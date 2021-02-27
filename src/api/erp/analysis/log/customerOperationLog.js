import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  return request({
    url: '/api/mall/member-access-log/page',
    method: 'get',
    params: query
  })
}
