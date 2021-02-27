<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="系列名称" v-model="listQuery.name"
                    @keyup.enter.native="handleFilter">
          </el-input>
<!--          <el-input style="width: 200px;" class="filter-item" placeholder="品牌名称" v-model="listQuery.brandName"-->
<!--                    @keyup.enter.native="handleFilter">-->
<!--          </el-input>-->
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="系列名称" prop="name"></el-table-column>
          <el-table-column align="center" label="品牌名称" prop="brandName"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page" pager-count="3"
                         :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="8">
        已选系列：
        <el-tag v-show="chooseSeries.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseSeries" :key="index" @close="handleTagClose(index)"
                style="margin-right: 15px;">
          {{tag}}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {page} from '@/api/erp/goods/series';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        seriesList: [],
        list: [],
        listQuery:{
          page:1,
          limit:10
        },
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseSeries: [],
        currentSeries: [],
        seriesName: undefined
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
            this.seriesList = response.data.records;
            this.list = response.data.records;
            this.total=response.data.total
            this.listLoading = false;
          })
      },
      getRowData(val) {
        if (val) {
          if (this.isSingle) {
            this.chooseSeries = [val.name];
            this.currentSeries = [val];
          } else {
            for (var i in this.chooseSeries) {
              if (this.chooseSeries[i] == val.name) {
                return;
              }
            }
            this.chooseSeries.push(val.name);
            this.currentSeries.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeSeriesDialog', this.currentSeries)
      },
      handleTagClose(index) {
        this.chooseSeries.splice(index, 1);
        this.currentSeries.splice(index, 1);
      },
      reset() {
        this.chooseSeries = [];
        this.currentSeries = [];
        this.$refs.dataTable.setCurrentRow();
      },
      handleFilter() {
        // var list = [];
        // if (this.seriesName && this.seriesName != '' && this.seriesName.trim().length > 0) {
        //   for (var i in this.seriesList) {
        //     if (this.seriesList[i].name.indexOf(this.seriesName.trim()) > -1) {
        //       list.push(this.seriesList[i]);
        //     }
        //   }
        //   this.list = list;
        // } else {
        //   this.list = this.seriesList;
        // }
        this.getList()
      },

      handleSizeChange(val) {
        this.listQuery.limit = val;
          this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
