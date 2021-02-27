<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增批量费用划拨</span>
        <span v-if="dataForm.id">编辑批量费用划拨</span>
        <el-upload class="upload"  action="/api/financial/expenseTransferBatch/importFile" :before-upload="beforeUpload"
          :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
          style="display:inline;" :on-success="uploadCompleted">
          <el-button type="text" icon="el-icon-upload2">
            导入(最多导入500条)
          </el-button>
        </el-upload>
        <el-button type="text" icon="el-icon-download">
          <a target="_blank" href="/api/financial/expenseTransferBatch/exportFile">下载导入模板</a>
        </el-button>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="payOrgName" class="el-form-flex">
                <el-input v-model="dataForm.billNo" :disabled="true" type="input" placeholder="自动生成"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" :disabled="true" align="right" type="datetime"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="审批状态:" prop="billStatus" class="el-form-flex">
                <el-select v-model="dataForm.billStatus" disabled>
                  <el-option v-for="item in statusOptions" :key="item.value" :value="item.value"
                             :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="附件:" class="el-form-flex">
                <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                           :on-success="handleFileSuccess"
                           :on-remove="handleFileRemove"
                           :file-list="attachmentList"
                           style="display: inline-block">
                  <svg-icon icon-class="add" style="margin-top: 13px;"></svg-icon>
                </el-upload>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <!--<el-upload class="upload" action="/api/financial/expenseTransferBatch/importFile" :before-upload="beforeUpload"-->
               <!--:show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"-->
               <!--style="display:inline;" :on-success="uploadCompleted" :headers="headers">-->
      <!--<el-button type="text" icon="el-icon-download">-->
        <!--导入模板-->
      <!--</el-button>-->
    <!--</el-upload>-->

    <!--<el-button type="text" icon="el-icon-download" @click="handleExportFile">-->
      <!--下载模板-->
    <!--</el-button>-->

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" :rules="rules1">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="transferIn" label="划入员工" width="150" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleUserSelector('in',scope.$index)">
            <el-input v-model="scope.row.transferIn" readonly suffix-icon="el-icon-more"></el-input>
          </div>
          <span>{{scope.row.transferIn}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="划入账户类型" width="150" class-name="col-required">
        <template slot-scope="scope">
          <div  v-if="scope.row && scope.row.accountInCategory == 1">
            <el-select v-model="scope.row.accountInType" @change="handleChangeSubject($event,scope.$index)">
              <el-option v-for="item in accountTypeList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <!-- <span>{{scope.row.subjectNo}}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="transferOut" label="划出员工" width="150" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleUserSelector('out',scope.$index)">
            <el-input v-model="scope.row.transferOut" readonly suffix-icon="el-icon-more"></el-input>
          </div>
          <!-- <span>{{scope.row.transferOut}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="types"  label="划出账户类型" width="150" class-name="col-required">
        <template slot-scope="scope">
          <div  v-if="scope.row && scope.row.accountOutCategory == 1">
            <el-select v-model="scope.row.accountOutType" @change="handleChangeSubject($event,scope.$index)">
              <el-option v-for="item in accountTypeList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <!-- <span>{{scope.row.subjectNo}}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="transferMoney" label="划拨金额" align="right" width="150" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferMoney" class="right-el-input"
                    @change="handleEdit($event,scope.$index,scope.row)"
                    ></el-input>
          <!-- <span>{{scope.row.amount}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="subjectNo" label="科目编号" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.subjectNo" @change="handleChangeSubject($event,scope.$index)">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name"
                       :value="item.number"></el-option>
          </el-select>
          <!-- <span>{{scope.row.subjectNo}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="subjectName" label="划拨类型" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.subjectName" readonly></el-input>
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" >
        <template slot-scope="scope">
          <el-input v-model="scope.row.note"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <el-dialog title="请选择账户" width="45%" :visible.sync="userVisible" append-to-body
               @before-close="closeUserDialog">
      <take-account-selector @closeAccountDialog="closeUserDialog" ref="userSelector"></take-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handleCancelUser">取 消</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitUser" type="primary"
                   icon="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 员工列表弹窗-->
    <!--<el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>-->
      <!--<user-selector @closeUserDialog="closeUserDialog" :isSingle="true"-->
                     <!--ref="userSelector"></user-selector>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="handleCancelUser">取 消</el-button>-->
        <!--<el-button type="primary" @click="handleSubmitUser">确 定</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

    <!-- 弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, exportFile} from '@/api/erp/financial/expenseTransferBatch';
  import {uploadPath} from '@/api/erp/goods/storage';
  import {page} from '@/api/erp/financial/account';
  import {getToken} from '@/utils/auth'


  export default {
    name: "expenseTransferBatchForm",
    components: {
      'user-selector': () => import('@/components/ERP/User/user'),
      'take-account-selector': () => import('./components/takeAccountSelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        accountTypeList:[
          {
            label:'利润账户',
            value:'A',
          },{
           label:'可用资金',
            value:'B',
          }
        ],
        accountVisible: false,
        uploadPath,
        headers: null,
        fileList: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: 2,
          attachment: [],
          note: undefined,
          items: []
        },
        items: [],
        attachmentList: [],
        accountList: [],
        userVisible: false,
        userType: undefined,
        userIndex: undefined,
        rules: {},
        rules1: {},
      };
    },
    created() {
      this.headers = {
        Authorization: getToken()
      };
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };

      page({page: 1, limit: 100}).then(response => {
        this.accountList = response.data.records;
      });
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      closeAccountDialog(){

      },
      handleCancelAccount(){

      },
      handleSubmitAccount(){

      },
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          var lastItem = this.items[this.items.length - 1];
          if (!lastItem.transferIn || lastItem.transferIn == '') {
            this.items.splice(this.items.length - 1);
          }
          for (var i in response.data) {
            this.items.push(response.data[i]);
          }
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          });
        } else {
          this.$notify({
            title: '失败',
            message: '导入失败',
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleExportFile() {
        exportFile().then(msg => {
          var blob = msg;
          var reader = new FileReader();
          reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement('a');
            a.download = '费用批量划拨导入模板.xlsx';
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        });
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 99;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (240 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              if(this.dataForm.billStatus=='1'){
                this.dataForm.billStatus = "暂存";
              }
              console.log(this.dataForm.billStatus);
              this.attachmentList = this.dataForm.attachment ? JSON.parse(this.dataForm.attachment) : [];
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date + ' 00:00:00';
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          transferInOffice: undefined,
          transferIn: undefined,
          transferOutOffice: undefined,
          transferOut: undefined,
          transferMoney: undefined,
          subjectNo: undefined,
          subjectName: undefined,
          note: undefined,
        };
        this.items.push(d);
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length;
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(val, index, row) {
        if (val != undefined && val != '') {
          val = Number(val).toFixed(4);
          this.vueSet(this.items[index], 'transferMoney', val);
        } else {
          this.vueSet(this.items[index], 'transferMoney', '0.0000');
        }
      },
      handleChangeSubject(val, index) {
        for (var i in this.accountList) {
          if (this.accountList[i].number == val) {
            this.items[index].subjectName = this.accountList[i].name;
            return;
          }
        }
      },
      /*附件*/
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },

      // 员工选择
      handleUserSelector(type, index) {
        this.userType = type;
        this.userIndex = index;
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.userSelector.reset();
        this.userVisible = false;
        this.userType = undefined;
        this.userIndex = undefined;
      },
      handleSubmitUser() {
        this.$refs.userSelector.onSubmit();
      },
      closeUserDialog(list) {
        if (list.length > 0) {
          if (this.userType == 'in') {
            this.items[this.userIndex].transferIn = list[0].accountCode;
            this.items[this.userIndex].accountInCategory = list[0].type;
            if(this.items[this.userIndex].accountInCategory == 6){
              this.items[this.userIndex].accountInType = ''
            }
          } else {
            this.items[this.userIndex].transferOut = list[0].accountCode;
            this.items[this.userIndex].accountOutCategory = list[0].type;
            if(this.items[this.userIndex].accountOutCategory == 6){
              this.items[this.userIndex].accountOutType = ''
            }

          }
          this.$refs.userSelector.reset();
        }
        this.userVisible = false;
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true;
            } else {
              _this.isFormLoading = true;
            }

            _this.dataForm.items = _this.items;

            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }

              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                _this.$emit(subFunSuccessName);
              } else {
                _this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }
            })
          } else {
            return false;
          }
        })
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataForm.attachment = this.attachmentList;
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataForm.attachment = this.attachmentList;
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (!this.items[i].transferIn || this.items[i].transferIn == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的划入员工为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].accountInType ||  this.items[i].accountInType == '' ) {
            if(this.items[i].accountInCategory == 1){
              this.$message.error('第' + (i * 1 + 1) + '行的划入账户类型为必填项，请填写了再提交');
              return;
            }
          }
          if (!this.items[i].transferOut || this.items[i].transferOut == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的划出员工为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].accountOutType ||  this.items[i].accountOutType == '' ) {
            if(this.items[i].accountOutCategory == 1){
              this.$message.error('第' + (i * 1 + 1) + '行的划出账户类型为必填项，请填写了再提交');
              return;
            }
          }
          if (!this.items[i].subjectNo || this.items[i].subjectNo == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的科目编号为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].subjectName || this.items[i].subjectName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的划拨类型为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].transferMoney || this.items[i].transferMoney == ''
            || this.items[i].transferMoney == '0.00' || this.items[i].transferMoney == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的划拨金额为大于0的数字，请填写了再提交');
            return;
          }
          if (!this.items[i].note || this.items[i].note == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的备注为必填项，请填写了再提交');
            return;
          }

        }
        return true;
      }
    },
  }
</script>

