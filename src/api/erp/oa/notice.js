import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/notice/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/oa/notice',
    method: 'post',
    data: obj
  })
}

export function addComment(obj) {
  return request({
    url: '/api/oa/dailyComment',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'put',
    data: obj
  })
}

export function readStatus(sourceId,toUser) {
  return request({
    url: '/api/oa/dailyUser?sourceId='+sourceId+'&toUser='+toUser,
    method: 'post',
  })
}

/**
 * 获取公告
 */
export function getNote() {
  return request({
    url: 'api/oa/notice/getNote',
    method: 'get',
  })
}

/**
 * 已读公告
 */
export function readNote(sourceId,toUser) {
  return request({
    url: '/api/oa/dailyUser/updateStatus?sourceId='+sourceId+'&toUser='+toUser,
    method: 'get',
  })
}

