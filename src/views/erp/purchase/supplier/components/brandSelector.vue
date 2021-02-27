<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商ID" v-model="listQuery.id"
                @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商名称" v-model="listQuery.name"
                    @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商英文名称" v-model="listQuery.nameEn"
                    @keyup.enter.native="handleFilter">
        </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" @row-click="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
           <el-table-column align="center" label="品牌商ID" prop="id" sortable>
            </el-table-column>
            <el-table-column align="center" label="品牌商名称" prop="name">
            </el-table-column>
            <el-table-column align="center" label="英文名称" prop="nameEn">
            </el-table-column>
            <el-table-column align="center" property="picUrl" label="品牌商图片">
                <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                </template>
            </el-table-column>
            <el-table-column min-width="200px" label="品牌介绍" prop="desc">
            </el-table-column>
            <!-- <el-table-column align="center" label="底价" prop="floorPrice">
            </el-table-column>
            <el-table-column align="center" label="排序" prop="sortOrder">
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
      </el-col>
      <el-col :span="8">
        已选品牌：
        <el-tag v-show="currentCustomer.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in currentCustomer" :key="index" @close="handleTagClose(index)"
                style="margin-right: 15px;">
          {{tag.name}}
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
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/brand';
  import {page as seriesPage} from '@/api/erp/goods/series';
  import {page as brandSeriesPage} from '@/api/erp/goods/brandSeries';
  import {uploadPath} from '@/api/erp/goods/storage'

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle','brandList'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseCustomer: [],
        currentCustomer: [],
        listQuery: {
          page: 1,
          limit: 20,
          customerName: undefined
        },
      };
    },
    created() {
      this.$nextTick(() => {
        this.getList();
      })
      console.log(this.brandList);
      this.currentCustomer = [];
      if(this.brandList.length > 0) {
        this.currentCustomer = JSON.parse(JSON.stringify(this.brandList))
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
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
            this.chooseCustomer = [val.customerName];
            this.currentCustomer = [val];
          } else {
            for (let i = 0; i <this.chooseCustomer.length ; i++) {
              if(this.chooseCustomer[i]&&this.chooseCustomer[i].id&&(this.chooseCustomer[i].id===val.id)){
                return false;
              }
            }
            this.chooseCustomer.push(val);
            this.currentCustomer.push(val);
          }
          console.log(this.currentCustomer);
        }
      },
      onSubmit(row) {
        this.$emit('closeCustomerDialog', this.currentCustomer)
      },
      handleTagClose(index) {
        this.chooseCustomer.splice(index, 1);
        this.currentCustomer.splice(index, 1);
      },
      reset() {
        this.chooseCustomer = [];
        this.currentCustomer = [];
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
