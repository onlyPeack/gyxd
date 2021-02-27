<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container borrow-money-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="借款人"
                    v-model="listQuery.userName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联客户"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联供应商"
                    v-model="listQuery.supplierName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-date-picker
              v-model="borrowMoneyDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="单据开始日期"
              end-placeholder="单据结束日期"
              @change="handleBorrowMoneyDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="borrowMoneyDate" label="借款日期" width="108">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="userName" label="借款人" width="150">
        </el-table-column>
        <el-table-column prop="payOrgName" label="费用承担部门" width="200">
        </el-table-column>
        <el-table-column prop="currencyId" label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="借款金额" width="120" align="right">
        </el-table-column>
        <el-table-column prop="note" label="借款事由" width="200">
        </el-table-column>
        <el-table-column prop="billStatus" label="审批状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="voucherStatus" label="记账状态" width="100">
        </el-table-column>
        <el-table-column prop="isAfr" label="是否报销" width="100">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPage} from '@/api/erp/financial/financialBorrowMoney';
  import {getFloat} from '@/utils/util';

  export default {
    name: "borrowMoneySelector",
    props: ['dialogSelectorVisible', 'sourceBillNo'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: '',
          customerName: '',
          supplierName: '',
          userName: '',
          startBorrowMoneyDate: '',
          endBorrowMoneyDate: '',
          selectType: 1, //其它单据关联合同时查询，只查状态为正常的单据
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'JKD',
          name: '借款单',
        }],
        sourceObject: {
          key: 'JKD',
          name: '借款单',
        },
        borrowMoneyDate: '',
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('borrow-money-filter-container')[0]) {
          var height = document.getElementsByClassName('borrow-money-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          var list = [];
          for (var i in response.data.records) {
            var item = response.data.records[i];
            var amount = Number(item.amount - item.repaymentAmount - item.afrAmount);
            if (amount > 0) {
              list.push(item);
            }
          }
          this.list = list;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
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
            if (column.property == 'amount') {
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: 1
        };
        this.borrowMoneyDate = undefined;
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].billNo) {

            this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('submitSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true,
                sourceObject: this.sourceObject
              });
            }).catch(() => {

            });

          } else {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            });
          }

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          });
        }
      },
      handleBorrowMoneyDateSelect(val) {
        this.listQuery.startBorrowMoneyDate = val[0];
        this.listQuery.endBorrowMoneyDate = val[1];
      },
    },
    watch: {
      borrowMoneyDate(value) {
        if (value == null) {
          this.listQuery.startBorrowMoneyDate = '';
          this.listQuery.endBorrowMoneyDate = '';
        }
      },
    }
  }
</script>

