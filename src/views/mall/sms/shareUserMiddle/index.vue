<template>
  <div class="full-purchase bill-container">

    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工工号"
                v-model="listQuery.userNo"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工部门"
                v-model="listQuery.userDept"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="享受人工号"
                v-model="listQuery.shareUserNo"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="享受人部门"
                v-model="listQuery.shareUserDept"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
      </el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
    </div>
    <!--列表-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" :height="clientHeight"
              @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="userNo" label="员工工号">
      </el-table-column>
      <el-table-column prop="userDept" label="员工部门">
      </el-table-column>
      <el-table-column prop="shareUserNo" label="享受人工号">
      </el-table-column>
      <el-table-column prop="shareUserDept" label="享受人部门">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建日期" width="150">
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
  import {page} from '@/api/erp/financial/shareUserMiddle';

  export default {
    name: "shareUserList",
    data() {
      return {
        clientHeight: 300,
        list: [],
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
        this.listQuery.userNo = undefined;
        this.listQuery.userDept = undefined;
        this.listQuery.shareUserNo = undefined;
        this.listQuery.shareUserDept = undefined;
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
      }
    }
  }
</script>
