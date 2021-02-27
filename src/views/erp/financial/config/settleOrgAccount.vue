<template>
  <div class="app-container calendar-list-container sales-summary-list-container bill-container">
    <el-tabs v-model="selectType">
      <el-tab-pane label="结算账户" name="1">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="组织编码"
                      @keyup.enter.native="handleSettleFilter" v-model="settleListQuery.orgCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="组织名称"
                      @keyup.enter.native="handleSettleFilter" v-model="settleListQuery.orgName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSettleFilter">查询
              </el-button>
              <el-button class="filter-item" type="danger" icon="el-icon-refresh" @click="getNewAccount">同步账户
              </el-button>
            </div>
          </div>
        </div>


        <!-- 查询结果 -->
        <el-table size="small" :data="settleList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1"
                  :default-sort="{prop: 'orgCode', order: 'descending'}">

          <el-table-column type="index" label="序号" align="center">
          </el-table-column>
          <el-table-column label="组织编码" prop="orgCode" sortable width="100">
          </el-table-column>
          <el-table-column label="组织名称" prop="orgName" min-width="300" >
          </el-table-column>
          <el-table-column label="结算账号" prop="settAccountCode" >
          </el-table-column>
          <el-table-column label="税号" prop="companyTax" width="180">
          </el-table-column>
          <el-table-column label="开户行" prop="companyOpeningBank" width="180">
          </el-table-column>
          <el-table-column label="银行账号" prop="companyBankAccountCode" width="180">
          </el-table-column>
          <el-table-column align="right" label="余额" prop="amount" class-name="col-required" >
          </el-table-column>
          <el-table-column align="right" label="结算应收金额" prop="jsReceive" class-name="col-required" >
          </el-table-column>
          <el-table-column align="right" label="结算应付金额" prop="jsPay" class-name="col-required" >
          </el-table-column>
          <el-table-column align="center" label="最后更新时间" prop="updTime" width="180">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSettleSizeChange" @current-change="handleSettleCurrentChange"
                         :current-page="settleListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="settleListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="settleTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="应收应付明细" name="2">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.orderNo">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="交易类型"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.tradeType">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="公司编号"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="公司全称"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.accountName">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="交易描述"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.tradeDesc">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="来源"
                      @keyup.enter.native="handleSettleFlowFilter" v-model="settleFlowListQuery.resource">
            </el-input>

            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="交易开始日期"
              end-placeholder="交易结束日期"
              value-format="yyyy-MM-dd"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSettleFlowFilter">查询
              </el-button>
              <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="settleFlowList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" :summary-method="getSummaries" show-summary
                  :default-sort="{prop: 'crtTime', order: 'descending'}">
          <el-table-column align="center" type="index" label="序号">
          </el-table-column>
          <el-table-column align="center" label="单据编号" prop="orderNo" sortable width="180">
          </el-table-column>
          <el-table-column align="left" label="交易类型" prop="tradeType" width="180">
          </el-table-column>
          <el-table-column prop="accountCode" label="公司编号" width="110" align="center">
          </el-table-column>
          <el-table-column prop="accountName" label="往来单位">
          </el-table-column>
          <el-table-column align="left" label="交易描述" prop="tradeDesc">
          </el-table-column>
          <el-table-column prop="amount" label="交易金额" width="120" align="right" class-name="col-required">
          </el-table-column>
          <el-table-column prop="afterAmount" label="交易后金额" width="120" align="right" class-name="col-required">
          </el-table-column>
          <el-table-column prop="resource" label="来源">
          </el-table-column>
          <el-table-column align="center" label="交易时间" prop="crtTime" sortable>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSettleFlowSizeChange"
                         @current-change="handleSettleFlowCurrentChange"
                         :current-page="settleFlowListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="settleFlowListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="settleFlowTotal">
          </el-pagination>
        </div>
      </el-tab-pane>

