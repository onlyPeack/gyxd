<template>
  <div class="full-purchase bill-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="到货仓库"
                  v-model="listQuery.warehouseName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
      </div>
      <div class="query-container">
        <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
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
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight" show-summary
              :summary-method="getSummaries"
              v-if="choose" key="dataTable1" class="result-data-table"
              :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="120">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="120">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="180"></el-table-column>
      <el-table-column prop="qty" label="发布数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="purchasedQty" label="已申请数量" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="canUseQty" label="可用数量" align="right" width="100" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.qty) - Number(scope.row.purchasedQty)}}
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="price" label="发布单价" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="discount" label="发布折扣" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期" width="60" class-name="col-required" align="center">
      </el-table-column>
      <el-table-column prop="amountPrice" label="发布总额" width="100" class-name="col-required" align="center">
      </el-table-column>
      <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="100">
      </el-table-column>
      <el-table-column prop="publishType" label="发布类型" width="100" align="center">
        <template slot-scope="scope">
            <span v-for="item in typeOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.publishType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" align="right" width="100">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="right" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierWarehouse" label="供应商仓库" align="right" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierWarehouseAddress" label="供应商仓库地址" align="right" width="120">
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="100" align="center">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="120" align="center">
      </el-table-column>
      <el-table-column prop="channelType" label="渠道类型" width="100" align="center">
        <template slot-scope="scope">
            <span v-for="item in channelTypeOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.channelType  ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.publishScope" label="发布范围" width="100" align="center">
      </el-table-column>
      <el-table-column prop="validityPeriod" label="信息有效期" width="150" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.note" label="备注" width="150">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建时间" width="180" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              size="mini" :default-sort="{prop: 'crtTime', order: 'descending'}"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" min-width="200" sortable>
      </el-table-column>
      <el-table-column prop="warehouseName" label="到货仓库" width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.channelType" label="渠道类型" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.mainDTO" v-for="item in channelTypeOptions">
            {{item}}
            <span v-if="scope.row.mainDTO.channelType ==item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.publishScope" label="发布范围" width="150">
        <template slot-scope="scope">
          <span>{{mainDTO.publishScope}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150">
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="180">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建时间" width="180" sortable>
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
</template>

<script>
  import { selectPage, selectPageByItem, batchDelBill } from '@/api/erp/purchase/bill/purchaseGoodsRelease'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'goods_release_query',
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        typeOptions:[
          {
            value: '0',
            label: 'GH'
          },
          {
            value: '1',
            label: 'VMI'
          }
        ],
        listQuery: {
          publishType: 0,
          page: 1,
          limit: 10,
          billNo: '',
          warehouseName: '',
          crtUserName: '',
          skuNo: '',
          skuName: '',
          specifications: '',
          brandName: '',
          seriesName: '',
          itemNo: '',
          crtUserNo: undefined,
          selectType: 1 //单据查询时使用，0代表查所有状态，1代表只查正常状态
        },
        clientHeight: 300,
        choose: true,
        publishTypeOptions: [{
          value: '0',
          label: '发布给所有人'
        }/*, {
          value: '1',
          label: '发布给商务'
        }, {
          value: '2',
          label: '发布给指定员工'
        }*/],
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
      }
    },
    created() {
      //this.changeDivHeight();
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getListByItem()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['qty', 'purchasedQty','canUseQty','amountPrice'])
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 1
      },
      getList() {
        this.listLoading = true
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      getListByItem() {
        this.listLoading = true
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listLoading = true
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      handleReset() {
        this.listQuery.billNo = '',
          this.listQuery.publishType = 0,
          this.listQuery.warehouseName = '',
          this.listQuery.crtUserName = '',
          this.listQuery.skuNo = '',
          this.listQuery.skuName = '',
          this.listQuery.itemNo = '',
          this.listQuery.brandName = '',
          this.listQuery.seriesName = '',
          this.listQuery.specifications = ''
        this.listQuery.crtUserNo = undefined
        this.listQuery.crtUserName = undefined
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1
          this.getListByItem()
        } else { //单据
          this.listQuery.page = 1
          this.getList()
        }
      }
    }
  }
</script>
