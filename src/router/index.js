import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {path: '/login', component: resolve => require(['@/views/login/index'], resolve), hidden: true},
  {path: '/register', component: resolve => require(['@/views/register/index'], resolve), hidden: true},
  {path: '/password', component: resolve => require(['@/views/password/index'], resolve), hidden: true},
  {path: '/authredirect', component: resolve => require(['@/views/login/authredirect'], resolve), hidden: true},
  {path: '/404', component: resolve => require(['@/views/errorPage/404'], resolve), hidden: true},
  {path: '/401', component: resolve => require(['@/views/errorPage/401'], resolve), hidden: true},
  {path: '/refresh', component: resolve => require(['@/layout/Refresh'], resolve), hidden: true},
  {path: '/setting', component: resolve => require(['@/views/setting/Setting'], resolve), hidden: true},
  {
    path: '/supplyCatalogueView',
    component: resolve => require(['@/views/erp/purchase/components/supplyCatalogueView'], resolve),
    hidden: true,
    name: '供货目录详情',
    authority: 'supplyCatalogueView'
  },
  {
    path: '/print/purchase-contract-print',
    component: resolve => require(['@/views/erp/purchase/supplier/purchaseContractPrint'], resolve),
    hidden: true
  },
  {
    path: '/print/purchase-order-print',
    component: resolve => require(['@/views/erp/purchase/bill/purchaseOrderPrint'], resolve),
    hidden: true
  },
  {
    path: '/print/sales-invoice-print',
    component: resolve => require(['@/views/erp/financial/receivable/sales-invoice-print'], resolve),
    hidden: true
  },
  {
    path: '/print/sales-contract-print',
    component: resolve => require(['@/views/erp/crm/salesProcess/salesContract/print'], resolve),
    hidden: true
  },
  {
    path: '/print/sales-order-print',
    component: resolve => require(['@/views/erp/sales/bill/customerOrderPrint'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: resolve => require(['@/views/dashboard/index'], resolve),
      name: '首页',
      meta: {title: '首页', icon: 'dashboard'}
    }]
  },
  {
    path: '',
    component: Layout,
    redirect: 'releaseLog',
    children: [{
      path: 'releaseLog',
      component: resolve => require(['@/views/erp/oa/releaseLog'], resolve),
      name: '最新发版日志',
      meta: {title: '最新发版日志', icon: 'releaseLog'}
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/baseManager',
    component: Layout,
    name: '基础配置管理',
    icon: 'setting',
    authority: 'baseManager',
    children: [
      {
        path: 'userManager',
        icon: 'fa-user',
        component: resolve => require(['@/views/admin/user/index'], resolve),
        name: '用户管理',
        authority: 'userManager'
      }, {
        path: 'menuManager',
        icon: 'category',
        component: resolve => require(['@/views/admin/menu/index'], resolve),
        name: '菜单管理',
        authority: 'menuManager'
      }, {
        path: 'groupManager',
        icon: 'group_fill',
        component: resolve => require(['@/views/admin/group/index'], resolve),
        name: '角色权限管理',
        authority: 'groupManager'
      }, {
        path: 'groupTypeManager',
        icon: 'fa-users',
        component: resolve => require(['@/views/admin/groupType/index'], resolve),
        name: '角色类型管理',
        authority: 'groupTypeManager'
      }, {
        path: 'gateLogManager',
        icon: 'viewlist',
        component: resolve => require(['@/views/admin/gateLog/index'], resolve),
        name: '操作日志管理',
        authority: 'gateLogManager'
      }, {
        path: 'dictManager',
        icon: 'viewlist',
        component: resolve => require(['@/views/dict/index'], resolve),
        name: '数据字典',
        authority: 'dictManager'
      }, {
        path: 'tenantManager',
        icon: 'tenant',
        component: resolve => require(['@/views/admin/tenant/index'], resolve),
        name: '租户管理',
        authority: 'tenantManager'
      }, {
        path: 'jobManager',
        icon: 'tenant',
        component: resolve => require(['@/views/admin/job/index'], resolve),
        name: '定时任务管理',
        authority: 'jobManager'
      }, {
        path: 'companyRegister',
        component: resolve => require(['@/views/admin/companyList'], resolve),
        name: '已注册公司',
        authority: 'companyRegister'
      }]
  }, {
    path: '/orgManager',
    component: Layout,
    name: '部门组织管理',
    icon: 'setting',
    authority: 'orgManager',
    children: [{
      path: 'departManager',
      component: resolve => require(['@/views/org/depart/index'], resolve),
      name: '服务权限管理',
      authority: 'departManager'
    }]
  }, {
    path: '/authManager',
    component: Layout,
    name: '服务管理',
    icon: 'setting',
    authority: 'authManager',
    children: [{
      path: 'serviceManager',
      component: resolve => require(['@/views/auth/service/index'], resolve),
      name: '服务权限管理',
      authority: 'serviceManager'
    }, {
      path: 'apiManager',
      component: resolve => require(['@/views/auth/api/index'], resolve),
      name: '服务接口管理',
      authority: 'apiManager'
    }, {
      path: 'gatewayManager',
      component: resolve => require(['@/views/auth/gatewayRoute/index'], resolve),
      name: '网关路由管理',
      authority: 'gatewayManager'
    }, {
      path: 'oauthClientDetailsManager',
      component: resolve => require(['@/views/auth/oauthClientDetails/index'], resolve),
      name: 'OAuth客户端管理',
      authority: 'oauthClientDetailsManager'
    }]
  }, {
    path: '/monitorManager',
    component: Layout,
    name: '监控模块管理',
    icon: 'setting',
    authority: 'monitorManager',
    children: [{
      path: 'serviceEurekaManager',
      component: resolve => require(['@/views/monitor/eureka/index'], resolve),
      name: 'Eureka注册中心',
      authority: 'serviceEurekaManager'
    }, {
      path: 'serviceMonitorManager',
      component: resolve => require(['@/views/monitor/service/index'], resolve),
      name: '服务状态监控',
      authority: 'serviceMonitorManager'
    }, {
      path: 'serviceZipkinManager',
      component: resolve => require(['@/views/monitor/zipkin/index'], resolve),
      name: '服务链路监控',
      authority: 'serviceZipkinManager'
    }]
  },

  /**************************************** CRM模块菜单start ****************************************/
  {
    path: '/customer',
    component: Layout,
    name: '客户管理',
    authority: 'customer',
    children: [{
      path: 'dashboard',
      component: resolve => require(['@/views/erp/crm/customer/dashboard/index'], resolve),
      name: '客户仪表盘',
      authority: 'dashboard'
    }, {
      path: 'customerInfo',
      component: resolve => require(['@/views/erp/crm/customer/customerInfo/customerList'], resolve),
      name: '客户资料',
      authority: 'customerInfo'
    }, {
      path: 'customerLinkman',
      component: resolve => require(['@/views/erp/crm/customer/customerLinkman/index'], resolve),
      name: '联系人资料',
      authority: 'customerLinkman'
    }, {
      path: 'reportForm',
      component: resolve => require(['@/views/erp/crm/customer/reportForm/index'], resolve),
      name: '客户报表',
      authority: 'reportForm'
    }, {
      path: 'customerTransfer',
      component: resolve => require(['@/views/erp/crm/customer/customerTransfer/customerTransfer'], resolve),
      name: '客户转移',
      authority: 'customerTransfer'
    }, {
      path: 'publicPoolCustomer',
      component: resolve => require(['@/views/erp/crm/customer/customerTransfer/publicPoolCustomer'], resolve),
      name: '公共池客户',
      authority: 'publicPoolCustomer'
    }, {
      path: 'customerRecords',
      component: resolve => require(['@/views/erp/crm/customer/customerTransfer/customerRecords'], resolve),
      name: '客户备案查询',
      authority: 'customerRecords'
    }, {
      path: 'customerEdit',
      component: resolve => require(['@/views/erp/crm/customer/customerInfo/customerEdit'], resolve),
      name: '客户信息修改',
      authority: 'customerEdit'
    }
    ]
  },
  {
    path: '/salesProcess',
    component: Layout,
    name: '销售过程',
    authority: 'salesProcess',
    children: [{
      path: 'customerCard',
      component: resolve => require(['@/views/erp/crm/salesProcess/customerCard'], resolve),
      name: '客户名片',
      authority: 'customerCard'
    }, {
      path: 'customerChance',
      component: resolve => require(['@/views/erp/crm/salesProcess/customerChance'], resolve),
      name: '客户商机',
      authority: 'customerChance'
    }, {
      path: 'customerFollow',
      component: resolve => require(['@/views/erp/crm/salesProcess/customerFollow'], resolve),
      name: '客户跟进',
      authority: 'customerFollow'
    }, {
      path: 'customerVisit',
      component: resolve => require(['@/views/erp/crm/salesProcess/customerVisit'], resolve),
      name: '客户拜访',
      authority: 'customerVisit'
    }, {
      path: 'salesContract',
      component: resolve => require(['@/views/erp/crm/salesProcess/salesContract/index'], resolve),
      name: '销售合同',
      authority: 'salesContract'
    }, {
      path: 'moneyBack',
      component: resolve => require(['@/views/erp/crm/salesProcess/moneyBack/index'], resolve),
      name: '回款管理',
      authority: 'moneyBack'
    }]
  },
  {
    path: '/afterSale',
    component: Layout,
    name: '售后管理',
    authority: 'afterSale',
    children: [{
      path: 'servicingAcceptance',
      component: resolve => require(['@/views/erp/crm/afterSale/servicingAcceptance/index'], resolve),
      name: '维修受理',
      authority: 'servicingAcceptance'
    }, {
      path: 'repairApplicationList',
      component: resolve => require(['@/views/erp/crm/afterSale/repairApplicationList'], resolve),
      name: '维修申请',
      authority: 'repairApplicationList'
    }, {
      path: 'accessoriesApplication',
      component: resolve => require(['@/views/erp/crm/afterSale/accessoriesApplication/index'], resolve),
      name: '配件申请',
      authority: 'accessoriesApplication'
    }, {
      path: 'manufactorServicing',
      component: resolve => require(['@/views/erp/crm/afterSale/manufactorServicing/index'], resolve),
      name: '送厂维修',
      authority: 'manufactorServicing'
    }, {
      path: 'pickUp',
      component: resolve => require(['@/views/erp/crm/afterSale/pickUp/index'], resolve),
      name: '客户取件',
      authority: 'pickUp'
    }, {
      path: 'refundMoney',
      component: resolve => require(['@/views/erp/crm/afterSale/refundMoney/index'], resolve),
      name: '维修退款',
      authority: 'refundMoney'
    }, {
      path: 'caring',
      component: resolve => require(['@/views/erp/crm/afterSale/caring/index'], resolve),
      name: '客户关怀',
      authority: 'caring'
    }]
  },
  {
    path: '/credit',
    component: Layout,
    name: '信用管理',
    authority: 'credit',
    children: [{
      path: 'creditInit',
      component: resolve => require(['@/views/erp/crm/credit/creditInit'], resolve),
      name: '信用初始化',
      authority: 'creditInit'
    }, {
      path: 'creditAdjust',
      component: resolve => require(['@/views/erp/crm/credit/creditAdjust'], resolve),
      name: '信用调整单',
      authority: 'creditAdjust'
    }, {
      path: 'creditSpecial',
      component: resolve => require(['@/views/erp/crm/credit/creditSpecial'], resolve),
      name: '信用特批单',
      authority: 'creditSpecial'
    }, {
      path: 'creditLimit',
      component: resolve => require(['@/views/erp/crm/credit/creditLimit'], resolve),
      name: '信用状况表',
      authority: 'creditLimit'
    }, {
      path: 'sx',
      component: resolve => require(['@/views/erp/crm/credit/creditExtension'], resolve),
      name: '客户授信',
      authority: 'sx'
    }, {
      path: 'hx',
      component: resolve => require(['@/views/erp/crm/credit/creditReturn'], resolve),
      name: '客户还信',
      authority: 'hx'
    }]
  },
  /**************************************** CRM模块菜单end ****************************************/

  /**************************************** 仓储模块start ****************************************/
  {
    path: '/wms_config',
    component: Layout,
    name: '仓储配置',
    authority: 'wms_config',
    children: [
      {
        path: 'warehouse',
        component: resolve => require(['@/views/erp/wms/config/warehouse'], resolve),
        name: '仓库资料',
        authority: 'warehouse'
      },
      {
        path: 'wms_bill_audit',
        component: resolve => require(['@/views/erp/wms/config/billAudit'], resolve),
        name: '仓库单据审批',
        authority: 'wms_bill_audit'
      },
      {
        path: 'wms_base',
        component: resolve => require(['@/views/erp/wms/config/wmsBase'], resolve),
        name: '仓库基础配置',
        authority: 'wms_base'
      }, {
        path: 'safety_stock',
        component: resolve => require(['@/views/erp/wms/config/safetyStock'], resolve),
        name: '安全库存',
        authority: 'safety_stock'
      }, {
        path: 'warehouse_position',
        component: resolve => require(['@/views/erp/wms/config/warehousePosition'], resolve),
        name: '仓位管理',
        authority: 'warehouse_position'
      }
    ]
  },
  {
    path: '/stock-report',
    component: Layout,
    name: '库存报表',
    authority: 'stock-report',
    children: [
      {
        path: 'stock-change-record',
        component: resolve => require(['@/views/erp/wms/report/stock-change-record'], resolve),
        name: '出入库明细',
        authority: 'stock-change-record'
      },
      {
        path: 'stock-change-record-summary',
        component: resolve => require(['@/views/erp/wms/report/stock-change-record-summary'], resolve),
        name: '出入库汇表总',
        authority: 'stock-change-record-summary'
      },
      {
        path: 'stock-summary-report',
        component: resolve => require(['@/views/erp/wms/report/stock-summary-report'], resolve),
        name: '库存汇总报表',
        authority: 'stock-summary-report'
      },
      {
        path: 'stockDemandAnalysis',
        component: resolve => require(['@/views/erp/wms/report/stockDemandAnalysis'], resolve),
        name: '库存需求分析',
        authority: 'stockDemandAnalysis'
      },
      {
        path: 'stockExchangeRecord',
        component: resolve => require(['@/views/erp/wms/report/stockExchangeRecord'], resolve),
        name: '库存来往查询',
        authority: 'stockExchangeRecord'
      },
      {
        path: 'findAnalysisList',
        component: resolve => require(['@/views/erp/wms/report/findAnalysisList'], resolve),
        name: '库存调拨记录分析',
        authority: 'findAnalysisList'
      },
    ]
  },
  {
    path: '/stock_query',
    component: Layout,
    name: '库存查询',
    authority: 'stock_query',
    children: [
      {
        path: 'goods_stock_query',
        component: resolve => require(['@/views/erp/wms/stock_query/goods_stock_query'], resolve),
        name: '商品库存查询',
        authority: 'goods_stock_query'
      },
      {
        path: 'goods_release_query',
        component: resolve => require(['@/views/erp/wms/stock_query/goods_release_query'], resolve),
        name: '供货信息查询',
        authority: 'goods_release_query'
      },
      // {
      //   path: 'shared-inventory-query',
      //   component: resolve => require(['@/views/erp/wms/stock_query/shared-inventory-query'], resolve),
      //   name: '共享库存查询',
      //   authority: 'shared-inventory-query'
      // }
    ]
  },
  {
    path: '/stock_lock',
    component: Layout,
    name: '库存锁库',
    authority: 'stock_lock',
    children: [
      {
        path: 'lock',
        component: resolve => require(['@/views/erp/wms/bill/stock_lock/lock/index'], resolve),
        name: '锁库',
        authority: 'lock'
      },
      {
        path: 'lock_log',
        component: resolve => require(['@/views/erp/wms/bill/stock_lock/lock_log/index'], resolve),
        name: '锁库日志',
        authority: 'lock_log'
      },
      {
        path: 'stockHandlePage',
        component: resolve => require(['@/views/erp/wms/bill/stock_lock/stockHandlePage'], resolve),
        name: '库存操作记录',
        authority: 'stockHandlePage'
      },
    ]
  },
  {
    path: '/stock_in',
    component: Layout,
    name: '商品入库',
    authority: 'stock_in',
    children: [
      {
        path: 'purchase_stock_in',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/purchase/purchase_stock_in'], resolve),
        name: '采购入库',
        authority: 'purchase_stock_in'
      },
      {
        path: 'purchase_stock_in_cancel',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/purchase/purchase_stock_in_cancel'], resolve),
        name: '采购入库',
        authority: 'purchase_stock_in_cancel'
      },
      {
        path: 'make_stock_in',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/make/make_stock_in'], resolve),
        name: '生产入库单',
        authority: 'make_stock_in'
      },
      {
        path: 'other_stock_in',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/other/other_stock_in'], resolve),
        name: '其它入库单',
        authority: 'other_stock_in'
      }, {
        path: 'sales_stock_return',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/sales/sales_stock_return'], resolve),
        name: '销售退库单',
        authority: 'sales_stock_return'
      }, {
        path: 'make_materiel_return',
        component: resolve => require(['@/views/erp/wms/bill/stock_in/make/make_materiel_return'], resolve),
        name: '生产退料单',
        authority: 'make_materiel_return'
      }
    ]
  },
  {
    path: '/stock_out',
    component: Layout,
    name: '商品出库',
    authority: 'stock_out',
    children: [
      {
        path: 'sales_stock_out',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/sales/sales_stock_out'], resolve),
        name: '销售出库单',
        authority: 'sales_stock_out'
      },
      {
        path: 'straight_stock_out',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/sales/straight_stock_out'], resolve),
        name: '直发出库单',
        authority: 'straight_stock_out'
      },
      // {
      //   path: 'entrust_stock_out',
      //   component: resolve => require(['@/views/erp/wms/bill/stock_out/sales/entrust_stock_out'], resolve),
      //   name: '委托发货单',
      //   authority: 'entrust_stock_out'
      // },
      {
        path: 'make_materiel_receive',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/make/make_materiel_receive'], resolve),
        name: '生产领料单',
        authority: 'make_materiel_receive'
      },
      {
        path: 'other_stock_out',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/other/other_stock_out'], resolve),
        name: '其它出库单',
        authority: 'other_stock_out'
      }, {
        path: 'purchase_stock_return',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/purchase/purchase_stock_return'], resolve),
        name: '采购退库单',
        authority: 'purchase_stock_return'
      }, {
        path: 'make_stock_out',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/make/make_stock_out'], resolve),
        name: '生产退库单',
        authority: 'make_stock_out'
      }, {
        path: 'delivery_abnormal_feedback',
        component: resolve => require(['@/views/erp/wms/bill/stock_out/feedback/delivery_abnormal_feedback'], resolve),
        name: '发货异常反馈单',
        authority: 'delivery_abnormal_feedback'
      }
    ]
  },
  // {
  //   path: '/stock_lock',
  //   component: Layout,
  //   name: '商品调拨',
  //   authority: 'stock_lock',
  //   children: [
  //     {
  //       path: 'lock',
  //       component: resolve => require(['@/views/erp/wms/bill/stock_lock/lock/index'], resolve),
  //       name: '锁库',
  //       authority: 'lock'
  //     },
  //     {
  //       path: 'lock_log',
  //       component: resolve => require(['@/views/erp/wms/bill/stock_lock/lock_log/index'], resolve),
  //       name: '锁库日志',
  //       authority: 'lock_log'
  //     }
  //   ]
  // },
  {
    path: '/allocation',
    component: Layout,
    name: '商品调拨',
    authority: 'allocation',
    children: [
      {
        path: 'allocation_stock',
        component: resolve => require(['@/views/erp/wms/bill/allocation/allocation_stock_list'], resolve),
        name: '商品调拨单',
        authority: 'allocation_stock'
      },
      {
        path: 'platform_allocation_order',
        component: resolve => require(['@/views/erp/wms/bill/allocation/platform_allocation_order_list'], resolve),
        name: '平台调拨单',
        authority: 'platform_allocation_order'
      },
      {
        path: 'change_warehouse_order',
        component: resolve => require(['@/views/erp/wms/bill/allocation/change_warehouse_order_list'], resolve),
        name: '异仓调拨单',
        authority: 'change_warehouse_order'
      }
    ]
  },
  {
    path: '/check_stock',
    component: Layout,
    name: '库存盘点',
    authority: 'check_stock',
    children: [
      {
        path: 'stock_modify',
        component: resolve => require(['@/views/erp/wms/bill/check_stock/stock_modify'], resolve),
        name: '库存修改单',
        authority: 'stock_modify'
      },
      {
        path: 'stock_taking',
        component: resolve => require(['@/views/erp/wms/bill/check_stock/stock_taking'], resolve),
        name: '库存盘点单',
        authority: 'stock_taking'
      },
      {
        path: 'check_stock_profit',
        component: resolve => require(['@/views/erp/wms/bill/check_stock/check_stock_profit'], resolve),
        name: '盘盈入库单',
        authority: 'check_stock_profit'
      },
      {
        path: 'check_stock_loss',
        component: resolve => require(['@/views/erp/wms/bill/check_stock/check_stock_loss'], resolve),
        name: '盘亏出库单',
        authority: 'check_stock_loss'
      },
      {
        path: 'check_adjust',
        component: resolve => require(['@/views/erp/wms/bill/check_stock/check_adjust'], resolve),
        name: '库存调价单',
        authority: 'check_adjust'
      }
    ]
  },
  {
    path: '/loan',
    component: Layout,
    name: '外借管理',
    authority: 'loan',
    children: [
      {
        path: 'loan_out',
        component: resolve => require(['@/views/erp/wms/bill/loan/loan_out'], resolve),
        name: '外借单',
        authority: 'loan_out'
      },
      {
        path: 'loan_return',
        component: resolve => require(['@/views/erp/wms/bill/loan/loan_return'], resolve),
        name: '归还单',
        authority: 'loan_return'
      }
    ]
  },
  /**************************************** 仓储模块end ****************************************/

  /**************************************** 财务模块start ****************************************/
  {
    path: '/financial_config',
    component: Layout,
    name: '财务',
    icon: 'setting',
    authority: 'financial_config',
    children: [
      {
        path: 'currency',
        component: resolve => require(['@/views/erp/financial/currency'], resolve),
        name: '币别',
        authority: 'currency'
      }, {
        path: 'account',
        component: resolve => require(['@/views/erp/financial/account'], resolve),
        name: '科目',
        authority: 'account'
      }, {
        path: 'voucherGroup',
        component: resolve => require(['@/views/erp/financial/voucherGroup'], resolve),
        name: '凭证字',
        authority: 'voucherGroup'
      }, {
        path: 'explanation',
        component: resolve => require(['@/views/erp/financial/explanation'], resolve),
        name: '摘要',
        authority: 'explanation'
      }, {
        path: 'explanationCategory',
        component: resolve => require(['@/views/erp/financial/explanationCategory'], resolve),
        name: '摘要类别',
        authority: 'explanationCategory'
      }
    ]
  },

  {
    path: '/general-ledger',
    component: Layout,
    name: '总账',
    icon: 'setting',
    authority: 'general-ledger',
    children: [
      {
        path: 'init',
        component: resolve => require(['@/views/erp/financial/general/init/index'], resolve),
        name: '总账初始化',
        authority: 'init'
      },
      {
        path: 'voucherForm',
        component: resolve => require(['@/views/erp/financial/voucherForm'], resolve),
        name: '凭证录入',
        authority: 'voucherForm'
      },
      {
        path: 'voucherList',
        component: resolve => require(['@/views/erp/financial/voucherList'], resolve),
        name: '凭证查询',
        authority: 'voucherList'
      },
      {
        path: 'voucher_summary',
        component: resolve => require(['@/views/erp/financial/general/voucherSummary/index'], resolve),
        name: '凭证汇总表',
        authority: 'voucher_summary'
      }
    ]
  },
  {
    path: '/management',
    component: Layout,
    name: '承兑汇票',
    icon: 'setting',
    authority: 'management',
    children: [
      {
        path: 'management-register',
        component: resolve => require(['@/views/erp/financial/management/AcceptanceRegisterList'], resolve),
        name: '承兑登记',
        authority: 'management-register'
      },
      {
        path: 'management-expenditure',
        component: resolve => require(['@/views/erp/financial/management/AcceptanceExpenditureList'], resolve),
        name: '承兑支出',
        authority: 'management-expenditure'
      },
      {
        path: 'management-back',
        component: resolve => require(['@/views/erp/financial/management/AcceptanceExpenditureBackList'], resolve),
        name: '承兑退回',
        authority: 'management-back'
      },
      {
        path: 'management-remittance',
        component: resolve => require(['@/views/erp/financial/management/remittanceBankList'], resolve),
        name: '汇票库',
        authority: 'management-remittance'
      },
    ]
  },
  {
    path: '/receivable',
    component: Layout,
    name: '应收管理',
    icon: 'setting',
    authority: 'receivable',
    children: [
      {
        path: 'receivables-init',
        component: resolve => require(['@/views/erp/financial/receivable/receivables-init-list'], resolve),
        name: '应收初始化',
        authority: 'receivables-init'
      },
      {
        path: 'sales-receivable',
        component: resolve => require(['@/views/erp/financial/receivable/sales-receivable'], resolve),
        name: '回款',
        authority: 'sales-receivable'
      },
      {
        path: 'sales-refund',
        component: resolve => require(['@/views/erp/financial/receivable/sales-refund-list'], resolve),
        name: '销售退款',
        authority: 'sales-refund'
      },
      {
        path: 'sales-return-invoice',
        component: resolve => require(['@/views/erp/financial/receivable/sales-return-invoice-list'], resolve),
        name: '销售退票',
        authority: 'sales-return-invoice'
      },
      {
        path: 'receivables-detail',
        component: resolve => require(['@/views/erp/financial/receivable/receivables-detail'], resolve),
        name: '应收明细表',
        authority: 'receivables-detail'
      },
      {
        path: 'financialGoods',
        component: resolve => require(['@/views/erp/financial/financialGoods'], resolve),
        name: '财务商品编码',
        authority: 'financialGoods'
      },
      {
        path: 'customer-transfer-info',
        component: resolve => require(['@/views/erp/financial/receivable/customer-transfer-info'], resolve),
        name: '客户往来明细',
        authority: 'customer-transfer-info'
      },
      // {
      //   path: 'issue_receipt_list',
      //   component: resolve => require(['@/views/erp/financial/receivable/issue_receipt_list'], resolve),
      //   name: '收据管理',
      //   authority: 'issue_receipt_list'
      // },
      // {
      //   path: 'receipt_apply_list',
      //   component:resolve => require(['@/views/erp/financial/receivable/receipt_apply_list'],resolve),
      //   name: '收据申请单',
      //   authority: 'receipt_apply_list'
      // }
    ]
  },

  {
    path: '/payable',
    component: Layout,
    name: '应付管理',
    icon: 'setting',
    authority: 'payable',
    children: [
      {
        path: 'payable-init',
        component: resolve => require(['@/views/erp/financial/payable/payableInitList'], resolve),
        name: '应付初始化',
        authority: 'payable-init'
      },
      {
        path: 'purchase-payment',
        component: resolve => require(['@/views/erp/financial/payable/purchasePaymentList'], resolve),
        name: '付款',
        authority: 'purchase-payment'
      },
      {
        path: 'purchase-refund',
        component: resolve => require(['@/views/erp/financial/payable/purchaseRefundList'], resolve),
        name: '采购退款',
        authority: 'purchase-refund'
      },
      {
        path: 'purchase-invoice',
        component: resolve => require(['@/views/erp/financial/payable/purchaseInvoiceList'], resolve),
        name: '采购发票',
        authority: 'purchase-invoice'
      },
      {
        path: 'invoice-verificate',
        component: resolve => require(['@/views/erp/financial/payable/invoiceVerificatelList'], resolve),
        name: '发票核销',
        authority: 'invoice-verificate'
      },
      {
        path: 'payable-detail',
        component: resolve => require(['@/views/erp/financial/payable/payable-detail'], resolve),
        name: '应付明细表',
        authority: 'payable-detail'
      },
      {
        path: 'supplier-transfer-info',
        component: resolve => require(['@/views/erp/financial/payable/supplierTransferInfo'], resolve),
        name: '供应商往来明细',
        authority: 'supplier-transfer-info'
      }
    ]
  },
  {
    path: '/financial-config',
    component: Layout,
    name: '财务配置',
    authority: 'financial-config',
    children: [
      {
        path: 'payments-means',
        component: resolve => require(['@/views/erp/financial/config/paymentsMeans'], resolve),
        name: '结算方式',
        authority: 'payments-means'
      },
      {
        path: 'capital-account',
        component: resolve => require(['@/views/erp/financial/config/capitalAccount'], resolve),
        name: '资金账户',
        authority: 'capital-account'
      },

    ]
  },
  {
    path: '/expense',
    component: Layout,
    name: '费用报销',
    authority: 'expense',
    children: [
      {
        path: 'costReimbursement',
        component: resolve => require(['@/views/erp/financial/expense/costReimbursementList'], resolve),
        name: '费用报销',
        authority: 'costReimbursement'
      },
      {
        path: 'costApply',
        component: resolve => require(['@/views/erp/financial/expense/costApplyList'], resolve),
        name: '费用申请单',
        authority: 'costApply'
      },
      {
        path: 'accountTransfer',
        component: resolve => require(['@/views/erp/financial/expense/accountTransfer'], resolve),
        name: '费用转账单',
        authority: 'accountTransfer'
      },
      {
        path: 'borrowMoney',
        component: resolve => require(['@/views/erp/financial/expense/borrowMoneyList'], resolve),
        name: '借款单',
        authority: 'borrowMoney'
      },
      {
        path: 'repaymentMoney',
        component: resolve => require(['@/views/erp/financial/expense/repaymentMoneyList'], resolve),
        name: '还款单',
        authority: 'repaymentMoney'
      },
      {
        path: 'expenseTransferBatch',
        component: resolve => require(['@/views/erp/financial/expenseTransferBatch'], resolve),
        name: '批量费用划拨',
        authority: 'expenseTransferBatch'
      },
      {
        path: 'financialFeeRegister',
        component: resolve => require(['@/views/erp/financial/financialFeeRegister'], resolve),
        name: '费用登记单',
        authority: 'financialFeeRegister'
      },
      {
        path: 'financialReceiveCharge',
        component: resolve => require(['@/views/erp/financial/financialReceiveCharge'], resolve),
        name: '收发货费用划拨单',
        authority: 'financialReceiveCharge'
      }
    ]
  },
  {
    path: '/capital-manage',
    component: Layout,
    name: '资金管理',
    authority: 'capital-manage',
    children: [
      {
        path: 'balance-account',
        component: resolve => require(['@/views/erp/financial/config/balanceAccount'], resolve),
        name: '余额账户',
        authority: 'balance-account'
      },
      {
        path: 'transaction-flow',
        component: resolve => require(['@/views/erp/financial/config/transactionFlow'], resolve),
        name: '交易记录',
        authority: 'transaction-flow'
      },
      {
        path: 'transactionFlowBack',
        component: resolve => require(['@/views/erp/financial/config/transactionFlowBack'], resolve),
        name: '交易记录回冲',
        authority: 'transactionFlowBack'
      },
      {
        path: 'settleOrgAccount',
        component: resolve => require(['@/views/erp/financial/config/settleOrgAccount'], resolve),
        name: '企业调拨账户',
        authority: 'settleOrgAccount'
      },
      {
        path: 'company-settlement',
        component: resolve => require(['@/views/erp/financial/config/companySettlement'], resolve),
        name: '企业结算单',
        authority: 'company-settlement'
      },
      {
        path: 'company-settlement-billing',
        component: resolve => require(['@/views/erp/financial/config/companySettlementBilling'], resolve),
        name: '企业结算开票单',
        authority: 'company-settlement-billing'
      },
      {
        path: 'staff-account',
        component: resolve => require(['@/views/erp/financial/config/staffAccount'], resolve),
        name: '员工资金账户',
        authority: 'staff-account'
      },
      {
        path: 'client-account',
        component: resolve => require(['@/views/erp/financial/config/clientAccount'], resolve),
        name: '客户资金账户',
        authority: 'client-account'
      },
      {
        path: 'supplier-account',
        component: resolve => require(['@/views/erp/financial/config/supplierAccount'], resolve),
        name: '供应商资金账户',
        authority: 'supplier-account'
      },
      {
        path: 'bank-account',
        component: resolve => require(['@/views/erp/financial/config/bankAccount'], resolve),
        name: '银行资金账户',
        authority: 'bank-account'
      },
      {
        path: 'stock-account',
        component: resolve => require(['@/views/erp/financial/config/stockAccount'], resolve),
        name: '库存资金账户',
        authority: 'stock-account'
      },
      {
        path: 'corporate-account',
        component: resolve => require(['@/views/erp/financial/config/corporateAccount'], resolve),
        name: '公司资金账户',
        authority: 'corporate-account'
      },
      {
        path: 'transaction-record',
        component: resolve => require(['@/views/erp/financial/config/transactionRecord'], resolve),
        name: '资金交易记录',
        authority: 'transaction-record'
      },
    ]
  },
  {
    path: '/capital-balance',
    component: Layout,
    name: '资金平衡',
    authority: 'capital-balance',
    children: [
      {
        path: 'balance-profit',
        component: resolve => require(['@/views/erp/financial/balance/profitBalance'], resolve),
        name: '单据利润分配平衡',
        authority: 'balance-profit'
      },
      {
        path: 'balance-quantity',
        component: resolve => require(['@/views/erp/financial/balance/quantityBalance'], resolve),
        name: '库存数量平衡',
        authority: 'balance-quantity'
      },
      {
        path: 'balance-stock',
        component: resolve => require(['@/views/erp/financial/balance/stockBalance'], resolve),
        name: '库存资金平衡',
        authority: 'balance-stock'
      },
      {
        path: 'balance-supplier',
        component: resolve => require(['@/views/erp/financial/balance/supplierBalance'], resolve),
        name: '供应商资金平衡',
        authority: 'balance-supplier'
      },
      {
        path: 'balance-system',
        component: resolve => require(['@/views/erp/financial/balance/systemBalance'], resolve),
        name: '系统资金平衡',
        authority: 'balance-system'
      },
      {
        path: 'balance-lock',
        component: resolve => require(['@/views/erp/financial/balance/lockBalance'], resolve),
        name: '锁库资金平衡',
        authority: 'balance-lock'
      },
      {
        path: 'balance-financial',
        component: resolve => require(['@/views/erp/financial/balance/procurementStatistics'], resolve),
        name: '和稷采购统计',
        authority: 'balance-financial'
      },
      {
        path: 'balance-history',
        component: resolve => require(['@/views/erp/financial/balance/historyBalance'], resolve),
        name: '历史资金账户',
        authority: 'balance-history'
      },
      {
        path: 'balance-dicyandiamide',
        component: resolve => require(['@/views/erp/financial/balance/dicyandiamideBalance'], resolve),
        name: '双乾资金平衡',
        authority: 'balance-dicyandiamide'
      }
    ]
  },
  /**************************************** 财务模块end ****************************************/



  /**************************************** 商品模块start ****************************************/
  {
    path: '/goodsManager',
    component: Layout,
    name: '商品管理',
    icon: 'setting',
    authority: 'goodsManager',
    children: [
      {
        path: 'goodsList',
        component: resolve => require(['@/views/erp/goods/goodsList'], resolve),
        name: '商品列表',
        authority: 'goodsList'
      }, {
        path: 'brand',
        component: resolve => require(['@/views/erp/goods/brand'], resolve),
        name: '品牌管理',
        authority: 'brand'
      }, {
        path: 'series',
        component: resolve => require(['@/views/erp/goods/series'], resolve),
        name: '系列管理',
        authority: 'series'
      }, {
        path: 'storage',
        component: resolve => require(['@/views/erp/goods/storage'], resolve),
        name: '对象存储',
        authority: 'storage'
      },
      {
        path: 'category',
        component: resolve => require(['@/views/erp/goods/category'], resolve),
        name: '商品类目',
        authority: 'category'
      }, {
        path: 'specificationBase',
        component: resolve => require(['@/views/erp/goods/specificationBase'], resolve),
        name: '商品规格',
        authority: 'specificationBase'
      }, {
        path: 'attributeBase',
        component: resolve => require(['@/views/erp/goods/attributeBase'], resolve),
        name: '商品参数',
        authority: 'attributeBase'
      }, {
        path: 'measureunit',
        component: resolve => require(['@/views/erp/goods/measureunit'], resolve),
        name: '计量单位',
        authority: 'measureunit'
      }, {
        path: 'goodsType',
        component: resolve => require(['@/views/erp/goods/productType'], resolve),
        name: '商品类型',
        authority: 'goodsType'
      }
    ]
  },
  /**************************************** 商品模块end ****************************************/

  /**************************************** 采购模块start ****************************************/
  {
    path: '/supplierManager',
    component: Layout,
    name: '供应商协同',
    authority: 'supplierManager',
    children: [
      {
        path: 'supplier',
        component: resolve => require(['@/views/erp/purchase/supplier/supplierInfo/supplierList'], resolve),
        name: '供应商资料',
        authority: 'supplier'
      },
      {
        path: 'supplierCertifications',
        component: resolve => require(['@/views/erp/purchase/supplier/supplierInfo/supplierCertifications'], resolve),
        name: '供应商认证',
        authority: 'supplierCertifications'
      },
      // {
      //   path: 'supplierVendors',
      //   component: resolve => require(['@/views/erp/purchase/supplier/supplierInfo/supplierVendors'], resolve),
      //   name: '供应商黑名单',
      //   authority: 'supplierVendors'
      // },
      {
        path: 'supplierCreditExtension',
        component: resolve => require(['@/views/erp/purchase/supplier/supplierInfo/supplierCreditExtension'], resolve),
        name: '供应商授信单',
        authority: 'supplierCreditExtension'
      },
      {
        path: 'supplierCreditReturn',
        component: resolve => require(['@/views/erp/purchase/supplier/supplierInfo/supplierCreditReturn'], resolve),
        name: '供应商还信单',
        authority: 'supplierCreditReturn'
      },
      {
        path: 'quotation',
        component: resolve => require(['@/views/erp/purchase/supplier/quotationList'], resolve),
        name: '报价单',
        authority: 'quotation'
      },
      {
        path: 'purchase_contract',
        component: resolve => require(['@/views/erp/purchase/supplier/purchaseContractList'], resolve),
        name: '采购合同',
        authority: 'purchase_contract'
      },
      {
        path: 'purchase_goods_release',
        component: resolve => require(['@/views/erp/purchase/supplier/purchaseGoodsReleaseList'], resolve),
        name: '供货信息发布单',
        authority: 'purchase_goods_release'
      },
      {
        path: 'purchase_goods_release_change',
        component: resolve => require(['@/views/erp/purchase/supplier/purchaseGoodsReleaseChangeList'], resolve),
        name: '供货信息变更单',
        authority: 'purchase_goods_release_change'
      },
      {
        path: 'idle_stock_release',
        component: resolve => require(['@/views/erp/purchase/supplier/idleStockList'], resolve),
        name: '闲置库存发布单',
        authority: 'idle_stock_release'
      },
      {
        path: 'idle_stock_release_change',
        component: resolve => require(['@/views/erp/purchase/supplier/idleStockChangeList'], resolve),
        name: '闲置发布变更单',
        authority: 'idle_stock_release_change'
      },
      {
        path: 'supplyCatalogue',
        component: resolve => require(['@/views/erp/purchase/supplier/supplyCatalogue'], resolve),
        name: '供货目录',
        authority: 'supplyCatalogue'
      },
      // {
      //   path: 'policyBrandSeries',
      //   component: resolve => require(['@/views/erp/purchase/bill/policyBrandSeries'], resolve),
      //   name: '品牌返点系列',
      //   authority: 'policyBrandSeries'
      // },
      // {
      //   path: 'policySeriesRebate',
      //   component: resolve => require(['@/views/erp/purchase/bill/policySeriesRebate'], resolve),
      //   name: '返点系列管理',
      //   authority: 'policySeriesRebate'
      // },
      // {
      //   path: 'policyRegister',
      //   component: resolve => require(['@/views/erp/purchase/bill/policyRegister'], resolve),
      //   name: '政策资源登记单',
      //   authority: 'policyRegister'
      // },
      // {
      //   path: 'policyEffect',
      //   component: resolve => require(['@/views/erp/purchase/bill/policyEffect'], resolve),
      //   name: '政策资源到账单',
      //   authority: 'policyEffect'
      // },
      // {
      //   path: 'supplyCatalogueView',
      //   component: resolve => require(['@/views/erp/purchase/components/supplyCatalogueView'], resolve),
      //   hidden: true,
      //   name: '供货目录详情',
      //   authority: 'supplyCatalogueView'
      // },
    ]
  },
  {
    path: '/purchase_bill',
    component: Layout,
    name: '采购单据',
    authority: 'purchase_bill',
    children: [
      {
        path: 'purchase_apply',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseApplyList'], resolve),
        name: '采购申请单',
        authority: 'purchase_apply'
      },
      {
        path: 'purchase_apply_change',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseApplyChangeList'], resolve),
        name: '采购申请变更单',
        authority: 'purchase_apply_change'
      },
      {
        path: 'purchase_order',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseOrderList'], resolve),
        name: '采购订单',
        authority: 'purchase_order'
      }, {
        path: 'receipt_goods_notice',
        component: resolve => require(['@/views/erp/purchase/bill/receiptGoodsNoticeList'], resolve),
        name: '收货通知单',
        authority: 'receipt_goods_notice'
      }, {
        path: 'receipt_goods_cancel_notice',
        component: resolve => require(['@/views/erp/purchase/bill/receiptGoodsNoticeCancelList'], resolve),
        name: '收货通知变更单',
        authority: 'receipt_goods_cancel_notice'
      }, {
        path: 'purchase_order_change',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseOrderChangeList'], resolve),
        name: '采购订单变更单',
        authority: 'purchase_order_change'
      }, {
        path: 'purchase_return_goods',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseReturnGoodsList'], resolve),
        name: '采购退货申请单',
        authority: 'purchase_return_goods'
      }, {
        path: 'payment_apply',
        component: resolve => require(['@/views/erp/purchase/bill/paymentApplyList'], resolve),
        name: '付款申请单',
        authority: 'payment_apply'
      }
    ]
  },
  {
    path: '/purchase_report',
    component: Layout,
    name: '采购报表',
    authority: 'purchase_report',
    children: [
      {
        path: 'purchase_summary_list',
        component: resolve => require(['@/views/erp/purchase/report/purchaseSummaryList'], resolve),
        name: '采购汇总表',
        authority: 'purchase_summary_list'
      },
      {
        path: 'purchase_detail_list',
        component: resolve => require(['@/views/erp/purchase/report/purchaseDetailList'], resolve),
        name: '采购明细表',
        authority: 'purchase_detail_list'
      }
    ]
  },
  {
    path: '/purchase_config',
    component: Layout,
    name: '采购配置',
    authority: 'purchase_config',
    children: [
      {
        path: 'purchase_bill_audit',
        component: resolve => require(['@/views/erp/purchase/bill/purchaseBillAudit'], resolve),
        name: '采购单据审批',
        authority: 'purchase_bill_audit'
      },
    ]
  },
  /**************************************** 采购模块end ****************************************/


  /**************************************** 销售模块start ****************************************/
  {
    path: '/sales_bill',
    component: Layout,
    name: '销售单据',
    authority: 'sales_bill',
    children: [
      {
        path: 'goods_list',
        component: resolve => require(['@/views/erp/sales/bill/goodsList'], resolve),
        name: '商品列表',
        authority: 'goods_list'
      },
      {
        path: 'goods_detail',
        component: resolve => require(['@/views/erp/sales/bill/goodsDetail'], resolve),
        name: '商品详情',
        authority: 'goods_detail'
      },
      {
        path: 'shopping_cart',
        component: resolve => require(['@/views/erp/sales/bill/shoppingCart'], resolve),
        name: '购物车',
        authority: 'shopping_cart'
      },
      {
        path: 'customer_order',
        component: resolve => require(['@/views/erp/sales/bill/customerOrderList'], resolve),
        name: '客户订货单',
        authority: 'customer_order'
      },
      {
        path: 'customer_order_change',
        component: resolve => require(['@/views/erp/sales/bill/customerOrderChangeList'], resolve),
        name: '客户订货变更单',
        authority: 'customer_order_change'
      }, {
        path: 'delivery_goods_notice',
        component: resolve => require(['@/views/erp/sales/bill/deliveryGoodsNoticeList'], resolve),
        name: '发货通知单',
        authority: 'delivery_goods_notice'
      }, {
        path: 'customer_return_goods',
        component: resolve => require(['@/views/erp/sales/bill/customerReturnGoodsList'], resolve),
        name: '客户退货单',
        authority: 'customer_return_goods'
      }
    ]
  },
  {
    path: '/shgl',
    component: Layout,
    name: '售后管理',
    authority: 'shgl',
    children: [
      {
        path: 'delivery_goods_notice',
        component: resolve => require(['@/views/erp/sales/bill/deliveryGoodsNoticeList'], resolve),
        name: '发货通知单',
        authority: 'delivery_goods_notice'
      }, {
        path: 'customer_return_goods',
        component: resolve => require(['@/views/erp/sales/bill/customerReturnGoodsList'], resolve),
        name: '客户退货单',
        authority: 'customer_return_goods'
      }
    ]
  },
  {
    path: '/price-manage',
    component: Layout,
    name: '价格管理',
    authority: 'price-manage',
    children: [
      {
        path: 'price-plan',
        component: resolve => require(['@/views/erp/sales/price/pricePlanList'], resolve),
        name: '价格方案',
        authority: 'price-plan'
      }, {
        path: 'discount-settings',
        component: resolve => require(['@/views/erp/sales/price/discountSettingsList'], resolve),
        name: '折扣设置',
        authority: 'discount-settings'
      }, {
        path: 'jgcx',
        component: resolve => require(['@/views/erp/sales/price/priceSearch'], resolve),
        name: '价格查询',
        authority: 'jgcx'
      }, {
        path: 'quotations',
        component: resolve => require(['@/views/erp/sales/price/quotationsList'], resolve),
        name: '商品报价',
        authority: 'quotations'
      },{
        path: 'idle-price-plan',
        component: resolve => require(['@/views/erp/sales/price/idlePricePlanList'], resolve),
        name: '闲置库存加点',
        authority: 'idle-price-plan'
      }
    ]
  },
  {
    path: '/sales_report',
    component: Layout,
    name: '销售与分销报表',
    authority: 'sales_report',
    children: [
      {
        path: 'sales_summary_list',
        component: resolve => require(['@/views/erp/sales/report/salesSummaryList'], resolve),
        name: '销售汇总表',
        authority: 'sales_summary_list'
      },
      {
        path: 'sales_detail_list',
        component: resolve => require(['@/views/erp/sales/report/salesDetailList'], resolve),
        name: '销售明细表',
        authority: 'sales_detail_list'
      },
      {
        path: 'sales-profit-statistics',
        component: resolve => require(['@/views/erp/sales/report/salesProfitStatistics'], resolve),
        name: '销售利润统计表',
        authority: 'sales-profit-statistics'
      },
      {
        path: 'stock-out-analysis',
        component: resolve => require(['@/views/erp/sales/report/stockOutAnalysis'], resolve),
        name: '销售出库分析',
        authority: 'stock-out-analysis'
      },
    ]
  },
  {
    path: '/sales_config',
    component: Layout,
    name: '销售与分销配置',
    authority: 'sales_config',
    children: [
      {
        path: 'customer_order_audit',
        component: resolve => require(['@/views/erp/sales/bill/customerOrderAudit'], resolve),
        name: '客户订单审批',
        authority: 'customer_order_audit'
      },
    ]
  },
  /**************************************** 销售模块end ****************************************/


  /**************************************** OA模块start ****************************************/
  {
    path: '/task',
    component: Layout,
    name: '任务流程',
    icon: 'setting',
    authority: 'task',
    children: [{
      path: 'taskNowList',
      component: resolve => require(['@/views/erp/oa/task/taskNowList'], resolve),
      name: '待办任务',
      authority: 'taskNowList'
    }, {
      path: 'taskHistoryList',
      component: resolve => require(['@/views/erp/oa/task/taskHistoryList'], resolve),
      name: '已办任务',
      authority: 'taskHistoryList'
    }]
  }, {
    path: '/oa',
    component: Layout,
    name: 'OA',
    icon: 'setting',
    authority: 'oa',
    children: [{
      path: 'oaDocument',
      component: resolve => require(['@/views/erp/oa/oaDocument'], resolve),
      name: '公司文档',
      authority: 'oaDocument'
    }]
  },
  {
    path: '/mail-list',
    component: Layout,
    name: '通讯录',
    icon: 'setting',
    authority: 'mail-list',
    children: [{
      path: 'company-members',
      component: resolve => require(['@/views/erp/oa/companyMembers'], resolve),
      name: '公司成员',
      authority: 'company-members'
    }, {
      path: 'group',
      component: resolve => require(['@/views/erp/oa/group'], resolve),
      name: '群组',
      authority: 'group'
    }]
  },
  {
    path: '/cultural-construction',
    component: Layout,
    name: '文化建设',
    icon: 'setting',
    authority: 'cultural-construction',
    children: [{
      path: 'notice',
      component: resolve => require(['@/views/erp/oa/notice'], resolve),
      name: '公告',
      authority: 'notice'
    },{
      path: 'issueLog',
      component: resolve => require(['@/views/erp/oa/issueLog'], resolve),
      name: '发版日志',
      authority: 'issueLog'
    },]
  },
  // {
  //   path: '/schedule-manage',
  //   component: Layout,
  //   name: '日程管理',
  //   icon: 'setting',
  //   authority: 'schedule-manage',
  //   children: [{
  //     path: 'scheduleList',
  //     component: resolve => require(['@/views/erp/oa/schedule/scheduleList'], resolve),
  //     name: '日程',
  //     authority: 'scheduleList'
  //   },
  //     {
  //       path: 'schedule',
  //       component: resolve => require(['@/views/erp/oa/schedule/schedule'], resolve),
  //       name: '任务',
  //       authority: 'schedule'
  //     },
  //     {
  //       path: 'daily',
  //       component: resolve => require(['@/views/erp/oa/schedule/daily'], resolve),
  //       name: '日志',
  //       authority: 'daily'
  //     },
  //     {
  //       path: 'meetingRoom',
  //       component: resolve => require(['@/views/erp/oa/schedule/meetingRoom'], resolve),
  //       name: '会议室预定',
  //       authority: 'meetingRoom'
  //     }]
  // },
  // /**************************************** OA模块end ****************************************/
  //
  // /**************************************** 人力资源模块start ****************************************/
  // {
  //   path: '/hrmManager',
  //   component: Layout,
  //   name: '人力资源',
  //   icon: 'setting',
  //   authority: 'hrmManager',
  //   children: [{
  //     path: 'staffRecord',
  //     component: resolve => require(['@/views/erp/hrm/staffRecord'], resolve),
  //     name: '员工档案',
  //     authority: 'staffRecord'
  //   }, {
  //     path: 'staffEmployment',
  //     component: resolve => require(['@/views/erp/hrm/staffEmployment'], resolve),
  //     name: '录用申请',
  //     authority: 'staffEmployment'
  //   }, {
  //     path: 'staffFull',
  //     component: resolve => require(['@/views/erp/hrm/staffFull'], resolve),
  //     name: '转正申请',
  //     authority: 'staffFull'
  //   }, {
  //     path: 'staffLeave',
  //     component: resolve => require(['@/views/erp/hrm/staffLeave'], resolve),
  //     name: '请假申请',
  //     authority: 'staffLeave'
  //   }, {
  //     path: 'staffTransaction',
  //     component: resolve => require(['@/views/erp/hrm/staffTransaction'], resolve),
  //     name: '异动申请',
  //     authority: 'staffTransaction'
  //   }, {
  //     path: 'staffQuit',
  //     component: resolve => require(['@/views/erp/hrm/staffQuit'], resolve),
  //     name: '离职申请',
  //     authority: 'staffQuit'
  //   }, {
  //     path: 'staffPerformance',
  //     component: resolve => require(['@/views/erp/hrm/staffPerformance'], resolve),
  //     name: '绩效考核',
  //     authority: 'staffPerformance'
  //   }, {
  //     path: 'staffSalary',
  //     component: resolve => require(['@/views/erp/hrm/staffSalary'], resolve),
  //     name: '薪资管理',
  //     authority: 'staffSalary'
  //   }]
  // },
  /**************************************** 人力资源模块end ****************************************/
  //
  // /**************************************** 商城模块start ****************************************/
  // {
  //   path: '/pay',
  //   component: Layout,
  //   name: '支付中心',
  //   icon: 'setting',
  //   authority: 'pay',
  //   children: [
  //     {
  //       path: 'channel',
  //       name: '支付渠道',
  //       component: resolve => require(['@/views/mall/pay/channel/index'], resolve),
  //       authority: 'channel'
  //     },
  //     {
  //       path: 'information',
  //       name: '商户信息',
  //       component: resolve => require(['@/views/mall/pay/payMchInfo/index'], resolve),
  //       authority: 'information'
  //     },
  //     {
  //       path: 'inform',
  //       name: '商户通知',
  //       component: resolve => require(['@/views/mall/pay/inform/index'], resolve),
  //       authority: 'inform'
  //     },
  //     {
  //       path: 'order',
  //       name: '支付订单',
  //       component: resolve => require(['@/views/mall/pay/order/index'], resolve),
  //       authority: 'order'
  //     }
  //   ]
  // },
  // {
  //   path: '/workbench',
  //   component: Layout,
  //   name: '工作台',
  //   icon: 'setting',
  //   authority: 'workbench',
  //   children: [
  //     {
  //       path: 'mallDashboard',
  //       name: '商城首页',
  //       component: resolve => require(['@/views/mall/dashboard/index'], resolve),
  //       authority: 'mallDashboard'
  //     },
  //     {
  //       path: 'article',
  //       name: '新闻资讯',
  //       component: resolve => require(['@/views/mall/dashboard/article'], resolve),
  //       authority: 'article'
  //     },
  //   ]
  // },
  // {
  //   path: '/shortLetterService',
  //   component: Layout,
  //   name: '短信服务',
  //   icon: 'setting',
  //   authority: 'shortLetterService',
  //   children: [
  //     {
  //       path: 'shortLetterList',
  //       name: '短信管理',
  //       component: resolve => require(['@/views/mall/service/shortLetter/index'], resolve),
  //       authority: 'shortLetterList'
  //     },
  //     {
  //       path: 'sendingRecords',
  //       name: '发送记录',
  //       component: resolve => require(['@/views/mall/service/sendingRecords'], resolve),
  //       authority: 'sendingRecords'
  //     },
  //     {
  //       path: 'sendingCount',
  //       name: '发送量统计',
  //       component: resolve => require(['@/views/mall/service/sendingCount'], resolve),
  //       authority: 'sendingCount'
  //     }
  //   ]
  // },
  // {
  //   path: '/memberCenter',
  //   component: Layout,
  //   name: '会员中心',
  //   icon: 'setting',
  //   authority: 'memberCenter',
  //   children: [
  //     {
  //       path: 'member',
  //       name: '会员管理',
  //       component: resolve => require(['@/views/mall/sms/member/index'], resolve),
  //       authority: 'member'
  //     },
  //     {
  //       path: 'address',
  //       name: '会员收货地址',
  //       component: resolve => require(['@/views/mall/sms/address/index'], resolve),
  //       authority: 'address'
  //     },
  //     {
  //       path: 'signUpInfo',
  //       name: '报名信息',
  //       component: resolve => require(['@/views/mall/sms/signUpInfo/index'], resolve),
  //       authority: 'signUpInfo'
  //     },
  //     {
  //       path: 'customerWarehouse',
  //       name: '客户仓库信息',
  //       component: resolve => require(['@/views/mall/sms/customerWarehouse/index'], resolve),
  //       authority: 'customerWarehouse'
  //     },
  //     // {
  //     //   path: 'shareUserMiddle',
  //     //   name: '享受人信息',
  //     //   component: resolve => require(['@/views/mall/sms/shareUserMiddle/index'], resolve),
  //     //   authority: 'shareUserMiddle'
  //     // },
  //     // {
  //     //   path: 'cellPhone',
  //     //   name: '会员首页菜单',
  //     //   component: resolve => require(['@/views/mall/sms/cellPhone/index'], resolve),
  //     //   authority: 'cellPhone'
  //     // },
  //     {
  //       path: 'leaveMessage',
  //       name: '留言信息',
  //       component: resolve => require(['@/views/mall/sms/leaveMessage/index'], resolve),
  //       authority: 'leaveMessage'
  //     },
  //   ]
  // },
  // {
  //   path: '/sms',
  //   component: Layout,
  //   name: '营销',
  //   icon: 'setting',
  //   authority: 'sms',
  //   children: [
  //     {
  //       path: 'subject',
  //       name: '主题推荐',
  //       component: resolve => require(['@/views/mall/sms/subject/index'], resolve),
  //       authority: 'subject'
  //     },
  //     {
  //       path: 'brand',
  //       name: '品牌推荐',
  //       component: resolve => require(['@/views/mall/sms/brand/index'], resolve),
  //       authority: 'brand'
  //     },
  //     {
  //       path: 'advertise',
  //       name: '广告管理',
  //       component: resolve => require(['@/views/mall/sms/advertise/index'], resolve),
  //       authority: 'advertise'
  //     },
  //     {
  //       path: 'pageManage',
  //       name: '页面管理',
  //       component: resolve => require(['@/views/mall/sms/homePicture/index'], resolve),
  //       authority: 'pageManage'
  //     }
  //   ]
  // },
  // {
  //   path: '/memberCenter',
  //   component: Layout,
  //   name: '用户中心',
  //   icon: 'setting',
  //   authority: 'sms',
  //   children: [
  //     {
  //       path: 'customerRegister',
  //       component: resolve => require(['@/views/erp/crm/customer/customerInfo/customerRegister'], resolve),
  //       name: '商城客户注册',
  //       authority: 'customerRegister'
  //     }
  //   ]
  // },
  {
    path: '/oms',
    component: Layout,
    name: '订单',
    icon: 'setting',
    authority: 'oms',
    children: [{
      path: 'order',
      component: resolve => require(['@/views/erp/mall/oms/order/index'], resolve),
      name: '订单列表',
      authority: 'order'
    }, {
      path: 'orderSetting',
      component: resolve => require(['@/views/erp/mall/oms/order/setting'], resolve),
      name: '订单设置',
      authority: 'orderSetting'
    }, {
      path: 'manualOrder',
      component: resolve => require(['@/views/erp/mall/oms/order/manualOrder'], resolve),
      name: '手工下单',
      authority: 'manualOrder'
    }, {
      path: 'orderDelay',
      component: resolve => require(['@/views/erp/mall/oms/order/orderDelay'], resolve),
      name: '订单延时',
      authority: 'orderDelay'
    }, {
      path: 'returnApply',
      component: resolve => require(['@/views/erp/mall/oms/apply/index'], resolve),
      name: '退货申请',
      authority: 'returnApply'
    }, {
      path: 'returnReason',
      component: resolve => require(['@/views/erp/mall/oms/apply/reason'], resolve),
      name: '退货原因',
      authority: 'returnReason'
    }]
  },
  // {
  //   path: '/stock_center',
  //   component: Layout,
  //   name: '库存中心',
  //   icon: 'setting',
  //   authority: 'stock_center',
  //   children: [{
  //     path: 'publish',
  //     component: resolve => require(['@/views/erp/mall/stock_center/publish/index'], resolve),
  //     name: '库存发布',
  //     authority: 'publish'
  //   }, {
  //     path: 'company',
  //     component: resolve => require(['@/views/erp/mall/stock_center/company/index'], resolve),
  //     name: '发布企业',
  //     authority: 'company'
  //   }]
  // },
  // {
  //   path: '/mallSetting',
  //   component: Layout,
  //   name: '商城设置',
  //   icon: 'setting',
  //   authority: 'mallSetting',
  //   children: [{
  //     path: 'areaList',
  //     name: '地区维护',
  //     component: resolve => require(['@/views/erp/mall/cms/areaList'], resolve),
  //     authority: 'areaList'
  //   }]
  // },
  // /**************************************** 商城模块end ****************************************/

  {
    path: '/cms',
    component: Layout,
    name: '界面管理',
    icon: 'setting',
    authority: 'cms',
    children: [
      {
        path: 'cmsStoreyGood',
        name: '模板管理',
        component: resolve => require(['@/views/mall/cms/cmsStoreyGood'], resolve),
        authority: 'cmsStoreyGood'
      },
      {
        path: 'recommendGoods',
        name: '商城商品管理',
        component: resolve => require(['@/views/mall/cms/recommendGoods'], resolve),
        authority: 'recommendGoods'
      },
      {
        path: 'taskBillList',
        name: '任务配置',
        component: resolve => require(['@/views/setting/tab/bussiness/taskBillList'], resolve),
        authority: 'taskBillList'
      },
    ]
  },

  // /**************************************** 统计分析模块start ****************************************/
  // {
  //   path: '/analysis',
  //   component: Layout,
  //   name: '统计分析',
  //   icon: 'setting',
  //   authority: 'analysis',
  //   children: [
  //     {
  //       path: '/sales/customerReceivable',
  //       name: '应收分析',
  //       component: resolve => require(['@/views/erp/analysis/sales/customerReceivable'], resolve),
  //       authority: 'customerReceivable'
  //     },
  //     {
  //       path: '/sales/salesProfit',
  //       name: '销售毛利分析',
  //       component: resolve => require(['@/views/erp/analysis/sales/salesProfit'], resolve),
  //       authority: 'salesProfit'
  //     },
  //     {
  //       path: '/sales/orderConversion',
  //       name: '订单转化分析',
  //       component: resolve => require(['@/views/erp/analysis/sales/orderConversion'], resolve),
  //       authority: 'orderConversion'
  //     },
  //     {
  //       path: '/sales/salesArea',
  //       name: '销售区域分析',
  //       component: resolve => require(['@/views/erp/analysis/sales/salesArea'], resolve),
  //       authority: 'salesArea'
  //     },
  //     {
  //       path: '/sales/saleCheckAnalysis',
  //       name: '销售综合分析',
  //       component: resolve => require(['@/views/erp/analysis/sales/saleCheckAnalysis'], resolve),
  //       authority: 'saleCheckAnalysis'
  //     },
  //     {
  //       path: '/purchase/suppilerPay',
  //       name: '应付统计',
  //       component: resolve => require(['@/views/erp/analysis/purchase/suppilerPay'], resolve),
  //       authority: 'suppilerPay'
  //     },
  //     {
  //       path: '/purchase/purchaseStockIn',
  //       name: '采购入库综合分析',
  //       component: resolve => require(['@/views/erp/analysis/purchase/purchaseStockIn'], resolve),
  //       authority: 'purchaseStockIn'
  //     },
  //     {
  //       path: '/purchase/purchaseOrder',
  //       name: '采购订单综合分析',
  //       component: resolve => require(['@/views/erp/analysis/purchase/purchaseOrder'], resolve),
  //       authority: 'purchaseOrder'
  //     },
  //     {
  //       path: '/purchase/channelAnalysis',
  //       name: '渠道贡献分析',
  //       component: resolve => require(['@/views/erp/analysis/purchase/channelAnalysis'], resolve),
  //       authority: 'channelAnalysis'
  //     },
  //     {
  //       path: '/storage/stockAmountAnalysis',
  //       name: '库存余额综合统计',
  //       component: resolve => require(['@/views/erp/analysis/storage/stockAmountAnalysis'], resolve),
  //       authority: 'stockAmountAnalysis'
  //     },
  //     {
  //       path: '/storage/stockTurnover',
  //       name: '库存周转率分析',
  //       component: resolve => require(['@/views/erp/analysis/storage/stockTurnover'], resolve),
  //       authority: 'stockTurnover'
  //     },
  //     {
  //       path: '/log/customerOperationLog',
  //       name: '客户操作日志',
  //       component: resolve => require(['@/views/erp/analysis/log/customerOperationLog'], resolve),
  //       authority: 'customerOperationLog'
  //     },
  //
  //   ]
  // },
  // /**************************************** 统计分析模块end ****************************************/
  /**************************************** 营销模块Start ****************************************/
  {
    path: '/marketing',
    component: Layout,
    name: '营销',
    authority: 'marketing',
    children: [
      {
        path: 'coupon',
        name: '优惠券',
        component: resolve => require(['@/views/erp/marketing/coupon'], resolve),
        authority: 'coupon'
      },
      {
        path: 'advertise',
        name: '广告管理',
        component: resolve => require(['@/views/mall/sms/advertise/index'], resolve),
        authority: 'advertise'
      },
    ]
  },
  /**************************************** 营销模块end ****************************************/
  /**************************************** 店主管理模块Start ****************************************/
  {
    path: '/shopkeeper',
    component: Layout,
    name: '店主管理',
    authority: 'shopkeeper',
    children: [
      {
        path: 'checkPending',
        name: '待审核店铺',
        component: resolve => require(['@/views/erp/shopkeeper/checkPending'], resolve),
        authority: 'checkPending'
      },
    ]
  },
  /**************************************** 店主管理模块end ****************************************/
  /**************************************** 运营中心模块Start ****************************************/
  {
    path: '/operation',
    component: Layout,
    name: '运营中心',
    authority: 'operation',
    children: [
      {
        path: 'feedback',
        name: '意见反馈',
        component: resolve => require(['@/views/erp/operation/feedback'], resolve),
        authority: 'feedback'
      },
    ]
  },

  /**************************************** 店主管理模块end ****************************************/
  /**************************************** 会员管理模块Start ****************************************/
  {
    path: '/member',
    component: Layout,
    name: '会员管理',
    authority: 'member',
    children: [
      {
        path: 'memberList',
        name: '会员列表',
        component: resolve => require(['@/views/erp/member/memberList'], resolve),
        authority: 'memberList'
      },
    ]
  },


  /**************************************** 会员管理模块end ****************************************/


];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