<!--      <el-tab-pane label="货主账户" name="3">-->
<!--        &lt;!&ndash; 查询和其他操作 &ndash;&gt;-->
<!--        <div class="filter-container staff-account-filter-container">-->
<!--          <div>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="货主编码"-->
<!--                      @keyup.enter.native="handleConsignorFilter" v-model="consignorListQuery.shipperCode">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="货主名称"-->
<!--                      @keyup.enter.native="handleConsignorFilter" v-model="consignorListQuery.shipperName">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="结算组织编号"-->
<!--                      @keyup.enter.native="handleConsignorFilter" v-model="consignorListQuery.settOrgCode">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="结算组织名称"-->
<!--                      @keyup.enter.native="handleConsignorFilter" v-model="consignorListQuery.settOrgName">-->
<!--            </el-input>-->
<!--            <div style="float: right;">-->
<!--              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleConsignorFilter">查询-->
<!--              </el-button>-->
<!--              <el-button class="filter-item" type="danger" icon="el-icon-refresh" @click="getNewAccount">同步账户-->
<!--              </el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 查询结果 &ndash;&gt;-->
<!--        <el-table size="small" :data="consignorList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit-->
<!--                  highlight-current-row :height="clientHeight" key="resultTable1"-->
<!--                  :default-sort="{prop: 'shipperCode', order: 'descending'}">-->
<!--          <el-table-column type="index" label="序号" align="center">-->
<!--          </el-table-column>-->
<!--          <el-table-column label="货主编码" prop="shipperCode" sortable width="100">-->
<!--          </el-table-column>-->
<!--          <el-table-column label="货主名称" prop="shipperName" width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column label="结算组织编号" prop="settOrgCode" width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column label="结算组织名称" prop="settOrgName" width="180">-->
<!--          </el-table-column>-->
<!--&lt;!&ndash;          <el-table-column align="right" label="余额" prop="amount" class-name="col-required" sortable>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-table-column align="right" label="调拨应收金额" prop="dbReceive" class-name="col-required" sortable>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-table-column align="right" label="调拨应付金额" prop="dbPay" class-name="col-required" sortable>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-table-column>&ndash;&gt;-->
<!--          <el-table-column align="left" label="最后更新时间" prop="updTime" width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column align="left" label="备注" prop="note">-->
<!--          </el-table-column>-->
<!--        </el-table>-->

<!--        &lt;!&ndash; 分页 &ndash;&gt;-->
<!--        <div class="pagination-container" style="margin-top: 10px;">-->
<!--          <el-pagination background @size-change="handleConsignorSizeChange"-->
<!--                         @current-change="handleConsignorCurrentChange"-->
<!--                         :current-page="consignorListQuery.page"-->
<!--                         :page-sizes="[10,20,50,1000]" :page-size="consignorListQuery.limit"-->
<!--                         layout="total, sizes, prev, pager, next, jumper" :total="consignorTotal">-->
<!--          </el-pagination>-->
<!--        </div>-->
<!--      </el-tab-pane>-->

<!--      <el-tab-pane label="平台调拨记录" name="4">-->
<!--        &lt;!&ndash; 查询和其他操作 &ndash;&gt;-->
<!--        <div class="filter-container staff-account-filter-container">-->
<!--          <div>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"-->
<!--                      @keyup.enter.native="handleConsignorFlowFilter" v-model="consignorFlowListQuery.billNo">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="调出货主编码"-->
<!--                      @keyup.enter.native="handleConsignorFlowFilter" v-model="consignorFlowListQuery.shipperCode">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="调出货主名称"-->
<!--                      @keyup.enter.native="handleConsignorFlowFilter" v-model="consignorFlowListQuery.shipperName">-->
<!--            </el-input>-->
<!--            <el-input clearable class="filter-item" style="width: 200px;" placeholder="调往客户名称"-->
<!--                      @keyup.enter.native="handleConsignorFlowFilter" v-model="consignorFlowListQuery.customerName">-->
<!--            </el-input>-->
<!--            <el-date-picker-->
<!--              v-model="billDate"-->
<!--              type="daterange"-->
<!--              align="right"-->
<!--              unlink-panels-->
<!--              range-separator="至"-->
<!--              start-placeholder="交易开始日期"-->
<!--              end-placeholder="交易结束日期"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              @change="handleConsignorFlowDateSelect"-->
<!--              :picker-options="pickerOptions">-->
<!--            </el-date-picker>-->

