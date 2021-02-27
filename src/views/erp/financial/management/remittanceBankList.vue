<template>

  <div class="app-container calendar-list-container bill-container" >
    <!--查询和其他操作-->
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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="汇票编号"
                  v-model="listQuery.draftNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  v-model="listQuery.customerCode"
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
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="单据日期"
                        end-placeholder="单据日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <!--</el-collapse-item>-->
      <!--</el-collapse>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" ref="dataTable" show-summary
              :summary-method="getSummaries"
              element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column align="right" label="附件" prop="attachment" class-name="col-required">-->
      <!--</el-table-column>-->
      <el-table-column label="承兑状态" prop="nowType" width="180" align="center" v-slot="{row}">
        <span>{{nowTypeMap[row.nowType]}}</span>
      </el-table-column>
      <el-table-column label="单据编号" prop="billNo" width="180" align="center">
      </el-table-column>
      <el-table-column label="汇票编号" prop="draftNo" min-width="180" align="left">
      </el-table-column>
      <el-table-column label="客户编号" prop="customerCode" width="120" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.customerCode}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customerName" min-width="180" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.customerName}}</span>
          </div>
        </template>
      </el-table-column>
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
      <el-table-column align="left"  min-width="180" label="付款银行全称" prop="paymentBankFullName">
      </el-table-column>
      <el-table-column align="right" width="90" label="出票金额" prop="amt" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="贴息额" prop="discount" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="手续费" width="80" prop="fee" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="月利率" width="80" prop="monthRate" class-name="col-required">
      </el-table-column>
      <el-table-column align="left" label="几手背书" width="80" prop="hands">
      </el-table-column>
      <el-table-column align="center" label="汇票到期日" width="100" prop="draftExpireDate">
      </el-table-column>
      <el-table-column align="center" label="制单人工号" prop="crtUserNo" width="120">
    </el-table-column>
      <el-table-column align="center" label="制单人" prop="crtUserName" width="120">
      </el-table-column>
      <el-table-column align="center" label="单据时间" prop="crtTime" width="180">
      </el-table-column>
    </el-table>
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
  import {findAllPage} from '@/api/erp/financial/acceptanceRegister';

  export default {
    name: 'customerList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        billDate: undefined,
        nowTypeMap:{//承兑状态字典
          1:'未支出',
          2:'支出中',
          3:'已支出'
        },
        listQuery:{
          page: 1,
          limit: 10,
          billStatus:undefined,
          billNo:undefined,
          crtUserName: undefined,
          crtUserNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
        }
      }
    },
    created() {
      this.getList();
    },
    watch: {
      billDate(value) {
        if (!value) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['amt', 'fee', 'monthRate','discount']);
      },
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      handleReset(){
        this.listQuery.billStatus = undefined;
        this.listQuery.page = 1;
        this.listQuery.limit = 10;
        this.listQuery.billNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.listQuery.draftNo = undefined;
        this.listQuery.customerCode = undefined;
        this.billDate = undefined;
      },
      handleFilter(){
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getList() {
        this.list = undefined;
        this.listLoading = false;
        findAllPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total
          this.listLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .customerInfoDialog {
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh !important;

    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

  }

</style>
