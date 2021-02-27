import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/api/mall/sms/tableTemplate/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/api/mall/sms/tableTemplate/update',
    method: 'post',
    data: data
  })
}

export function select(id) {
  return request({
    url: '/api/mall/sms/tableTemplate/select/' + id,
    method: 'post',
  })
}

export function list(params) {
  return request({
    url: '/api/mall/sms/tableTemplate/list',
    method: 'get',
    params: params
  })
}

export function updateTemplateType(params) {
  return request({
    url: '/api/mall/sms/tableTemplate/selectTemplateType',
    method: 'post',
    params: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/api/mall/sms/tableTemplate/selectStatus',
    method: 'post',
    params: params
  })
}

export function deletes(data) {
  return request({
    url: '/api/mall/sms/tableTemplate/delete',
    method: 'post',
    data: data
  })
}

// 发送记录对应接口
export function recordList(params) {
  return request({
    url: '/api/mall/sms/tableRecord/list',
    method: 'get',
    params: params
  })
}

export function deleteRecord(data) {
  return request({
    url: '/api/mall/sms/tableRecord/delete',
    method: 'post',
    data: data
  })
}

export function statistical(data) {
  return request({
    url: '/api/mall/sms/tableRecord/statistical',
    method: 'post',
    params: data
  })
}
