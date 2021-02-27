<template>

  <div class="app-container calendar-list-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础目录" name="first"></el-tab-pane>
      <el-tab-pane label="闲置目录" name="second"></el-tab-pane>
    </el-tabs>
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编码"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商全称"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.supplierType" placeholder="供应商类型" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-date-picker style="position: relative;top: -4px;"
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
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>

      </div>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handlechangeFun" border fit highlight-current-row :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="供应商编码" fixed="left" prop="supplierCode" sortable>
      </el-table-column>
      <el-table-column  width="200" label="供应商全称" fixed="left" prop="supplierName">
      </el-table-column>
      <el-table-column align="center" label="供应商类型" prop="supplierType">
        <template slot-scope="scope">
            <span v-for="item in supplierOptions">
            <span v-if="scope.row.supplierType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商等级" prop="supplierGrade">
        <template slot-scope="scope">
            <span v-for="item in gradeOptions">
            <span v-if="scope.row.supplierGrade ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已认证" prop="authenticationType">
        <template slot-scope="scope">
            <span v-if="scope.row.authenticationType">{{scope.row.authenticationType == 0 ? '未认证':'已认证'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采购员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="采购员姓名" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" width="200" label="创建时间" prop="crtTime" sortable>
      </el-table-column>
      <el-table-column align="center" label="供货目录" prop="opt">
        <template slot-scope="scope">
          <div>
            <el-button @click="catalogueBtn(scope.row)" plain>详情</el-button>
          </div>
        </template>
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
  import {selectPage, batchDel, updateStatus,updateSupplierBlack} from '@/api/erp/srm/supplyList';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {page as payMeansPage} from '@/api/erp/financial/financialPaymentsMeans';
  import { getToken } from '@/utils/auth'

  export default {
    name: 'supplyCatalogue',
    components: {
      'catalogue-selector': () => import('@/views/erp/purchase/components/supplyCatalogueView')
    },
    data() {
      return {
        id: undefined,
        supplierOptions: [
          {
            value: '0',
            label: '供应商'
          },
          {
            value: '1',
            label: '渠道商'
          }
        ],
        gradeOptions: [
          {
            value: '0',
            label: '一级'
          },
          {
            value: '1',
            label: '二级'
          },
          {
            value: '2',
            label: '三级'
          },
        ],
        billDate:undefined,
        list: undefined,
        total: undefined,
        listLoading: true,
        supplierCode: '',
        activeName:'first',
        listQuery: {
          page: 1,
          limit: 10,
          supplierCode: '',
          supplierName: '',
          startDate:'',
          endDate:'',
          supplierType:'',
        },
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
      catalogueBtn(val){
        this.$router.push({path:'/supplyCatalogueView?supplierCode=' + val.supplierCode,query:{type:(this.listQuery.publishType===2?'2':'1')}})
        // this.$router.push('/supplierManager/supplyCatalogueView?supplierCode=' + val.supplierCode)
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery)
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
        this.listQuery.supplierCode = undefined;
        this.listQuery.supplierName = undefined;
        this.billDate = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate =undefined;
        this.listQuery.supplierType = undefined;
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

      handleClick(tab, event) {
        switch (tab.label) {
          case '闲置目录':
            this.listQuery.publishType=2
                break;
          default:
            delete this.listQuery.publishType
        }
        this.getList()
      }
    },
  }
</script>

<style>

</style>
