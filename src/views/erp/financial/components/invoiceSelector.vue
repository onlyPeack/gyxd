<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase sales-contract-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container sales-contract-filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
      <!-- 查询结果 -->
      <!--汇票库-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="billStatus" label="当前状态" width="100" align="center">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="承兑状态" prop="nowType" width="180" align="center" v-slot="{row}">
          <span>{{nowTypeMap[row.nowType]}}</span>
        </el-table-column>
        <el-table-column label="单据编号" prop="billNo" width="180" align="center">
        </el-table-column>
        <el-table-column label="汇票编号" prop="draftNo" width="180" align="left">
        </el-table-column>
        <el-table-column label="客户编号" prop="customerCode" width="120" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.mainDTO">
              <span>{{scope.row.mainDTO.customerCode}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="客户" prop="customerName" width="180" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.mainDTO">
              <span>{{scope.row.mainDTO.customerName}}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="汇票类型" prop="acceptanceType" width="90" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.mainDTO">
              <span>{{scope.row.mainDTO.acceptanceType}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分公司承兑账户" prop="companyAccount" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.mainDTO">
              <span>{{scope.row.mainDTO.companyAccount}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left"  width="180" label="付款银行全称" prop="paymentBankFullName" sortable>
        </el-table-column>
        <el-table-column align="right" width="110" label="出票金额" prop="amt" class-name="col-required" sortable>
        </el-table-column>
        <el-table-column align="right" label="贴息额" prop="discount" class-name="col-required" sortable width="110">
        </el-table-column>
        <el-table-column align="right" label="手续费" width="110" prop="fee" class-name="col-required" sortable>
        </el-table-column>
        <el-table-column align="right" label="月利率" width="110" prop="monthRate" class-name="col-required" sortable>
        </el-table-column>
        <el-table-column align="left" label="几手背书" width="110" prop="hands" sortable>
        </el-table-column>
        <el-table-column align="center" label="汇票到期日" width="120" prop="draftExpireDate" sortable>
        </el-table-column>
        <el-table-column align="center" label="制单人" prop="crtUserName" width="120" sortable>
        </el-table-column>
        <el-table-column align="center" label="单据时间" prop="crtTime" width="180" sortable>
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {findAllPage} from '@/api/erp/financial/acceptanceRegister';
  import {getFloat} from '@/utils/util';

  export default {
    name: "invoiceSelector",
    props: ['dialogSelectorVisible', 'sourceBillNo'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        nowTypeMap:{//承兑状态字典
          1:'未支出',
          2:'支出中',
          3:'已支出'
        },
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          selectType: 2,
          nowType: 1,
          billStatus: 4, //其它单据关联合同时查询，只查状态为正常的单据
        },
        selectedRows: [],
        queryVisible: false,
        contractDate: undefined,
        effectiveDate: undefined,
        disabledDate: undefined,
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-contract-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-contract-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        this.list = [];
        this.total = 0;
        this.listLoading = false;
        findAllPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }


          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.handleSouceObjectChange(false);
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.handleSouceObjectChange(false);
        this.getList()
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          nowType: 1,
          billStatus: 4,
          selectType: 2,
        };
        this.contractDate = undefined;
        this.effectiveDate = undefined;
        this.disabledDate = undefined;
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSouceObjectChange(clear) {
        if (clear) {
          this.selectedRows = [];
        }
      },
      handleSubmit() {
         this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
          });
        // if (this.selectedRows.length > 0) {
        //   for (let i in this.selectedRows) {
        //     if (this.selectedRows[0].billNo != this.selectedRows[i].billNo) {
        //       this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
        //       return;
        //     }
        //   }

        //   if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].mainDTO.billNo) {

        //     this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       this.$emit('submitSelectorSuccess', {
        //         list: this.selectedRows,
        //         isClearAll: true,
        //       });
        //     }).catch(() => {

        //     });

        //   } else {
        //     this.$emit('submitSelectorSuccess', {
        //       list: this.selectedRows,
        //       isClearAll: false,
        //     });
        //   }
        // } else {
        //   this.$emit('submitSelectorSuccess', {
        //     list: this.selectedRows,
        //     isClearAll: false,
        //   });
        // }
      },
      handleContractDateSelect(val) {
        this.listQuery.startContractDate = val[0];
        this.listQuery.endContractDate = val[1];
      },
      handleDisabledDateSelect(val) {
        this.listQuery.startDisabledDate = val[0];
        this.listQuery.endDisabledDate = val[1];
      },
      handleEffectiveDateDateSelect(val) {
        this.listQuery.startEffectiveDate = val[0];
        this.listQuery.endEffectiveDate = val[1];
      },
    },
    watch: {
      contractDate(value) {
        if (value == null) {
          this.listQuery.startContractDate = undefined;
          this.listQuery.endContractDate = undefined;
        }
      },
      effectiveDate(value) {
        if (value == null) {
          this.listQuery.startEffectiveDate = undefined;
          this.listQuery.endEffectiveDate = undefined;
        }
      },
      disabledDate(value) {
        if (value == null) {
          this.listQuery.startDisabledDate = undefined;
          this.listQuery.endDisabledDate = undefined;
        }
      }
    }
  }
</script>
