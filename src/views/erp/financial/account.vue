<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入科目编码"
                v-model="listQuery.number"></el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入科目名称"
                v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="科目编码" prop="number"></el-table-column>
      <el-table-column align="center" label="科目名称" prop="name"></el-table-column>
      <el-table-column align="center" label="科目属性" prop="attribute">
        <template slot-scope="scope">
          <span v-for="item in attributeList">
            <span v-if="scope.row.attribute ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目类别" prop="groupKey">
        <template slot-scope="scope">
          <span v-for="item in groupKeyList">
            <span v-if="scope.row.groupKey ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额方向" prop="dcKey"></el-table-column>
      <el-table-column align="center" label="期末调汇">
        <template slot-scope="scope">
          <span v-for="item in yesOrNo">
            <span v-if="scope.row.isAdjustRate ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="辅助核算" prop="detailJson">
        <template slot-scope="scope">
          <span v-for="item in detailJsonList">
            <span v-if="scope.row.detailJson ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目状态" prop="status">
        <template slot-scope="scope">
          <span v-for="item in statusList">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
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
            <el-form-item label="科目编码" prop="number">
              <el-input v-model="dataForm.number" placeholder="请输入科目编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科目名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入科目名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="科目类别" prop="groupKey">
              <el-select class="filter-item" v-model="dataForm.groupKey">
                <el-option
                  v-for="item in groupKeyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="余额方向" prop="dcKey">
              <el-radio v-model="dataForm.dcKey" label="借方">借方</el-radio>
              <el-radio v-model="dataForm.dcKey" label="贷方">贷方</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="科目属性" prop="attribute">
              <el-select class="filter-item" v-model="dataForm.attribute">
                <el-option
                  v-for="item in attributeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期末调汇" prop="isAdjustRate">
              <el-radio v-model="dataForm.isAdjustRate" label="0">否</el-radio>
              <el-radio v-model="dataForm.isAdjustRate" label="1">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="辅助核算" prop="detailJson">
              <el-select class="filter-item" v-model="dataForm.detailJson">
                <el-option
                  v-for="item in detailJsonList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
             </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科目状态" prop="status">
              <el-radio v-model="dataForm.status" label="0">启用</el-radio>
              <el-radio v-model="dataForm.status" label="1">禁用</el-radio>
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
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/financial/account';

  export default {
    name: 'account',
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
          dcKey: undefined,
          groupKey: undefined,
          attribute: '0',
          isAdjustRate: '0',
          status: '0',
          detailJson: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          dcKey: [{required: true, message: '余额方向不能为空', trigger: 'blur'}],
          number: [{required: true, message: '科目编码不能为空', trigger: 'blur'}],
          name: [{required: true, message: '科目名称不能为空', trigger: 'blur'}],
          groupKey: [{required: true, message: '科目类别不能为空', trigger: 'blur'}]
        },
        yesOrNo: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        attributeList: [{
          value: '0',
          label: '无'
        }, {
          value: '1',
          label: '银行科目'
        }, {
          value: '2',
          label: '现金科目'
        }, {
          value: '3',
          label: '现金等价物'
        }],
        statusList: [{
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }],
        detailJsonList: [{
          value: '1',
          label: '银行账户'
        }, {
          value: '2',
          label: '客户'
        }, {
          value: '3',
          label: '供应商'
        }, {
          value: '4',
          label: '部门'
        }, {
          value: '5',
          label: '仓库'
        }, {
          value: '6',
          label: '用户'
        }, {
          value: '7',
          label: '项目'
        }, {
          value: '8',
          label: '门店'
        }, {
          value: '9',
          label: '商品'
        }],
        groupKeyList: [{
          value: '1',
          label: '负债类'
        }, {
          value: '2',
          label: '损益类'
        }, {
          value: '3',
          label: '所有者权益类'
        }, {
          value: '4',
          label: '资产类'
        }
        //   ,{
        //   value: '5',
        //   label: '所有者权益'
        // }, {
        //   value: '6',
        //   label: '成本'
        // }, {
        //   value: '7',
        //   label: '营业收入'
        // }, {
        //   value: '8',
        //   label: '营业成本及税金'
        // }, {
        //   value: '9',
        //   label: '期间费用'
        // }, {
        //   value: '10',
        //   label: '其他收益'
        // }, {
        //   value: '11',
        //   label: '其他损失'
        // }, {
        //   value: '12',
        //   label: '以前年度损益调整'
        // }, {
        //   value: '13',
        //   label: '所得税'
        // }
        ],
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
          number: undefined,
          name: undefined,
          dcKey: undefined,
          groupKey: undefined,
          attribute: '0',
          isAdjustRate: '0',
          status: '0',
          detailJson: undefined
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
