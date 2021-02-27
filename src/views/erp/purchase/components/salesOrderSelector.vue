<template>
  <el-row>
    <el-col :span="24">
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading="listLoading" @row-dblclick="onSubmit" height="55vh">
        <el-table-column align="center" label="序号" type="index"></el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="notOrderQty" v-if="selectType == '4'" label="未订货数量" align="right" width="120">
          <template slot-scope="scope">
            <div>{{scope.row.qty * 1 - scope.row.orderQty * 1}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="applicableFutureQty" v-if="selectType == '6'" label="未订货期货数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="applicableSynergyQty" v-if="selectType == '7'" label="未订货调拨数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="180">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="200">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/sales/bill/salesOrder';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle', 'customerCode', 'skuNo','selectType'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseBill: [],
        currentBill: [],
        listQuery: {
          page: 1,
          limit: 100,
          selectType: this.selectType,
          customerCode: '',
          skuNo: ''
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listQuery.customerCode = this.customerCode;
        this.listQuery.skuNo = this.skuNo;
        this.listLoading = true;
        selectPageByItem(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(res => {
          this.listLoading = false;
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        if (val) {
          if (this.isSingle) {
            this.chooseBill = [val.mainDTO.billNo];
            this.currentBill = [val];
          } else {
            for (var i in this.chooseBill) {
              if (this.chooseBill[i] == val.billNo) {
                return;
              }
            }
            this.chooseBill.push(val.mainDTO.billNo);
            this.currentBill.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeSalesOrderDialog', this.currentBill)
      },
      reset() {
        this.chooseBill = [];
        this.currentBill = [];
        this.$refs.dataTable.setCurrentRow();
      }
    }
  }
</script>

<style scoped>

</style>
