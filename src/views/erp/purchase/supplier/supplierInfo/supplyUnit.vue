<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编码"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商全称"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商联系人"
                  v-model="listQuery.linkMan"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <br/>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>

        <el-date-picker style="position: relative;top: -3px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        @change="handleDateSelect"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handlechangeFun" border fit highlight-current-row :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="供应商编码" fixed="left" prop="supplierCode" sortable>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column  width="200" label="供应商全称" fixed="left" prop="supplierName">
      </el-table-column>
      <el-table-column align="center" label="供应商联系人" prop="linkMan">
      </el-table-column>
      <el-table-column align="center" label="采购员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="采购员姓名" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" label="采购员部门" prop="departName">
      </el-table-column>
      <el-table-column align="center" label="联系人职务" prop="linkPosition">
      </el-table-column>
      <el-table-column align="center" label="联系人电话" prop="linkPhone">
      </el-table-column>
      <el-table-column align="center" label="联系人邮箱" prop="linkEmail">
      </el-table-column>
      <el-table-column align="center" width="200" label="创建时间" prop="crtTime" sortable>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {page, batchDel, updateStatus, batchUpdate,updateSupplierBlack} from '@/api/erp/purchase/supplier/index';
  export default {
    name: 'supplyUnit',
    data() {
      return {
        billDate:undefined,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        id: '',
        listQuery: {
          page: 1,
          limit: 10,
          supplierCode: '',
          supplierName: '',
          managerName: '',
          abbrName: '',
          linkMan: '',
          status: '',
          departName:'',
          startDate:'',
          endDate:'',
          crtUserNo:'',
          crtUserName:'',
        },
        collectionTermsOptions: [],
        selectedRows: [],
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      },
    },
    created() {
      this.getList();
    },
    methods: {
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            if (response.data.records.length > 0) {
              this.list = response.data.records;
              this.total = response.data.total;
            } else {
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery.supplierCode = '';
        this.listQuery.supplierName = '';
        this.listQuery.managerName = '';
        this.listQuery.abbrName = '';
        this.listQuery.linkMan = '';
        this.listQuery.status = '';
        this.listQuery.departName = '';
        this.billDate = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate =undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
    },
  }
</script>

<style>

</style>
