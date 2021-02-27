import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-capital-account/page',
    method: 'get',
    params: query
  })
}

export function pageCompanyAccount(query) {
  return request({
    url: '/api/financial/financial-capital-account/pageCompanyAccount',
    method: 'get',
    params: query
  })
}

export function getTakeAccount(query) {
  return request({
    url: '/api/financial/financial-capital-account/getTakeAccount',
    method: 'get',
    params: query
  })
}
export function getAssignAccount(query) {
  return request({
    url: '/api/financial/financial-capital-account/getAssignAccount',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/financial-capital-account',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/financial-capital-account/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/financial-capital-account/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/financial-capital-account/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/financial/financial-capital-account/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}
