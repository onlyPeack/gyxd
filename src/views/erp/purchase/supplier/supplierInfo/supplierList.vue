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
        <el-select v-model="listQuery.supplierType" placeholder="供应商类型" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in supplierTypes" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>

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
        <el-select v-model="listQuery.authenticationType" placeholder="是否为认证供应商" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in authenticationTypes" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="listQuery.publishType" placeholder="发布类型" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in publishTypeOption" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
          </div>
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <!--<el-button type="text" icon="el-icon-arrow-down">批量导入</el-button>-->
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-upload class="upload" action="/api/purchase/supplier/import" :before-upload="beforeUpload"
                 :on-remove="handleRemove" :show-file-list="false"
                 :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                 style="display:inline;" :on-success="uploadCompleted" :headers="headers">
        <el-button type="text" icon="el-icon-download">
          导入
        </el-button>
      </el-upload>
      <el-dropdown style="margin-left: 10px;">
        <el-button type="text" icon="el-icon-more">更多</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-edit" @click="handleBatchUpdate">批量修改</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-check" @click="handleUpdateStatus('0')">启用</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-close" @click="handleUpdateStatus('1')">禁用</el-button>
          </el-dropdown-item>
          <!-- <el-dropdown-item>
            <el-button type="text"  icon="el-icon-sort-up" @click="blackBtn">移入黑名单</el-button>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text"  icon="el-icon-view" @click="certificationBtn">供应商认证</el-button>
      <el-button type="text" icon="el-icon-download">
        <a href="/api/purchase/supplier/download">下载导入模板</a>
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handlechangeFun" border fit highlight-current-row :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="index" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column type="selection" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="供应商编码" fixed="left" width="120" prop="supplierCode" sortable>
      </el-table-column>
      <!-- <el-table-column prop="billStatus" label="单据状态" align="center">
        <template slot-scope="scope">
          <div v-for="(item,index) in statusOptions" :key="index">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="(item,index) in statusOptions"  :key="index">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  width="200" label="供应商全称" fixed="left" prop="supplierName">
        <template slot-scope="scope">
          <div style="color: #46a6ff;" @click="handleViewSupplier(scope.row.id)">{{scope.row.supplierName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="供应商简称" prop="abbrName">
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="linkMan">
      </el-table-column>
      <el-table-column align="center" label="联系人电话" prop="linkPhone">
      </el-table-column>
      <el-table-column align="center" label="供应商类型" prop="supplierType">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierType==0">厂家</span>
          <span v-if="scope.row.supplierType==1">代理商</span>
          <span v-if="scope.row.supplierType==2">经销商</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商等级" prop="supplierGrade">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierGrade==0">一级</span>
          <span v-if="scope.row.supplierGrade==1">二级</span>
          <span v-if="scope.row.supplierGrade==2">三级</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否认证" prop="authenticationType">
        <template slot-scope="scope">
          <span v-for="(item,index) in authenticationTypes" :key="index">
            <span v-if="scope.row.authenticationType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布类型" prop="authenticationType">
        <template slot-scope="scope">
          <span v-for="(item,index) in publishTypeOption" :key="index">
            <span v-if="scope.row.publishType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启禁用" prop="status">
        <template slot-scope='scope'>
          {{scope.row.status == '0' ? "启用" : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="采购员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="采购员姓名" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" label="采购员部门" prop="departName">
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
          <span>手工结算</span>
          <!-- <span v-for="item in paymentsMeansOptions">
            <span v-if="scope.row.paymentsMeans ===item.value">{{item.label}}</span>
          </span> -->
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormsVisible" v-if="dialogFormsVisible" width="60%">
      <supplier-form :id="id" :paymentsMeansOptions="paymentsMeansOptions"
                     :supplierCode="supplierCode"
                     :collectionTermsOptions="collectionTermsOptions"
                     :selectedAuthenticationType="selectedAuthenticationType"
                     :selectedBillStatus="selectedBillStatus"
                     @submitWarning="submitWarning"
                     @submitSuccess="submitSuccess"
                     ref="supplierForm" v-if="dialogFormsVisible"></supplier-form>
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
    <component :is="plugItem" v-for="(plugItem, plugIndex) in plugs" :key='plugIndex'
               :visible.sync="dialogDialogVisible"
               :close-on-click-modal="false"
               :supplierCode="supplierCode"
               @submitSuccess="submitSuccess"
               @handleSubmmitDialog="handleSubmmitDialog"
               @handleDialogClose="dialogDialogVisible = false;dialogFormsVisible = false"
               @handleCertificateClose="dialogDialogVisible = false;dialogFormsVisible = false"
               :id="billId" :dialogFormVisible="dialogDialogVisible" taskType="notNow"></component>
  </div>
</template>

<script>
  import {page, batchDel, updateStatus, batchUpdate,updateSupplierBlack,getObj } from '@/api/erp/purchase/supplier/index';
  import {addBill } from '@/api/erp/srm/supplierAuth';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {page as payMeansPage} from '@/api/erp/financial/financialPaymentsMeans';
  import { getToken } from '@/utils/auth'

  export default {
    name: 'supplierList',
    components: {
      'supplier-form': () => import('./supplierForm'),
      'supplier-view': () => import('./supplierView'),
      'supplier-certification': () => import('./supplierCertification'),
      'supplier-manager': () => import('@/components/ERP/User/user')
    },
    data() {
      return {
        type: 'add',
        dialogFormVisible: false,//供应商详情页面展示条件
        certificationVisible: false,
        isView:false,
        isCertification:false,
        billDate:undefined,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        selectedBillStatus:undefined,
        selectedAuthenticationType:undefined,
        dialogStatus: '',
        dialogFormsVisible: false,
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
          blackType: 0
        },
        publishTypeOption:[
          {
            value:1,
            label:'调拨'
          },
          {
            value:2,
            label:'闲置'
          },
        ],
        supplierTypes:[{
          value:'0',
          label:'厂家'
        },{
          value:'1',
          label:'代理商'
        },{
          value:'2',
          label:'经销商'
        }],
        plugs: [],
        collectionTermsOptions: [],
        paymentsMeansOptions: [],
        supplierGrades: [{
          value: '0',
          label: '一级'
        }, {
          value: '1',
          label: '二级'
        },{
          value: '2',
          label: '三级'
        }],
        textMap: {
          update: '编辑供应商',
          create: '创建供应商'
        },
        authenticationTypes: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        selectedRows: [],
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
      '$route.query': function (val) {
        this.dialogDialogVisible = false
      },
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
      handleSubmmitDialog() {
        this.dialogDialogVisible = false;
        this.getList()
      },
      submitSuccess() {
        this.dialogDialogVisible = false;
        this.dialogFormsVisible = false;
        this.isLoading = false;
        this.getList()
      },
      handleCancel() {
        this.dialogFormVisible = false
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
          updateSupplierBlack(this.selectedRows[0].id,1)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '加入黑名单成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            });
        });
      },
      handleViewSupplier(id){
          this.billId = id;
          this.plugs = [];
          this.dialogDialogVisible = true;
          console.log('查看详情');
          this.plugs.push(() => import(`@/views/erp/purchase/supplier/supplierInfo/supplierView`));
      },
      certificationBtn(){
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
        this.supplierCode = this.selectedRows[0].supplierCode;
        if(this.selectedRows[0].authenticationType == '0' && this.selectedRows[0].billStatus == '4'){
          this.billId = this.id;
          this.plugs = [];
          this.plugs.push(() => import(`@/views/erp/purchase/supplier/supplierInfo/supplierCertificationForm`));
          this.dialogDialogVisible = true;
        }else if(Number(this.selectedRows[0].billStatus) != '4') {
          this.$notify({
            title: '提示',
            message: '仅单据正常时可认证!',
            type: 'success',
            duration: 2000
          });
        } else {
          this.$notify({
            title: '提示',
            message: '该供应商已认证!',
            type: 'success',
            duration: 2000
          });
        }

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
        this.dialogDialogVisible = false
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
        this.listQuery.publishType = '';
        this.listQuery.status = '';
        this.listQuery.departName = '';
        this.billDate = undefined;
        this.listQuery.supplierType = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate =undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.authenticationType = undefined;
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
        this.dialogFormsVisible = true;
        this.dialogDialogVisible = false
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
        this.dialogDialogVisible = false
        this.selectedAuthenticationType = this.selectedRows[0].authenticationType;
        this.selectedBillStatus = this.selectedRows[0].billStatus;
        this.id = this.selectedRows[0].id;
        this.dialogFormsVisible = true;
        this.dialogStatus = 'update';
      },
      handlerCancel() {
        this.dialogFormsVisible = false;
      },
      handlerOnSubmit() {
        this.isLoading = true;
        this.$refs.supplierForm.onSubmit();
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
        console.log(this.dialogDialogVisible);
        // this.dialogDialogVisible = false
        // this.dialogFormsVisible = false
        // this.dialogFormVisible = false
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
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
      //文件上传
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
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
      }
    },
  }
</script>

<style>

</style>
