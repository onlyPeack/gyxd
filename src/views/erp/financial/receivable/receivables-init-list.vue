<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" v-bind:disabled="this.initStatus===1">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" v-bind:disabled="this.initStatus===1">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" v-bind:disabled="this.initStatus===1">删除</el-button>
      <el-button type="text" @click="handleEndInit" v-bind:disabled="this.initStatus===1">
        <svg-icon icon-class="end" style="margin-right: 3px;"></svg-icon>
        结束初始化
      </el-button>
      <el-button type="text" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
      </el-table-column>
      <el-table-column prop="billDate" label="业务日期">
      </el-table-column>
      <el-table-column prop="receiveAccount" label="收款账户">
        <template slot-scope="scope">
          <span v-for="item in bankAccountArr">
            <span v-if="scope.row.receiveAccount==item.accountCode">{{item.name}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="receiptCondition" label="收款条件">
        <template slot-scope="scope">
          <span v-for="item in repayConditionOptions">
            <span v-if="scope.row.receiptCondition==item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="deadlineDate" label="收款到期日">
      </el-table-column>
      <el-table-column prop="currencyId" label="币别" width="80">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveAmount" label="应收金额" align="right" class-name="col-required">
      </el-table-column>
      <el-table-column prop="note" label="备注">
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

    <!-- 新增应收初始化弹窗 -->
    <receivables-init-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                           @submitSuccess="submitSuccess" @handleClose="handleClose">
    </receivables-init-form>
  </div>
</template>

<script>
  import {page, delObj,endInit,selectInitStatus} from '@/api/erp/financial/financialReceivableInit';
  import {getFloat} from '@/utils/util';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: "receivables-init-list",
    components: {
      'receivables-init-form': () => import('./receivables-init-form')
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          customerName: undefined,
          // selectType: 0  //0代表查询所有状态的单据
        },
        clientHeight: 300,
        dialogFormVisible: false,
        selectedRows: [],
        initStatus: undefined,
        bankAccountArr: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: undefined
      };
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.init();
      this.getList();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 46;
        }
        this.clientHeight = (document.body.clientHeight - (210 + height)) * 1;
      },
      init() {
        selectInitStatus().then(response => {
          this.initStatus = response.data;
        }).catch(() => {
          this.initStatus = 0;
        });
        pageAll().then(response => {
          this.bankAccountArr = response.data;
        })
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
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
            if (column.property == 'payAmount') {
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.listQuery.page = 1;
        this.getList();
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          customerName: undefined,
          // selectType: 0
        };
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
        });
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.id = this.selectedRows[0].id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleEndInit() {
        endInit().then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '结束初始化成功',
              type: 'success',
              duration: 2000
            });
            this.init();
            this.getList();
          } else {
            this.$notify({
              title: '结束初始化失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
    }
  }
</script>

