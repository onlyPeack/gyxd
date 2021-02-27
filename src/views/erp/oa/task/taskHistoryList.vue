<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号" v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          @change="handleFilter"
          align="right"
          style="vertical-align: top"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table"
              @row-dblclick="handleOpenDialog">
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDialog(scope.row)">
            {{scope.row.billName}}: {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="单据时间" align="center">
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

    <component :is="plugItem" v-for="(plugItem, plugIndex) in plugs" :key='plugIndex'
               :visible.sync="dialogDialogVisible" @submitDetailSuccess="handleSubmitDialog"
               :before-close="handleCloseDialog" :close-on-click-modal="false" @handleClose="handleCloseDialog"
               :id="billId" :dialogFormVisible="dialogDialogVisible" taskType="history"></component>

  </div>
</template>

<script>
  import {getTaskHistoryPage} from '@/api/erp/oa/task/taskHistory';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "taskHistoryList",
    data() {
      return {
        colck:null,
        plugs: [],
        list: [],
        taskHistory: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
        },
        billDate: [],
        form: {},
        clientHeight: 300,
        dialogDialogVisible: false,
        billOptions: [],
        taskAuditOptions: [],
        queryVisible: false,
        step: undefined
      };
    },
    created() {
      var Date1 = new Date();
      var Date7 = new Date(Date1.getTime() - 24 * 60 * 60 * 1000);
      this.listQuery.endBillDate = Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate() + ' 00:00:00';
      this.listQuery.startBillDate = Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate() + ' 23:59:59';
      this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate(), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate()]
      getTypeValue('task_audit').then(response => {
        this.taskAuditOptions = response.data.rows;
      });
      getTypeValue('root_bill').then(response => {
        this.billOptions = response.data.rows;
        this.getList();
      });
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    watch: {
      billDate(val) {
        if (val == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        } else {
          this.listQuery.startBillDate = val[0] + ' 00:00:00';
          this.listQuery.endBillDate = val[1] + ' 23:59:59';
        }
        this.handleFilter()
      },
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
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (200 + height)) * 1;
      },
      getBillName(key) {
        for (var j in this.billOptions) {
          if (key == this.billOptions[j].code) {
            return this.billOptions[j].labelDefault;
          }
        }
      },
      getList() {
        this.listLoading = true;
        getTaskHistoryPage(this.listQuery).then(response => {
          this.list = [];
          for (var i in response.records) {
            if (response.records[i].billNo) {
              var key = response.records[i].billNo.replace(/[^a-z]+/ig, "");
              key = 'root_bill_' + key;
              response.records[i].billName = this.getBillName(key);
            }
          }
          this.list = response.records;
          this.total = response.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
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
      handleReset() {
        this.listQuery.billNo = undefined;
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleOpenDialog(row) {
        this.billId = row.billId;
        this.plugs = [];
        this.plugs.push(() => import(`@/views/${row.url}`));
        this.dialogDialogVisible = true;
      },
      handleCloseDialog() {
        this.dialogDialogVisible = false;
      },
      handleSubmitDialog() {
        this.dialogDialogVisible = false;
        this.colck = setTimeout(()=>{
          this.getList();
        },500);
        this.colck = null;
        window.clearTimeout(this.colck);
      }
    },
  }
</script>

