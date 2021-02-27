<template>
  <div class="full-purchase purchase-order-full-purchase">
    <el-row>
      <el-col :span="24">
        <div class="filter-container">
         <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  v-model="listQuery.brandName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品名"
                  v-model="listQuery.specModel"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  v-model="listQuery.seriesName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  v-model="listQuery.itemNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' style="width: 100%" :data="list" ref="dataTable" border fit highlight-current-row
        @select-change="handleSelectChange" @select="handleSelect"  @select-all="handleSelectAll"
                  @current-change="getRowData" @row-click="handleSelect" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh" class="result-data-table">
                  <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>
           <el-table-column type="index" label="序号" align="center">
      </el-table-column>
       <el-table-column prop="billNo" align="center" label="单据编号" min-width="204" sortable>
        </el-table-column>
        <el-table-column prop="billStatus" align="center" label="单据状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in statusOptions">
              <span v-if="scope.row && item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="categoryName" label="分类名称" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="crtUserName" label="更新人员" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="discount" label="折扣" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="seriesName" label="系列号" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="specModel" label="品名" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="releaseQty" label="发布数量" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="lockedQty" label="锁库数量" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="qty" label="库存数量" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="retailPrice" label="面价" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="supplyPrice" label="供货价" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="tags" label="标签" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="warehouseAdress" label="仓库地址" width="200" sortable align="center"></el-table-column>
        <el-table-column prop="warranty" label="质保期" width="200" sortable align="center"></el-table-column>
        </el-table>
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
  import {page as seriesPage} from '@/api/erp/goods/series';
  import {page as brandSeriesPage} from '@/api/erp/goods/brandSeries';
   import { selectPageByItem } from '@/api/erp/purchase/bill/idleStock';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        crtTime:undefined,
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseCustomer: [],
        currentCustomer: [],
        listQuery: {
          page: 1,
          limit: 20,
          billStatus:4,
          customerName: undefined
        },
      };
    },
    created() {
      console.log('进来了');
      this.$nextTick(() => {
        this.getList();
      })
    },
    watch:{
      crtTime(value) {
        console.log(value);
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        } else {
          this.listQuery.startDate = value[0];
          this.listQuery.endDate = value[1];
        }
      },
    },
    methods: {
      getList() {
        this.listLoading = true;
        selectPageByItem(this.listQuery)
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
      handleSelect(selection, row) {
        this.currentCustomer = Object.assign([], selection)
      },
      handleSelectChange(selection, row) {
        this.currentCustomer = Object.assign([], selection)
      },
      handleSelectAll(selection) {
        this.currentCustomer = Object.assign([], selection)
      },
      getRowData(val) {
        if (val) {
          if (this.isSingle) {
            this.chooseCustomer = [val.customerName];
            this.currentCustomer = [val];
          } else {
            for (var i in this.chooseCustomer) {
              if (this.chooseCustomer[i] == val.customerName) {
                return;
              }
            }
            this.chooseCustomer.push(val.customerName);
            this.currentCustomer.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeIdleRelease', this.currentCustomer)
      },
      handleTagClose(index) {
        this.chooseCustomer.splice(index, 1);
        this.currentCustomer.splice(index, 1);
      },
      reset() {
        console.log('出发了');
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
.full-purchase {
  overflow-x: auto;
}
.el-table__body-wrappe {
  overflow: hidden;
}
</style>
