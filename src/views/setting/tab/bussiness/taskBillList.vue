<template>
  <div class="full-purchase bill-container task-bill-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="流程ID" v-model="listQuery.processId"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据前缀" v-model="listQuery.billPrefix"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="danger" @click="handleInitialise">初始化</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column prop="processId" label="流程ID">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.processId}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billPrefix" label="单据前缀" align="center" width="200">
      </el-table-column>
      <el-table-column align="center" label="单据名称">
        <template slot-scope="scope">
          <span v-for="item in billOptions">
            <span v-if="scope.row.billPrefix ===item.value">{{item.labelDefault}}</span>
          </span>
        </template>
      </el-table-column>

    </el-table>


    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增单据弹窗 -->
    <task-bill-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                    @submitSuccess="submitSuccess" @handleClose="handleClose">
    </task-bill-form>
    <el-dialog :visible.sync="dialognItialiseVisiblelt" @close="handleCloses" width="70%" title="流程初始化"
               class="Intialisedialogn" :close-on-click-modal="false" :before-close="handleCloses">
      <el-transfer
        filterable
        v-model="value"
        :props="props"
        :titles="['流程模板', '已选流程模板']"
        :data="data">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloses">取消</el-button>
        <el-button type="primary" @click="handleItialise">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {page, itemPage, batchDelBill, getSourcePage, copyTask} from '@/api/erp/oa/task/taskBill';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: 'taskBillList',
    components: {
      'task-bill-form': () => import('./taskBillForm')
    },
    data() {
      return {
        data: [],
        value: [],
        list: [],
        total: undefined,
        listLoading: true,
        listQuerys: {
          page: 1,
          limit: 100
        },
        listQuery: {
          page: 1,
          limit: 20,
          processId: undefined,
          billPrefix: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        billOptions: [],
        taskAuditOptions: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialognItialiseVisiblelt: false,
        props: {
          key: 'billPrefix',
          label: 'billName'
        }
      };
    },
    created() {
      getTypeValue('root_bill').then(response => {
        this.billOptions = response.data.rows;
      });
      getTypeValue('task_audit').then(response => {
        this.taskAuditOptions = response.data.rows;
      });
      // this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
      this.getSourcePages();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      getSourcePages() {
        getSourcePage(this.listQuerys).then(res => {
          for (const i in res.records) {
            res.records[i].billName = this.getBillName(res.records[i].billPrefix);
          }
          this.data = res.records;
        })
      },
      handleCloses() {
        this.dialognItialiseVisiblelt = false;
        this.data = [];
        this.value = [];
        this.getSourcePages();
      },
      handleItialise() {
        if (this.value.length < 1) {
          this.vueMessage('warning', '请选择流程模板!');
        } else {
          copyTask(this.value).then(response => {
            if (response.code == '2000') {
              this.$notify({
                title: '成功',
                message: '操作成功',
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
            this.dialognItialiseVisiblelt = false;
            this.data = [];
            this.value = [];
            this.getSourcePages();
          })
        }
      },
      handleInitialise() {
        this.dialognItialiseVisiblelt = true;
      },
      getBillName(val) {
        for (const i in this.billOptions) {
          if (val == this.billOptions[i].value) {
            return this.billOptions[i].labelDefault
          }
        }
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(() => {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (230 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.records;
          this.total = response.total;
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
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.processId = undefined;
        this.listQuery.billPrefix = undefined
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
        const ids = [];
        this.selectedRows.forEach(row => {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
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
      handleChangeFun(val) {
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
      handleDetailOpen(row) {
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        this.getList();
      },
      handleOpenDetailOrForm(row) {
        this.id = row.id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      }
    }
  }
</script>

<style lang="scss">
  .task-bill-list-container {
    .el-transfer-panel {
      width: 260px;
    }
    .el-transfer {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-transfer-panel__body {
      height: 286px;
    }
    .el-transfer-panel__list.is-filterable {
      height: 239px;
      padding-top: 0;
    }
    .Intialisedialogn {
      .el-dialog {
        margin-top: 20vh !important;
        width: 35% !important;
        height: auto !important;
        .el-dialog__body {
          height: 46vh !important;
        }
      }
    }
  }
</style>
