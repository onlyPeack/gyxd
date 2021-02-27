<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" placeholder="单据状态" clearable style="width: 200px;position:relative;top:-4px;"
                   @change="handleFilter" filterable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" class="filter-item" style="width: 200px;" placeholder="品牌"
                  v-model="listQuery.brand"
                  @keyup.enter.native="handleFilter">
        </el-input>
         <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                    v-model="listQuery.supplierName"
                    @keyup.enter.native="handleFilter">
          </el-input>
        <el-input v-if="choose" class="filter-item" style="width: 200px;" placeholder="标准系列"
                  v-model="listQuery.standardSeries"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" class="filter-item" style="width: 200px;" placeholder="返点系列"
                  v-model="listQuery.companySeries"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
        <div>
         
          <el-date-picker style="position: relative;top:-4px;"
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
        </div>

    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <!--      <el-button type="text" id="import_bill" v-if="false">-->
      <!--        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>-->
      <!--        导入-->
      <!--      </el-button>-->
      <!--      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">-->
      <!--        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>-->
      <!--        导出-->
      <!--      </el-button>-->
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row fit element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose" key="dataTable1" class="result-data-table">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="100" align="center" sortable>
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
      <el-table-column prop="brand" label="品牌" width="100" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="业务员姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="channelTypeCode" label="渠道类型编码"  align="center"></el-table-column>
      <el-table-column prop="channelTypeName" label="渠道类型"  align="center"></el-table-column>
      <el-table-column align="center" label="供应商名称" prop="supplierName" width="120">
      </el-table-column>
      <el-table-column align="center" label="供应商编号" prop="supplierCode" width="120">
      </el-table-column>
      <el-table-column prop="standardSeries" label="标准系列" align="center"></el-table-column>
      <el-table-column prop="companySeries" label="返点系列"  align="center"></el-table-column>
      <el-table-column prop="rebate" label="返点(0-1)"  align="center"></el-table-column>
      <el-table-column prop="yearRebate" label="年终返点" width="80" align="center"></el-table-column>
      <el-table-column prop="monthRebate" label="季月度返点"  align="center"></el-table-column>
      <el-table-column prop="salesRebate" label="促销返点" width="80" align="center"></el-table-column>
      <el-table-column prop="agreementRebate" label="协议返点" width="80" align="center"></el-table-column>
      <el-table-column prop="agreementYearRebate" label="协议年终返点" align="center"></el-table-column>
      <el-table-column prop="agreementMonthRebate" label="协议季月度返点" align="center"></el-table-column>
      <el-table-column prop="agreementSalesRebate" label="协议促销返点"  align="center"></el-table-column>
      <el-table-column prop="note" label="备注" width="80" align="center"></el-table-column>


    </el-table>
    <!--单据-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit v-else @selection-change="handlechangeFun"
              highlight-current-row>
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo">
        <template slot-scope="scope">
          <div class="colum-billno" @click.stop="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据状态" prop="billStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.billStatus*1===1">暂存</span>
          <span v-else-if="scope.row.billStatus*1===2">流转中</span>
          <span v-else-if="scope.row.billStatus*1===3">作废</span>
          <span v-else-if="scope.row.billStatus*1===4">正常</span>
          <span v-else-if="scope.row.billStatus*1===5">驳回</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌" prop="brand"></el-table-column>
      <el-table-column align="center" label="供应商名称" prop="supplierName">
      </el-table-column>
      <el-table-column align="center" label="供应商编号" prop="supplierCode">
      </el-table-column>
      <el-table-column align="center" label="单据时间" prop="billDate"></el-table-column>
      <el-table-column align="center" label="备注" prop="note"></el-table-column>

<!--      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          &lt;!&ndash;          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增客户订货单弹窗 -->
    <policy-series-rebate-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id" @submitSuccess="submitSuccess" @handleClose="handleClose"></policy-series-rebate-form>

    <!--    &lt;!&ndash; 客户订货单详情弹窗 &ndash;&gt;-->
    <!--    <customer-order-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"-->
    <!--                         @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">-->
    <!--    </customer-order-view>-->
    <!-- 采购申请单详情弹窗 -->
    <policy-series-rebate-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                         @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </policy-series-rebate-view>

  </div>
</template>

