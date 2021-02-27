<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!--<el-collapse style="margin-top: -10px;">-->
        <!--<el-collapse-item title="筛选">-->
          <!--<template slot="title">-->
            <!--<el-button icon="el-icon-search" type="text">筛选</el-button>-->
          <!--</template>-->
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                      v-model="listQuery.customerCode"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户全称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="原客户负责人"
                      v-model="listQuery.oldManagerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="现客户负责人"
                      v-model="listQuery.newManagerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
            <el-button class="filter-item" type="primary" @click="handleBatchUpdate">转移客户</el-button>
          </div>
        <!--</el-collapse-item>-->
      <!--</el-collapse>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handleChangeFun" border fit highlight-current-row :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column align="center" label="客户编号" fixed="left" prop="customerCode" width="250" sortable>
      </el-table-column>
      <el-table-column align="center" label="客户全称" fixed="left"  min-width="400">
        <template slot-scope="scope">
          <span style="color: #4F90E2" @click="handleCustomerInfoShow(scope.row)">{{scope.row.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原客户负责人" prop="oldManagerName" width="400">
      </el-table-column>
      <el-table-column align="center" label="现客户负责人" prop="newManagerName"  width="400">
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="crtTime"  width="400">
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

    <!--&lt;!&ndash; 客户详情弹窗 &ndash;&gt;-->
    <!--<el-dialog title="客户详情" :visible.sync="customerInfoVisible" width="70%" class="customerInfoDialog">-->
      <!--<customer-view :id="id" ref="customerInfoDialog"-->
                     <!--:customerAttributeOptions="customerAttributeOptions"-->
                     <!--:customerTypeOptions="customerTypeOptions"-->
                     <!--:customerIndustryOptions="customerIndustryOptions"-->
                     <!--:paymentsMeansOptions="paymentsMeansOptions"-->
                     <!--:collectionTermsOptions="collectionTermsOptions"></customer-view>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button size="medium" type="primary" @click="handleCustomerInfoClose">关闭</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

    <!--&lt;!&ndash;创建或编辑客户&ndash;&gt;-->
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">-->
      <!--<customer-form :id="id" :customerTypeOptions="customerTypeOptions"-->
                     <!--:paymentsMeansOptions="paymentsMeansOptions"-->
                     <!--:collectionTermsOptions="collectionTermsOptions"-->
                     <!--:customerAttributeOptions="customerAttributeOptions"-->
                     <!--:customerIndustryOptions="customerIndustryOptions"-->
                     <!--@submitSuccess="submitSuccess"-->
                     <!--ref="customerForm" v-if="dialogFormVisible"></customer-form>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button size="medium" class="filter-item" @click="handlerCancel()">取消</el-button>-->
        <!--<el-button size="medium" class="filter-item" type="primary" icon="edit"-->
                   <!--@click="handlerOnSubmit()">提交</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

    <!-- 批量转移客户 -->
    <el-dialog title="批量转移" :visible.sync="dialogBatchUpdateVisible">
      <div style="margin-top: -20px;text-align: center"><span style="font-size: large">你已选择{{this.customerArr.length}}个客户</span>
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
        <el-form-item label="选择客户">
          <span @click="handleShow">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-tag v-for="tag in customerArr" :key="tag.name" :type="tag.type" closable style="margin-right: 5px;"
                  @close="handleDel">
            {{tag.name}}
          </el-tag>
        </el-form-item>
        <!--<el-form-item label="新增可查看用户" prop="addCusFollowUserIds">-->
          <!--<el-input v-model="dataForm.addCusFollowUserIds" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="移除可查看用户" prop="removeCusFollowUserIds">-->
          <!--<el-input v-model="dataForm.removeCusFollowUserIds" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="收款条件" prop="collectionTerms">-->
          <!--<el-select class="filter-item" v-model="dataForm.collectionTerms" placeholder="请输入收款条件">-->
            <!--<el-option v-for="item in collectionTermsOptions" :key="item.id" :label="item.labelDefault"-->
                       <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="信用期限" prop="creditPeriod">-->
          <!--<el-input-number v-model="dataForm.creditPeriod" :min="1" :max="365" label="信用期限"></el-input-number>-->
        <!--</el-form-item>-->
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
    <!-- 客户选择-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {batchDel, updateStatus, batchUpdate} from '@/api/erp/crm/customer/index';
  import {page} from '@/api/erp/crm/customerTransferRecord';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: 'customerList',
    components: {
      // 'customer-form': () => import('./customerForm'),
      // 'customer-view': () => import('./customerView'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'customer-manager': () => import('@/components/ERP/User/user')
    },
    data() {
      return {
        customerVisible: false,
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
        customerArr: [],
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
          oldManagerName: '',
          newManagerName: '',
          addCusFollowUserIds: '',
          removeCusFollowUserIds: '',
          paymentsMeans: '',
          creditPeriod: ''
        },
        customerManagerArr: [],
        customerManagerVisible: false
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
    },
    methods: {
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerArr = [];
        this.customerVisible = false;
        if (list.length > 0) {
          for(let i in list){
            this.customerArr.push({name:list[i].customerName,id:list[i].id});
          }
        }
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
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
        this.dialogBatchUpdateVisible = true;
      },
      batchUpdate() {
        let ids = [];
        this.customerArr.forEach(function (row) {
          ids.push(row.id)
        });
        batchUpdate(ids, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.dialogBatchUpdateVisible = false;
            this.$notify({
              title: '成功',
              message: '转移成功',
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
      handleShow(){
        this.customerVisible = true;
      },
      handleManagerDel(index) {
        this.customerManagerArr.splice(index, 1);
        this.$refs.customerManagerDialog.reset();
      },
      handleDel(index){
        this.customerArr.splice(index, 1);
        this.$refs.customer.reset();
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
