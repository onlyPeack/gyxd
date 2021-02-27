<template>
  <div class="full-purchase stock-center-company bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="企业名称"
                  v-model="listQuery.companyName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="companyName" label="企业名称" min-width="150">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleDetailOpen(scope.row)">
            {{scope.row.companyName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userCode" label="客户编号" width="100"></el-table-column>
      <el-table-column prop="contact" label="联系人" width="120"></el-table-column>
      <el-table-column prop="telephone" label="联系人电话" width="120"></el-table-column>
      <el-table-column prop="mobile" label="手机" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="qq" label="QQ" width="150"></el-table-column>
      <el-table-column prop="wx" label="微信" width="150"></el-table-column>
      <el-table-column prop="city" label="城市" width="150"></el-table-column>
      <el-table-column prop="fax" label="传真" width="150"></el-table-column>
      <el-table-column prop="note" label="备注" width="150"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增企业弹窗 -->
    <stock-center-company-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible"
                               @submitSuccess="submitSuccess" @handleClose="handleFormClose">
    </stock-center-company-form>

    <!-- 企业详情弹窗 -->
    <stock-center-company-detail :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @handleClose="handleDetailClose">
    </stock-center-company-detail>

  </div>
</template>

<script>
  import {selectPage, deleteCompany} from '@/api/erp/mall/scs/company';

  export default {
    name: "companyList",
    components: {
      'stock-center-company-form': () => import('./form'),
      'stock-center-company-detail': () => import('./detail')
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          companyName: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        id: null
      };
    },
    created() {
      const _this = this;
      this.changeDivHeight();
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
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
      handleFilter() {
        this.listLoading = true;
        this.getList();
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleFormClose() {
        this.id = '';
        this.dialogFormVisible = false;
        //this.getList();
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
        //this.getList();
      },
      handleReset() {
        this.listQuery.companyName = undefined;
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'warning',
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
          deleteCompany(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'error',
                  duration: 2000
                })
              }
            });
        });
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'warning',
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
      handleDetailOpen(row) {
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        this.getList();
      },
    }
  }
</script>

<style lang="scss">
  .stock-center-company {
    .billFormDialog {
      .el-dialog {
        margin-top: 15vh !important;
        height: auto !important;
      }
      .el-dialog__body {
        height: auto !important;
      }
    }
  }
</style>
