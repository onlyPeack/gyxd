import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/oa/issueLog/page',
        method: 'get',
        params: query
    })
}

export function selectNewLog(obj) {
  return request({
    url: '/api/oa/issueLog/selectNewLog',
    method: 'get',
    data: obj
  })
}

export function addObj(obj) {
    return request({
        url: '/api/oa/issueLog',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/oa/issueLog/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/oa/issueLog/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/oa/issueLog/' + id,
        method: 'put',
        data: obj
    })
}
export function addBill(obj) {
    return request({
        url: '/api/oa/issueLog/addBill',
        method: 'post',
        data: obj
    })
}

export function auditBill(obj) {
    return request({
        url: '/api/oa/issueLog/auditBill',
        method: 'post',
        data: obj
    })
}

export function deleteBill(id) {
    return request({
        url: '/api/oa/issueLog/deleteBill/?id=' + id,
        method: 'post'
    })
}
