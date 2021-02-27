<template>
  <div class="app-container calendar-list-container customer-type-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户行业名称"
                v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="客户行业名称" prop="name"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isSwitch" active-color="#C0CCDA" inactive-color="#188AE2"
                     @change="handleSwitchChange($event,scope.row,scope.$index)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="ms-dialog">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="100%">
              <el-form-item label="名称:" prop="name" class="el-form-flex">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="100%">
              <el-form-item label="状态:" prop="status" class="el-form-flex">
                <div style="margin-top: 6px;">
                  <el-radio v-model="form.status" v-for="item in statusOptionList" :key="item.value"
                            :label="item.value">
                    {{item.label}}
                  </el-radio>
                </div>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/erp/crm/customerType';

  export default {
    name: 'customerIndustry',
    data() {
      return {
        form: {
          type: 'customer_industry',
          name: undefined,
          status: '0'
        },
        statusOptionList: [
          {
            value: '0',
            label: '开启'
          },
          {
            value: '1',
            label: '关闭'
          }
        ],
        rules: {
          name: [{required: true, message: '请输入', trigger: 'blur'}],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          type: 'customer_industry',
          name: undefined,
        },
        dialogFormVisible: false,
        selectedRows: [],
        dialogStatus: '',
        textMap: {
          update: '修改客户行业',
          create: '新增客户行业'
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            if (response.data.records) {
              for (var i in response.data.records) {
                response.data.records[i].isSwitch = response.data.records[i].status == '0' ? false : true;
              }
            }
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
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
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
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
        getObj(this.selectedRows[0].id)
          .then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
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
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(this.selectedRows[0].id)
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
      create(formName) {
        const set = this.$refs;
        this.form.type = 'customer_industry';
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.type = 'customer_industry';
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          status: '0'
        };
      },
      handleSwitchChange(val, row, index) {
        if (val) {
          row.status = '1';
        } else {
          row.status = '0';
        }
        this.form = row;
        this.form.type = 'customer_industry';
        putObj(this.form.id, this.form).then(() => {
          this.list[index] = row;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.name = undefined;
        this.listQuery.type='customer_industry';
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .customer-type-container {
    .ms-dialog {
      font-size: 12px;
      .topTable {
        width: 100%;
        margin-bottom: 20px;
        border: none;
        border-spacing: 0;
        border-collapse: collapse;
        color: #444;

        td {
          border: 1px solid #e0e0e0;
          height: 40px;
          padding: 0px;
          margin: 0px;
          padding-left: 10px;
        }
        .el-form-flex {
          display: flex;
          margin-bottom: 0px;
        }
        .el-input, .el-input-number {
          margin-top: 6px;
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
        .el-radio__label {
          padding-left: 5px;
        }
        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }
        .el-textarea__inner {
          border: none;
          resize: none;
          padding: 10px 15px;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-form-item__content {
          width: 100%;
          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }
        }
        .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
          line-height: 40px;
          color: #444;
          white-space: nowrap;
        }
      }
    }
  }
</style>
