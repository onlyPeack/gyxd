<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="快递编号" v-model="listQuery.expressId"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="快递名称" v-model="listQuery.expressName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="快递名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        已选寄送方式：
        <el-tag v-show="chooseExpress.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseExpress" :key="index" @close="handleTagClose(index)"
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
  import {page} from '@/api/erp/wms/config/Logistics';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseExpress: [],
        currentExpress: [],
        listQuery: {
          page: 1,
          limit: 20,
          expressName: undefined,
          expressId: undefined,
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
            console.log(response);
            this.list = response.data.records;
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
        if (val) {
          if (this.isSingle) {
            this.chooseExpress = [val.name];
            this.currentExpress = [val];
          } else {
            for (var i in this.chooseExpress) {
              if (this.chooseExpress[i] == val.name) {
                return;
              }
            }
            this.chooseExpress.push(val.name);
            this.currentExpress.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeExpressDialog', this.currentExpress)
      },
      handleTagClose(index) {
        this.chooseExpress.splice(index, 1);
        this.currentExpress.splice(index, 1);
      },
      reset() {
        this.chooseExpress = [];
        this.currentExpress = [];
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
