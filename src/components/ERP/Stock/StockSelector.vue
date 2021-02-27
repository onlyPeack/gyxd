<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="姓名或账户">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-click="OnSubmit">
        <el-table-column align="center" label="仓库名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓库管理员">
          <template slot-scope="scope">
            <span>{{scope.row.managerName}}</span>
          </template>
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
    </el-col>
    <el-col :span="8">
      已选客户：
      <el-tag v-show="chooseWarehouse.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseWarehouse" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/crm/customer/index';

  export default {
    data() {
      return {
        list: [],
        listLoading: false,
        tableKey: 0,
        chooseWarehouse: [],
        currentWarehouse: [],
        listQuery: {
          page: 1,
          limit: 20,
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        this.chooseWarehouse = [val.name];
        this.currentWarehouse = [val];
      },
      OnSubmit(row) {
        this.$emit('closeWarehouseDialog', this.currentWarehouse)
      },
      handleTagClose(index) {
        this.chooseWarehouse.splice(index, 1);
        this.currentWarehouse.splice(index, 1);
      },
      reset() {
        this.chooseWarehouse = [];
        this.currentWarehouse = [];
      },
    }

  }
</script>

<style scoped>

</style>
