import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/storage/page',
    method: 'get',
    params: query
  })
}

export function createStorage(obj) {
  return request({
    url: '/api/goods/storage/create',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/storage/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/storage/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/goods/storage/' + id,
    method: 'put',
    data: obj
  })
}

const uploadPath = '/api/goods/storage/create';
export {uploadPath}


export function downloadPath(url) {
  return '/api/goods/storage/downloadFile?key=' + url.substring(url.lastIndexOf('/') + 1, url.length);
}
