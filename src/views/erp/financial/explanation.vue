<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入摘要编码"
                v-model="listQuery.number"></el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入摘要名称"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="摘要编码" prop="number"></el-table-column>
      <el-table-column align="center" label="摘要名称" prop="name"></el-table-column>
      <el-table-column align="center" label="摘要类别" >
        <template slot-scope="scope">
          <span v-for="item in groupNameList">
            <span v-if="scope.row.groupName ===item.number">{{item.name}}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="right" label-width="100px"
               style=' margin-left:50px;'>

        <el-row>
          <el-col :span="12">
            <el-form-item label="摘要编码" prop="number">
              <el-input v-model="dataForm.number" placeholder="请输入摘要编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摘要名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入摘要名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="摘要类别" prop="groupName">
              <el-select class="filter-item" v-model="dataForm.groupName">
                <el-option
                  v-for="item in groupNameList"
                  :key="item.number"
                  :label="item.name"
                  :value="item.number">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {page, addObj, getObj, delObj, putObj, getExplanationCategoryList} from '@/api/erp/financial/explanation';

  export default {
    name: 'explanation',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined,
          number: undefined
        },
        activeName: 'value',
        dataForm: {
          number: undefined,
          name: undefined,
          groupName: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          number: [{required: true, message: '摘要编码不能为空', trigger: 'blur'}],
          name: [{required: true, message: '摘要名称不能为空', trigger: 'blur'}],
          groupName: [{required: true, message: '摘要类别不能为空', trigger: 'blur'}]
        },
        groupNameList: []
      }
    },
    created() {
      this.getList();
      getExplanationCategoryList().then(response => {
        this.groupNameList = response.data.records;
      })
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
          number: undefined,
          name: undefined,
          groupName: undefined
        }
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
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
                this.handleFilter();
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
        this.dataForm = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
                this.handleFilter();
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


    }
  }
</script>
