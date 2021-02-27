<template>
  <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose" title="选择品牌" append-to-body class="public-dialog">
    <div class="app-container calendar-list-container">
      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商ID" v-model="listQuery.id"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商名称" v-model="listQuery.name"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商英文名称" v-model="listQuery.nameEn"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" ref="dataTable" border fit highlight-current-row
                v-loading.body="listLoading" @row-dblclick="rowClick"
                height="50vh">
        <el-table-column align="center" label="品牌商ID" prop="id" sortable>
        </el-table-column>
        <el-table-column align="center" label="品牌商名称" prop="name">
        </el-table-column>
        <el-table-column align="center" label="英文名称" prop="nameEn">
        </el-table-column>
        <el-table-column align="center" property="picUrl" label="品牌商图片">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="品牌介绍" prop="desc">
        </el-table-column>
        <el-table-column align="center" label="底价" prop="floorPrice">
        </el-table-column>
        <el-table-column align="center" label="排序" prop="sortOrder">
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

    </div>
  </el-dialog>
</template>

<script>
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/brand';
  export default {
    name: 'supplierSelector',
    props: ['dialogVisible'],
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
          name: [{required: true, message: '渠道类型名称不能为空', trigger: 'blur'}],
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
        }).catch(error => {
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

      /**
       * 数字前补零
       * @param num 需要补零的数字
       * @returns {string|*} 补零后的数字
       */
      addPreZero(num){
        if(num<10){
          return '00'+num;
        }else if(num<100){
          return '0'+num;
        }else{
          return num;
        }
      },

      /**
       * 从父组件中接收的关闭对话框方法
       */
      handleClose() {
        this.$emit('handleClose');
      },

      clear(){
        this.listQuery = {
          page: 1,
          limit: 10
        }
        this.getList()
      },

      /**
       * 行单击
       * @param row 当前行
       */
      rowClick(row){
        let ids = {
          arr:row,
          type:'brand',
        };
        this.$emit('handleSubmit', ids);
      }
    }
  }
</script>
