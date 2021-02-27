<template>
  <el-dialog title="选择关联合同" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase sales-contract-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container sales-contract-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;"
                     @change="handleSouceObjectChange($event,true)">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同名称"
                    v-model="listQuery.contractName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                    v-model="listQuery.salerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-date-picker
              v-model="contractDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="签约开始日期"
              end-placeholder="签约结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleContractDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="effectiveDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="生效开始日期"
              end-placeholder="生效结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleEffectiveDateDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="disabledDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="到期开始日期"
              end-placeholder="到期结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleDisabledDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
        </div>
      </div>
      <!-- 查询结果 -->
      <!--销售合同-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="合同编号" width="160">
        </el-table-column>
        <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="84">
        </el-table-column>
        <el-table-column prop="mainDTO.contractAmount" label="合同金额" align="right" width="108">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="160">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="204">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="204">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="400">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="75" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="75" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="78" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.stockOutQty" label="出库数量" width="105" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.customerOrderQty" label="客户订货数量" width="105" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.contractDate" label="签约日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.effectiveDate" label="生效日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.disabledDate" label="到期日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.returnStatus" label="回款状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in returnMoneyStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.returnStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.customerOrderStatus" label="订货状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in orderGoodsStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.stockOutStatus" label="出库状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in storageOutStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.stockOutStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" width="100">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
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
  import {selectPageByItem} from '@/api/erp/sales/bill/salesContract';
  import {getFloat} from '@/utils/util';

  export default {
    name: "salesContractSelector",
    props: ['dialogSelectorVisible', 'sourceBillNo'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          contractName: undefined,
          customerName: undefined,
          salerName: undefined,
          startContractDate: undefined,
          endContractDate: undefined,
          startDisabledDate: undefined,
          endDisabledDate: undefined,
          startEffectiveDate: undefined,
          endEffectiveDate: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          selectType: 1, //其它单据关联合同时查询，只查状态为正常的单据
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'XSHT',
          name: '销售合同',
        }],
        sourceObject: {
          key: 'XSHT',
          name: '销售合同',
        },
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
        selectPageByItem(this.listQuery).then(response => {
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
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0);
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
        this.handleSouceObjectChange(this.sourceObject.key, false);
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.handleSouceObjectChange(this.sourceObject.key, false);
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
          selectType: 1
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
      handleSouceObjectChange(val, clear) {
        if (val == 'XSHT') {
          this.sourceObject.name = '销售合同';
          this.getList();
        } else if (val == 'GZL') {
          this.sourceObject.name = '工作流';
        }
        if (clear) {
          this.selectedRows = [];
        }
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].mainDTO.billNo != this.selectedRows[i].mainDTO.billNo) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
              return;
            }
          }

          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].mainDTO.billNo) {

            this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('submitSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true,
                sourceObject: this.sourceObject
              });
            }).catch(() => {

            });

          } else {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            });
          }

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          });
        }
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
