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

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table">
      <el-table-column prop="companyName" label="公司名称" ></el-table-column>
      <el-table-column prop="type" label="是否注册">
          <template slot-scope="scope">
              <span v-if="scope.row.type == 1">已注册</span>
              <span v-if="scope.row.type == 0">未注册</span>
              <span v-if="scope.row.type == 2">已备案未注册</span>
          </template>
      </el-table-column>
      <el-table-column prop="isPublicPool" label="是否公共池客户">
          <template slot-scope="scope">
              <span v-if="scope.row.isPublicPool == 0">不是</span>
              <span v-if="scope.row.isPublicPool == 1">是</span>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="备案时间"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <!-- 新增企业弹窗 -->
    <!-- <stock-center-company-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible"
                               @submitSuccess="submitSuccess" @handleClose="handleFormClose">
    </stock-center-company-form> -->

    <!-- 企业详情弹窗 -->
    <!-- <stock-center-company-detail :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @handleClose="handleDetailClose">
    </stock-center-company-detail> -->

  </div>
</template>

<script>
  import {selectPage, deleteCompany} from '@/api/erp/mall/scs/company';
  import {recordSelect} from '@/api/erp/crm/customer/index';

  export default {
    name: "companyList",
    components: {
    //   'stock-center-company-form': () => import('./form'),
    //   'stock-center-company-detail': () => import('./detail')
    },
    data() {
      return {
        list: null,
        total: undefined,
        listLoading: false,
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
    //   this.getList();
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
        recordSelect(this.listQuery.companyName.trim()).then(response => {
        if(response.companyName) {
            let tempArr = [];
            tempArr.push(response)
              this.list = tempArr
        }
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
        this.list = null;
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
        this.list = null;
        this.getList();
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
