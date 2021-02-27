<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>

        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  v-model="listQuery.code"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="公司名称"
                  v-model="listQuery.companyName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>


    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>

    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handleChangeFun" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="序号" fixed="left"></el-table-column>
      <el-table-column type="selection" width="55" label="操作" fixed="left"></el-table-column>
      <el-table-column align="center" label="编码" prop="code"></el-table-column>
      <el-table-column align="center" label="公司名称" prop="companyName"></el-table-column>
      <el-table-column align="center" label="用户名称" prop="userName"></el-table-column>
      <el-table-column align="center" label="固定电话" prop="telephone"></el-table-column>
      <el-table-column align="center" label="移动电话" prop="mobile"></el-table-column>
      <el-table-column align="center" label="地址" prop="address"></el-table-column>
      <el-table-column align="center" label="有效期" prop="validTime"></el-table-column>


    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :id="id" :rules="rules" ref="form" label-width="100px">

        <el-row>
          <el-col :span="24">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="固定电话" prop="telephone">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="移动电话" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="有效期" prop="validTime">
              <el-date-picker v-model="form.validTime" type="date" style="width: 100%;" value-format="yyyy-MM-dd"
                              format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" @click="handlerCancel()">取消</el-button>
  <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>      </span>
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
  } from '@/api/admin/company';

  export default {
    name: 'companyList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        dialogFormVisible: false,
        id: '',
        listQuery: {
          page: 1,
          limit: 10,
          code: undefined,
          companyName: undefined,
        },
        selectedRows: [],
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        form: {
          code: undefined,
          companyName: undefined,
          userName: undefined,
          telephone: undefined,
          mobile: undefined,
          address: undefined,
          validTime: undefined,
        },
        rules: {
          companyName: [
            {
              required: true,
              message: '请输入公司名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], userName: [
            {
              required: true,
              message: '请输入用户名称',
              trigger: 'blur'
            }
          ], telephone: [
            {
              required: true,
              message: '请输入固定电话',
              trigger: 'blur'
            },
            {
              min: 9,
              max: 20,
              message: '长度在 9 到 20 个字符',
              trigger: 'blur'
            }
          ], mobile: [
            {
              required: true,
              message: '请输入移动电话',
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '长度在 11个字符',
              trigger: 'blur'
            }
          ]
        },
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
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery = {};
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
        this.id = this.selectedRows[0].id;
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
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handlerCancel() {
        this.dialogFormVisible = false;
      },
      submitSuccess() {
        this.getList();
        this.dialogFormVisible = false;
      },
      handlerOnSubmit() {
        this.$refs.form.onSubmit();
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      create(formName) {
        const set = this.$refs;
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
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
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

    }
  }
</script>

<style>

</style>
