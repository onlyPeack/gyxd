<template>
  <div class="full-purchase bill-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" style="position: relative;top:-4px;width: 200px;"
                   @change="handleFilter" class="input-width" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调往客户订单 "
                  v-model="listQuery.customerOrderNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
         <el-select
                  v-model="listQuery.allocationType"
                  placeholder="调拨类型"
                  clearable
                  style="width: 200px"
                  class="filter-item"
                  filterable
                >
                  <el-option
                    v-for="item in sourceOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库订单号 "
                  v-model="listQuery.lockingOrderNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号 "
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <div></div>
        <el-date-picker style="position: relative;top: -4px;width: 403px"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="单据开始日期"
                        end-placeholder="单据结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleCrtTimeSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="调往客户名称"-->
                  <!--v-model="listQuery.customerName"-->
                  <!--@keyup.enter.native="handleFilter">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="调出货主名称"-->
                  <!--v-model="listQuery.shipperName"-->
                  <!--@keyup.enter.native="handleFilter">-->
        <!--</el-input>-->
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  v-model="listQuery.goodsName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌名称"
                  v-model="listQuery.brandName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                  v-model="listQuery.series"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                  v-model="listQuery.rebateSeries"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  v-model="listQuery.itemNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  v-model="listQuery.specModel"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <!--<el-date-picker style="position: relative;top: -4px;"-->
        <!--v-model="crtTime"-->
        <!--type="daterange"-->
        <!--align="right"-->
        <!--unlink-panels-->
        <!--range-separator="至"-->
        <!--start-placeholder="单据开始日期"-->
        <!--end-placeholder="单据结束日期"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--@change="handleCrtTimeSelect"-->
        <!--:picker-options="pickerOptions">-->
        <!--</el-date-picker>-->
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>

    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <el-button type="text" id="import_bill" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
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
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.crtUserName" label="制单人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.customerName" label="调往客户名称" width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.shipperName" label="调出货主名称" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.customerOrderNo" label="调往客户订单" align="center" width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.lockingOrderNo" label="锁库订单号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.totalTransferAmt" label="调拨总金额" align="right" width="120">
      </el-table-column>
      <el-table-column prop="houseCode" label="仓库编码" width="120" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="goodsCode" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌"  width="150">
      </el-table-column>
      <el-table-column prop="series" label="标准系列" width="150">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="150">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" v-slot="{row}">
        <span style="color: #2da3fb;cursor: pointer" @click="showGoodsDetail(row)">{{row.itemNo}}</span>
<!--        <span>{{row.itemNo}}</span>-->
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="180" v-slot="{row}">
        <span style="color: #2da3fb;cursor: pointer" @click="showGoodsDetail(row)">{{row.specModel}}</span>
