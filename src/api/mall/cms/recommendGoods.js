import request from '@/utils/request'
import Vue from "vue"
export function insertBatch(data) {
  return request({
    url: '/api/mall/cms-goods-attr-bind/insertBatch',
    method: 'post',
    data
  })
}

export function delObj(id) {
  return request({
    url: '/api/mall/cms-goods-attr-bind/'+id,
    method: 'delete',
  })
}

export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/cms-goods-attr-bind/page',
    method: 'get',
    params: query
  })
}