<script>
  import {addBill,selectPage,selectPageByItem,batchDelBill} from '@/api/erp/purchase/bill/policySeriesRebate';
  import {getFloat} from '@/utils/util';

  export default {
    name: "policyRegister",
    components: {
      'policySeriesRebateForm': () => import('./policySeriesRebateForm'),
      'policySeriesRebateView': () => import('./policySeriesRebateView'),
      // 'customer-order-view': () => import('./customerOrderView')
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          salerCode: undefined,
          salerName: undefined,
          customerName: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          source: undefined,
          salesType: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startDeliverDate: undefined,
          endDeliverDate: undefined,
          billStatus: undefined,
          standardSeries:undefined,
          companySeries:undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        source: [{
          value: 0,
          label: '商城订单'
        }, {
          value: 1,
          label: '线下订单'
        }],
        salesType: [{
          value: 0,
          label: '现货'
        }, {
          value: 1,
          label: '期货'
        }],
        billDate: '',
        deliverDate: '',
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
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          if (this.choose == false) {
            tHeader = ['单据日期', '单据编号', '制单人工号', '制单人姓名', '业务员工号', '业务员姓名', '订货单位', '币别', '金额', '价税合计', '实付金额', '单据状态', '备注', '开票状态', '出库状态', '变更次数'];
            filterVal = ['crtTime', 'billNo', 'crtUserNo', 'crtUserName', 'salerCode', 'salerName', 'customerName', 'currencyId', 'billAmount', 'taxBillAmount', 'billActuallyRebateAmount', 'billStatus', 'note', 'invoiceStatus', 'storageStatus', 'changeCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据日期', '单据编号', '制单人工号', '制单人姓名', '业务员工号', '业务员姓名', '订货单位', '币别', '金额', '价税合计', '实付金额', '单据状态', '备注', '开票状态', '商品编码', '商品名称', '订货号', '规格型号', '单位', '数量', '单价', '金额', '税额', '含税单价', '价税合计', '采购订货数量', '发货数量', '出库数量', '未出库数量', '出库金额', '未出库金额', '出库状态', '变更次数', '开票数量'];
            filterVal = ['crtTime', 'billNo', 'crtUserNo', 'crtUserName', 'salerCode', 'salerName', 'customerName', 'currencyId', 'billAmount', 'taxBillAmount', 'billActuallyRebateAmount', 'billStatus', 'note', 'invoiceStatus', 'skuNo', 'skuName', 'itemNo', 'specifications', 'unit', 'qty', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'orderQty', 'deliverQty', 'stockOutSaleQty', 'notStockOutSaleQty', 'stockInSaleAmount', 'notStockInSaleAmount', 'storageStatus', 'changeCount', 'purchaseInvoiceQty'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '客户订货单');
          this.downloadLoading = false;
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
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
            if (column.property == 'taxBillAmount' || column.property == 'taxAmount'
              || column.property == 'stockInSaleAmount' || column.property == 'notStockInSaleAmount'
              || column.property == 'billActuallyRebateAmount' || column.property == 'orderQty' || column.property == 'purchaseStockInQty' || column.property == 'stockOutSaleQty' || column.property == 'notStockOutSaleQty') {
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
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      getListByItem() {
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
      handleFilter() {
        this.listLoading = true;
        if (this.choose == true) {
          this.getListByItem();
        } else {
          this.getList();
        }
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
        }
        this.billDate = undefined;
        this.deliverDate = undefined;
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
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
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
        });
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess(data) {
        if(data.type==='policySeriesRebateForm'){
          if(data.flag){
            this.showSuccess('创建返点系列管理成功!')
          }
        }
      },

      init(){
        this.dialogFormVisible = false
        if (this.choose) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },

      /**
       * 成功处理方法
       * @param message 成功提示信息
       */
      showSuccess(message){
        this.$message.success(message)
        this.init()
      },

      /**
       * 错误处理方法
       * @param message 错误信息
       * @param code 错误码
       */
      showError(message,code){
        if(Number(code)===401){
          this.$message.warning(message||'操作失败')
        }else{
          this.$message.error(message||'操作失败')
        }
        this.isLoading=false
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1])
        }
        this.selectedRows = val;
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
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleSwitch() {
        this.listQuery.page = 1;
        if (this.choose) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.mainDTO.id;//详情
        }
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleOpenDetailOrForm(row) {
        var billStatus;
        if (row.billStatus) {
          billStatus = row.billStatus;
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
          }
        }
        if (billStatus && billStatus == 1) {
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.mainDTO.id;//详情
          }
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
        }
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
      deliverDate(value) {
        if (value == null) {
          this.listQuery.startDeliverDate = undefined;
          this.listQuery.endDeliverDate = undefined;
        }
      },
    }
  }
</script>

