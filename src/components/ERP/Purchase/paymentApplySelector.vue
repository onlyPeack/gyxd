<template>
  <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose" title="付款申请单关联" append-to-body class="public-dialog">
    <div class="app-container calendar-list-container">
      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-select style="position: relative;top:-3px;width: 200px;" v-model="listQuery.billStatus" class="input-width" placeholder="单据状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select style="position: relative;top:-3px;width: 200px;" v-model="listQuery.paymentForm" class="input-width" placeholder="付款形式" clearable>
            <el-option v-for="item in paymentOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人工号"
                    v-model="listQuery.crtUserNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人部门"
                    v-model="listQuery.departName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                    v-model="listQuery.supplierCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
        <div class="query-container">
          <div class="block">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                      v-model="listQuery.supplierName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-date-picker  style="position: relative;top:-3px;"
                             v-model="billDate"
                             type="daterange"
                             align="right"
                             unlink-panels
                             range-separator="至"
                             start-placeholder="单据开始日期"
                             end-placeholder="单据结束日期"
                             value-format="yyyy-MM-dd"
                             @change="handleBillDateSelect"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="rowClick" @selection-change="handlechangeFun" size="mini" show-summary :summary-method="getSummaries"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                 key="dataTable1" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}">
        <el-table-column type="selection" align="center" width="60">
        </el-table-column>
        <el-table-column  align="center" type="index">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" align="center" min-width="180" sortable>
          <template slot-scope="scope">
            <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
              {{scope.row.billNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
          <template slot-scope="scope" v-if="scope.row">
            <div v-for="(item,index) in statusOptions"  :key="index">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="crtUserNo" label="申请人工号" align="center" width="100">
        </el-table-column>
        <el-table-column prop="applicantName" label="申请人" align="center" width="100">
        </el-table-column>
        <!-- <el-table-column prop="applicantId" label="申请人ID" align="center" width="100">
        </el-table-column> -->
        <el-table-column prop="departName" label="申请人部门" align="center" width="100">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商"  width="200">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编号"  width="100">
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请金额" width="120" align="right" class-name="col-required">
          <template slot-scope="scope">
            {{Number(scope.row.applyAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已付款金额" width="120" align="right" class-name="col-required">
          <template slot-scope="scope">
            {{Number(scope.row.paidAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="bankName" label="开户银行" align="center" width="150">
        </el-table-column>
        <el-table-column prop="bankAccount" label="银行账户" align="center" width="200">
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center" width="200">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" align="center" width="108" sortable>
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
  import {selectPage as page, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/paymentApply';
  import {getFloat} from '@/utils/util';
  import {page as getPaymentsMeans} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: 'paymentApplySelector',
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
          number: undefined,
          selectType:2
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
        paymentOptions:[
          {
            label: '直接付款',
            value: '0',
          },{
            label: '预付款',
            value: '1',
          }
        ],
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
          type:'paymentApply',
        };
        this.$emit('handleSubmit', ids);
      },

      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          crtUserNo: null,
          billStatus:null,
          applicantName: undefined,
          departName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          selectType: 0,
          paymentForm: null,
          supplierCode: null,
          supplierName: null
        };
        this.billDate = undefined;
      },
    }
  }
</script>
