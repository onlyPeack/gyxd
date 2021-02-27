<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="true" :before-close="handleSelectorClose" class="billSelectorDialog dropDialog">
    <div class="full-purchase purchase-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-goods-release-filter" v-if="type != 3">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号" size="small"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称" size="small"
                    v-model="listQuery.warehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人" size="small"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码" size="small"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <span @click="queryVisibleChange" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                      v-model="listQuery.brandName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                      v-model="listQuery.seriesName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
        </div>
      </div>
      <!-- 闲置查询 -->
      <div class="filter-container purchase-goods-release-filter" v-if="type == 3">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订单号"
                    v-model="lockedQuery.masterOrderSn"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="lockedQuery.name"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="lockedQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                    v-model="lockedQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="lockedQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="lockedQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="成色"
                    v-model="lockedQuery.percentage"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                    v-model="lockedQuery.supplierCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                    v-model="lockedQuery.warehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="lockedQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
      </div>

      <!-- 查询结果(期货/调拨) -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" v-if="type != 3"
                @row-click="chooseData" @selection-change="handlechangeFun" size="mini" @row-dblclick="chooseData"
                highlight-current-row element-loading-text="正在查询中。。。"
                class="result-data-table">
        <el-table-column width="90" align="center">
          <template slot="header" slot-scope="scope">
            <el-button @click="batchChoose">选入</el-button>
          </template>
          <template slot-scope="scope">
            <span class="el-icon-plus" style="cursor: pointer;color:#409EFF;" @click="chooseData(scope.row)"></span>
          </template>

        </el-table-column>
        <el-table-column type="selection" align="center">

        </el-table-column>
        <!--        <el-table-column type="selection" width="60">-->
        <!--        </el-table-column>-->
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="200">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="200">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="200">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="200">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="300">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100" align="center">
        </el-table-column>
        <el-table-column prop="canUseQty" label="可用数量" align="right" width="100" class-name="col-required">
          <template slot-scope="scope" v-if="scope.row">
            {{scope.row.qty * 1 - scope.row.purchasedQty * 1}}
          </template>
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="发布单价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="publishType" label="发布类型" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.mainDTO.publishType == '0'">GH</span>
            <span v-if="scope.row.mainDTO.publishType == '1'">调拨</span>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="发布折扣" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="deliveryDate" label="货期" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编号" width="204">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="200">
        </el-table-column>
        <el-table-column prop="channelType" label="渠道类型" width="100">
          <template slot-scope="scope">
            <span v-for="(item,index) in channelTypeOptions" :key="index">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.channelType ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.channelType" label="渠道类型编号" align="right" width="120">
        </el-table-column>
        <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="validityPeriod" label="信息有效期" width="150">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="180">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="180">
        </el-table-column>
      </el-table>
      <!-- 查询结果(闲置) -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" v-if="type == 3"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                class="result-data-table">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" width="200">
        </el-table-column>
        <el-table-column prop="masterOrderSn" label="订单号" width="200">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="200">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="200">
        </el-table-column>
        <el-table-column prop="specModel" label="规格型号" width="200">
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="count" label="本次锁库数量" align="right" width="150">
        </el-table-column>
        <el-table-column prop="orderQty" label="已采购数量" align="right" width="150">
        </el-table-column>
        <el-table-column label="本次可采购数量" align="right" width="150">
          <template slot-scope="scope">
            {{scope.row.count - scope.row.orderQty}}
          </template>
        </el-table-column>
        <el-table-column prop="minPack" label="起订量" align="right" width="150">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <!-- <el-table-column prop="supplyPrice" label="供货价" align="right" width="150" class-name="col-required">
        </el-table-column> -->
        <el-table-column prop="releasePrice" label="发布价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="discount" label="折扣" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="percentage" label="成色" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="productionDate" label="生产日期" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="warehouseAdress" label="仓库地址" align="right" width="150" class-name="col-required">
          <template slot-scope="scope">
            <div>
              {{scope.row.province === scope.row.city ? scope.row.province + scope.row.region : scope.row.province +
              scope.row.city + scope.row.region}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="warranty" label="质保期" width="180">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="180">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="180">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <div style="height: 30px" v-if="type != 3"></div>

      <!-- 选入放置表格 -->
      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row class="result-data-table" :height="450"
                v-if="type != 3">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="200">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="200">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="200">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="200">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="300">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100" align="center">
        </el-table-column>
        <el-table-column prop="canUseQty" label="可用数量" align="right" width="100" class-name="col-required">
          <template slot-scope="scope" v-if="scope.row">
            {{scope.row.qty * 1 - scope.row.purchasedQty * 1}}
          </template>
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="发布单价" align="right" width="150" class-name="col-required">
        </el-table-column>
        <el-table-column prop="publishType" label="发布类型" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.mainDTO.publishType == '0'">GH</span>
            <span v-if="scope.row.mainDTO.publishType == '1'">调拨</span>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="发布折扣" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="deliveryDate" label="货期" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编号" width="204">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="200">
        </el-table-column>
        <el-table-column prop="channelType" label="渠道类型" width="100">
          <template slot-scope="scope">
            <span v-for="(item,index) in channelTypeOptions" :key="index">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.channelType ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.channelType" label="渠道类型编号" align="right" width="120">
        </el-table-column>
        <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="validityPeriod" label="信息有效期" width="150">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="180">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="180">
        </el-table-column>

      </el-table>


    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPageByItem, selectLockRecordPage} from '@/api/erp/purchase/bill/purchaseGoodsRelease';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseGoodsReleaseSelector",
    props: ['dialogSelectorVisible', 'warehouseName', 'type', 'customerCode'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listDrop: [],
        listQuery: {
          page: 1,
          limit: 5,
          billNo: '',
          warehouseName: '',
          crtUserName: '',
          skuNo: '',
          skuName: '',
          publishType: this.type == '2' ? 1 : 0,
          specifications: '',
          itemNo: '',
          selectType: 1,
        },
        lockedQuery: {
          page: 1,
          limit: 20,
          customerCode: ''
        },
        selectedRows: [],
        queryVisible: false,
        channelTypeOptions: [{
          value: '01',
          label: '厂家'
        }, {
          value: '02',
          label: '厂家库存单'
        }, {
          value: '03',
          label: '厂家促销'
        }, {
          value: '04',
          label: '厂家促销第一季度'
        }, {
          value: '05',
          label: '厂家促销第二季度'
        }, {
          value: '06',
          label: '厂家促销第三季度'
        }, {
          value: '07',
          label: '厂家促销第四季度'
        }]
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      if (this.type == 3 && this.customerCode) {
        this.lockedQuery.customerCode = this.customerCode
      }
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
        if (document.getElementsByClassName('purchase-goods-release-filter')[0]) {
          var height = document.getElementsByClassName('purchase-goods-release-filter')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        if (this.type != 3) {
          selectPageByItem(this.listQuery).then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          })
        } else {
          selectLockRecordPage(this.lockedQuery).then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          })
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
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
        this.lockedQuery = {
          page: 1,
          limit: 20,
        }
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSubmit() {
        if (this.type != 3) {
          this.selectedRows=this.listDrop
        }
        //console.log("检查");
        if (this.selectedRows.length > 1) {
          for (let i in this.selectedRows) {
            if (i > 0) {
              if (this.type != 3) {
                if (this.selectedRows[0].skuNo == this.selectedRows[i].skuNo) {
                  this.$message.error('您选择的数据因订货号[' + this.selectedRows[0].itemNo + ']一致，不能执行调入操作，请重新选择');
                  return;
                }
                if (this.selectedRows[0].mainDTO.warehouseName != this.selectedRows[i].mainDTO.warehouseName) {
                  this.$message.error('您选择的数据因到货仓库[' + this.selectedRows[0].mainDTO.warehouseName + ']数据不一致，不能执行调入操作，请重新选择');
                  return;
                }
              }
            }
          }
        }

        if (this.type != 3) {
          //console.log('进来了');
          if (this.warehouseName && this.warehouseName != this.selectedRows[0].mainDTO.warehouseName) {

            this.$confirm('您选择的数据因[到货仓库]和已选择的到货仓库不一致，切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('submitSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true
              });
            }).catch(() => {

            });

          } else {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false
            });
          }
        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false
          });
        }
      },

      /**
       * 下方存储表格移除数据
       * @param index
       */
      removeData(index) {
        this.listDrop.splice(index, 1)
      },

      /**
       * 表格双击选中添加进下方存储表格
       * @param row
       */
      chooseData(row) {

        for (let i = 0; i < this.listDrop.length; i++) {
          if (this.type != 3) {
            if (row.skuNo == this.listDrop[i].skuNo) {
              this.$message.error('您选择的数据因订货号[' + this.listDrop[i].itemNo + ']一致，不能执行调入操作，请重新选择');
              return;
            }
            if (row.mainDTO.warehouseName != this.listDrop[i].mainDTO.warehouseName) {
              this.$message.error('您选择的数据因到货仓库[' + this.listDrop[i].mainDTO.warehouseName + ']数据不一致，不能执行调入操作，请重新选择');
              return;
            }
          }
        }
        this.listDrop.push(row)
        let hash = {}
        this.listDrop = this.listDrop.reduce(function (item, next) {
          hash[next.id] ? '' : hash[next.id] = true && item.push(next);
          return item
        }, [])
      },

      batchChoose(){
        if (this.selectedRows.length > 0) {
          if (this.selectedRows.length > 1) {
            for (let i in this.selectedRows) {
              if (i > 0) {
                if (this.type != 3) {
                  if (this.selectedRows[0].skuNo == this.selectedRows[i].skuNo) {
                    this.$message.error('您选择的数据因订货号[' + this.selectedRows[0].itemNo + ']一致，不能执行调入操作，请重新选择');
                    return;
                  }
                  if (this.selectedRows[0].mainDTO.warehouseName != this.selectedRows[i].mainDTO.warehouseName) {
                    this.$message.error('您选择的数据因到货仓库[' + this.selectedRows[0].mainDTO.warehouseName + ']数据不一致，不能执行调入操作，请重新选择');
                    return;
                  }
                }
              }
            }
          }
          for (let i = 0; i <this.selectedRows.length ; i++) {
            this.chooseData(this.selectedRows[i])
          }
        }
      }
    }
  }
</script>
<style>
  .dropDialog>.el-dialog{
    height: auto!important;
  }
  .dropDialog  .el-dialog__footer{
    bottom: -45px;
  }
</style>
