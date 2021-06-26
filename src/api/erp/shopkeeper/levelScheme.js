import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/t-core-goods-level-discount/page',
    method: 'get',
    params: query
  })
}

export function insertBatch(data) {
  return request({
    url: '/api/mini/t-core-goods-level-discount/insertBatch',
    method: 'post',
    data
  })
}

export function updateBatch(data) {
  return request({
    url: '/api/mini/t-core-goods-level-discount/updateBatch',
    method: 'post',
    data
  })
}

export function deleteBatch(ids) {
  return request({
    url: '/api/mini/t-core-goods-level-discount/deleteBatch/'+ids,
    method: 'get',
  })
}

export function saveOrUpdateBatch(data) {
  return request({
    url: '/api/mini/t-core-goods-level-discount/saveOrUpdateBatch',
    method: 'post',
    data
  })
}
