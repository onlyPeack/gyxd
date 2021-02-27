import request from '@/utils/request'

export function getCollect() {
  return request({
    url: '/api/mall/home/statistical/gather',
    method: 'post',
  })
}

export function selectCounts(id) {
  return request({
    url: '/api/mall/home/statistical/sales/' + id,
    method: 'post'
  })
}

export function getComprehensiveCollect(id) {
  return request({
    url: '/api/mall/home/statistical/comprehensiveCollect/' + id,
    method: 'post'
  })
}

export function comprehensiveSales(id) {
  return request({
    url: '/api/mall/home/statistical/comprehensiveSales/' + id,
    method: 'post'
  })
}
