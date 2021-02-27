<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>订单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <!--      <el-table-column label="审核状态" width="80" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag v-if="scope.row "-->
      <!--                  :type="scope.row.auditStatus==1?'success':scope.row.auditStatus==2?'danger':'warning'"-->
      <!--                  effect="plain">{{scope.row.auditStatus | formatAuditStatus}}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="主订单编号" prop="masterOrderSn" width="170" align="center" sortable>-->
      <!--        <template slot-scope="scope">-->
      <!--          <div>{{scope.row.masterOrderSn}}-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="子订单编号" width="170" align="center" prop="orderSn" sortable>
        <template slot-scope="scope">
          <div>{{scope.row.orderSn}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" width="70" align="center">
        <template slot-scope="scope">{{scope.row.customer}}</template>
      </el-table-column>
      <el-table-column label="客户名称" width="240" align="center">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column label="客服账号" width="100">
        <template slot-scope="scope"> {{scope.row.crtUserName}}</template>
      </el-table-column>
      <!--<el-table-column label="订单类型" width="80" align="center">-->
      <!--<template slot-scope="scope">{{scope.row.orderType === 0 ? '正常订单' : scope.row.orderType ===1 ?-->
      <!--'秒杀订单': scope.row.orderType ===2?'期货订单':'调拨订单'}}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="单价" prop="productPrice" width="100" align="right">
        <template slot-scope="scope" v-if="scope.row.productPrice">￥{{scope.row.productPrice.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="60" align="right" prop="productQuantity">
        <template slot-scope="scope">{{scope.row.productQuantity}}</template>
      </el-table-column>
      <el-table-column label="金额" width="120" align="right" prop="totalAmount">
        <template slot-scope="scope">{{scope.row.totalAmount}}</template>
      </el-table-column>
      <el-table-column label="利润（参考）" prop="profit" width="120" align="right" >
        <template slot-scope="scope" v-if="scope.row.profit">
          <font :class="scope.row.profit < 0 ? 'costColor': ''">￥{{scope.row.profit}}</font>
        </template>
      </el-table-column>
      <el-table-column label="毛利率(%)" width="120" align="right"  prop="profitPercent" class-name="col-required">
        <template slot-scope="scope">{{scope.row.profitPercent}}</template>
      </el-table-column>
      <el-table-column label="品牌" width="100">
        <template slot-scope="scope">{{scope.row.productBrand}}</template>
      </el-table-column>
      <el-table-column label="订货号" width="180">
        <template slot-scope="scope">{{scope.row.sp1}}</template>
      </el-table-column>
      <el-table-column label="型号" width="180">
        <template slot-scope="scope">{{scope.row.sp2}}</template>
      </el-table-column>
      <el-table-column label="品名" width="180">
        <template slot-scope="scope">{{scope.row.productName}}</template>
      </el-table-column>
      <!--<el-table-column label="订单时间" width="160" prop="createTime" align="center">-->
      <!--<template slot-scope="scope">{{scope.row.createTime}}</template>-->
      <!--</el-table-column>-->
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>
    <!-- 订单详情弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getFloat } from '@/utils/util'
  import { getAuditOrderTask, auditOrderTask } from '@/api/erp/mall/oms/order/order'
  import { getObj } from '@/api/admin/user/index'
  import { getProcessId } from '@/api/erp/oa/task/taskBill'

  export default {
    name: 'orderListView',
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isAgreeLoading: false,
        isRejectLoading: false,
        dataForm: {
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        totalAmount:undefined,
        totalProfit:undefined,
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value) {
        if (value === 0) {
          return '待付款'
        } else if (value === 1) {
          return '待发货'
        } else if (value === 11) {
          return '部分发货'
        } else if (value === 2) {
          return '已发货'
        } else if (value === 3) {
          return '已完成'
        } else if (value === 4) {
          return '已关闭'
        } else if (value === 5) {
          return '无效订单'
        } else if (value === 6) {
          return '异常订单'
        } else if (value === 7) {
          return '部分支付'
        } else if (value === 8) {
          return '发货中'
        } else {

        }
      },
      formatAuditStatus(value) {
        if (value === 0) {
          return '未审核'
        } else if (value === 1) {
          return '正常'
        } else if (value === 2) {
          return '驳回'
        } else {
          return '审核中'
        }
      }
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 334
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        getAuditOrderTask(this.id)
          .then(response => {
            this.dataForm = response.data
            this.dataForm.orderItemList = response.data.orderItemList
            this.items = response.data.orderItemList
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, '')
            this.getProcessId(billPrefix)
          })
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response
          }
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'productQuantity' || column.property == 'totalAmount' ||column.property == 'profit') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0).toFixed(2);
              sums[index] += ' ';
            }
            // 出库金额合计
            if (column.property == 'totalAmount') {
              this.totalAmount = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0).toFixed(2);
            }
            if (column.property == 'profit') {
              this.totalProfit = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0).toFixed(2);
            }

            if (column.property == 'profitPercent') {
              sums[index] = (Number(this.totalProfit * 1)/Number(this.totalAmount * 1)*100).toFixed(4);
              sums[index] += ' ';
            }
          } else {
            sums[index] = ' ';
          }
        });
        return sums;
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        }
        this.auditBill(this, 'dataForm', auditOrderTask, 'submitDetailSuccess')
      }
    }
  }
</script>

<style scoped>
  .tb-edit {
    height: 80% !important
  }

  .costColor {
    color: #F56C6C;
  }
</style>
