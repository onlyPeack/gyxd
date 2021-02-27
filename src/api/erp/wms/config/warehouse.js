import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/warehouse/page',
    method: 'get',
    params: query
  })
}

export function pageAll() {
  return request({
    url: '/api/wms/warehouse/pageAll',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/api/wms/warehouse',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/wms/warehouse/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/wms/warehouse/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/wms/warehouse/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/wms/warehouse/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}