<!--            <div style="float: right;">-->
<!--              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleConsignorFlowFilter">查询-->
<!--              </el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 查询结果 &ndash;&gt;-->
<!--        <el-table size="small" :data="consignorFlowList" v-loading="listLoading" element-loading-text="正在查询中。。。" border-->
<!--                  fit-->
<!--                  highlight-current-row :height="clientHeight" key="resultTable1" :summary-method="getSummaries" show-summary-->
<!--                  :default-sort="{prop: 'crtTime', order: 'descending'}">-->
<!--          <el-table-column align="center" type="index" label="序号">-->
<!--          </el-table-column>-->
<!--          <el-table-column align="center" label="单据编号" prop="billNo" sortable width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="shipperCode" label="调出货主编码" width="150" align="center">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="shipperName" label="调出货主名称" >-->
<!--          </el-table-column>-->
<!--          <el-table-column label="调往客户名称" prop="customerName">-->
<!--          </el-table-column>-->
<!--          <el-table-column align="right" label="调拨总金额" prop="totalTransferAmt" class-name="col-required" sortable  width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column align="center" label="交易时间" prop="crtTime" sortable  width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column align="left" label="备注" prop="note">-->
<!--          </el-table-column>-->
<!--        </el-table>-->

<!--        &lt;!&ndash; 分页 &ndash;&gt;-->
<!--        <div class="pagination-container" style="margin-top: 10px;">-->
<!--          <el-pagination background @size-change="handleConsignorFlowSizeChange"-->
<!--                         @current-change="handleConsignorFlowCurrentChange"-->
<!--                         :current-page="consignorFlowListQuery.page"-->
<!--                         :page-sizes="[10,20,30,50,1000]" :page-size="consignorFlowListQuery.limit"-->
<!--                         layout="total, sizes, prev, pager, next, jumper" :total="consignorFlowTotal">-->
<!--          </el-pagination>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import { page as settleAccount, getNewAccount, consignorPage } from '@/api/erp/wms/config/settleOrg'
  import { selectPage as consignorFlow } from '@/api/erp/wms/bill/platformAllocation'
  import { selectPage as settleFlow ,selectMoneyRecord} from '@/api/erp/wms/bill/companySettlement'
  import { getTypeValue } from '@/api/dict/dictValue/index'

  export default {
    name: 'settleOrgAccount',
    data() {
      return {
        downloadLoading: false,
        clientHeight: 300,
        settleList: undefined,
        settleFlowList: undefined,
        consignorList: undefined,
        consignorFlowList: undefined,
        settleTotal: undefined,
        settleFlowTotal: undefined,
        consignorTotal: undefined,
        consignorFlowTotal: undefined,
        listLoading: false,
        tradeOptions: [],
        settleListQuery: {
          page: 1,
          limit: 10,
          orgCode: undefined,
          orgName: undefined
        },
        settleFlowListQuery: {
          page: 1,
          limit: 15,
          orderNo: undefined,
          type: undefined,
          tradeType: undefined,
          tradeDesc: undefined,
          resource: undefined,
          startDate: undefined,
          endDate: undefined,
          accountCode: undefined,
          accountName: undefined
        },
        consignorListQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerCode: undefined
        },
        consignorFlowListQuery: {
          page: 1,
          limit: 15,
          billNo: undefined,
          customerCode: undefined,
          customerName: undefined,
          shipperCode: undefined,
          shipperName: undefined,
          selectType: '1'
        },
        billDate: undefined,
        selectType: '1'
      }
    },
    created() {
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      getTypeValue('comm_tmp_trade_name').then(res => {
        this.tradeOptions = res.data.rows
      })
      this.getSettleList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['totalTransferAmt','totalTransferAmt'])
      },
      handleBillDateSelect(val) {
        this.settleFlowListQuery.startDate = val[0] + ' 00:00:00';
        this.settleFlowListQuery.endDate = val[1] + ' 23:59:59';
      },
      handleReset() {
        this.settleFlowListQuery.orderNo= undefined;
        this.settleFlowListQuery.type = undefined;
        this.settleFlowListQuery.tradeType = undefined;
        this.settleFlowListQuery.tradeDesc = undefined;
        this.settleFlowListQuery.resource = undefined;
        this.settleFlowListQuery.startDate =undefined;
        this.settleFlowListQuery.endDate = undefined;
        this.settleFlowListQuery.accountCode = undefined;
        this.settleFlowListQuery.accountName = undefined;
        this.getList();
      },
      getNewAccount() {
        getNewAccount().then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
        this.getSettleList()
      },
      changeDivHeight() {
        if (document.getElementsByClassName('staff-account-filter-container')[0]) {
          if (this.selectType == '1') {
            var height = document.getElementsByClassName('staff-account-filter-container')[0].clientHeight
          } else if (this.selectType == '2') {
            var height = document.getElementsByClassName('staff-account-filter-container')[1].clientHeight
          } else if (this.selectType == '3') {
            var height = document.getElementsByClassName('staff-account-filter-container')[2].clientHeight
          } else if (this.selectType == '4') {
            var height = document.getElementsByClassName('staff-account-filter-container')[3].clientHeight
          }
        } else {
          height = 48
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95
      },
      getSettleList() {
        this.listLoading = true
        settleAccount(this.settleListQuery).then(response => {
          this.settleList = response.data.records
          this.settleTotal = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.settleList = []
          this.settleTotal = 0
          this.listLoading = false
        })
      },
      getSettleFlowList() {
        this.listLoading = true
        selectMoneyRecord(this.settleFlowListQuery).then(response => {
          this.settleFlowList = response.data.records
          this.settleFlowTotal = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.settleFlowList = []
          this.settleFlowTotal = 0
          this.listLoading = false
        })
      },
      getConsignorList() {
        this.listLoading = true
        consignorPage(this.consignorListQuery).then(response => {
          this.consignorList = response.data.records
          this.consignorTotal = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.consignorList = []
          this.consignorTotal = 0
          this.listLoading = false
        })
      },
      getConsignorFlowList() {
        this.listLoading = true
        consignorFlow(this.consignorFlowListQuery).then(response => {
          this.consignorFlowList = response.data.records
          this.consignorFlowTotal = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.consignorFlowList = []
          this.consignorFlowTotal = 0
          this.listLoading = false
        })
      },
      handleSettleFilter() {
        this.settleListQuery.page = 1
        this.getSettleList()
      },
      handleSettleFlowFilter() {
        this.settleFlowListQuery.page = 1
        this.getSettleFlowList()
      },
      handleConsignorFilter() {
        this.consignorListQuery.page = 1
        this.getConsignorList()
      },
      handleConsignorFlowFilter() {
        this.consignorFlowListQuery.page = 1
        this.getConsignorFlowList()
      },
      handleSettleSizeChange(val) {
        this.settleListQuery.limit = val
        this.getSettleList()
      },
      handleSettleFlowSizeChange(val) {
        this.settleFlowListQuery.limit = val
        this.getSettleFlowList()
      },
      handleConsignorSizeChange(val) {
        this.consignorListQuery.limit = val
        this.getConsignorList()
      },
      handleConsignorFlowSizeChange(val) {
        this.consignorFlowListQuery.limit = val
        this.getConsignorFlowList()
      },
      handleSettleCurrentChange(val) {
        this.settleListQuery.page = val
        this.getSettleList()
      },
      handleSettleFlowCurrentChange(val) {
        this.settleFlowListQuery.page = val
        this.getSettleFlowList()
      },
      handleConsignorCurrentChange(val) {
        this.consignorListQuery.page = val
        this.getConsignorList()
      },
      handleConsignorFlowCurrentChange(val) {
        this.consignorFlowListQuery.page = val
        this.getConsignorFlowList()
      },
      handleConsignorFlowDateSelect(val) {
        this.consignorFlowListQuery.startBillDate = val[0] + ' 00:00:00'
        this.consignorFlowListQuery.endBillDate = val[1] + ' 23:59:59'
      }
    },
    computed: {},
    watch: {
      billDate(value) {
        if (value == null) {
          this.settleFlowListQuery.startTradeDate = undefined
          this.settleFlowListQuery.endTradeDate = undefined
        }
      },
      selectType: {
        handler(val) {
          if (val == '1') {
            this.getSettleList()
          } else if (val == '2') {
            this.getSettleFlowList()
          } else if (val == '3') {
            this.getConsignorList()
          } else if (val == '4') {
            this.getConsignorFlowList()
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-summary-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }
</style>
