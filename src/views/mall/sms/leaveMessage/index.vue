<template>
  <div class="full-purchase bill-container">

    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="姓名"
                v-model="listQuery.name"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="电话"
                v-model="listQuery.phone"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="公司"
                v-model="listQuery.company"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-date-picker  style="position: relative;top:-3px;width: 385px;"
                       v-model="billDate"
                       type="daterange"
                       align="right"
                       unlink-panels
                       range-separator="至"
                       start-placeholder="开始时间"
                       end-placeholder="结束时间"
                       value-format="yyyy-MM-dd"
                       @change="handleBillDateSelect">
      </el-date-picker>
      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
      </el-button>
      <el-button icon="el-icon-delete" class="filter-item" type="warning" @click="handleReset">重置</el-button>
    </div>
    <!--列表-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" :height="clientHeight"
              @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="company" label="公司">
      </el-table-column>
      <el-table-column prop="note" label="留言" width="1000">
      </el-table-column>
      <el-table-column prop="maskFromV2" label="留言日期" width="150">
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
</template>

<script>
  import {page} from '@/api/erp/financial/leaveMessage';

  export default {
    name: "leaveMessage",
    data() {
      return {
        clientHeight: 300,
        list: [],
        billDate: undefined,
        multipleSelection: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          userNo: undefined,
          userDept: undefined,
          shareUserNo: undefined,
          shareUserDept: undefined
        },
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
    methods: {
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
        page(this.listQuery).then(response => {
          //console.log(response,'999')
          this.list = response;
          this.total = response.length;
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
        delete this.listQuery.name
        delete this.listQuery.phone
        delete this.listQuery.company
        delete this.listQuery.startTime
        delete this.listQuery.endTime
        this.billDate=[]
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleBillDateSelect(val) {
        this.listQuery.startTime = val[0];
        this.listQuery.endTime = val[1];
      },
    }
  }
</script>
