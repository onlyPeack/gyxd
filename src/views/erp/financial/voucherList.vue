<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-collapse style="margin-top: -10px;">
        <el-collapse-item title="筛选">
          <template slot="title">
            <el-button icon="el-icon-search" type="text">筛选</el-button>
          </template>
          <div style="margin-bottom: -20px;">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>


            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>

    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handleChangeFun" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="序号" fixed="left"></el-table-column>
      <el-table-column type="selection" width="55" label="操作" fixed="left"></el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo"></el-table-column>
      <el-table-column align="center" label="凭证状态" prop="billStatus"></el-table-column>
      <el-table-column align="center" label="凭证类型" prop="voucherType"></el-table-column>
      <el-table-column align="center" label="凭证号" prop="voucherNumber"></el-table-column>
      <el-table-column align="center" label="摘要" prop="explanation"></el-table-column>
      <el-table-column align="center" label="科目编码" prop="accountNumber"></el-table-column>
      <el-table-column align="center" label="会计科目" prop="accountName"></el-table-column>
      <el-table-column align="center" label="辅助核算类型" prop="auxiliaryType"></el-table-column>
      <el-table-column align="center" label="辅助核算" prop="itemObjectKeys"></el-table-column>
      <el-table-column align="center" label="借方本位币金额" prop="basicDebitAmount"></el-table-column>
      <el-table-column align="center" label="贷方本位币金额" prop="basicCreditAmount"></el-table-column>
      <el-table-column align="center" label="时间" prop="year"></el-table-column>


    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="70%">
      <voucher-form :id="id" @submitSuccess="submitSuccess"
                    ref="voucherForm" v-if="dialogFormVisible"></voucher-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" @click="handlerCancel()">取消</el-button>
        <el-button class="filter-item" type="primary" icon="edit" @click="handlerOnSubmit()">提交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getDetailPage, delObj} from '@/api/erp/financial/voucher';

  export default {
    name: 'voucherList',
    components: {
      'voucher-form': () => import('./voucherForm'),
    },
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        dialogFormVisible: false,
        id: '',
        listQuery: {
          page: 1,
          limit: 10
        },
        selectedRows: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getDetailPage(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery.billNo = '';
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
        this.id = this.selectedRows[0].parentId;
        this.dialogFormVisible = true;
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
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能选择一条数据',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.selectedRows[0].billNo)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            });
        });
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handlerCancel() {
        this.dialogFormVisible = false;
      },
      handlerOnSubmit() {
        this.$refs.voucherForm.onSubmit();
      },
      submitSuccess() {
        this.getList();
        this.dialogFormVisible = false;
      },

    }
  }
</script>

<style>

</style>
