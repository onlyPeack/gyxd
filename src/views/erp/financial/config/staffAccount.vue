<template>
  <div class="app-container calendar-list-container sales-summary-list-container bill-container">
    <el-tabs v-model="selectType">
      <el-tab-pane label="员工资金账户" name="1">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工工号"
                      @keyup.enter.native="handleFilter" v-model="listQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工姓名"
                      @keyup.enter.native="handleFilter" v-model="listQuery.accountName">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="所属部门"
                      @keyup.enter.native="handleFilter" v-model="listQuery.departName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="员工工号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="员工姓名" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="left" label="所属部门" prop="departName" sortable>
          </el-table-column>
          <el-table-column align="right" label="利润账户" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="最后更新时间" prop="updTime">
          </el-table-column>
          <el-table-column align="left" label="备注" prop="note">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="员工交易记录" name="2">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      @keyup.enter.native="handleFilter" v-model="flowListQuery.billNo">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工工号"
                      @keyup.enter.native="handleFlowFilter" v-model="flowListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工姓名"
                      @keyup.enter.native="handleFlowFilter" v-model="flowListQuery.accountName">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="所属部门"
                      @keyup.enter.native="handleFlowFilter" v-model="flowListQuery.departName">
            </el-input>
            <el-select v-if="tradeOptions.length>0" @change="handleFlowFilter"  placeholder="交易名称"
                       style="width: 200px" v-model="flowListQuery.tradeType" class="filter-item" clearable="" filterable>
              <el-option v-for="item in tradeOptions" :key="item.value" :label="item.labelDefault"
                         :value="item.value"></el-option>
            </el-select>
            <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="交易地点"-->
            <!--@keyup.enter.native="handleFilter" v-model="listQuery.tradePlace">-->
            <!--</el-input>-->
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="来源"
                      @keyup.enter.native="handleFlowFilter" v-model="flowListQuery.resource">
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
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFlowFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="flowList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'crtTime', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="单据编号" prop="orderNo" sortable width="180">
          </el-table-column>
          <el-table-column align="left" label="员工工号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="员工姓名" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="left" label="所属部门" prop="departName" sortable>
          </el-table-column>
          <!--<el-table-column align="right" label="交易地点" prop="tradePlace">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="交易时间" prop="crtTime" sortable>
          </el-table-column>
          <el-table-column align="left" label="交易名称" prop="tradeType" sortable>
            <template slot-scope="scope">
              <span v-for="(item,index) in tradeOptions" :key="index">
                <span v-if="scope.row.tradeType ===item.value">{{item.labelZhCh}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="right" label="收支金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <!--<el-table-column align="right" label="交易后可用金额" prop="afterAmount" class-name="col-required" sortable>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="left" label="资金出入账" prop="flowType">-->
          <!--<template slot-scope="scope">-->
          <!--<span v-for="item in outInOptions">-->
          <!--<span v-if="scope.row.flowType ===item.value">{{item.label}}</span>-->
          <!--</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="来源" prop="resource" sortable>
          </el-table-column>
          <el-table-column align="left" label="说明" prop="tradeDesc" width="240">
          </el-table-column>
          <el-table-column align="left" label="备注" prop="note">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleFlowSizeChange" @current-change="handleFlowCurrentChange"
                         :current-page="flowListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="flowListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="flowTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {page as capitalAccount} from '@/api/erp/financial/financialCapitalAccount';
  import {page as transactionFlow} from '@/api/erp/financial/financialTransactionFlow';
  import {getFloat} from '@/utils/util';
  import {getTypeValue} from '@/api/dict/dictValue/index'

  export default {
    name: 'staffAccount',
    data() {
      return {
        downloadLoading: false,
        clientHeight: 300,
        list: undefined,
        flowList: undefined,
        total: undefined,
        flowTotal: undefined,
        listLoading: false,
        tradeOptions:[],
        listQuery: {
          page: 1,
          limit: 20,
          accountId: undefined,
          accountName: undefined,
          selectType: "1"
        },
        flowListQuery: {
          page: 1,
          limit: 20,
          accountId: undefined,
          accountName: undefined,
          selectType: "1",
          tradeType:'',
        },
        billDate: undefined,
        brandList: [],
        categoryList: [],
        statusOptions: [{
          value: 0,
          label: '启用'
        }, {
          value: 1,
          label: '冻结'
        }, {
          value: 2,
          label: '禁用'
        }],
        outInOptions: [{
          value: 'IN',
          label: '收入'
        }, {
          value: 'OUT',
          label: '支出'
        }, {
          value: 'FREEZE',
          label: '冻结'
        }],
        selectType: "1",
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      getTypeValue('comm_tmp_trade_name').then(res=>{
        this.tradeOptions = res.data.rows;
      });
      this.getList();
      this.getFlowList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.selectType == '1' ? this.list : this.flowList));
          if (this.selectType == '1') {
            tHeader = ['员工工号', '员工姓名', '所属部门', '账户总金额', '冻结金额', '可用余额', '员工可报销金额', '账户状态', '创建时间', '最后更新时间', '备注'];
            filterVal = ['accountCode', 'accountName', 'departName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'crtTime', 'updTime', 'note'];
            excel.export_json_to_excel2(tHeader, list, filterVal, '员工资金账户');
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据编号', '员工工号', '员工姓名', '所属部门', '交易时间', '交易名称', '收支金额', '交易后可用余额', '来源', '说明', '备注'];
            filterVal = ['orderNo', 'accountCode', 'accountName', 'departName', 'crtTime', 'tradeType', 'amount', 'afterAmount', 'resource', 'tradeDesc', 'note'];
            excel.export_json_to_excel2(tHeader, list, filterVal, '员工交易记录');
          }

          this.downloadLoading = false;
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('staff-account-filter-container')[0]) {
          if (this.selectType == '1') {
            var height = document.getElementsByClassName('staff-account-filter-container')[0].clientHeight;
          } else {
            var height = document.getElementsByClassName('staff-account-filter-container')[1].clientHeight;
          }
        } else {
          height = 48;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        capitalAccount(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getFlowList() {
        this.listLoading = true;
        transactionFlow(this.flowListQuery).then(response => {
          this.flowList = response.data.records;
          this.flowTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.flowList = [];
          this.flowTotal = 0;
          this.listLoading = false;
        })
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
            if (column.property == 'amount' || column.property == 'frozenAmount' || column.property == 'reimbursementAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }
          } else {
            sums[index] = ' ';
          }

        });

        return sums;
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleFlowFilter() {
        this.listQuery.page = 1;
        this.getFlowList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleFlowSizeChange(val) {
        this.flowListQuery.limit = val;
        this.getFlowList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFlowCurrentChange(val) {
        this.flowListQuery.page = val;
        this.getFlowList();
      },
      handleBillDateSelect(val) {
        this.flowListQuery.startTradeDate = val[0] + ' 00:00:00';
        this.flowListQuery.endTradeDate = val[1] + ' 23:59:59';
      },
    },
    computed: {},
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startTradeDate = undefined;
          this.listQuery.endTradeDate = undefined;
        }
      },
      selectType: {
        handler(val) {
          if (val == '1') {
            this.getList();
          } else {
            this.getFlowList();
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
