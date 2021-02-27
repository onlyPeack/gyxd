<template>
  <div class="full-purchase bill-container">
    <el-tabs  v-model="activity">
      <el-tab-pane label="制单" name="first">
        <!-- 新增弹窗 -->
        <manual-order-form :id="id" @submitSuccess="submitSuccess" @handleClose="handleClose"></manual-order-form>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="发票号码"
                      v-model="listQuery.invoiceNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                      v-model="listQuery.crtUserNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                      v-model="listQuery.crtUserName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员部门"
                      v-model="listQuery.departName"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
          <div class="query-container">
            <div>
              <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                        v-model="listQuery.skuName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-select v-if="choose" v-model="listQuery.sp3" class="filter-item" placeholder="渠道类型" clearable>
                <el-option v-for="item in sp3Option" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                        v-model="listQuery.brandName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="系列"
                        v-model="listQuery.seriesName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                        v-model="listQuery.specifications"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                        v-model="listQuery.itemNo"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-date-picker
                style="position: relative;top:-3px;"
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
        <div style="margin-top: 1px;">
          <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
          <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
            <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
            导出
          </el-button>
          <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                     @change="handleSwitch"></el-switch>
        </div>

        <!-- 查询结果 -->
        <!--详情-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm" >
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column type="index" align="center">
          </el-table-column>
          <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" width="180" sortable>
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                {{scope.row.mainDTO.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="100">
            <template slot-scope="scope">
              <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
                <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createType" label="下单方式" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="item in createOption">
                <span v-if="item.value==scope.row.mainDTO.createType">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sp3" label="渠道类型" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sp3 == '0'">现货</span>
              <span v-if="scope.row.sp3 == '1'">期货</span>
              <span v-if="scope.row.sp3 == '2'">调拨</span>
            </template>
          </el-table-column>
          <el-table-column prop="mainDTO.customer" label="客户编号" width="120">
          </el-table-column>
          <el-table-column prop="mainDTO.deliverDetailAddress" label="收货地址" width="120">
          </el-table-column>
          <el-table-column prop="mainDTO.memberUsername" label="用户账号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="mainDTO.receiverName" label="收货人" align="center" width="120">
          </el-table-column>
          <el-table-column prop="mainDTO.salesmanName" label="客服账号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="deliveryWarehouse" label="仓库" align="center" width="120">
          </el-table-column>
          <el-table-column prop="productBrand" label="品牌" align="center" width="120">
          </el-table-column>
          <el-table-column prop="productBrand" label="品牌" align="center" width="120">
          </el-table-column>
          <el-table-column prop="productName" label="品名" align="center" width="120">
          </el-table-column>
          <el-table-column prop="productSeries" label="系列" align="center" width="120">
          </el-table-column>
          <el-table-column prop="retailPrice" label="面价" align="center" width="120">
          </el-table-column>
          <el-table-column prop="allocationDiscount" label="调拨折扣" align="center" width="120">
          </el-table-column>
          <el-table-column prop="allocationPrice" label="调拨价" align="center" width="120">
          </el-table-column>

          <el-table-column prop="productPrice" label="销售价" align="center" width="120">
          </el-table-column>
          <el-table-column prop="productPrice" label="购买数量" align="center" width="120">
          </el-table-column>
          <el-table-column prop="referencePrice" label="参考价" align="center" width="120">
          </el-table-column>
          <el-table-column prop="sp1" label="订货号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="sp2" label="暂存型号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="subtotal" label="价税合计" align="center" width="100">
          </el-table-column>
          <el-table-column prop="crtUserNo" label="业务员工号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="crtUserName" label="业务员" align="center" width="100">
          </el-table-column>
          <el-table-column prop="departName" label="业务员部门" align="center" width="100">
          </el-table-column>
          <el-table-column prop="crtTime" label="单据日期" align="center" width="150" sortable>
          </el-table-column>
        </el-table>
        <!--单据-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm" >
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column type="index" align="center">
          </el-table-column>
          <el-table-column prop="billNo" label="单据编号" align="center" width="160" sortable>
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
                {{scope.row.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="单据状态" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="item in statusOptions">
                <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="customer" label="客户编号" width="120">
          </el-table-column>
          <el-table-column prop="orderSn" label="商城主订单号" width="120">
          </el-table-column>
          <el-table-column prop="receiverName" label="收货人" align="center" width="120">
          </el-table-column>
          <el-table-column prop="deliverDetailAddress" label="收货地址" width="120">
          </el-table-column>
          <el-table-column prop="receiverPhone" label="联系电话" align="center" width="120">
          </el-table-column>
          <el-table-column prop="distributionMode" label="寄件方式" width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in distributionOptions" :key="index">
                <span v-if="item.value==scope.row.distributionMode">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isReplaceDelivery" label="是否代发" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.isReplaceDelivery == 0">否</span>
              <span v-if="scope.row.isReplaceDelivery == 1">是</span>
            </template>
          </el-table-column>
          <el-table-column prop="memberUsername" label="用户账号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="salesmanName" label="客服账号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="salesmanId" label="客服ID" align="center" width="120">
          </el-table-column>
          <el-table-column prop="createType" label="下单方式" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="item in createOption">
                <span v-if="item.value==scope.row.createType">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="crtUserName" label="制单人" width="120">
          </el-table-column>
          <el-table-column prop="crtUserNo" label="制单人工号" width="120">
          </el-table-column>
          <el-table-column prop="billDate" label="单据日期" align="center" width="150" sortable>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.billStatus == 2 && scope.row.billNo && scope.row.billNo.length > 0" style="line-height: 28px;font-size:14px;cursor: pointer;color: rgb(64,158,255)" @click="handleDownloadContract(scope.row.billNo,scope.row.customer)">下载合同</span>
              <a v-if="scope.row.billStatus == 4 && scope.row.fileUrl && scope.row.fileUrl.length > 0" style="line-height: 28px;font-size:14px;cursor: pointer;color: rgb(64,158,255)" :href="scope.row.fileUrl" target="_blank">查看合同</a>
              <!-- <span v-if="scope.row.billStatus == 4" style="line-height: 28px;font-size:14px;cursor: pointer;color: rgb(64,158,255)" @click="handleViewContract(scope.row.fileUrl)"> 查看合同</span> -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </el-tab-pane>
    </el-tabs>


    <!-- 详情弹窗 -->
    <manual-order-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                               @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </manual-order-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/mall/oms/order/manualOrder';
  import {getFloat} from '@/utils/util';

  export default {
    name: "sales-return-invoice-list",
    components: {
      'manual-order-form': () => import('./manualOrderFormCopy'),
      'manual-order-view': () => import('./manualOrderView')
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        id:'',
        listLoading: true,
        activity:'second',
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          invoiceNo: undefined,
          crtUserNo: undefined,
          customerName:undefined,
          billStatus:undefined,
          departName:undefined,
          itemNo:undefined,
        },
        createOption:[
          {
            value: "0",
            label: "商城订单"
          },
          {
            value: "1",
            label: "手工订单"
          },
        ],
        sp3Option:[
          {
            value: "0",
            label: "现货"
          },
          {
            value: "1",
            label: "期货"
          },
          {
            value: "2",
            label: "调拨"
          },
        ],
      distributionOptions: [
        {
          value: "0",
          label: "快递运输"
        },
        {
          value: "1",
          label: "运费到付"
        },
        {
          value: "2",
          label: "货物自提"
        },
        {
          value: "3",
          label: "货运物流"
        }
      ],
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: undefined,
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
      handleViewContract(url) {
        window.location.href = url
      },
      handleDownloadContract(orderSn,customerCode) {
        window.location.href = window.location.origin + `/api/mall/oms-order-manual/download?billNo=${orderSn}&customerCode=${customerCode}`
      },
      handleDownload() {
        if (this.selectedRows.length < 1) {
          this.$notify.warning('请选择要导出的单据');
          return;
        }

        this.downloadLoading = true;
        var selectedRows = this.selectedRows == undefined || this.selectedRows == null ? [] : this.selectedRows;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(selectedRows));
          if (this.choose == false) {
            tHeader = ['单据编号', '单据状态', '发票号码', '发票类型', '退票金额', '客户名称', '纳税人识别号', '开户银行', '银行账号', '关联单据', '退票原因', '单据日期', '制单人'];
            filterVal = ['billNo', 'billStatus', 'invoiceNo', 'invoiceType', 'invoiceAmount', 'customerName', 'taxpayerNumber', 'bankName', 'bankAccount', 'sourceBillNo', 'note', 'billDate', 'crtUserName'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据编号', '单据状态', '发票号码', '发票类型', '退票金额', '客户名称', '单据日期', '制单人', '商品名称', '规格型号', '单位', '开票数量', '退票数量', '单价', '金额', '税额', '含税单价', '价税合计', '退票原因'];
            filterVal = ['billNo', 'billStatus', 'invoiceNo', 'invoiceType', 'invoiceAmount', 'customerName', 'billDate', 'crtUserName', 'skuName', 'specifications', 'unit', 'invoiceQty', 'qty', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售退票');
          this.downloadLoading = false;
        })
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
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
            if (column.property == 'invoiceAmount' || column.property == 'amount'
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
          this.listQuery.page = 1;
          this.getListByItem();
        } else {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleCreate() {
        this.id = '';
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = undefined,
        this.listQuery.crtUserName = undefined,
        this.listQuery.customerName = undefined,
        this.listQuery.skuNo = undefined,
        this.listQuery.itemNo = undefined,
        this.listQuery.skuName = undefined,
        this.listQuery.specifications = undefined,
        this.billDate = undefined,
        this.listQuery.invoiceNo = undefined,
        this.listQuery.billStatus = undefined,
        this.listQuery.crtUserNo = undefined,
        this.listQuery.departName = undefined;
        this.listQuery.sp3 = undefined;
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
            });
        });
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        //this.dialogFormVisible = false;
        // if (this.choose == true) { //详情
        //   this.getListByItem();
        // } else { //单据
        //   this.getList();
        // }
        this.$router.replace({
          path: '/refresh',
          query: {
            date: Date.now()
          }
        })
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1]);
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
        if(!!this.choose) {
          this.id = this.selectedRows[0].mainDTO.id
        } else {
          this.id = this.selectedRows[0].id
        }
        // this.dialogStatus = 'update';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.mainDTO.id;//详情
        }
        // this.dialogFormVisible = true
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
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
        //console.log('billStatus');
        //console.log(billStatus);
        if (billStatus && billStatus == 1) {
          //console.log('打开编辑页');
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.mainDTO.id;//详情
          }
          //this.dialogStatus = 'update';
          //this.dialogFormVisible = true;
          this.activity='first'
        } else {
          console.log('打开详情');
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
      }
    }
  }
</script>
