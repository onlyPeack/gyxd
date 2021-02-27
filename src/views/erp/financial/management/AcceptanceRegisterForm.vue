<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增承兑登记单</span>
        <span v-if="dataForm.id">编辑承兑登记单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input :value="dataForm.billNo ? dataForm.billNo : '单据编号由系统自动生成'" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                <div @click.stop="handleCustomerSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.customerName" closable @close="handleCustomerDel()">
                    {{dataForm.customerCode+'/'+dataForm.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="汇票类型:" prop="acceptanceType" class="el-form-flex">
                <el-select v-model="dataForm.acceptanceType" size="small" placeholder="">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="到款银行:" prop="toBankCode" class="el-form-flex">
                <div @click.stop="handleAcceptanceSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.toBankCode" closable>
                    {{dataForm.toBankCode + '/' + dataForm.companyAccount}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="公司承兑账户:" prop="comanyAccount" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span  v-if="dataForm.companyAccount">
                    {{dataForm.toBankCode + '/' + dataForm.companyAccount}}
                  </span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:">
                <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                           :on-success="handleFileSuccess"
                           :on-remove="handleFileRemove"
                           :file-list="dataForm.attachment">
                  <svg-icon icon-class="add" style="margin-top: 12px;"></svg-icon>
                </el-upload>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号" width="160" class-name="col-required">
        <template slot-scope="scope">
          <div style="cursor: pointer;">
            <el-input size="mini" v-model="scope.row.draftNo" class="right-el-input"
                      @change="handleEdit(scope.$index, scope.row , 'draftNo', $event)"></el-input>
            <span>{{scope.row.draftNo}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="paymentBankFullName" label="付款银行全称" width="160" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.paymentBankFullName" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'paymentBankFullName', $event)"></el-input>
          <span>{{scope.row.paymentBankFullName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dateOfIssue" label="出票日" width="128" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.dateOfIssue" type="date" value-format="yyyy-MM-dd"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.dateOfIssue}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="draftExpireDate" label="汇票到期日" width="128" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.draftExpireDate" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.draftExpireDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amt" label="出票金额" width="100" align="right" class-name="col-required">
      <template slot-scope="scope">
        <el-input size="mini" v-model="scope.row.amt" class="right-el-input"
                  @change="handleEdit(scope.$index, scope.row , 'amt', $event)"
                  @input="handleInputFun($event, scope.row, 'amt')"></el-input>
        <span>{{scope.row.amt}}</span>
      </template>
    </el-table-column>
      <el-table-column prop="monthRate" label="月利率(%)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.monthRate" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'monthRate', $event)"
                    @input="handleInputFun($event, scope.row, 'monthRate')"></el-input>
          <span>{{scope.row.monthRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="贴息额" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.discount" class="right-el-input"></el-input>
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fee" label="手续费" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.fee" class="right-el-input"></el-input>
          <span>{{scope.row.fee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alreadyChange" label="已找零金额" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.alreadyChange" class="right-el-input"></el-input>
          <span>{{scope.row.alreadyChange}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hands" label="几手背书" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.hands" class="right-el-input"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.hands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isAllopatry" label="付款行是否异地" width="120" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isAllopatry" size="small" placeholder=""
                     :disabled="scope.row.sourceBillId?true:false"
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in allopatryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.isAllopatry}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isFlaw" label="是否有瑕疵" width="90" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isFlaw" size="small" placeholder=" "
                     :disabled="scope.row.sourceBillId?true:false"
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in allopatryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.isFlaw}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isGiveChange" label="是否可以找零" width="120" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isGiveChange" size="small" placeholder=" "
                     :disabled="scope.row.sourceBillId?true:false"
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in allopatryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.isGiveChange}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="请选择到款银行" :visible.sync="acceptanceVisible" append-to-body>
      <acceptance-account-selector @closeAccountDialog="closeAccountDialog"
                               :isSelect="isSelect" :isSingle="true"
                               ref="acceptance"></acceptance-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAcceptance">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAcceptance">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增采购订单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/acceptanceRegister';
  import {uploadPath} from '@/api/erp/goods/storage';

  export default {
    name: 'sales-invoice-form',
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'acceptance-account-selector': () => import('../components/acceptanceAccountSelector'),

    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        uploadPath,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        isSelect: false,
        acceptanceVisible: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billStatus: undefined,
          billDate: undefined,
          acceptanceType: undefined,
          toCompany: 'gxcl',
          toBankCode: undefined,
          customerCode: undefined,
          customerName: undefined,
          companyAccount: undefined,
          note: undefined,
          attachment: [],
          items: [],
        },
        items: [],
        customerArr: [],
        sourceBillNoArr: [],
        customerVisible: false,
        typeOptions: [
          {
            value: '0',
            label: '纸质承兑',
          },
          {
            value: '1',
            label: '电子承兑',
          }
        ],
        allopatryOptions: [
          {
            value: '0',
            label: '是',
          }, {
            value: '1',
            label: '否',
          }
        ],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择开票日期',
              trigger: 'blur'
            }
          ],
          acceptanceType: [
            {
              required: true,
              message: '请选择汇票类型',
              trigger: 'blur'
            }
          ],
          customerName: [
            {
              required: true,
              message: '请选择客户',
              trigger: 'blur'
            }
          ],
          toBankCode: [
            {
              required: true,
              message: '请选择到款银行',
              trigger: 'blur'
            }
          ],
        },
        list: null,
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      closeAccountDialog(list) {
        if(list.length>0){
          this.dataForm.toBankCode = list[0].accountCode;
          this.dataForm.companyAccount = list[0].name;
        }
        this.acceptanceVisible = false;
      },
      handleEdit(index, val, type, row) {
        console.log(type);
          if (type == 'amt'||type == 'monthRate'){
            for (var i in this.items) {
              var item = this.items[i];
              item.fee = (item.amt * 0.0005).toFixed(4);
              var draftExpireDate = Date.parse(item.draftExpireDate);
              var da = new Date();
              var dateOfIssue = Date.parse(da);
              var d = Math.abs(draftExpireDate - dateOfIssue);
              let day = this.$moment(item.draftExpireDate).diff(this.$moment(new Date()), 'days') + 1
              var je = item.amt * (item.monthRate/100);
              item.discount = (je/30*day).toFixed(4);
              if (isNaN(item.discount)) {
                item.discount = 0;
              }
              this.vueSet(this.items, i, item);
            }
          }
          this.vueSet(this.items, index, this.items[index]);
      },
      handleFileRemove(file, fileList) {
        this.dataForm.attachment = fileList;
      },
      handleFileSuccess(response) {
        this.dataForm.attachment.push(response.data);
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 252
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data
              this.customerArr = response.data.customerArr
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
              }
              if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
                this.dataForm.attachment = JSON.parse(response.data.attachment);
              } else {
                this.dataForm.attachment = [];
              }
              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
          this.handleValueAdd()
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          billNo: undefined,
          isAllopatry: undefined,
          isFlaw: undefined,
          isGiveChange: undefined,
        }
        if(this.items.length<1){
          this.items.push(d)
        }else{
          this.vueMessage('warning','明细表数据不能超过一条!');
        }

      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleAcceptanceSelector() {
        this.acceptanceVisible = true;
      },
      handleCancelAcceptance() {
        this.$refs.acceptance.reset()
        this.acceptanceVisible = false
      },
      handleSubmitAcceptance() {
        this.$refs.acceptance.onSubmit();
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerCode = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.customer.reset()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        this.customerArr = list
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerCode = list[0].customerCode;
        }
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      dataFormSubmit(_this, subFun, subFunSuccessName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(subFun == 'tempAddBill'){
              _this.isTemporaryLoading = true;
            }else{
              _this.isFormLoading = true;
            }

            var list = [];
            for (var i in _this.items) {
              if (_this.items[i].draftNo && _this.items[i].draftNo != '') {
                list.push(_this.items[i]);
              }
            }
            _this.dataForm.items = list;

            subFun(_this.dataForm).then(response => {
              _this.isFormLoading = false;
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
              _this.isFormLoading = false;
              _this.isTemporaryLoading = false;
            })
          } else {
            return false;
          }
        })
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].draftNo && this.items[i].draftNo != '') {
            if (!this.items[i].paymentBankFullName || this.items[i].paymentBankFullName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行付款银行全称必填项，请填写了再提交');
              return
            }
            if (!this.items[i].dateOfIssue || this.items[i].dateOfIssue == '') {
              this.$message.error('第' + (i * 1 + 1) + '行出票日全称必填项，请填写了再提交');
              return
            }
            if (!this.items[i].draftExpireDate || this.items[i].draftExpireDate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行汇票到期日全称必填项，请填写了再提交');
              return
            }
            if (!this.items[i].amt || this.items[i].amt == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的出票金额必填项，请填写了再提交');
              return
            }
            if (!this.items[i].monthRate || this.items[i].monthRate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的月利率必填项，请填写了再提交')
              return
            }
            if (!this.items[i].fee || this.items[i].fee == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的手续费必填项，请填写了再提交')
              return
            }
            if (!this.items[i].hands || this.items[i].hands == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的几手背书必填项，请填写了再提交')
              return
            }
            if (!this.items[i].isAllopatry || this.items[i].isAllopatry == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的付款行是否异地为必选项，请填写了再提交')
              return
            }
            if (!this.items[i].isFlaw || this.items[i].isFlaw == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的是否有瑕疵为必选项，请填写了再提交')
              return
            }
            if (!this.items[i].hands || this.items[i].hands == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的是否可以找零为必选项，请填写了再提交')
              return
            }
          }
        }
        return true
      }
    }
  }
</script>
