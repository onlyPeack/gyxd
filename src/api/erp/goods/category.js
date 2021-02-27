import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/category/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/category',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/category/' + id,
    method: 'get'
  })
}

export function categoryTree() {
  return request({
    url: '/api/goods/category/categoryTree',
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/category/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/goods/category/' + id,
    method: 'put',
    data: obj
  })
}

export function listCatL1() {
  return request({
    url: '/api/goods/category/l1',
    method: 'get'
  })
}

export function getCategoryBylevel(level) {
  return request({
    url: '/api/goods/category/getCategoryBylevel?level=' + level,
    method: 'get'
  })
}

export function updateNavStatus(status, id) {
  return request({
    url: '/api/goods/category/updateNavStatus?id=' + id + "&status=" + status,
    method: 'put'
  })
}

export function updateShowStatus(status, id) {
  return request({
    url: '/api/goods/category/updateShowStatus?id=' + id + "&status=" + status,
    method: 'put'
  })
}