<!--        <span>{{row.specModel}}</span>-->
      </el-table-column>
      <el-table-column prop="unit" label="计量单位" align="center" width="80">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="transferPrice" label="平台调拨价" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="sysTransferPrice" label="系统调拨价" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="costPrice" label="平均成本价" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="transferQty" label="调拨数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="transferAmt" label="调拨金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column label="调拨利润" prop="__transferProfit" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="alreadySettleQty" label="已结算数量" align="right" width="90" class-name="col-required">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" align="center" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="150">
      </el-table-column>
      <el-table-column prop="customerCode" label="调往客户编码" width="150">
      </el-table-column>
      <el-table-column prop="customerName" label="调往客户名称" width="180">
      </el-table-column>
      <el-table-column prop="customerOrderNo" label="调往客户订单" align="center" width="180">
      </el-table-column>
      <el-table-column prop="shipperCode" label="调出货主编码" width="150">
      </el-table-column>
      <el-table-column prop="shipperName" label="调出货主名称" width="150">
      </el-table-column>
      <el-table-column prop="lockingOrderNo" label="锁库订单号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="allocationType" label="调拨类型" width="80" align="center">
        <template slot-scope="scope">
          <span v-for="item in allocationTypeOptions">
            <span v-if="scope.row.allocationType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalTransferAmt" label="调拨总金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="alreadySettleAmt" label="已结算金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="settleAmtForAccept" label="承兑结算金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="settleAmtForOnline" label="网银结算金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="alreadyBillingAmt" label="已开票金额" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" width="150" align="center" sortable>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增平台调拨单弹窗 -->
    <platform_allocation_order_form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                             @submitSuccess="submitSuccess" @handleClose="handleClose">
    </platform_allocation_order_form>

    <!-- 平台调拨单详情弹窗 -->
    <platform_allocation_order_view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                             @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </platform_allocation_order_view>

    <el-dialog :visible.sync="isShowGoodsDetail" width="70%" class="formDialog goodsDetailDialog" title="商品信息">

      <el-table :data="goodsItems" border highlight-current-row width="100%" class="tb-edit">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="skuName" width="140" sortable></el-table-column>
        <el-table-column label="品牌" prop="brandName" width="100" sortable></el-table-column>
        <el-table-column label="标准系列" prop="seriesName" width="110" ></el-table-column>
        <el-table-column label="返点系列" prop="rebateSeries" width="110" ></el-table-column>
        <el-table-column label="规格型号" prop="specifications" sortable width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="订货号" prop="itemNo" width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column label="面价" prop="retailPrice" align="right" class-name="col-required" width="100">
          <template slot-scope="scope">{{Number(scope.row.retailPrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column label="平台调拨价" prop="allocationPrice" align="right" class-name="col-required" width="120"
                         sortable>
          <template slot-scope="scope">{{Number(scope.row.allocationPrice).toFixed(4)}}</template>
        </el-table-column>
<!--        <el-table-column label="调拨金额" prop="allocationAmount" align="right" class-name="col-required" width="120"-->
<!--                         sortable>-->
<!--          <template slot-scope="scope">{{Number(scope.row.allocationPrice * scope.row.qty).toFixed(4)}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="成本价" prop="costPrice" align="right" class-name="col-required" width="100" sortable>
          <template slot-scope="scope">{{Number(scope.row.costPrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column label="调拨数量" prop="qty" align="center" width="120" sortable>
        </el-table-column>
        <el-table-column label="仓库" prop="warehouseName" width="100" sortable></el-table-column>
        <el-table-column label="仓位" prop="positionName" width="90"></el-table-column>
        <el-table-column label="批次号" prop="batchNumber" width="170"></el-table-column>
        <el-table-column label="供应商编号" prop="supplierCode" width="150"></el-table-column>
        <el-table-column label="入库时间" prop="crtTime" width="150"></el-table-column>
      </el-table>


      <!-- 弹窗底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowGoodsDetail=false">关 闭</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import {batchDelBill, selectPage, selectPageByItem,selectDetailItemById} from '@/api/erp/wms/bill/platformAllocation';
  import {getFloat} from '@/utils/util';

  export default {
    name: "platformAllocationOrderList",
    components: {
      'platform_allocation_order_form': () => import('./platform_allocation_order_form'),
      'platform_allocation_order_view': () => import('./platform_allocation_order_view')
    },
    data() {
      return {
        downloadLoading: false,
        isShowGoodsDetail:false,
        list: [],
        total: undefined,
        listLoading: true,
        allocationTypeOptions: [
          {
            value: 0,
            label: '调出'
          },
          {
            value: 1,
            label: '调入'
          }
        ],
        sourceOption:[{
          value: "0",
          label: "调出"
        },
        {
          value: "1",
          label: "调入"
        }],
        listQuery: {
          page: 1,
          limit: 10,
          billNo: '',
          crtUserName: '',
          lockingOrderNo: '',
          customerOrderNo: '',
          crtUserNo: '',
          shipperName: '',
          customerName: '',
          goodsCode: '',
          goodsName: '',
          itemNo: '',
          specModel: '',
          brandName: '',
          allocationType:'',
          series: '',
          startCrtTime: '',
          endCrtTime: '',
          billStatus: undefined,
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        crtTime: '',
        goodsItems:[],//商品信息存储
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
            tHeader = ['单据编号', '单据状态', '制单人', '调往客户编码', '调往客户名称', '调往客户订单', '调出货主编码', '调出货主名称', '锁库订单号', '调拨类型', '调拨总金额', '已结算金额', '承兑结算金额', '网银结算金额', '已开票金额', '流程结束时间', '单据日期', '备注'];
            filterVal = ['billNo', 'billStatus', 'crtUserName', 'customerCode', 'customerName', 'customerOrderNo', 'shipperCode', 'shipperName', 'lockingOrderNo', 'allocationType', 'totalTransferAmt', 'alreadySettleAmt', 'settleAmtForAccept', 'settleAmtForOnline', 'alreadyBillingAmt', 'finishTime', 'crtTime', 'note'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据编号', '单据状态', '制单人', '调往客户名称', '调出货主名称', '调拨总金额', '仓库编码', '仓位编码', '库存类型', '商品名称', '商品编码', '品牌', '标准系列','返点系列', '订货号', '规格型号', '计量单位', '面价', '平台调拨价', '系统调拨价', '库存数量', '调拨数量', '调拨金额', '已结算数量', '备注', '单据日期'];
            filterVal = ['billNo', 'billStatus', 'crtUserName', 'customerName', 'shipperName', 'totalTransferAmt', 'houseCode', 'locationCode', 'stockType', 'goodName', 'goodCode', 'brandName', 'series', 'rebateSeries','itemNo', 'specModel', 'unit', 'retailPrice', 'transferPrice', 'sysTransferPrice', 'qty', 'transferQty', 'transferAmt', 'alreadySettleQty', 'note', 'crtTime'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '平台调拨单');
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
            if (column.property == 'totalTransferAmt' || column.property == 'alreadySettleAmt' || column.property == 'settleAmtForAccept'
              || column.property == 'settleAmtForOnline' || column.property == 'alreadyBillingAmt' || column.property == 'qty'
              || column.property == 'transferQty' || column.property == 'transferPrice'|| column.property == 'sysTransferPrice'|| column.property == 'transferAmt'||column.property=='__transferProfit') {
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
          for (let i = 0; i <this.list.length ; i++) {
            //计算调拨利润   调拨利润=(系统调拨价-平均成本价) * 数量
            this.list[i].__transferProfit=this.accMulti(this.accAdd(this.list[i].sysTransferPrice,-this.list[i].costPrice),this.list[i].transferQty).toFixed(4)
          }
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
        this.listQuery.page = 1;
        this.listQuery.billNo = undefined;
        this.listQuery.lockingOrderNo = undefined;
        this.listQuery.customerOrderNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.customerName = undefined;
        this.listQuery.shipperName = undefined;
        this.listQuery.goodsCode = undefined;
        this.listQuery.goodsName = undefined;
        this.listQuery.brandName = undefined;
        this.listQuery.allocationType = undefined;
        this.listQuery.itemNo = undefined;
        this.listQuery.specModel = undefined;
        this.listQuery.series = undefined;
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.crtTime = null;
        this.listQuery.billStatus = undefined;
        delete this.listQuery.rebateSeries
        this.handleFilter()
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
        this.dialogFormVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
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
        this.id = this.selectedRows[0].id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleSwitch() {
        this.listQuery.page = 1;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleCrtTimeSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00'
        this.listQuery.endBillDate = val[1] + ' 23:59:59'
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
      },

      /**
       * 展示商品明细
       */
      showGoodsDetail(row){
        this.isShowGoodsDetail=true
        let params={}
        if (row.billNo.indexOf('PTDBD')>-1){
          params.skuNo=row.goodsCode
          params.batchNumber=row.billNo
        }else{
          params.id=row.iid
        }
        selectDetailItemById(params).then(res=>{
            if(Number(res.code)===2000||Number(res.code)===200){
              this.goodsItems=res.data?[res.data]:[]
            }else{
              this.$message.error('查询商品明细失败!请检查网络情况或联系管理员!')
            }
        })
      }
    },
    watch: {
      crtTime(value) {
        if (value == null) {
          this.listQuery.startBillDate = '';
          this.listQuery.endBillDate = '';
        }
      },
    }
  }
</script>
<style>
  .goodsDetailDialog{
    height: auto!important;
    margin-top: 10vh!important;
  }
  .goodsDetailDialog .el-dialog{
    height: auto!important;
  }
  .goodsDetailDialog .el-dialog__body{
    height: auto!important;
  }
  .goodsDetailDialog .el-dialog__footer{
    position: unset;
  }
</style>

