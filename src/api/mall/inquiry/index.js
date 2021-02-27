import request from '@/utils/request'

export function selectPageByItem(params) {
  return request({
    url: '/api/mall/home/quotation/getQuotation',
    method: 'post',
    params: params
  })
}

export function selectIntegrated(params) {
  return request({
    url: '/api/mall/home/quotation/getIntegrated',
    method: 'post',
    params: params
  })
}

export function selectPage(params) {
  return request({
    url: '/api/mall/home/quotation/getDocument',
    method: 'post',
    params: params
  })
}

export function updateObj(data) {
  return request({
    url: '/api/mall/home/quotation/UpdateQuotation',
    method: 'post',
    data: data
  })
}

// export function getObj(params) {
//   return request({
//     url: '/api/mall/home/quotation/selectSumgoods',
//     method: 'post',
//     params: params
//   })
// }

export function select(id) {
  return request({
    url: '/api/mall/home/quotation/select/' + id,
    method: 'post'
  })
}

export function deleteObj(obj) {
  return request({
    url: '/api/mall/home/quotation/deleteQuotation',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/mall/home/quotation/auditSaleInquiry',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mall/home/quotation/getObject/' + id,
    method: 'get'
  })
}
