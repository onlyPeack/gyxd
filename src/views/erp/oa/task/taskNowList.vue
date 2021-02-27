<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号" v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter"></el-input>
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
      <el-table-column prop="billId" label="单据ID" align="center" v-if="false">
      </el-table-column>
      <el-table-column prop="logicKey" label="执行环节" align="center">
        <template slot-scope="scope">
          <div v-for="item in taskAuditOptions">
            <span v-if="scope.row.logicKey==item.value">{{item.labelDefault}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="操作人" align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="note" label="备注">
      </el-table-column>
<!--      <el-table-column prop="processId" label="流程ID" align="center">-->
<!--      </el-table-column>-->
      <el-table-column prop="url" label="页面路径" v-if="false">
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
               @submitSuccess="handleSubmitDialog"
               :before-close="handleCloseDialog" :close-on-click-modal="false" @handleClose="handleCloseDialog"
               :id="billId" :dialogFormVisible="dialogDialogVisible" taskType="now" :step="step"></component>

  </div>
</template>

<script>
  import {page} from '@/api/erp/oa/task/taskNow';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "taskNowList",
    data() {
      return {
        colck: null,
        plugs: [],
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
        },
        form: {},
        clientHeight: 300,
        dialogDialogVisible: false,
        billOptions: [],
        taskAuditOptions: [],
        queryVisible: false,
        billId: undefined,
        step: undefined,
      };
    },
    watch: {
      '$route.query': function (val) {
        this.dialogDialogVisible = false;
        if (val && val.billNo) {
          this.listQuery.billNo = val.billNo;
          page(this.listQuery).then(response => {
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
            this.handleOpenDialog(response.records[0]);
          }).catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          })
        } else {
          this.listQuery.billNo = undefined;
          this.getList()
        }

      }
    },
    created() {
        getTypeValue('task_audit').then(response => {
          this.taskAuditOptions = response.data.rows;
        });
        getTypeValue('root_bill').then(response => {
          this.billOptions = response.data.rows;
          if (this.$route.query && this.$route.query.billNo) {
            this.listQuery.billNo = this.$route.query.billNo;
            page(this.listQuery).then(response => {
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
              this.handleOpenDialog(response.records[0]);
            }).catch(() => {
              this.list = [];
              this.total = 0;
              this.listLoading = false;
            })
          } else {
            this.listQuery.billNo = undefined;
            this.getList()
          }
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
        this.clientHeight = (document.body.clientHeight - (230 + height)) * 1;
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
        page(this.listQuery).then(response => {
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
        this.dialogDialogVisible = false;
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
         console.log('row');
         console.log(row);
        this.billId = row.billId;
          this.step = row.step;
          this.plugs = [];
           this.plugs.push( () =>Promise.resolve(require(`@/views/${row.url}`)));
          this.dialogDialogVisible = true;
      },
      handleCloseDialog() {
        this.dialogDialogVisible = false;
      },
      handleSubmitDialog() {
        this.dialogDialogVisible = false;
        this.list = [];
        this.colck = setTimeout(() => {
          this.getList();
        }, 500);
        this.colck = null;
        window.clearTimeout(this.colck);
      }
    },
  }
</script>

