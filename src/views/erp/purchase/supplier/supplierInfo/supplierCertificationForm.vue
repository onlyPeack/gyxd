<template>
   <el-dialog :visible.sync="dialogFormVisible" @close="handleCertificateClose" width="70%" class="billFormDialog billDetailDialog">
    <!-- <span>认证页面</span> -->
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
    <el-tabs v-model="activeName" class="authenticationTabs">
      <el-tab-pane label="供应商协议" name="fifth">
        <el-button type="text" icon="el-icon-plus" @click="insertBtn(5)">添加</el-button>
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='文件名称' min-width="180">
          </el-table-column>
          <el-table-column prop="validity" label="有效期至" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
                <el-button type="text" icon="el-icon-delete" @click="delAccessory(scope.row.id)">删除</el-button>
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
        <el-button type="text" icon="el-icon-plus" @click="insertBtn(6)">添加</el-button>
        <el-table :data="trademarkTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="trademarkTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label='文件名称' min-width="180">
          </el-table-column>
          <el-table-column prop="validity" label="有效期至" width="220">
          </el-table-column>
          <el-table-column prop="opt;" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div>
                <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
                <el-button type="text" icon="el-icon-delete" @click="delAccessory(scope.row.id)">删除</el-button>
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
    </el-tabs>
    <el-dialog :title="publicMap[publicIndex].label" :visible.sync="publicVisible" v-if="publicVisible" append-to-body>
      <div class="center-container">
        <el-form :model="publicForm" :rules="publicRules" ref="publicForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td>
                <el-form-item label="供应商协议:" prop="accessoryType" class="el-form-flex">
                  <el-select v-model="publicForm.accessoryType" placeholder="请选择" :disabled="true" style="width:160px">
                    <el-option
                      v-for="item in accessoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td v-if="activeName != 'sixth'">
                <el-form-item label="有效期至" prop="validity" class="el-form-flex">
                  <el-date-picker
                    v-model="publicForm.validity"
                    style="width:160px"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="上传文件" prop="name" class="el-form-flex">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
      <!-- 
      <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!=''">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!=''" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
      </div>
      <el-button v-if="taskType=='now'" @click="handleClose">取 消</el-button>
    </div> -->
    </el-dialog>
 <span slot="footer" class="dialog-footer">
   <task-history v-if="billNo && processId && processId!=''" :processId="processId"
                    :billNo="billNo"></task-history>
        <el-button class="filter-item" @click="handleCertificateClose()">取消</el-button>
        <el-button class="filter-item" type="primary" icon="edit" @click="handlerCertificationOnSubmit()"
                   :loading="isLoading">提交</el-button>
      </span>
      <!-- 图片预览 -->
    <img-viewer ref="viewer"/>
  </el-dialog>
</template>

<script>
  import {uploadPath} from '@/api/erp/goods/storage'
  import {addBill } from '@/api/erp/srm/supplierAuth';
  import {addObj, getObj, getAuth, page, putObj, getSupplierAuth} from '@/api/erp/purchase/supplier/index'
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import ImgViewer from '@/components/imgViewer/imgViewer'
  import {
    addObj as attachmentAddObj,
    page as selectSupplierAttachment,
    delObj as attachmentDelObj,
    selectSupplierAttachment as selectSupplierAttachments,
    deleteBill,deleteFile
  } from '@/api/erp/srm/srmAttachment';

  export default {
    name: "supplierCertification",
    props: ['id','type','supplierCode','taskType','dialogFormVisible','step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory'),
      ImgViewer
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
        // legalRepresentativeQuery:{
        //   page: 1,
        //   limit: 10,
        //   accessoryType: 8
        // },
        brandAuthorizationTableData:[],
        brandAuthorizationTotal:0,
        authorizationTotal: 0,
        trademarkVisible: false,
        trademarkTableData: [],
        trademarkTotal: 0,
        dataForm: {
          supplierCode: '',
          supplierName: ''
        },
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
            label: '添加供应商协议'
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
        imgList:[]
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
        // window.open(url, '_blank');
        if(url.indexOf('jpg') > -1 || url.indexOf('JPG') > -1 || url.indexOf('jpeg') > -1 || url.indexOf('png') > -1 || url.indexOf('bmp') > -1) {
          this.imgList = [{
            source:url,
            thumbnail:url
          }]
          this.$refs.viewer.show(
           this.imgList,
            0
          );
        } else {
          window.open(url, '_blank');
        }
      },
      handleCertificateClose() {
        this.$emit('handleCertificateClose')
        this.dialogFormVisible = false
      },
       handlerCertificationOnSubmit(){
         if(this.trademarkTableData.length < 1) {
           this.$message.warning('认证为SRM供应商，需要上传认证资料，才能认证成功!')
         } else {
           this.certificationVisible = false;
           getObj(this.id)
             .then(response => {
              if(response.code == 2000){
                addBill({supplierCode:response.data.supplierCode,supplierName:response.data.supplierName}).then(res=>{
                  if(res.code == 2000) {
                   this.$message.success('认证成功');
                   this.getList();
                  } else {
                    this.$message.warning(res.msg);
                  }
                 this.dialogFormVisible = false
                 this.$emit('submitSuccess')
                })
              }
             });
         }
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
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
        console.log('id');
        console.log(this.id);
        if (this.id != '') {
          // 供应商详情
          getObj(this.id)
          .then(response => {
            this.dataForm = response.data;
            this.getList()
          });
          let obj = {
            page:1,
            limit:10,
          }
          // 供应商流程
          getSupplierAuth(obj,this.supplierCode).then(res => {
            let id = res.data.records[0].id
            getAuth(id)
            .then(response => {
              this.dataForm = response.data;
              this.billNo = response.data.billNo;
              console.log('billNo');
            console.log(this.billNo);
              var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
              this.getProcessId(billPrefix)
            });
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
        this.publicForm.accessoryType = index;

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
          // if(this.activeName == 'first'){
          //   this.fileList = res.list;
          // }else{
          //   this.fileListLast= res.list;
          // }
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
  .viewer-container {
    z-index: 3000;
  }
  .authenticationTabs {
    position: relative;
  }
  .authenticationTabs::before {
    position: absolute;
    content: '*';
    color: red;
    left: -10px;
    top: 10px;
  }
</style>
