<template>
  <el-row>
    <el-col :span="24">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="订单编号" v-model="listQuery.billNo">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="getList">搜索
        </el-button>
      </div>
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row width="100%"  :show-header="true" ref="dataTable"
                  @select-change="handleSelectChange" @select="handleSelect"
                  @select-all="handleSelectAll">
        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>
        <el-table-column type="index" width="50" fixed="left">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="160" sortable align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="100" align="center">
        </el-table-column>
        <el-table-column prop="qty" label="发布数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="发布单价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="discount" label="发布折扣" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="deliveryDate" label="货期(天)" width="80" class-name="col-required" align="right">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" align="center" width="160">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" align="center" width="140">
        </el-table-column>
        <el-table-column prop="validityPeriod" label="信息有效期" width="150" align="center">
        </el-table-column>
        <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="180" sortable  align="center">
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
    </el-col>
  </el-row>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseGoodsReleaseChange';

  export default {
    props:['selectType','publishType'],
    data() {
      return {
        list: [],
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
        }, {
          value: '08',
          label: '渠道'
        }],
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
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseSource: [],
        currentSource: [],
        listQuery: {
          page: 1,
          limit:10,
          billNo: undefined,
          selectType: 0,
          publishType: undefined
        },
      };
    },
    created() {
      if (this.selectType != undefined) {
        this.listQuery.selectType = this.selectType;
      }
      this.listQuery.publishType = this.publishType;
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        selectPageByItem(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(() => {
          this.listLoading = false;
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleRowClick(row, event, column) {
        //判断是否已选中
        var flag = false
        for (var i = this.currentSource.length - 1; i >= 0; i--) {
          if (this.currentSource[i].mainDTO.billNo == row.mainDTO.billNo) {
            flag = true
            this.currentSource.splice(i, 1)
          }
        }
        if (!flag) {
          this.currentSource.push(row)
        }
        //切换选中状态
        this.$refs.dataTable.toggleRowSelection(row)
        //this.chooseGoods.push(Object.assign({}, row));
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleSelect(selection, row) {
        this.currentSource = Object.assign([], selection)
      },
      handleSelectChange(selection, row) {
        this.currentSource = Object.assign([], selection)
      },
      handleSelectAll(selection) {
        this.currentSource = Object.assign([], selection)
      },
      onSubmit(row) {
        if(this.currentSource.length > 1) {
          this.$message.error('只支持同一仓库内进行关联创建，请重新选择');
        } else {
          this.$emit('closeSourceDialog', this.currentSource)
        }
        // for (let i in this.currentSource) {
        //   if (this.currentSource[0].mainDTO.warehouseName != this.currentSource[i].mainDTO.warehouseName) {
        //     this.$message.error('只支持同一仓库内进行关联创建，请重新选择');
        //     return;
        //   }
        // }
      },
      handleTagClose(index) {
        this.chooseSource.splice(index, 1);
        this.currentSource.splice(index, 1);
      },
      reset() {
        this.chooseSource = [];
        this.currentSource = [];
        this.$refs.dataTable.setCurrentRow();
      },
    }

  }
</script>

<style scoped>

</style>
