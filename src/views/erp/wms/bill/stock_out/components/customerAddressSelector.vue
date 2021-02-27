<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="收货人" style="width: 200px" class="input-width" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.phoneNumber" placeholder="收货人电话" style="width: 200px" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.province" placeholder="省份/直辖市" style="width: 200px" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-delete" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading="listLoading" @row-dblclick="onSubmit" height="55vh">
        <el-table-column align="center" label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label='收货人'>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="收货人电话">
        </el-table-column>
        <el-table-column prop="province" label="省份/直辖市">
        </el-table-column>
        <el-table-column prop="city" label="市">
        </el-table-column>
        <el-table-column prop="region" label="区">
        </el-table-column>
        <el-table-column prop="detailAddress" label="详细地址">
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 10px;">
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
  import {getAddressPage} from '@/api/erp/crm/customer/index';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle', 'customerCode'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseAddress: [],
        currentAddress: [],
        listQuery: {
          page: 1,
          limit: 20,
          memberId: undefined
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listQuery.memberId = this.customerCode;
        this.listLoading = true;
        getAddressPage(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
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
            this.chooseAddress = [val.id];
            this.currentAddress = [val];
          } else {
            for (var i in this.chooseAddress) {
              if (this.chooseAddress[i] == val.id) {
                return;
              }
            }
            this.chooseAddress.push(val.id);
            this.currentAddress.push(val);
          }
        }
      },
      onSubmit() {
        this.$emit('closeCustomerAddressDialog', this.currentAddress)
      },
      reset() {
        this.chooseAddress = [];
        this.currentAddress = [];
        this.$refs.dataTable.setCurrentRow();
      },
      clear(){
        this.listQuery={
          page: 1,
          limit: 20,
          memberId: undefined
        }
        this.getList()
      }
    }
  }
</script>

<style scoped>
>>>.el-input--mini .el-input__inner{
  height: 28px;
  line-height: 28px;
}
</style>
