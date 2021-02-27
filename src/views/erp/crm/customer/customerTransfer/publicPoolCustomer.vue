<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编码"
                      v-model="listQuery.customerCode"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户全称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户负责人"
                      v-model="listQuery.managerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="原负责人"
                      v-model="listQuery.lastManagerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <!--<el-select v-model="timeInterval" placeholder="请选择时间间隔"  style="width: 200px"-->
                       <!--class="filter-item">-->
              <!--<el-option v-for="item in timeIntervalOptions" :key="item.id" :label="item.labelDefault"-->
                         <!--:value="item.value"></el-option>-->
            <!--</el-select>-->
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
            <!--<el-button class="filter-item" type="primary" @click="handleGeneratingCommonPool(timeInterval)">生成公共池客户</el-button>-->
            <el-button class="filter-item" type="primary" v-if="this.$store.state.user.code=='97002'" @click="handleBatchUpdate">重新分配</el-button>
            <el-button class="filter-item" type="primary" v-if="$store.state.user.code == '00000' || $store.state.user.code == '97002'" @click="handleDownload">
              导出
            </el-button>
          </div>
        <!--</el-collapse-item>-->
      <!--</el-collapse>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handleChangeFun" border fit highlight-current-row>
      <el-table-column type="index" width="50" fixed="left">
      </el-table-column>
      <el-table-column type="selection" width="55" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="客户编码" fixed="left" prop="customerCode" width="172">
      </el-table-column>
      <el-table-column align="center" label="客户名称" fixed="left"  width="400">
        <template slot-scope="scope">
          <span style="color: #4F90E2" @click="handleCustomerInfoShow(scope.row)">{{scope.row.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户负责人" prop="managerName" width="200">
      </el-table-column>
      <el-table-column align="center" label="原负责人" prop="lastManagerName" width="200">
      </el-table-column>
      <el-table-column align="center" label="客户联系人" prop="linkMan" width="150">
      </el-table-column>
      <el-table-column align="center" label="联系人职务" prop="linkPosition" width="180">
      </el-table-column>
      <el-table-column align="center" label="联系人电话" prop="linkPhone" width="180">
      </el-table-column>
      <el-table-column align="center" label="联系人邮箱" prop="linkEmail" width="180">
      </el-table-column>
      <el-table-column align="center" label="注册时间" prop="crtTime" width="150">
      </el-table-column>
      <el-table-column align="center" label="进入公共池时间" prop="publicTime" width="160">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100,3000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!-- 重新分配客户负责人 -->
    <el-dialog title="批量分配" :visible.sync="dialogBatchUpdateVisible">
      <div style="margin-top: -20px;text-align: center"><span style="font-size: large">你已选择{{this.selectedRows.length}}个客户</span>
      </div>
      <el-form :model="dataForm" ref="dataForm">
        <el-form-item label="选择新负责人">
          <span @click="handleManagerShow">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-tag v-for="tag in customerManagerArr" :key="tag.name" :type="tag.type" closable
                  @close="handleManagerDel">
            {{tag.name}}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatchUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="batchUpdate">确定</el-button>
      </div>
    </el-dialog>

    <!-- 客户负责人列表弹窗-->
    <el-dialog title="请选择人员" :visible.sync="customerManagerVisible" append-to-body>
      <customer-manager @closeUserDialog="closeUserDialog" :isSingle="true"
                        ref="customerManagerDialog"></customer-manager>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleManagerCancel">取消</el-button>
        <el-button size="medium" type="primary" @click="handleManagerConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {pagePublicPool, batchDel, updateStatus, batchUpdate,generatingPublicPool,reallocate} from '@/api/erp/crm/customer/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: 'customerList',
    components: {
      // 'customer-form': () => import('./customerForm'),
      // 'customer-view': () => import('./customerView'),
      'customer-manager': () => import('@/components/ERP/User/user')
    },
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        dialogStatus: '',
        dialogFormVisible: false,
        customerInfoVisible: false,
        id: '',
        listQuery: {
          page: 1,
          limit: 10
        },
        customerTypeOptions: [],
        customerAttributeOptions: [],
        customerIndustryOptions: [],
        collectionTermsOptions: [],
        paymentsMeansOptions: [],
        statusOptions: [{
          value: '2',
          label: '全部'
        }, {
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '禁用'
        }],
        textMap: {
          update: '编辑客户',
          create: '创建客户'
        },
        selectedRows: [],
        dialogBatchUpdateVisible: false,
        dataForm: {
          managerId: '',
          managerName: '',
        },
        customerManagerArr: [],
        customerManagerVisible: false,
        timeInterval: undefined,
        timeIntervalOptions: []
      }
    },
    created() {
      this.getList();
      getTypeValue('customer_type').then(response => {
        this.customerTypeOptions = response.data.rows;
      });
      getTypeValue('customer_attribute').then(response => {
        this.customerAttributeOptions = response.data.rows;
      });
      getTypeValue('customer_industry').then(response => {
        this.customerIndustryOptions = response.data.rows;
      });
      getTypeValue('payments_means').then(response => {
        this.paymentsMeansOptions = response.data.rows;
      });
      getTypeValue('collection_terms').then(response => {
        this.collectionTermsOptions = response.data.rows;
      });
      getTypeValue('public-pool').then(response=>{
        this.timeIntervalOptions = response.data.rows;
      })
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          tHeader = ['客户编码', '客户名称', '客户负责人', '原负责人', '客户联系人', '联系人职务','联系人电话','联系人邮箱','注册时间','进入公共池时间'];
          filterVal = ['customerCode', 'customerName', 'managerName', 'lastManagerName', 'linkMan', 'linkPosition','linkPhone','linkEmail','crtTime','publicTime'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '公共池客户');
          this.downloadLoading = false;
        })
      },
      getList() {
        this.listLoading = true;
        pagePublicPool(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10
        };
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
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
        this.id = this.selectedRows[0].id;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      },
      handlerCancel() {
        this.dialogFormVisible = false;
      },
      handlerOnSubmit() {
        this.$refs.customerForm.onSubmit();
      },
      submitSuccess() {
        this.getList();
        this.dialogFormVisible = false;
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
          batchDel(ids)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            });
        });
      },
      handleUpdateStatus(status) {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条编辑',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        updateStatus(ids, status)
          .then(() => {
            this.getList();
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
          });
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
        //console.log(val)
      },
      handleBatchUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        this.dialogBatchUpdateVisible = true;
      },
      batchUpdate() {
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        reallocate(ids, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.dialogBatchUpdateVisible = false;
            this.$notify({
              title: '成功',
              message: '分配成功',
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

      },
      handleCustomerInfoShow(row) {
        this.selectedRows = row
        this.id = this.selectedRows.id;
        this.customerInfoVisible = true;
        //console.log(this.selectedRows)
        /*console.log(this.selectedRows.id)*/
      },
      handleCustomerInfoClose() {
        this.customerInfoVisible = false
      },
      handleManagerShow() {
        this.customerManagerVisible = true;
      },
      handleManagerDel(index) {
        this.customerManagerArr.splice(index, 1);
        this.$refs.customerManagerDialog.reset();
      },
      handleManagerConfirm() {
        this.$refs.customerManagerDialog.onSubmit();
      },
      handleManagerCancel() {
        this.customerManagerVisible = false;
      },
      closeUserDialog(list) {
        this.customerManagerArr = list;
        this.customerManagerVisible = false
        if (list.length > 0) {
          this.dataForm.managerName = list[0].name;
          this.dataForm.managerId = list[0].id;
        }
      },
      handleGeneratingCommonPool(val){
        if (this.timeInterval == undefined) {
          this.$notify({
            title: '提示',
            message: '请先选择时间间隔',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        generatingPublicPool(val).then(response=>{
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '生成成功',
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
