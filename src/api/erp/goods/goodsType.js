import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/goods/goodsType/page',
    method: 'get',
    params: query
  })
}

export function allGoodsType() {
  return request({
    url: '/api/goods/goodsType/allGoodsType',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/goods/goodsType/addGoodsType',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/goods/goodsType/updateGoodsType',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/goods/goodsType/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/goods/goodsType/' + id,
    method: 'delete'
  })
}


