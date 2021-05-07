import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mini/goods/page',
    method: 'get',
    params: query
  })
}

export function selectGoodsBySeries(seriesName) {
  return request({
    url: '/api/mini/goods/selectGoodsBySeries?seriesName=' + seriesName,
    method: 'get'
  })
}

export function addGoods(obj) {
  return request({
    url: '/api/mini/goods/addGoods',
    method: 'post',
    data: obj
  })
}

export function updateGoods(obj) {
  return request({
    url: '/api/mini/goods/updateGoods',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mini/goods/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mini/goods/' + id,
    method: 'delete'
  })
}

export function listCatAndBrand() {
  return request({
    url: '/api/mini/goods/listCatAndBrand',
    method: 'get'
  })
}

export function getGoodsDetail(id) {
  return request({
    url: '/api/mini/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function getAttributeBaseAll() {
  return request({
    url: '/api/mini/attributeBase/all',
    method: 'get'
  })
}

export function getSpecificationBaseAll() {
  return request({
    url: '/api/mini/specificationBase/all',
    method: 'get'
  })
}

export function initGoodsFromStandardStore() {
  return request({
    url: '/api/mini/goods/initGoodsFromStandardStore',
    method: 'get'
  })
}

export function queryParamsAndAttrByGoodsTypeId(id) {
  return request({
    url: '/api/mini/goods/queryParamsAndAttrByGoodsTypeId?id=' + id,
    method: 'get'
  })
}

export function updateOnSaleStatus(status, id) {
  return request({
    url: '/api/mini/goods/updateOnSaleStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function updateIsNewStatus(status, id) {
  return request({
    url: '/api/mini/goods/updateIsNewStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function updateIsHotStatus(status, id) {
  return request({
    url: '/api/mini/goods/updateIsHotStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function coverFromOut() {
  return request({
    url: '/a/cp/cpCategory/tree',
    method: 'post'
  })
}

export function getByPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/a/cp/cpProducts/getByPage',
    method: 'get',
    params: query
  })
}

export function coverFromOuts(query) {
  return request({
    url: '/api/mini/goods/coverFromOut',
    method: 'get',
    params: query
  })
}

export function handleCategorySpec() {
  return request({
    url: '/api/mini/goods/handleCategorySpec',
    method: 'get'
  })
}

export function downTemplate() {
  return request({
    url: 'api/mini/goods/downTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function updateBatch(data) {
  return request({
    url: 'api/mini/goods/updateBatch',
    method: 'post',
    data
  })
}
