<template>
  <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose" title="选择政策资源登记明细" append-to-body class="public-dialog">
    <div class="app-container calendar-list-container">
      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入供应商名称"
                  v-model="listQuery.supplierName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="rowClick" size="mini" highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                key="dataTable1" class="result-data-table">
        <el-table-column type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180" align="center" sortable>
          <template slot-scope="scope">
            <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
              {{scope.row.mainDTO.billNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80" align="center">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="crtUserNo" label="业务员工号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="crtUserName" label="业务员姓名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="agreementType" label="协议类型" width="80" align="center" v-slot="{row}">
          <span v-if="row.agreementType*1===0">促销返点</span>
          <span v-else-if="row.agreementType*1===1">个人资源</span>
          <span v-else-if="row.agreementType*1===2">上半年返利</span>
          <span v-else-if="row.agreementType*1===3">月</span>
          <span v-else-if="row.agreementType*1===4">下半年返利</span>
          <span v-else-if="row.agreementType*1===5">年终返利</span>
          <span v-else-if="row.agreementType*1===6">季度(一)</span>
          <span v-else-if="row.agreementType*1===7">季度(二)</span>
          <span v-else-if="row.agreementType*1===8">季度(三)</span>
          <span v-else-if="row.agreementType*1===9">季度(四)</span>
        </el-table-column>
        <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
        <!--</el-table-column>-->
        <el-table-column prop="rebateType" label="返利形式" width="180" v-slot="{row}" align="center">
          <span v-if="row.rebateType*1===1">抵货款</span>
          <span v-else-if="row.rebateType*1===2">现金</span>
          <span v-else-if="row.rebateType*1===3">特价</span>
        </el-table-column>
        <el-table-column prop="agreementYear" label="协议年度" align="center" width="180">
        </el-table-column>
        <el-table-column prop="beginTime" label="协议开始时间" min-width="200">
        </el-table-column>
        <el-table-column prop="endTime" label="协议结束时间" min-width="200">
        </el-table-column>
        <el-table-column prop="note" label="协议简要备注" width="150" sortable align="center">
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
  import {getFloat} from '@/utils/util'
  import {addBill,selectPage,selectPageByItem as page} from '@/api/erp/purchase/bill/policyRegister';

  export default {
    name: 'policyRegisterSelector',
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
          console.log(error,'获取数据发生了错误')
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
        delete this.listQuery.name
      },

      /**
       * 行单击
       * @param row 当前行
       */
      rowClick(row){
        let ids = {
          arr:row,
          type:'policyRegister',
        };
        this.$emit('handleSubmit', ids);
      }
    }
  }
</script>
