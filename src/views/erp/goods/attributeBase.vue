<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入参数名称"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="排序" width="100" prop="sort">
      </el-table-column>
      <el-table-column align="center" label="ID" width="100" prop="id">
      </el-table-column>
      <el-table-column align="center" label="参数名称" prop="name">
      </el-table-column>
      <el-table-column align="center" label="参数值" prop="stringList">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
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
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style=' margin-left:50px;'>

        <!--el-row>
          <el-col :span="24">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="dataForm.sort" placeholder="请输入参数排序"></el-input>
            </el-form-item>
          </el-col>
        </el-row-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--el-button type="primary" size="mini" icon="el-icon-plus" @click="addValueRow"></el-button-->
        <el-table :data="valueTableData" size="mini" highlight-current-row border
                  style="width: 100%;margin-top: 5px;"
                  :header-cell-style="valueHeaderStyle"
                  class="el-tb-edit"
                  @current-change="handleValueCurrentChange"
                  ref="valueTable">
          <el-table-column type="index"></el-table-column>
          <el-table-column  width="65">
            <template  slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-plus" @click="addValueRow"></el-button>
              <el-button type="text" size="mini" icon="el-icon-minus" @click="handleValueDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="*参数值">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="参数值编码">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.code"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.sort"></el-input>
            </template>
          </el-table-column>
          <!--el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleValueDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column-->
        </el-table>
        <!--el-tabs v-model="activeName">
          <el-tab-pane label="参数值" name="value">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addValueRow">新增</el-button>
              <el-table :data="valueTableData" size="mini" highlight-current-row border
                        style="width: 100%;margin-top: 5px;"
                        :header-cell-style="valueHeaderStyle"
                        class="el-tb-edit"
                        @current-change="handleValueCurrentChange"
                        ref="valueTable">
                <el-table-column prop="name" label="*参数值">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.sort"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleValueDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

        </el-tabs-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<style>
  .add{
    width: 100%;
    height: 100%;
  }
  .span-css{
    display: block;
    line-height: 100px;
    width:100px;
    height: 100px;
    float: left;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>

<script>
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/attributeBase';

  export default {
    name: 'attributeBase',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined
        },
        valueTableData: [],
        activeName: 'value',
        dataForm: {
          valueList: undefined,
          stringList: undefined,
          sort: undefined,
          name: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{required: true, message: '参数名称不能为空', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getList()
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
          sort: undefined,
          valueList: undefined,
          name: ''
        }
      },
      handleCreate() {
        this.resetForm();
        this.valueTableData = [];
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
        this.addValueRow()
      },
      createData() {
        this.dataForm.valueList = this.valueTableData;
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
        this.valueTableData = row.valueList;
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
      //tab页相关
      addValueRow() {
        const d = {
          name: '',
          sort: ''
        };
        this.valueTableData.push(d);
        setTimeout(() => {
          this.$refs.valueTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleValueCurrentChange(val) {
        this.currentRow = val;
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.valueTableData.length
        if(ValueIndex === 1){
          return
        }
          this.valueTableData.splice(index, 1)


      },
      valueHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          return 'color:red'
        }
      },

    }
  }
</script>
