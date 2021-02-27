<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="支付方式名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.label">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="中文名称" prop="label">
      </el-table-column>
      <el-table-column align="center" label="英文名称" prop="englishLabel">
      </el-table-column>
      <el-table-column align="center" label="值" prop="value">
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sort">
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status"
                       :filters="[{ text: '启用', value: 0 }, { text: '禁用', value: 1 }]"
                       :filter-method="filterStatus">
        <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="note">
      </el-table-column>
      <el-table-column align="center" label="操作" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="info" v-if="scope.row.status ===0" size="mini"
                     @click="handleUpdateStatus(scope.row.id,1)">禁用
          </el-button>
          <el-button type="info" v-if="scope.row.status ===1" size="mini"
                     @click="handleUpdateStatus(scope.row.id,0)">启用
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px">
        <el-form-item label="中文名称" prop="label">
          <el-input v-model="dataForm.label" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="englishLabel">
          <el-input v-model="dataForm.englishLabel" clearable></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="dataForm.value" clearable :disabled="isUpdate"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="dataForm.note" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
  import {page, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/financial/financialPaymentsMethods';

  export default {
    name: 'paymentsMode',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          label: undefined,
        },
        dataForm: {
          id: undefined,
          label: undefined,
          englishLabel: undefined,
          value: undefined,
          sort:undefined,
          note:undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        statusOptions: [{
          value: 0,
          label: '启用'
        }, {
          value: 1,
          label: '禁用'
        }],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        isUpdate: false,
        rules: {
          label: [{required: true, message: '中文名称不能为空', trigger: 'blur'}],
          sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
          value: [{required: true, message: '值不能为空', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      resetForm() {
        this.dataForm = {
          id: undefined,
          label: undefined,
          englishLabel: undefined,
          value: undefined,
          sort:undefined,
          status:0,
          note:undefined
        };
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.isUpdate = false;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.list.unshift(response.data);
                this.dialogFormVisible = false;
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
            })
          } else {
            return false;
          }
        })
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.dataForm = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
            this.isUpdate = true;
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          });
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm.id, this.dataForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
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
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        });
      },
      handleUpdateStatus(id, status) {
        updateStatus(id, status)
          .then(response => {
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
          });
      },
      filterStatus: function (value, row) {
        return row.status === value;
      },
    },
    watch:{
      'listQuery.label':{
        deep:true,
        handler: function () {
          if (this.listQuery.label === '') {
            this.listQuery.label = undefined;
          }
        }
      }
    }
  }
</script>
