import request from '@/utils/request'
import Vue from "vue"
export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/SrmSupplier/selectSupplier',
    method: 'get',
    params: query
  })
}

export function getUserByNo(no) {
  return request({
    url: '/api/admin/user/getUserByNo?no='+no,
    method: 'get'
  })
}
export function initPassword(no) {
  return request({
    url: '/api/admin/user/initPassword',
    method: 'post',
    params: {
      no:no
    }
  })
}

export function sendUserPassword(no) {
  return request({
    url: '/api/srm/supplierAuth/sendUserPassword?no='+no,
    method: 'post'
  })
}

export function updateUser(obj) {
  return request({
    url: '/api/admin/user/updateUser',
    method: 'post',
    data:obj
  })
}
