<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="仓库名称" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="getList">搜索
        </el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading="listLoading" @row-dblclick="onSubmit">
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
      已选仓库：
      <el-tag v-show="chooseWarehouse.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseWarehouse" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/wms/config/warehouse';

  export default {
    props:['selectType'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseWarehouse: [],
        currentWarehouse: [],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          selectType: 0
        },
      };
    },
    created() {
      if (this.selectType != undefined) {
        this.listQuery.selectType = this.selectType;
      }
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(() => {
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
        if (val) {
          this.chooseWarehouse = [val.name];
          this.currentWarehouse = [val];
        }
      },
      onSubmit(row) {
        this.$emit('closeWarehouseDialog', this.currentWarehouse)
      },
      handleTagClose(index) {
        this.chooseWarehouse.splice(index, 1);
        this.currentWarehouse.splice(index, 1);
      },
      reset() {
        this.chooseWarehouse = [];
        this.currentWarehouse = [];
        this.$refs.dataTable.setCurrentRow();
      },
    }

  }
</script>

<style scoped>

</style>
