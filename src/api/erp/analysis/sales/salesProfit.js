import request from '@/utils/request'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stockOutAnalysis/getSalesmanProfit',
    method: 'get',
    params: query
  })
}
