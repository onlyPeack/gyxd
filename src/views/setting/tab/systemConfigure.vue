<template>
  <div class="system-configure">
    <el-row>
      <el-col :span="3" class="left-container">
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="value"
          highlight-current
          :props="defaultProps"
          :accordion="true"
          ref="menuTree"
          :default-expand-all="false"
          icon-class="el-icon-arrow-right"
          @node-click="hanleNodeClick"
        >
        </el-tree>
      </el-col>
      <el-col :span="21">
        <component :is="plugItem" v-for="(plugItem, plugIndex) in plugs" :key='plugIndex'>
        </component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "systemConfigure",
    data() {
      return {
        plugs: [],
        treeData: [
          {
            value: 'OA',
            label: 'OA',
            children: [
              {
                path: 'setting/tab/bussiness/taskBillList',
                value: '任务配置',
                label: '任务配置'
              }
            ]
          },
          {
            value: '财务',
            label: '财务',
            children: [
              {
                value: '总账',
                label: '总账',
                children: [
                  {
                    path: 'erp/financial/currency',
                    value: '币别',
                    label: '币别'
                  }, {
                    path: 'erp/financial/account',
                    value: '科目',
                    label: '科目'
                  }, {
                    path: 'erp/financial/voucherGroup',
                    value: '凭证字',
                    label: '凭证字'
                  }, {
                    path: 'erp/financial/explanation',
                    value: '摘要',
                    label: '摘要'
                  }, {
                    path: 'erp/financial/explanationCategory',
                    value: '摘要类别',
                    label: '摘要类别'
                  }
                ]
              },
              {
                value: '财务基础配置',
                label: '财务基础配置',
                children: [
                  {
                    path: 'erp/financial/config/paymentsMode',
                    value: '支付方式',
                    label: '支付方式',
                  },
                  {
                    path: 'erp/financial/config/paymentsMeans',
                    value: '结算方式',
                    label: '结算方式',
                  },
                  {
                    path: 'erp/financial/config/capitalAccount',
                    value: '银行账户',
                    label: '银行账户',
                  },{
                    path: 'erp/financial/config/companyAccount',
                    value: '公司账户',
                    label: '公司账户',
                  },
                  {
                    path: 'erp/financial/config/costRatio',
                    value: '费用比例设置',
                    label: '费用比例设置',
                  }
                ]
              }
            ]
          },
          {
            value: '采购',
            label: '采购',
            children: [
              {
                path:'erp/purchase/bill/policyChannelType',
                value: '渠道类型',
                label: '渠道类型'
              }
            ]
          },
          {
            value: '仓储',
            label: '仓储',
            children: [
              {
              //   path: 'erp/wms/config/safetyStock',
              //   value: '安全库存',
              //   label: '安全库存'
              // }, {
                path: 'erp/wms/config/warehousePosition',
                value: '仓位管理',
                label: '仓位管理'
              }, {
                path: 'erp/wms/config/logistics',
                value: '快递方式',
                label: '快递方式'
              }, {
                path: 'erp/wms/config/commodityLabel',
                value: '商品标签',
                label: '商品标签'
              }, {
                path: 'erp/wms/config/warehouseLogistics',
                value: '仓库物流设置',
                label: '仓库物流设置'
              }, {
                path: 'erp/wms/config/warehouseLogisticsTemplate',
                value: '物流费用设置',
                label: '物流费用设置'
              }
            ]
          },
          {
            value: '销售与分销',
            label: '销售与分销',
            children: [
              {
                value: '商品资料',
                label: '商品资料',
                children: [
                  {
                    path: 'erp/goods/measureunit',
                    value: '计量单位',
                    label: '计量单位'
                  }
                ]
              },
              {
                value: '价格管理',
                label: '价格管理',
                children: [
                  {
                    path: 'erp/sales/price/discountSettingsList',
                    value: '折扣设置',
                    label: '折扣设置'
                  }
                ]
              }
            ]
          },
          {
            value: 'CRM',
            label: 'CRM',
            children: [
              {
                path: 'erp/crm/customer/customerType/customerType',
                value: '客户类型',
                label: '客户类型'
              },
              {
                path: 'erp/crm/customer/customerType/customerAttribute',
                value: '客户属性',
                label: '客户属性'
              },
              {
                path: 'erp/crm/customer/customerType/customerIndustry',
                value: '客户行业',
                label: '客户行业'
              },
              {
                path: 'erp/crm/customer/customerType/customerGrade',
                value: '客户等级',
                label: '客户等级'
              }
            ]
          },
          {
            value: '系统配置',
            label: '系统配置',
            children: [
              // {
              //   value: '基础资料',
              //   label: '基础资料'
              // },
              // {
              //   value: '字段授权',
              //   label: '字段授权'
              // }
            ]
          },
          {
            value:'SRM',
            label: 'SRM',
            children:[
              // {
              //   value: '供应商管理',
              //   label: '供应商管理',
              //   children :[
              //     {
              //       value: '供应商详情',
              //       label: '供应商详情'
              //     }  ,{
              //       value: '新增',
              //       label: '新增'
              //     },{
              //       value: '供应商认证',
              //       label: '供应商认证'
              //     },{
              //       path: 'erp/purchase/supplier/supplierInfo/supplierVendors',
              //       value: '供应商黑名单',
              //       label: '供应商黑名单'
              //     }
              //   ]
              // },
              {
                value: '加价点设置',
                label: '加价点设置',
                path: 'erp/srm/markupSetting'
                // children :[
                //   {
                //     value: '新增加价点设置',
                //     label: '新增加价点设置',
                //     path: 'erp/srm/markupSetting'
                //   }
                // ]
              }
            ]
          },
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      if(this.$route.query.activeView && this.$route.query.activeView=='discount-settings'){
        this.plugs.push(() => import('@/views/erp/sales/price/discountSettingsList'));
      }else{
        this.plugs.push(() => import('@/views/setting/tab/bussiness/taskBillList'));
      }
    },
    methods: {
      hanleNodeClick(data) {
        if (data.path && data.path != '') {
          this.plugs = [];
          console.log(data,'223')
          let url=String('@/views/'+data.path)
          this.plugs.push(() => import(`@/views/${data.path}`));
        }
      }
    }
  }
</script>

<style lang="scss">
  .system-configure {
    .left-container {
      height: 87vh;
      overflow: auto;
      border-right: 1px solid #ddd;
      .el-tree-node__content {
        height: 40px;
      }
    }
  }
</style>
