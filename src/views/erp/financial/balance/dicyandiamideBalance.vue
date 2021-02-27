<template>

  <div class="app-container calendar-list-container bill-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 250px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @blur="getList"
                  @keyup.enter.native="getList">
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
        &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="listQuery.type" @change="getList()" checked>剔除重复项</el-checkbox>

        <el-button class="filter-item" type="primary" @click="getList" style="margin-left: 20px;">查询
        </el-button>
        <el-button class="filter-item" type="danger" @click="handleResetSearch()">重置</el-button>
      </div>
      <!--</el-collapse-item>-->
      <!--</el-collapse>-->
    </div>

    <!-- 查询结果 -->
    <div>
      <div style="width: 48%;float: left;margin-right: 2%;margin-top: 10px;">
        <el-table size="small" :data="eOrderList" v-loading="listLoading" ref="dataTable" show-summary
                  :summary-method="getSummaries" :height="height"
                  element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column align="right" label="双乾金额" prop="amount" class-name="col-required">
          </el-table-column>
          <el-table-column align="right" label="双乾单号" fixed="right" prop="billNo">
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 48%;float: left;margin-top: 10px;">
        <el-table size="small" :data="bankList" v-loading="listLoading" ref="dataTable" show-summary :height="height"
                  :summary-method="getSummaries"
                  element-loading-text="正在查询中。。。" border fit highlight-current-row>

          <el-table-column align="left" label="系统单号" fixed="left" prop="billNo">
          </el-table-column>
          <el-table-column align="right" label="系统金额" prop="amount" class-name="col-required">
          </el-table-column>
          <el-table-column type="index">
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
  import { getEOrderPage } from '@/api/erp/financial/balance'

  export default {
    name: 'dicyandiamideBalance',
    data() {
      return {
        height: '700',
        eOrderList: undefined,
        bankList: undefined,
        listLoading: true,
        billDate: undefined,
        listQuery: {
          billNo: undefined,
          startDate: undefined,
          endDate: undefined,
          type: 1
        }
      }
    },
    created() {
      const yestoday = this.yesterday()
      this.listQuery.startDate = yestoday + ' 00:00:00'
      this.listQuery.endDate = yestoday + ' 23:59:59'
      this.billDate = [yestoday, yestoday]
      this.getList()
      this.getList()
    },
    watch: {
      billDate(value) {
        if (!value) {
          this.listQuery.startDate = undefined
          this.listQuery.endDate = undefined
        }
      }
    },
    methods: {
      yesterday() {
        var timenow = new Date()
        timenow.setDate(timenow.getDate() - 1) //设置天数 -1 天，昨天的日期
        var y = timenow.getFullYear()//年
        var m = timenow.getMonth() + 1//月
        m = m < 10 ? '0' + m : m
        var d = timenow.getDate()//日
        d = d < 10 ? ('0' + d) : d
        var yesterdayTime = y + '-' + m + '-' + d//字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
        return yesterdayTime
      },
      handleResetSearch() {
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
        this.listQuery.billNo = undefined
        this.billDate = undefined
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00'
        this.listQuery.endDate = val[1] + ' 23:59:59'
        this.getList()
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['amount'])
      },
      getList() {
        this.listLoading = true
        let listQuery = JSON.parse(JSON.stringify(this.listQuery))
        listQuery.type = this.listQuery.type ? 1 : 0
        this.eOrderList = []
        this.bankList = []
        getEOrderPage(listQuery).then(response => {
          if (response.data) {
            this.eOrderList = response.data.eOrderList
            this.bankList = response.data.bankList
          } else {
            this.eOrderList = []
            this.bankList = []
          }

          this.listLoading = false
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
