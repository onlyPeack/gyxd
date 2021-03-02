import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/category/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mini/category',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mini/category/' + id,
    method: 'get'
  })
}

export function categoryTree() {
  return request({
    url: '/api/mini/category/categoryTree',
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mini/category/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/mini/category/' + id,
    method: 'put',
    data: obj
  })
}

export function listCatL1() {
  return request({
    url: '/api/mini/category/l1',
    method: 'get'
  })
}

export function getCategoryBylevel(level) {
  return request({
    url: '/api/mini/category/getCategoryBylevel?level=' + level,
    method: 'get'
  })
}

export function updateNavStatus(status, id) {
  return request({
    url: '/api/mini/category/updateNavStatus?id=' + id + "&status=" + status,
    method: 'put'
  })
}

export function updateShowStatus(status, id) {
  return request({
    url: '/api/mini/category/updateShowStatus?id=' + id + "&status=" + status,
    method: 'put'
  })
}
