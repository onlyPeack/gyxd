<template>

  <div class="app-container calendar-list-container">

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
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.supplierType" placeholder="供应商类型" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

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
        <template slot-scope="scope">
          <div style="color: #46a6ff;" @click="handleViewSupplier(scope.row.id)">{{scope.row.supplierName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="100"  align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
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
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="供应商认证" :visible.sync="certificationVisible" v-if="certificationVisible" width="60%">
      <supplier-certification :id="id" ref="certificationForm" v-if="certificationVisible" :type="type"></supplier-certification>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" @click="certificationVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { page as selectPage, batchDel, updateStatus,updateSupplierBlack} from '@/api/erp/srm/supplierAuth';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {page as payMeansPage} from '@/api/erp/financial/financialPaymentsMeans';
  import { getToken } from '@/utils/auth'

  export default {
    name: 'supplyCatalogue',
    components: {
      'supplier-certification': () => import('./supplierCertification'),
    },
    data() {
      return {
        type:"view",
        certificationVisible: false,
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
        crtTime:undefined,
        list: undefined,
        total: undefined,
        listLoading: true,
        supplierCode: '',
        listQuery: {
          page: 1,
          limit: 10,
          supplierCode: '',
          supplierName: '',
          startDate:'',
          endDate:'',
          supplierType:'',
          billStatus: '',
        },
        selectedRows: [],
      }
    },
    watch: {
      crtTime(value) {
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
      handleViewSupplier(id){
        this.id = id;
        this.certificationVisible = true;
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
        this.listQuery.supplierCode = '';
        this.listQuery.supplierName = '';
        this.crtTime = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate =undefined;
        this.listQuery.supplierType = undefined;
        this.listQuery.billStatus = undefined;
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
      }
    },
  }
</script>

<style>

</style>
