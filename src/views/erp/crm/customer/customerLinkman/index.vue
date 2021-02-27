<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户联系人"
                @keyup.enter.native="handleFilter" v-model="listQuery.linkMan">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="联系人电话"
                @keyup.enter.native="handleFilter" v-model="listQuery.linkPhone">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>

      <el-table-column label="客户名称" prop="customerName">
      </el-table-column>
      <el-table-column label="客户编号" prop="customerCode">
      </el-table-column>
      <el-table-column label="客户联系人" prop="linkMan">
      </el-table-column>
      <el-table-column label="联系人电话" prop="linkPhone">
      </el-table-column>
      <el-table-column label="联系人职务" prop="linkPosition">
      </el-table-column>
      <el-table-column label="联系人邮箱" prop="linkEmail">
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

<style>

</style>

<script>
  import {page} from '@/api/erp/crm/customerLinkman/index';

  export default {
    name: 'CustomerLinkman',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          customerName: '',
          customerCode: '',
          linkMan: '',
          linkPhone: ''
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
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
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleReset(){
        this.listQuery.customerCode = '';
        this.listQuery.customerName = '';
        this.listQuery.linkMan = '';
        this.listQuery.linkPhone = '';
        this.getList();
      }
    }
  }
</script>
