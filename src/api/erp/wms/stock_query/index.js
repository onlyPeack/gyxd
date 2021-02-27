import request from '@/utils/request'
import Vue from "vue"

export function queryStockDetail(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/queryStockDetail',
    method: 'get',
    params: query
  })
}
export function queryXSStockDetail(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/queryXSStockDetail',
    method: 'get',
    params: query
  })
}

export function pageBySingleProduct(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/pageBySingleProduct',
    method: 'get',
    params: query
  })
}

export function pageByProduct(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/pageByProduct',
    method: 'get',
    params: query
  })
}

export function pageByProductPosition(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/pageByProductPosition',
    method: 'get',
    params: query
  })
}

export function stockSummary(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/stockSummary',
    method: 'get',
    params: query
  })
}

export function queryStockAndCostPrice() {
  return request({
    url: '/api/wms/home-page-data/queryStockAndCostPrice',
    method: 'get'
  })
}

export function queryStockBrand() {
  return request({
    url: '/api/wms/home-page-data/queryStockBrand',
    method: 'get'
  })
}

export function queryWarehouseRank(dateType) {
  return request({
    url: '/api/wms/home-page-data/queryWarehouseRank?dateType=' + dateType,
    method: 'get'
  })
}

export function querySalerRank(dateType) {
  return request({
    url: '/api/wms/home-page-data/querySalerRank?dateType=' + dateType,
    method: 'get',
  })
}

export function queryCustomerRank(dateType) {
  return request({
    url: '/api/wms/home-page-data/queryCustomerRank?dateType=' + dateType,
    method: 'get',
  })
}

export function querySalesReceivableRank(dateType) {
  return request({
    url: '/api/wms/home-page-data/querySalesReceivableRank?dateType=' + dateType,
    method: 'get',
  })
}

export function getStockSharingDataList(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/getStockSharingDataList',
    method: 'get',
    params: query
  })
}
export function getStockDemandAnalysis(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-demand-analysis/findAnalysisList',
    method: 'get',
    params: query
  })
}
export function selectDetailItem(query) {
  if (query) {
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-detail/selectDetailItem',
    method: 'get',
    params: query
  })
}

/**
 *查询调拨库存明细
 * @param query
 */
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/srm-stock-detail/selectAllPage',
    method: 'get',
    params: query
  })
}
/**
 *查询库存来往明细
 * @param query
 */
export function stockExchangeRecord(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-exchange-record/page',
    method: 'get',
    params: query
  })
}

/**
 *查询闲置库存明细
 * @param query
 */
export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/srm/srm-idle-release/selectPageByItem',
    method: 'get',
    params: query
  })
}

/**
 *出入库明细查询
 * @param query
 */
export function findStockRecord(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-record/findStockRecord',
    method: 'get',
    params: query
  })
}


/**
 *库存操作记录查询
 * @param query
 */
export function StockHandlePage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-record/page',
    method: 'get',
    params: query
  })
}


/**
 *库存调拨记录查询
 * @param query
 */
export function findAnalysisList(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-exchange-record/findAnalysisList',
    method: 'get',
    params: query
  })
}


