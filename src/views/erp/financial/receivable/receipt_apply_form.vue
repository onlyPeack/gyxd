<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新建收据申请单</span>
        <span v-if="dataForm.id">编辑收据申请单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="(tag,tagIndex) in dataForm.customerArr" v-model="dataForm.customerName" :key="tag.id" closable
                          @close="handleCustomerDel(tagIndex)">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                <el-input v-model="dataForm.customerCode" disabled=""></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客服姓名:" prop="customerService" class="el-form-flex">
                <el-input v-model="dataForm.customerService" :disabled=true ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客服部门:" prop="customerDepart" class="el-form-flex">
                <el-input v-model="dataForm.customerDepart" :disabled=true></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收款类型:" prop="collectionType" class="el-form-flex">
                <el-select v-model="dataForm.collectionType" style="width: 100%;" @change="handleTypeChange">
                  <el-option v-for="(item,index) in accountType" :key="index" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收据号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo"  disabled placeholder="收据号自动生成"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="24">
              <el-form-item label="收据金额:" prop="receiveMoney" class="el-form-flex">
                <el-input v-model="dataForm.receiveMoney" disabled ></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="24">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <el-table :data="items" border highlight-current-row width="100%"
              class="tb-edit" :summary-method="getSummaries" >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="receiveNo" label="到款单号" v-if="dataForm.collectionType != '承兑汇票'">
        <template slot-scope="scope">
          <div @click.stop="handleReceiveShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.receiveNo"
                      :disabled="dataForm.collectionType == '承兑汇票'"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.receiveNo}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="receiveMoney" label="到款金额" v-if="dataForm.collectionType != '承兑汇票'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.receiveMoney" 
              @change="handleEdit(scope.$index,$event,scope.row,'receiveMoney')"
                    :readonly="dataForm.collectionType == '承兑汇票'"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票号" v-if="dataForm.collectionType == '承兑汇票'">
        <template slot-scope="scope">
          <div @click.stop="handleAcceptShow" style="cursor: pointer;">
            <el-input size="mini"
                      suffix-icon="el-icon-more"
                      v-model="scope.row.draftNo"
                      :disabled="dataForm.collectionType != '承兑汇票'"
                      readonly
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.draftNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="faceAmount" label="票面金额" v-if="dataForm.collectionType == '承兑汇票'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.faceAmount"
          @change="handleEdit(scope.$index,$event,scope.row,'faceAmount')"
                    class="readonly-el-input left-el-input" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"
                    class="right-el-input"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 销售收款选择框 -->
    <receipt-sales-selector :dialogSelectorVisible="salesVisible" v-if="salesVisible"
                           @submitSelectorSuccess="submitSelectorSuccess"
                           @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </receipt-sales-selector>
    <!-- 承兑选择框 -->
    <receipt-accept-selector :dialogSelectorVisible="acceptanceVisible" v-if="acceptanceVisible"
                           @submitSelectorSuccess="submitAcceptSelectorSuccess"
                           @handleSelectorClose="handleAcceptSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </receipt-accept-selector>

    <!-- 新增承兑支出弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="!id" @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button v-if="!id" type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                         ref="customer" ></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill,getBillDetail, tempAddBill} from '@/api/erp/financial/receiptApply';
  import {uploadPath} from '@/api/erp/goods/storage';
  import {page as pageName} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: 'AcceptanceExpenditureBackForm',
    components: {
      'issue-receipt-selector': () => import('../components/issueReceiptSelector'),
      'acceptance-account-selector': () => import('../components/acceptanceAccountSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'receipt-sales-selector': () => import('../components/receiptSalesSelector'),
      'receipt-accept-selector': () => import('../components/receiptAcceptSelector'),

    },
    props: ['id', 'dialogFormVisible','typeOptions','acceptanceTypeOptions'],
    data() {
      return {
        tableElInputNum: 1,
        uploadPath,
        invoiceArr:undefined,
        isSelect: false,
        salesVisible: false,
        attachment: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dialogSelectorVisible:false,
        acceptanceVisible:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        dataForm: {
          id: undefined,
          sourceBillNo:undefined,
          billNo: undefined,
          draftBillNo:undefined,
          billStatus: undefined,
          billDate: undefined,
          expenditureType: undefined,
          customerCode: undefined,
          receiveMoney:0,
          customerName: undefined,
          acceptanceAccount: undefined,
          draftAmt: undefined,
          attachment: [],
          alreadyChange: undefined,
          registerBillNo: undefined,
          expenditureExpireDate: undefined,
          backType:undefined,
          collectionType:undefined,
          managerName:"",
          departName:"",
          items: [],
          customerArr: [],
        },
        items: [{}],
        sourceBillNoArr: [],
        customerVisible: false,
        billedOptions: [
          {
            value: '0',
            label: '未'
          },
          {
            value: '1',
            label: '已'
          }
        ],
        showOptions: [
          {
            value: '0',
            label: '可以'
          },
          {
            value: '1',
            label: '不可以'
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
          // customerDepart: [
          //   {
          //     required: true,
          //     message: '请输入客服部门',
          //     trigger: 'blur'
          //   }
          // ],
          // customerService: [
          //   {
          //     required: true,
          //     message: '请输入客服姓名',
          //     trigger: 'blur'
          //   }
          // ],
          // customerCode: [
          //   {
          //     required: true,
          //     message: '请选择客户编号',
          //     trigger: 'blur'
          //   }
          // ],
          // customerName: [
          //   {
          //     required: true,
          //     message: '请选择客户',
          //     trigger: 'blur'
          //   }
          // ],
          // collectionType: [
          //   {
          //     required: true,
          //     message: '请选择客户',
          //     trigger: 'blur'
          //   }
          // ],

        },
        list: null,
        accountType:[
          {
            label:'微信',
            value:'微信'
          },{
            label:'支付宝',
            value:'支付宝'
          },{
            label:'双乾支付',
            value:'双乾支付'
          },{
            label:'现金支付',
            value:'现金支付'
          },{
            label:'承兑汇票',
            value:'承兑汇票'
          },{
            label:'工行支付',
            value:'工行支付'
          },
        ]
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
      handleTypeChange() {
        console.log(this.items.findIndex(item => {
          return item.billNo && item.billNo.length > 0
        }) > -1);
        if((this.items.findIndex(item => {
          return item.billNo && item.billNo.length > 0
        }) > -1) == true) {
          this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
            confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.items = [];
              this.dataForm.receiveMoney = 0
              this.handleValueAdd()
            })
        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum

        if (type == 'enter' && number + 1 <= total) {
          number++
        } else if (type == 'left' && number - 1 > 0) {
          number--
        } else if (type == 'right' && number + 1 <= total) {
          number++
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus()
        this.$refs['tableElInput' + number].$el.querySelector('input').select()

      },
      // 承兑
      submitAcceptSelectorSuccess(list) {
        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in list) {
          var item = list[index];
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }

          var itemObj = {};
          itemObj.billNo = item.mainDTO.billNo;
          // itemObj.receiveNo = item.mainDTO.billNo;
          itemObj.draftNo = item.mainDTO.billNo;
          itemObj.draftId = item.id;
          itemObj.faceAmount = item.amt;
          _this.dataForm.receiveMoney += Number(item.amt)
          _this.items.push(itemObj)
        }
        // this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.acceptanceVisible = false;
      },
      // 到款
      submitSelectorSuccess(list,isClearAll) {
        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in list) {
          var item = list[index];
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }

          var itemObj = {};
          itemObj.billNo = item.mainDTO.billNo;
          itemObj.receiveNo = item.mainDTO.billNo;
          itemObj.receiveId = item.id;
          itemObj.receiveMoney = item.amountFormer;
          _this.dataForm.receiveMoney += Number(item.amountFormer)
          _this.items.push(itemObj)
        }
        console.log('items');
        console.log(this.items);
        // this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.salesVisible = false;
      },
      handleSelectorClose() {
        this.salesVisible = false
        // this.dialogSelectorVisible = false;
      },
      handleAcceptSelectorClose() {
        this.acceptanceVisible = false
      },
      handleInvoicesSelector(type) {
        if(this.dataForm.customerCode == undefined) {
          this.$message.warning('请先选择客户编号')
        } else if(this.dataForm.issueType == undefined) {
          this.$message.warning('请先选择收据类型')
        } else if (type != this.dataForm.issueType) {
          this.$message.warning('请选择与类型对应的单号')
        } else {
          this.dialogSelectorVisible = true;
        }
      },
      handleAcceptanceSelector(){
        this.salesVisible = true;
      },
      handleCancelAcceptance() {
        this.$refs.acceptance.reset()
        this.salesVisible = false
      },
      handleSubmitAcceptance() {
        this.$refs.acceptance.onSubmit();
      },
       data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
      },
      closeAccountDialog(list) {
        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in list) {
          var item = list[index];
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }

          var itemObj = {};
         
          itemObj.receiveBillId = item.accountCode;
          itemObj.receiveBank = item.name;
          itemObj.transferMoney = 0;
        }
        // this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.salesVisible = false;
      },
      handleEdit(index, val,row, type) {
        
        // if (type == 'receiveMoney') {
        //   this.items[index].receiveMoney = Number(val).toFixed(4);
        //   this.vueSet(this.items, index, this.items[index]);
        //   this.items.forEach(item => {
        //     this.dataForm.receiveMoney += item.receiveMoney
        //   })
        // }
        // if (type == 'faceAmount') {
        //   this.items[index].faceAmount = Number(val).toFixed(4);
        //   this.vueSet(this.items, index, this.items[index]);
        //   this.items.forEach(item => {
        //     this.dataForm.receiveMoney += item.faceAmount
        //   })
        // }
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
          let query = {
            id:this.id
          }
          getBillDetail(query)
            .then(response => {
              this.dataForm = response.data;
              this.dataForm.customerArr = [];
              this.dataForm.customerArr.push({
                customerCode:response.data.customerCode,
                id:0
              })
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
              }
              if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
                this.dataForm.attachment = JSON.parse(response.data.attachment);
              } else {
                this.dataForm.attachment = [];
              }
              // this.invoiceArr = response.data.items[0].billNo;
              this.dataForm.issueType = response.data.issueType;
              this.dataForm.billDate = response.data.crtTime;
              // this.dataForm.customerCode = response.data.customerCode;

              if(response.data.issueType == '1') {
                this.dataForm.draftBillNo = response.data.billNo;
                this.dataForm.receiveBillNo = null;
              } else {
                this.dataForm.receiveBillNo = response.data.billNo;
                this.dataForm.draftBillNo = null;
              }
              if (response.data.items == undefined) {
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          billNo: undefined,
          isAllopatry: '0',
          isFlaw: '0',
          isGiveChange: '0',
          isBilled: '0',
          isShow: '0',
        }
        this.items.push(d)
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
      handleCancelCustomer() {
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      handleCustomerDel(index) {
        this.dataForm.customerArr.splice(index, 1);
        this.dataForm.customerCode = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.customer.reset()
      },
      handleReceiveBillNoClose() {
        this.$set(this.dataForm,'receiveBillNo',undefined)
        this.$set(this.dataForm,'amountFormer',undefined)
        this.$set(this.dataForm,'receiveAccount',undefined)
        this.$forceUpdate()
      },
      handleBillNoClose() {
        this.$set(this.dataForm,'billNo',undefined)
        this.$set(this.dataForm,'amt',undefined)
        this.$set(this.dataForm,'draftMoney',undefined)
        this.$set(this.dataForm,'toBankCode',undefined)
        this.$forceUpdate()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        // 单选
        let tempList = [];
        tempList.push(list[list.length - 1])
        this.dataForm.customerArr = tempList
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerCode = list[0].customerCode;
        }
      },
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        let values = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'receiveMoney') {
            values = data.map(item => Number(item.receiveMoney))
          }  else if (column.property === 'faceAmount') {
            values = data.map(item => Number(item.faceAmount))
          }

          if (column.property === 'qty' || column.property === 'receiveMoney'
            || column.property === 'tax' || column.property === 'faceAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'receiveMoney') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'faceAmount') {
                  this.dataForm.invoiceAmount = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4)
              } else {
                return prev
              }
            }, 0).toFixed(4)

            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.issueType == 1 && !this.dataForm.draftNo) {
              this.vueMessage('warning','请选择汇票单号');
            } else if (this.dataForm.issueType == 2 && !this.dataForm.receiveBillNo) {
              this.vueMessage('warning','请选择收款单号');
            } else {
              this.dataFormSubmit(this, addBill, 'submitSuccess');
            }
          } else {
            return false;
          }
        });
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
            _this.isFormLoading = true;
            var list = [];
            for (var i in _this.items) {
              list.push(_this.items[i]);
            }
            console.log('list');
            console.log(list);
            let tempList = []
            list.forEach(item => {
              if(item != "") {
                tempList.push(item)
              }
            })
            _this.dataForm.items = tempList;
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
            })
          } else {
            return false;
          }
        })
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].draftNo && this.items[i].draftNo != '') {
            if (!this.items[i].newMonthRate || this.items[i].newMonthRate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行新月利率必填项，请填写了再提交');
              return
            }
            if (!this.items[i].backDate || this.items[i].backDate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的退回时间必填项，请填写了再提交');
              return
            }
          }
        }
        return true
      },
      // 到款
      handleReceiveShow(){
        if(this.dataForm.collectionType != '承兑汇票') {
          this.salesVisible=true
        }
      },
      // 汇票
      handleAcceptShow() {
        if(this.dataForm.collectionType == '承兑汇票') {
          this.acceptanceVisible = true
        }
      }
    },
    watch:{
      //深度监听dataForm.customer数组,在数组变动时将里面的managerName提取到上一层
      "dataForm.customerArr":{
        immediate: true,
        handler(newArr,oldArr){
          try {
            this.dataForm.managerName=newArr[0].managerName||""
            this.dataForm.departName=newArr[0].departName||""
          }catch (e) {}
        },
      },
      items:{
        immediate: true,
        handler(newArr,oldArr){
          try {
            //if(this.dataForm.)
            this.items.isaccapt=newArr[0].managerName||""
          }catch (e) {}
        },
      }
    }
  }
</script>
