<template>
  <div class="full-purchase bill-container">

    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                v-model="listQuery.billNo"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                v-model="listQuery.supplierName"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                v-model="listQuery.builderName"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="所属部门"
                v-model="listQuery.departName"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-date-picker
        style="position: relative;top:-4px;"
        v-model="billDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="单据日期"
        end-placeholder="单据日期"
        @change="handleDateSelect"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
      </el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
    </div>
    <!--列表-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" :height="clientHeight"
              show-summary :summary-method="getSummaries" :default-sort = "{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" sortable>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" sortable>
      </el-table-column>
      <!--<el-table-column prop="supplierManagerName" label="供应商负责人" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="builderName" label="业务员" align="center" sortable>
      </el-table-column>
      <!--<el-table-column prop="currencyId" label="币别">-->
        <!--<template slot-scope="scope">-->
            <!--<span v-for="item in currencyOptions">-->
            <!--<span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="departName" label="所属部门" align="center" sortable>
      </el-table-column>
      <el-table-column prop="objectName" label="单据名称" align="center" sortable>
      </el-table-column>
      <el-table-column prop="amount" label="涉及金额" align="right" class-name="col-required" sortable>
         <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="paymentAmount" label="已付款金额" align="right" class-name="col-required">-->
      <!--</el-table-column>-->
      <el-table-column prop="crtTime" label="单据时间" align="center" sortable>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,500,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {selectPage} from '@/api/erp/financial/SupplierTransferInfo';
  import {getFloat} from '@/utils/util';

  export default {
    name: "supplierTransferInfo",
    data() {
      return {
        clientHeight: 300,
        list: [],
        listLoading: false,
        billDate:undefined,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          supplierName: undefined,
          departName: undefined,
          builderName: undefined,
          startDate:undefined,
          endDate:undefined,
        },
        billDate:undefined,
        total: 0
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
    },
    methods: {
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery.billNo = undefined;
        this.listQuery.supplierName = undefined;
        this.listQuery.builderName = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate = undefined;
        this.listQuery.departName = undefined;
        this.billDate = undefined;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
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
            if (column.property == 'paymentAmount' || column.property == 'amount') {
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
      }
    }
  }
</script>
