import request from '@/utils/request'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/ums-member-commission/pageForWeb',
    method: 'get',
    params: query
  })
}

export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/ums-member-commission-record/page',
    method: 'get',
    params: query
  })
}

export function updObj(data) {
  return request({
    url: '/api/mini/ums-member-commission/update',
    method: 'post',
    data
  })
}

export function updateNote(data) {
  return request({
    url: '/api/mini/ums-member-commission/updateNote',
    method: 'post',
    data
  })
}
