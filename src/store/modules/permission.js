import { asyncRoutes, constantRoutes } from '@/router'

import { getAllMenus } from '@/api/login'
/**
 * 通过authority判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.authority) {
    if (menus[route.authority] !== undefined) {
      return menus[route.authority]
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      //console.log(menuDatas[route.authority],route,'错误检测')
      route.name = menuDatas[route.authority].title
      route.icon = menuDatas[route.authority].icon
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const state = {
  routes: constantRoutes,
  addRouters: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRouters = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  GenerateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      getAllMenus().then(data => {
        const menuDatas = {}
        for (let i = 0; i < data.length; i++) {
          menuDatas[data[i].code] = data[i]
        }
        const accessedRouters = filterAsyncRouter(asyncRoutes, menus, menuDatas);
        // console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
