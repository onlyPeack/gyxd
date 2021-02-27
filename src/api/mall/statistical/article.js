import request from '@/utils/request'
import Vue from "vue"
export function page(params) {
  if(params){
    params = Vue.prototype.filterObjSpace(params);
  }
  return request({
    url:'/api/mall/cms-article-consultation/page',
    method:'get',
    params:params
  })
}

/**
 * 新增新闻资讯
 * @param data
 */
export function addObj(data) {
  return request({
    url:'/api/mall/cms-article-consultation',
    method:'post',
    data
  })
}

/**
 * 编辑新闻资讯
 * @param data
 */
export function updObj(data) {
  return request({
    url:'/api/mall/cms-article-consultation/'+data.id,
    method:'put',
    data
  })
}


/**
 * 删除单个新闻资讯
 * @param id
 */
export function delObj(id) {
  return request({
    url:'/api/mall/cms-article-consultation/'+id,
    method:'delete',
  })
}
