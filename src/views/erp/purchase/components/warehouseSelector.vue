<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="客户编号" v-model="listQuery.warehouseCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="仓库名称" v-model="listQuery.warehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="仓库编号">
            <template slot-scope="scope">
              <span>{{scope.row.warehouseCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="仓库名称">
            <template slot-scope="scope">
              <span>{{scope.row.warehouseName}}</span>
            </template>
          </el-table-column>
        </el-table>
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
  import {page} from '@/api/erp/srm/srmWarehouse';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
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
          warehouseName: undefined
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
            this.list = response.records;
            this.total = response.total;
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
          if (this.isSingle) {
            this.chooseWarehouse = [val.warehouseName];
            this.currentWarehouse = [val];
          } else {
            for (var i in this.chooseWarehouse) {
              if (this.chooseWarehouse[i] == val.warehouseName) {
                return;
              }
            }
            this.chooseWarehouse.push(val.warehouseName);
            this.currentWarehouse.push(val);
          }
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
      handleFilter() {
        this.getList();
      }
    }

  }
</script>

<style scoped>

</style>
