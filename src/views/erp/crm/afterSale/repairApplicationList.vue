<template>
  <div class="full-purchase bill-container">
    <el-tabs type="border-card" v-model="activity">
      <el-tab-pane label="制单" name="first">
        <!-- 新增维修申请弹窗 -->
        <repair-application-form :id="id"
                                 @submitSuccess="submitSuccess" @handleClose="handleClose"
                                 :attachmentOptions="attachmentOptions">
        </repair-application-form>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
        <!-- 查询和其他操作 -->
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
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

          </div>
        </div>
        <div style="margin-top: 1px;">
          <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除
          </el-button>
          <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                     @change="handleSwitch"></el-switch>
        </div>

        <!-- 查询结果 -->
        <!--详情-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary v-if="choose" key="dataTable1" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="204">
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                {{scope.row.mainDTO.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mainDTO.goodsName" label="商品名称" width="200">
          </el-table-column>
          <el-table-column prop="mainDTO.specifications" label="规格型号" width="200">
          </el-table-column>
          <el-table-column prop="mainDTO.customerName" label="客户名称" width="200">
          </el-table-column>
          <el-table-column prop="mainDTO.repairType" label="维修类型" width="150">
          </el-table-column>
          <el-table-column prop="mainDTO.faultDescribe" label="故障描述" width="200">
          </el-table-column>
          <el-table-column prop="goodsName" label="附件名称" width="200">
          </el-table-column>
          <el-table-column prop="num" label="申请数量" width="100">
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
          </el-table-column>
          <el-table-column prop="totalSum" label="总金额" width="100">
          </el-table-column>
        </el-table>
        <!--单据-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm">
          <el-table-column type="selection" width="60" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="billStatus" label="单据状态" align="center" width="80">
            <template slot-scope="scope">
              <div v-for="item in statusOptions">
                <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="billNo" label="单据编号" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
                {{scope.row.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="维修商品名称" width="200">
          </el-table-column>
          <el-table-column prop="specifications" label="规格型号" width="200">
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" width="200">
          </el-table-column>
          <el-table-column prop="customerPhone" label="客户联系方式" align="center" width="200">
          </el-table-column>
          <el-table-column prop="repairType" label="维修类型" width="150">
          </el-table-column>
          <el-table-column prop="faultDescribe" label="故障描述" width="200">
          </el-table-column>
          <el-table-column prop="note" label="备注" width="200">
          </el-table-column>

        </el-table>


        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 维修申请详情弹窗 -->
    <repair-application-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                             @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                             :attachmentOptions="attachmentOptions">
    </repair-application-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/crm/repairApplication';
  import {getFloat} from '@/utils/util';

  export default {
    name: "repairApplicationList",
    components: {
      'repair-application-form': () => import('./repairApplicationForm'),
      'repair-application-view': () => import('./repairApplicationView')
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: '',
        },
        activity:'second',
        id:'',
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        contractDate: '',
        effectiveDate: '',
        disabledDate: '',
        attachmentOptions: [
          {
            value: '0',
            label: '是'
          },
          {
            value: '1',
            label: '否'
          }
        ]
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
        this.clientHeight = (document.body.clientHeight - (290 + height)) * 1;
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
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
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
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = ''
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
                  message: '删除成功',
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
        this.activity='second'
        // this.dialogFormVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleChangeFun(val) {
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
        this.id = this.selectedRows[0].id.toString();
        this.activity='first'
        // this.dialogStatus = 'update';
        // this.dialogFormVisible = true;
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleContractDateSelect(val) {
        this.listQuery.startContractDate = val[0];
        this.listQuery.endContractDate = val[1];
      },
      handleDisabledDateSelect(val) {
        this.listQuery.startDisabledDate = val[0];
        this.listQuery.endDisabledDate = val[1];
      },
      handleEffectiveDateDateSelect(val) {
        this.listQuery.startEffectiveDate = val[0];
        this.listQuery.endEffectiveDate = val[1];
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
        this.activity='second'
        // this.dialogDetailVisible = false;
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
      }
    },
    watch: {
      contractDate(value) {
        if (value == null) {
          this.listQuery.startContractDate = '';
          this.listQuery.endContractDate = '';
        }
      },
      effectiveDate(value) {
        if (value == null) {
          this.listQuery.startEffectiveDate = '';
          this.listQuery.endEffectiveDate = '';
        }
      },
      disabledDate(value) {
        if (value == null) {
          this.listQuery.startDisabledDate = '';
          this.listQuery.endDisabledDate = '';
        }
      }
    }
  }
</script>
