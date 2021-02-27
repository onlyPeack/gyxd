<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编码"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商全称"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商联系人"
                  v-model="listQuery.linkMan"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.supplierType" placeholder="供应商类型" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in supplierTypes" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <br/>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>

        <el-date-picker style="position: relative;top: -3px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        @change="handleDateSelect"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <el-button type="text"  icon="el-icon-sort-up" @click="blackBtn">移出黑名单</el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handlechangeFun" border fit highlight-current-row :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="供应商编码" fixed="left" prop="supplierCode" sortable>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column  width="200" label="供应商全称" fixed="left" prop="supplierName">
      </el-table-column>
      <el-table-column  width="100" label="简称" fixed="left" prop="abbrName">
      </el-table-column>
      <el-table-column align="center" label="供应商类型" prop="supplierType">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierType==0">供应商</span>
          <span v-if="scope.row.supplierType==1">渠道商</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商等级" prop="supplierGrade">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierGrade==0">一级</span>
          <span v-if="scope.row.supplierGrade==1">二级</span>
          <span v-if="scope.row.supplierGrade==2">三级</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商联系人" prop="linkMan">
      </el-table-column>
      <el-table-column align="center" label="采购员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="采购员姓名" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" label="采购员部门" prop="departName">
      </el-table-column>
      <el-table-column align="center" label="联系人职务" prop="linkPosition">
      </el-table-column>
      <el-table-column align="center" label="联系人电话" prop="linkPhone">
      </el-table-column>
      <el-table-column align="center" label="联系人邮箱" prop="linkEmail">
      </el-table-column>
      <el-table-column align="center" label="收款条件">
        <template slot-scope="scope">
          <span v-for="item in collectionTermsOptions">
            <span v-if="scope.row.collectionTerms ===item.value">{{item.labelDefault}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算方式">
        <template slot-scope="scope">
          <span v-for="item in paymentsMeansOptions">
            <span v-if="scope.row.paymentsMeans ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="创建时间" prop="crtTime" sortable>
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

    <!--创建或编辑供应商-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="60%">
      <supplier-form :id="id" :paymentsMeansOptions="paymentsMeansOptions"
                     :collectionTermsOptions="collectionTermsOptions"
                     @submitSuccess="submitSuccess"
                     @submitWarning="submitWarning"
                     ref="supplierForm" v-if="dialogFormVisible"></supplier-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" @click="handlerCancel()">取消</el-button>
        <el-button class="filter-item" type="primary" icon="edit" @click="handlerOnSubmit()"
                   :loading="isLoading">提交</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改供应商 -->
    <el-dialog title="批量修改" :visible.sync="dialogBatchUpdateVisible">
      <div style="margin-top: -20px;text-align: center"><span style="font-size: large">你已选择{{this.selectedRows.length}}个供应商</span>
      </div>
      <el-form :model="dataForm" ref="dataForm">
        <el-form-item label="变更负责人">
           <span @click="handleManagerShow">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-tag v-for="tag in supplierManagerArr" :key="tag.name" :type="tag.type" closable
                  @close="handleManagerDel">
            {{tag.name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="新增可查看用户" prop="addCusFollowUserIds">
          <el-input v-model="dataForm.addCusFollowUserIds" clearable></el-input>
        </el-form-item>
        <el-form-item label="移除可查看用户" prop="romoveCusFollowUserIds">
          <el-input v-model="dataForm.romoveCusFollowUserIds" clearable></el-input>
        </el-form-item>
        <el-form-item label="收款条件" prop="collectionTerms">
          <el-select class="filter-item" v-model="dataForm.collectionTerms" placeholder="请输入收款条件">
            <el-option v-for="item in collectionTermsOptions" :key="item.id" :label="item.labelDefault"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用期限" prop="creditPeriod">
          <el-input-number v-model="dataForm.creditPeriod" :min="1" :max="365" label="信用期限"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatchUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="batchUpdate">确定</el-button>
      </div>
    </el-dialog>

    <!-- 供应商负责人列表弹窗-->
    <el-dialog title="请选择人员" :visible.sync="supplierManagerVisible" append-to-body>
      <supplier-manager @closeUserDialog="closeUserDialog" :isSingle="true"
                        ref="supplierManagerDialog"></supplier-manager>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleManagerCancel">取消</el-button>
        <el-button type="primary" @click="handleManagerConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {page, batchDel, updateStatus, batchUpdate,updateSupplierBlack} from '@/api/erp/purchase/supplier/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {page as payMeansPage} from '@/api/erp/financial/financialPaymentsMeans';
  import { getToken } from '@/utils/auth'

  export default {
    name: 'supplierVendors',
    components: {
      'supplier-form': () => import('./supplierForm'),
      'supplier-certification': () => import('./supplierCertification'),
      'supplier-manager': () => import('@/components/ERP/User/user')
    },
    data() {
      return {
        certificationVisible: false,
        billDate:undefined,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        dialogStatus: '',
        dialogFormVisible: false,
        id: '',
        listQuery: {
          page: 1,
          limit: 10,
          supplierCode: '',
          supplierName: '',
          managerName: '',
          abbrName: '',
          linkMan: '',
          status: '',
          departName:'',
          startDate:'',
          endDate:'',
          crtUserNo:'',
          crtUserName:'',
          blackType: 1
        },
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
          update: '编辑供应商',
          create: '创建供应商'
        },
        supplierTypes: [{
          value: '0',
          label: '供应商'
        }, {
          value: '1',
          label: '渠道商'
        }],
        selectedRows: [],
        downloadLoading:false,
        dialogBatchUpdateVisible: false,
        dataForm: {
          managerId: '',
          managerName: '',
          addCusFollowUserIds: '',
          romoveCusFollowUserIds: '',
          paymentsMeans: '',
          creditPeriod: ''
        },
        supplierManagerArr: [],
        supplierManagerVisible: false,
        fileList: undefined,
        headers:null,
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      },
    },
    created() {
      this.getList();
      payMeansPage().then(response => {
        this.paymentsMeansOptions = response.data.records;
      });
      getTypeValue('collection_terms').then(response => {
        this.collectionTermsOptions = response.data.rows;
      });
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
            tHeader = ['供应商编码','状态','供应商全称','简称','供应商类型','供应商等级','供应商联系人','采购员工号','采购员姓名','采购员部门','联系人职务','联系人电话','联系人邮箱','创建时间' ];
            filterVal = ['supplierCode','status','supplierName','abbrName','supplierType','supplierGrade','linkMan','crtUserNo','crtUserName','departName','linkPosition','linkPhone','linkEmail','crtTime'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '供应商黑名单');
          this.downloadLoading = false;
        })
      },
      blackBtn(){
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
          this.$confirm('您确定执行该操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateSupplierBlack(this.selectedRows[0].id,0)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '移出黑名单成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              });
          });
      },
      handlerCertificationCancel(){
        this.certificationVisible = false;
      },
      handlerCertificationOnSubmit(){
        this.certificationVisible = false;
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            if (response.data.records.length > 0) {
              this.list = response.data.records;
              this.total = response.data.total;
            } else {
              this.list = [];
              this.total = 0;
            }
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      submitWarning(){
        this.isLoading = false;
      },
      handleReset() {
        this.listQuery.supplierCode = '';
        this.listQuery.supplierName = '';
        this.listQuery.managerName = '';
        this.listQuery.abbrName = '';
        this.listQuery.linkMan = '';
        this.listQuery.status = '';
        this.listQuery.departName = '';
        this.billDate = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate =undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.crtUserName = undefined;
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
      handlerCancel() {
        this.dialogFormVisible = false;
      },
      handlerOnSubmit() {
        this.isLoading = true;
        this.$refs.supplierForm.onSubmit();
      },
      submitSuccess() {
        this.getList();
        this.isLoading = false;
        this.dialogFormVisible = false;
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      batchUpdate() {
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        batchUpdate(ids, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.dialogBatchUpdateVisible = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
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
      handleManagerShow() {
        this.supplierManagerVisible = true;
      },
      handleManagerDel(index) {
        this.supplierManagerArr.splice(index, 1);
        this.$refs.supplierManagerDialog.reset();
      },
      handleManagerConfirm() {
        this.$refs.supplierManagerDialog.onSubmit();
      },
      handleManagerCancel() {
        this.supplierManagerVisible = false;
      },
      closeUserDialog(list) {
        this.supplierManagerArr = list;
        this.supplierManagerVisible = false
        if (list.length > 0) {
          this.dataForm.managerName = list[0].name;
          this.dataForm.managerId = list[0].id;
        }
      },
    },
  }
</script>

<style>

</style>
