<template>
  <div class="app-container calendar-list-container sales-summary-list-container bill-container">
    <el-tabs v-model="type">
      <el-tab-pane label="员工资金账户" name="1">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工编号"
                      @keyup.enter.native="handleAccountFilter" v-model="accountListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="员工姓名"
                      @keyup.enter.native="handleAccountFilter" v-model="accountListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleAccountFilter">查询</el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="员工工号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="员工姓名" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="利润账户" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleAccountSizeChange" @current-change="handleAccountCurrentChange"
                         :current-page="accountListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="accountListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客户资金账户" name="2">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                      @keyup.enter.native="handleClientFilter" v-model="clientListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                      @keyup.enter.native="handleClientFilter" v-model="clientListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleClientFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>
        <el-table size="small" :data="clientList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'crtTime', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="客户编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="客户名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="账户总金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="授信金额" prop="creditAmount" class-name="col-required" sortable>
          </el-table-column>
          <!--<el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleClientSizeChange" @current-change="handleClientCurrentChange"
                         :current-page="clientListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="clientListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="clientTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="供应商资金账户" name="3">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                      @keyup.enter.native="handleSupplierFilter" v-model="supplierListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                      @keyup.enter.native="handleSupplierFilter" v-model="supplierListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSupplierFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="supplierList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
        highlight-current-row :height="clientHeight" key="resultTable1" show-summary
        :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="供应商编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="供应商名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="账户总金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <el-table-column align="right" label="授信金额" prop="creditAmount" class-name="col-required" sortable>
          </el-table-column>
          <!--<el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSupplierSizeChange" @current-change="handleSupplierCurrentChange"
                         :current-page="supplierListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="supplierListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="supplierTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="银行资金账户" name="4">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户号"
                      @keyup.enter.native="handleBankFilter" v-model="bankListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户名"
                      @keyup.enter.native="handleBankFilter" v-model="bankListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSupplierFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="bankList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="银行账户编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="银行账户名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="账户总金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <!--<el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleBankSizeChange" @current-change="handleBankCurrentChange"
                         :current-page="bankListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="bankListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="bankTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公司资金账户" name="5">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户号"
                      @keyup.enter.native="handleCompanyFilter" v-model="companyListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户名"
                      @keyup.enter.native="handleCompanyFilter" v-model="companyListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleCompanyFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="companyList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="公司账户编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="公司账户名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="账户总金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <!--<el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleCompanySizeChange" @current-change="handleCompanyCurrentChange"
                         :current-page="companyListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="companyListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="companyTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="库存资金账户" name="6">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户号"
                      @keyup.enter.native="handleStockFilter" v-model="companyListQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户名"
                      @keyup.enter.native="handleStockFilter" v-model="companyListQuery.accountName">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleStockFilter">查询
              </el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                         @click="handleDownload">导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="stockList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1" show-summary
                  :summary-method="getSummaries" :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column align="left" label="库存账户编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="库存账户名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="账户总金额" prop="amount" class-name="col-required" sortable>
            <template slot-scope="scope">{{scope.row.amount.toFixed(4)}}</template>
          </el-table-column>
          <!--<el-table-column align="right" label="冻结金额" prop="frozenAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.frozenAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可用金额" prop="availableAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.availableAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="right" label="可报销金额" prop="reimbursementAmount" class-name="col-required" sortable>-->
            <!--<template slot-scope="scope">{{scope.row.reimbursementAmount.toFixed(4)}}</template>-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="账户状态" prop="status">
            <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
            </template>
          </el-table-column>
          <!--<el-table-column align="left" label="创建时间" prop="crtTime">-->
          <!--</el-table-column>-->
          <el-table-column align="left" label="截止日期" prop="backupDate">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleStockSizeChange" @current-change="handleStockCurrentChange"
                         :current-page="stockListQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="stockListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="stockTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {capitalAccountHistory} from '@/api/erp/financial/balance';
  import {getFloat} from '@/utils/util';
  export default {
    name: 'staffAccount',
    data() {
      return {
        downloadLoading: false,
        clientHeight: 300,
        list: undefined,
        clientList: undefined,
        total: undefined,
        clientTotal: undefined,
        supplierList : undefined,
        supplierTotal : undefined,
        bankList: undefined,
        bankTotal: undefined,
        companyList: undefined,
        companyTotal: undefined,
        stockList: undefined,
        stockTotal: undefined,
        listLoading: false,
        tradeOptions:[],
        accountListQuery: {
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type: "1"
        },
        clientListQuery: {
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type: "2",
        },
        supplierListQuery:{
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type: "3"
        },
        bankListQuery:{
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type:'4',
        },
        companyListQuery:{
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type:'5',
        },
        stockListQuery:{
          page: 1,
          limit: 10,
          accountCode: undefined,
          accountName: undefined,
          type: '6',
        },
        billDate: undefined,
        brandList: [],
        categoryList: [],
        statusOptions: [{
          value: 0,
          label: '启用'
        }, {
          value: 1,
          label: '冻结'
        }, {
          value: 2,
          label: '禁用'
        }],
        outInOptions: [{
          value: 'IN',
          label: '收入'
        }, {
          value: 'OUT',
          label: '支出'
        }, {
          value: 'FREEZE',
          label: '冻结'
        }],
        type: "1",
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };

      this.getList();
      this.getClientList();
      this.getSupplierList();
      this.getBankList();
      this.getCompanyList();
      this.getStockList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.type == '1' ? this.list : this.type == '2' ? this.clientList :  this.type == '3' ? this.supplierList : this.type == '4' ? this.bankList : this.type == '5' ? this.companyList : this.stockList));
          if (this.type == '1') {
            tHeader = ['员工编号', '员工姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '员工资金账户');
          }  else if(this.type == '2') {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['客户编号', '客户姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '客户资金账户');
          }else if(this.type == '3') {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['供应商编号', '供应商姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '供应商账户');
          }else if(this.type == '4') {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['银行编号', '银行姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '银行资金账户');
          }else if(this.type == '5') {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['公司编号', '公司姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '公司资金账户');
          }else{
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['库存编号', '库存姓名', '账户总金额', '冻结金额', '可用余额', '可报销金额', '账户状态', '最后更新时间', ];
            filterVal = ['accountCode', 'accountName', 'amount', 'frozenAmount', 'availableAmount', 'reimbursementAmount', 'status', 'backupDate',];
            excel.export_json_to_excel2(tHeader, list, filterVal, '库存资金账户');
          }

          this.downloadLoading = false;
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('staff-account-filter-container')[0]) {
          if (this.type == '1') {
            var height = document.getElementsByClassName('staff-account-filter-container')[0].clientHeight;
          } else {
            var height = document.getElementsByClassName('staff-account-filter-container')[1].clientHeight;
          }
        } else {
          height = 48;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        this.list = [];
        capitalAccountHistory(this.accountListQuery).then(response => {
          console.log(response.data.records);
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getClientList() {
        this.listLoading = true;
        this.clientList = [];
        capitalAccountHistory(this.clientListQuery).then(response => {
          this.clientList = response.data.records;
          this.clientTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.clientList = [];
          this.clientTotal = 0;
          this.listLoading = false;
        })
      },
      getSupplierList(){
        this.listLoading = true;
        this.supplierList = [];
        capitalAccountHistory(this.supplierListQuery).then(response => {
          this.supplierList = response.data.records;
          this.supplierTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.supplierList = [];
          this.supplierTotal = 0;
          this.listLoading = false;
        })
      },
      getBankList(){
        this.listLoading = true;
        this.bankList = [];
        capitalAccountHistory(this.bankListQuery).then(response => {
          this.bankList = response.data.records;
          this.bankTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.bankList = [];
          this.bankTotal = 0;
          this.listLoading = false;
        })
      },
      getCompanyList(){
        this.listLoading = true;
        this.companyList = [];
        capitalAccountHistory(this.companyListQuery).then(response => {
          this.companyList = response.data.records;
          this.companyTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.companyList = [];
          this.companyTotal = 0;
          this.listLoading = false;
        })
      },
      getStockList(){
        this.listLoading = true;
        this.companyList = [];
        capitalAccountHistory(this.stockListQuery).then(response => {
          this.stockList = response.data.records;
          this.stockTotal = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.stockList = [];
          this.stockTotal = 0;
          this.listLoading = false;
        })
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }

          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'amount' || column.property == 'frozenAmount' || column.property == 'reimbursementAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }
          } else {
            sums[index] = ' ';
          }

        });

        return sums;
      },
      handleAccountFilter() {
        this.accountListQuery.page = 1;
        this.getList()
      },
      handleClientFilter() {
        this.clientListQuery.page = 1;
        this.getClientList();
      },
      handleSupplierFilter(){
        this.supplierListQuery.page = 1;
        this.getSupplierList()
      },
      handleBankFilter(){
        this.bankListQuery.page = 1;
        this.getBankList()
      },
      handleCompanyFilter(){
        this.companyListQuery.page = 1;
        this.getCompanyList();
      },
      handleStockFilter(){
        this.stockListQuery.page = 1;
        this.getStockList();
      },
      handleStockSizeChange(val){
        this.stockListQuery.limit = val;
        this.getStockList();
      },
      handleCompanySizeChange(val){
        this.companyListQuery.limit = val;
        this.getCompanyList();
      },
      handleBankSizeChange(val) {
        this.bankListQuery.limit = val;
        this.getBankList()
      },
      handleSupplierSizeChange(val) {
        this.supplierListQuery.limit = val;
        this.getSupplierList()
      },
      handleClientSizeChange(val) {
        this.clientListQuery.limit = val;
        this.getClientList()
      },
      handleAccountSizeChange(val) {
        this.accountListQuery.limit = val;
        this.getList()
      },
      handleStockCurrentChange(val){
        this.stockListQuery.page = val;
        this.getStockList();
      },
      handleBankCurrentChange(val) {
        this.bankListQuery.page = val;
        this.getList();
      },
      handleAccountCurrentChange(val) {
        this.accountListQuery.page = val;
        this.getList();
      },
      handleClientCurrentChange(val) {
        this.clientListQuery.page = val;
        this.getClientList();
      },
      handleSupplierCurrentChange(val) {
        this.supplierListQuery.page = val;
        this.getSupplierList();
      },
      handleCompanyCurrentChange(val){
        this.companyListQuery.page = val;
        this.getCompanyList();
      },
      handleBillDateSelect(val) {
        this.clientListQuery.startTradeDate = val[0];
        this.clientListQuery.endTradeDate = val[1];
      },
    },
    computed: {},
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startTradeDate = undefined;
          this.listQuery.endTradeDate = undefined;
        }
      },
      type: {
        handler(val) {
          if (val == '1') {
            this.getList();
          }
          if (val == '2') {
            this.getClientList();
          }
          if(val == '3') {
            this.getSupplierList();
          }
          if(val == '4'){
            this.getBankList();
          }
          if(val == '5'){
            this.getCompanyList();
          }
          if(val == '6'){
            this.getStockList();
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-summary-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }
</style>
