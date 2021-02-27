<template>
   <el-dialog :visible.sync="dialogFormVisible" @close="handleCertificateClose" width="70%" class="billFormDialog billDetailDialog">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商编号" prop="supplierCode">
            <el-input v-model="dataForm.supplierCode" placeholder="请输入供应商编号" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商全称" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="请输入供应商全称" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="品牌授权(仅限授权经销商卖家)" name="first">
        <el-table :data="brandAuthorizationTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="authorizationTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
                  <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
                    {{item.label}}
                  </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleAuthorizationSizeChange"
                         @current-change="handleAuthorizationChange"
                         :current-page="brandAuthorationListQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="brandAuthorationListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="brandAuthorizationTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="代理证书" name="second">
        <el-table :data="authorizationTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="authorizationTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
                  <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
                    {{item.label}}
                  </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleAuthorizationSizeChange"
                         @current-change="handleAuthorizationChange"
                         :current-page="authorizationListQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="authorizationListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="authorizationTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商标注册证明(仅限生产厂家卖家)" name="third">
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
              <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
              {{item.label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleTrademarkSizeChange" @current-change="handleTrademarkChange"
                         :current-page="trademarkListQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="trademarkListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="trademarkTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="供应商认证资料" name="fourth">
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
              <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
              {{item.label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleTrademarkSizeChange" @current-change="handleTrademarkChange"
                         :current-page="trademarkListQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="trademarkListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="trademarkTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公司营业执照" name="eighth">
        <div style="display: flex;flex-direction: row;justify-content: start;">
          <div>
            <el-upload
              :action="uploadPath"
              :class="type == 'add'?'add_class':'view_class'"
              list-type="picture-card"
              :on-preview="handleCompanyCardPreview"
              :on-success="handleCompanyCardSuccess"
              :on-remove="handleCompanyRemove"
              :show-file-list="true"
              :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogCompanyVisible">
              <img width="100%" :src="dialogCompanyImageUrl" alt="">
            </el-dialog>
          </div>
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="供应商协议" name="fifth">
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
              <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
              {{item.label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleTrademarkSizeChange" @current-change="handleTrademarkChange"
                         :current-page="supplierAgreementQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="supplierAgreementQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="trademarkTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="法人代表有效证明(身份证、护照、港澳台通行证)" name="sixth">
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
              <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
              {{item.label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleTrademarkSizeChange" @current-change="handleTrademarkChange"
                         :current-page="trademarkListQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="trademarkListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="trademarkTotal">
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="其他" name="seventh">
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='证书' min-width="180">
          </el-table-column>
          <el-table-column prop="accessoryType;" label="证书类型" width="120">
            <template slot-scope="scope">
              <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
              {{item.label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="validity" label="有效期" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleTrademarkSizeChange" @current-change="handleTrademarkChange"
                         :current-page="otherQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="otherQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="trademarkTotal">
          </el-pagination>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <el-dialog :title="publicMap[publicIndex].label" :visible.sync="publicVisible" v-if="publicVisible" append-to-body>
      <div class="center-container">
        <el-form :model="publicForm" :rules="publicRules" ref="publicForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td>
                <el-form-item label="证书类型:" prop="accessoryType" class="el-form-flex">
                  <el-select v-model="publicForm.accessoryType" placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="item in accessoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="有效期" prop="validity" class="el-form-flex">
                  <el-date-picker
                    v-model="publicForm.validity"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="证件名称" prop="name" class="el-form-flex">
                  <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                             :on-success="handleFileSuccess"
                             :on-remove="handleFileRemove"
                             :file-list="attachmentList">
                    <svg-icon icon-class="add"></svg-icon>
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </el-dialog>
    <task-history v-if="billNo && processId && processId!=''" :processId="processId"
                    :billNo="billNo"></task-history>
      <div slot="footer" class="dialog-footer">
        <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
          <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
        </div>
        <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
          <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                    v-if="dataForm.billStatus!=5">驳 回
          </el-button>
          <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
        </div>
        <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        </div>
        <el-button v-if="taskType=='now'" @click="handleCertificateClose">取 消</el-button>
      </div>
     <!-- <div slot="footer" class="dialog-footer">
        <el-button class="filter-item" @click="handleCertificateClose()">取消</el-button>
      </div> -->
  </el-dialog>
</template>

<script>
  import {uploadPath} from '@/api/erp/goods/storage'
  import {addBill } from '@/api/erp/srm/supplierAuth';
  import {certificationAuditBill, addObj, getObj, getAuth, page, putObj, getSupplierAuth} from '@/api/erp/purchase/supplier/index'
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {
    addObj as attachmentAddObj,
    page as selectSupplierAttachment,
    delObj as attachmentDelObj,
    selectSupplierAttachment as selectSupplierAttachments,
    deleteBill,deleteFile
  } from '@/api/erp/srm/srmAttachment';

  export default {
    name: "supplierCertification",
    props: ['id','type','supplierCode','taskType','dialogFormVisible','step','taskType'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        uploadPath,
        rules: {},
        billNo:undefined,
        dialogCompanyImageUrl: '',
        dialogCompanyVisible: false,
        dialogRepresentativeImageUrl: '',
        dialogRepresentativeVisible: false,
        activeName: 'fifth',
        authorizationVisible: false,
        authorizationTableData: [],
        processId:undefined,
        isLoading:false,
        // 品牌授权
        brandAuthorationListQuery:{
          page: 1,
          limit: 10,
          accessoryType: 1
        },
        // 代理证书
        authorizationListQuery: {
          page: 1,
          limit: 10,
          accessoryType: 2
        },
        trademarkListQuery: {
          page: 1,
          limit: 10,
          accessoryType: 3
        },
        corporateRepresentativeQuery:{
          page: 1,
          limit: 10,
          accessoryType: 4
        },
        supplierAgreementQuery:{
          page: 1,
          limit: 10,
          accessoryType: 5
        },
        representativeQuery:{
          page: 1,
          limit: 10,
          accessoryType: 6
        },
        otherQuery:{
          page: 1,
          limit: 10,
          accessoryType: 7
        },
        authorizationTotal: 0,
        trademarkVisible: false,
        trademarkTableData: [],
        trademarkTotal: 0,
        dataForm: {
          supplierCode: '',
          supplierName: ''
        },
        certificationDataForm:{},
        publicMap: [
          {
            value: 0,
            label: '新建品牌授权'
          },
          {
            value: 1,
            label: '修改品牌授权'
          },
          {
            value: 2,
            label: '新建商标注册证明'
          },
          {
            value: 3,
            label: '修改商标注册证明'
          },
          {
            value: 4,
            label: '修改供应商认证资料'
          },
          {
            value: 5,
            label: '修改供应商协议'
          },
          {
            value: 6,
            label: '新建法人代表有效证明'
          },
          {
            value: 7,
            label: '修改其他资料'
          },
        ],
        publicIndex: 0,
        publicVisible: false,
        publicForm: {},
        publicRules: {},
        attachmentList: [],
        comment:undefined,
        isRejectLoading: false,
        isAgreeLoading: false,
        accessoryOptions: [
          {
            value: 1,
            label: '品牌授权证书',
          },
          {
            value: 2,
            label: '代理证书',
          },
          {
            value: 3,
            label: '生产证书',
          },
          {
            value: 4,
            label: '供应商认证资料',
          },
          {
            value: 5,
            label: '供应商协议',
          },
          {
            value: 6,
            label: '法人代表有效证明',
          },
          {
            value: 8,
            label: '营业执照',
          },
          {
            value: 7,
            label: '其他',
          },
        ],
        fileList: [],
        fileListLast: [],
        brandAuthorizationTableData:[],
        brandAuthorizationTotal:0
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      activeName(val) {
        if (val == 'eighth') {
          this.getUrlList();
          } else {
          this.getList();
        }
      }
    },
    methods: {
       showDetail(url) {
        window.open(url, '_blank');
      },
      handleCertificateClose() {
        this.$emit('handleCertificateClose')
        this.dialogFormVisible = false
      },
       handlerCertificationOnSubmit(){
        this.certificationVisible = false;
        getObj(this.id)
          .then(response => {
           if(response.code == 2000){
             addBill({supplierCode:response.data.supplierCode,supplierName:response.data.supplierName}).then(res=>{
               if(res.code == 2000) {
                this.$message.success('认证成功');
                this.$emit('handleSubmmitDialog')
                this.getList();
               } else {
                 this.$message.warning(res.msg);
               }
              this.dialogFormVisible = false
             })
           }
          });
      },
      handleAuditBill(val) {
        this.certificationDataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'certificationDataForm', certificationAuditBill, 'submitDetailSuccess');
      },
       delAccessory(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          attachmentDelObj(id).then(res => {
            if (res.code == 2000) {
              this.vueMessage('success', '删除成功!');
            } else {
              this.vueMessage('warning', res.msg);
            }
            this.getList();
          })
        });

      },
      init() {
        if (this.id != '') {
          let obj = {
            page:1,
            limit:10,
          }
          getAuth(this.id).then(res => {
            this.certificationDataForm = res.data;
            this.billNo = res.data.billNo;
            let billPrefix = res.data.billNo.replace(/[^a-z]+/ig, "");
            getProcessId({
              billPrefix: billPrefix
            }).then(res => {
              this.processId = res
            })
            getSupplierAuth(obj,res.data.supplierCode).then(response => {
              let id = response.data.records[0].id
              // 供应商详情
              let supplierId = response.data.records[0].supplierId;
              getObj(supplierId)
              .then(response => {
                this.dataForm = response.data;
                this.getList();
              });
            })
          })
        } 
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
      handleAuthorizationSizeChange(val) {
        this.authorizationListQuery.limit = val;
      },
      handleAuthorizationChange(val) {
        this.authorizationListQuery.page = val;
      },
      handleTrademarkSizeChange(val) {
        this.trademarkListQuery.limit = val;
      },
      handleTrademarkChange(val) {
        this.trademarkListQuery.page = val;
      },
      handleCompanyRemove(file, fileList) {
        this.deleteBill(file);
      },
      handleCompanyCardPreview(file) {
        this.dialogCompanyImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleCompanyCardSuccess(response, file, fileList) {
        let queryObj = {
          name: response.data.name,
          url: response.data.url,
          size: response.data.size,
          supplierCode: this.dataForm.supplierCode,
          accessoryType: this.activeName == 'first' ? 1 : 4
        };
        this.fileList.push(response.data);
        if (response.code == 2000) {
          attachmentAddObj(queryObj).then(res => {
            this.getUrlList();
          })
        }
      },
      handleRepresentativeCardSuccess(response, file, fileList) {
        let queryObj = {
          name: response.data.name,
          url: response.data.url,
          size: response.data.size,
          supplierCode: this.dataForm.supplierCode,
          accessoryType: this.activeName == 'first' ? 1 : 4
        };
        this.fileListLast.push(response.data);
        if (response.code == 2000) {
          attachmentAddObj(queryObj).then(res => {
            this.getUrlList();
          })
        }
      },
      handleRepresentativeRemove(file, fileList) {
        this.deleteBill(file);
      },
      deleteBill(file){
        deleteFile(file.id).then(res=>{
          this.getUrlList();
        })
      },
      handleRepresentativeCardPreview(file) {
        this.dialogRepresentativeImageUrl = file.url;
        this.dialogRepresentativeVisible = true;
      },
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },
      insertBtn(index) {
        this.publicVisible = true;
        this.publicIndex = index;
        this.publicForm.accessoryType = index == 0 || index == 1 ? 2 : 3;
      },
      handleClose() {
        this.publicVisible = false;
      },
      handleConfirm() {
        let queryObj = {
          name: this.attachmentList[0].name,
          url: this.attachmentList[0].url,
          size: this.attachmentList[0].size,
          supplierCode: this.dataForm.supplierCode,
          validity: this.publicForm.validity,
          accessoryType: this.publicForm.accessoryType
        };
        attachmentAddObj(queryObj).then(res => {
          if (res.code == 2000) {
            this.attachmentList = [];
            this.publicForm = {
              validity: '',
              name: '',
              accessoryType: undefined
            };
            this.vueMessage('success', '新增成功!');
            this.publicVisible = false;
            this.getList();
          } else {
            this.vueMessage('warning', res.msg);
          }
        })
      },
      getList() {
        let obj = undefined;
        if (this.activeName == 'first') {
          obj = this.brandAuthorationListQuery;
        }
        if (this.activeName == 'second') {
          obj = this.authorizationListQuery;
        }
        if (this.activeName == 'third') {
          obj = this.trademarkListQuery;
        }
        if (this.activeName == 'fourth') {
          obj = this.corporateRepresentativeQuery;
        }
        if (this.activeName == 'fifth') {
          obj = this.supplierAgreementQuery;
        }
        if (this.activeName == 'sixth') {
          obj = this.representativeQuery;
        }
        if (this.activeName == 'seventh') {
          obj = this.otherQuery;
        }
        obj.supplierCode =  this.dataForm.supplierCode;
        selectSupplierAttachment(obj).then(res => {
          if (this.activeName == 'first') {
            this.brandAuthorizationTableData = res.records;
            this.brandAuthorizationTotal = res.total;
          } else if (this.activeName == 'second') {
            this.authorizationTableData = res.records;
            this.authorizationTotal = res.total;
          } else {
            this.trademarkTableData = res.records;
            this.trademarkTotal = res.total;
          }
        })
      },
      getUrlList() {
        selectSupplierAttachments({accessoryType:8, supplierCode: this.dataForm.supplierCode,}).then(res=>{
          this.fileList= res.list;
        })
      }
    }
  }
</script>

<style lang="scss">
  .view_class{
    .el-upload--picture-card{
      display: none;
    }
  }
</style>
