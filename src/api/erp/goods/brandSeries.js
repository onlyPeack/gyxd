import request from '@/utils/request'
import Vue from "vue"
export function page(id) {
  return request({
    url: '/api/goods/series/selectByBrandId/' + id,
    method: 'get',
  })
}
