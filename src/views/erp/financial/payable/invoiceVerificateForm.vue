<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增发票核销</span>
        <span v-if="dataForm.id">编辑发票核销</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>
    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" type="text" :rows="2" placeholder="单据编号为自动生成" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date" readonly
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商名称:" prop="supplierName" class="el-form-flex">
                <el-input v-model="dataForm.supplierName" type="text" readonly></el-input>
              </el-form-item>
            </td>
            
            <td>
              <el-form-item label="发票号码:" prop="invoiceNo" class="el-form-flex">
                  <div @click="handleBillNoSelector">
                  <el-input  v-model="dataForm.invoiceNo" type="text" placeholder="请选择发票"></el-input>
                  </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
              <td>
                <el-form-item label="发票代码:" prop="invoiceCode" class="el-form-flex">
                    <el-input v-model="dataForm.invoiceCode" type="text" readonly></el-input>
                </el-form-item>
              </td>
               <td>
                <el-form-item label="未核销金额:" prop="notCancelAmount" class="el-form-flex">
                    <el-input v-model="dataForm.notCancelAmount" type="text" readonly></el-input>
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
    <!-- 单据 -->
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
       <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="billNo" label="关联单据" width="180">
        <template slot-scope="scope">
          <div @click.stop="handlePurchaseContractSelector" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.billNo"></el-input>
          </div>
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>
        <el-table-column prop="brandName" label="品牌" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" align="right" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="specifications" label="型号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      
    
      <el-table-column prop="cancelQty" label="核销数量" align="right" class-name="col-required" width="100">
        <template slot-scope="scope">
           <el-input size="mini" v-model="scope.row.cancelQty" class="right-el-input"
                    readonly
                    @change="handleEdit('cancelQty',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.cancelQty}}</span>
        </template>
      </el-table-column>
     
      <el-table-column prop="puchaseQty" label="采购数量" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.puchaseQty"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.puchaseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnGoodsQty" label="退货数量" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.returnGoodsQty"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.returnGoodsQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="采购单价" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="cancelAmount" label="核销金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cancelAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.cancelAmount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="cancelAmount" label="核销金额" align="right" class-name="col-required" width="100">
        <template slot-scope="scope">
           <el-input size="mini" v-model="scope.row.cancelAmount" class="right-el-input"
                    @change="handleEdit('cancelAmount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.cancelAmount}}</span>
        </template>
      </el-table-column>
     
      <el-table-column prop="notCancelAmount" label="未核销金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.notCancelAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.notCancelAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"
                    ></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>


    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增付款申请单弹窗底部 -->
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

    <!-- 关联单据 -->
    <contract-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="submitSelectorSuccess" :supplierName="dataForm.supplierName"
                            :supplierCode="dataForm.supplierCode"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </contract-selector>
    <!-- 发票号码选择框 -->
    <billno-selector :dialogSelectorVisible="isBillNoVisible" v-if="isBillNoVisible"
                            @submitBillNoSelectorSuccess="submitBillNoSelectorSuccess"
                            @handleSelectorClose="handleAcceptSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </billno-selector>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/invoiceVertificate';
  import {getObj} from '@/api/admin/user/index';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';


  export default {
    name: "purchasePaymentForm",
    components: {
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'contract-selector': () => import('../components/invoiceVerificateSelector'),
      'billno-selector': () => import('../components/billNoSelector'),
    },
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions'],
    data() {
      const validatePayAmount = (rule, value, callback) => {
        if (!value || value == '' || value == '0.00' || value == 'NaN') {
          callback(new Error("付款金额为大于0的数字"));
        } else {
          callback();
        }
      };
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        isBillNoVisible:false,
        purchaserUserArr: [],
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          payAmount: undefined,
          currencyId: '1',
          payAccount: undefined,
          sumOfAdvance: undefined,
          bankName: undefined,
          bankAccount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillId: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        acceptItems:[],
        supplierArr: [],
        sourceBillNoArr: [],
        acceptSourceBillNoArr:[],
        supplierVisible: false,
        bankAccountArr: [],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择付款日期',
              trigger: 'blur'
            }
          ],
          paymentForm: [
            {
              required: true,
              message: '请选择付款形式',
              trigger: 'blur'
            }
          ],
          // supplierName: [
          //   {
          //     required: true,
          //     message: '请选择供应商',
          //     trigger: 'blur'
          //   }
          // ],
          currencyId: [
            {
              required: true,
              message: '请选择币别',
              trigger: 'blur'
            }
          ],
          payAmount: [
            {
              required: true,
              validator: validatePayAmount,
              trigger: 'blur'
            }
          ],
          refundAccount: [
            {
              required: true,
              message: '请选择退款账户',
              trigger: 'blur'
            }
          ],
          sourceBillNo: [
            {
              required: true,
              message: '请关联付款申请单',
              trigger: 'blur'
            }
          ],
          paymentsMeans: [
            {
              required: true,
              message: '请选择结算方式',
              trigger: 'blur'
            }
          ],
        },
        dialogSelectorVisible: false,
        acceptDialogSelectorVisible: false,
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 293;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.purchaserUserArr = response.data.purchaserUserArr;
              let {expenditureNo,draftNo,expenditureType,paymentAmt} = this.dataForm;
              let tempItem = [];
              tempItem.push({expenditureNo,draftNo,expenditureType,paymentAmt})
              tempItem.forEach((item,index) => {
                this.$set(this.acceptItems,index,item)
              })
              this.supplierArr = [{
                supplierName:response.data.supplierName,
                id:response.data.id
              }];
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',');
              }
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
          this.handleValueAdd();
        }
        pageAll().then(response => {
          this.bankAccountArr = response.data
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          sourceBillDate: undefined,
          sourceBillNo: undefined
        };
        // 如果items里面已经有一个空item了就不能再add了
        let i = 0;
        this.items.forEach(item => {
          if(!item.billNo) {
            i++
          }
        }) 
        if(i == 0) {
          this.items.push(d);
        }
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
        this.sourceBillNoArr.splice(index, 1)
        this.purchaserUserArr.splice(index, 1)
        var count = 0
        for (var i in this.items) {
          if (this.items[i].sourceBillId) {
            count++
          }
        }
        if (count == 0) {
          this.dataForm.sourceBillNo = undefined
          // this.sourceBillNoArr = []
        }
      },
      handleEdit(type, val, index, row) {
        if(type == 'cancelAmount') {
          if(!this.dataForm.supplierName) {
              this.$message.warning('请先选择发票')
          } else {
            if (val != undefined && val != '') {
              console.log('val');
              console.log(val);
              console.log('notCancelAmount');
              console.log(row.notCancelAmount);
              if(Number(val) > Number(row.notCancelAmount)) {
                this.$message.warning('核销金额不能大于未核销金额');
                this.vueSet(this.items[index], 'cancelAmount', row.notCancelAmount);
              } else {
                this.vueSet(this.items[index], 'cancelQty', (row.cancelAmount/row.taxPrice).toFixed(2));
              }
            } else {
              this.vueSet(this.items[index], 'cancelAmount', '0');
            }
          }
        }
        this.vueSet(this.items, index, this.items[index]);
      },

      // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true;
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset();
        this.supplierVisible = false;
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1);
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
        this.dataForm.paymentsMeans = undefined;
        this.$refs.supplier.reset();
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      closeSupplierDialog(list) {
        console.log('lsit');
        console.log(list);
        this.supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName;
          this.dataForm.supplierId = list[0].id;
          this.dataForm.supplierCode = list[0].supplierCode;
          this.dataForm.bankName = list[0].bankName;
          this.dataForm.bankAccount = list[0].bankAccount;
          this.dataForm.paymentsMeans = list[0].paymentsMeans;
        }

      },

      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
      },
      data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'cancelQty') {
            values = data.map(item => Number(item.cancelQty));
          } else if (column.property === 'cancelAmount') {
            values = data.map(item => Number(item.cancelAmount));
          } 
          if (column.property === 'cancelQty' || column.property === 'cancelAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((Number(prev) + Number(curr)), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(4);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleCancel() {
        this.$emit('handleCancelForm');
      },
      //关联单据选择
      handlePurchaseContractSelector() {
          if(!this.dataForm.supplierName) {
            this.$message.warning('请先选择发票')
          } else {
              this.dialogSelectorVisible = true;
          }
      },
      // 发票号码选择
      handleBillNoSelector() {
          this.isBillNoVisible = true;
      },
      handlePurchaseAcceptContractSelector() {
        this.acceptDialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleAcceptSelectorClose() {
        this.isBillNoVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      handleAcceptSourceBillNoDel() {
        this.acceptSourceBillNoArr.splice(index, 1);
        this.dataForm.expenditureNo = this.acceptSourceBillNoArr.join(',');
      },
      submitAcceptSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }
        this.acceptSourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            this.dataForm.draftNo = item.draftNo;
            this.dataForm.expenditureType = item.mainDTO.expenditureType;
            this.dataForm.paymentAmt = item.paymentAmt;
          }
          this.acceptSourceBillNoArr.push(item.billNo);
        }
        this.dataForm.expenditureNo = this.acceptSourceBillNoArr.join(',');
        this.acceptDialogSelectorVisible = false;
        let {expenditureNo,draftNo,expenditureType,paymentAmt} = this.dataForm;
        this.acceptItems.push({expenditureNo,draftNo,expenditureType,paymentAmt})
      },
      submitBillNoSelectorSuccess(obj) {
          this.isBillNoVisible =false;
          this.dataForm.invoiceNo = obj.list[0].invoiceNo;
          this.dataForm.invoiceCode = obj.list[0].invoiceCode;
          this.dataForm.invoiceCode = obj.list[0].invoiceCode;
          this.dataForm.notCancelAmount = obj.list[0].notCancelAmount;
          this.dataForm.supplierName = obj.list[0].mainDTO.supplierName;
          this.dataForm.supplierCode = obj.list[0].mainDTO.supplierCode;
          this.dataForm.purchaseInvoiceId = obj.list[0].id;
          this.dataForm.purchaseInvoiceNo = obj.list[0].billNo;
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }

        if (obj.isClearAll) {
          this.items = [];
        }
        // this.dataForm.sourceBillId = obj.list[0].id;
        this.dataForm.paymentForm = obj.list[0].paymentForm;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          this.purchaserUserArr.push(item.crtUserName)
          if (index == 0) {
            this.dataForm.bankAccount = item.bankAccount;
            this.dataForm.bankName = item.bankName;
            this.dataForm.buyer = this.purchaserUserArr[0];
            if (this.dataForm.bankName) {
              this.$refs['dataForm'].validateField('bankName');
            }
            if (this.dataForm.bankAccount) {
              this.$refs['dataForm'].validateField('bankAccount');
            }
          }
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }
          _this.sourceBillNoArr.push(item.billNo);
          var itemObj = {};
          itemObj.billNo = item.sourceBillNo;
          itemObj.id = item.sourceBillId;
        //   itemObj.sourceObjectKey = obj.sourceObject.key;
        //   itemObj.sourceObjectName = obj.sourceObject.name;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.specifications = item.specifications;
          itemObj.itemNo = item.itemNo;
        
          itemObj.returnGoodsQty = item.returnGoodsQty;

          itemObj.puchaseQty = item.qty;
        //   itemObj.amount = Number(item.taxAmount)*Number(item.qty);
          itemObj.thenCancelAmount = item.thenCancelAmount;
          itemObj.thenCancelQty = item.thenCancelQty;
          itemObj.puchasePrice = item.taxAmount;
          itemObj.taxPrice = item.taxPrice;
            //   核销金额
          itemObj.cancelAmount = (item.taxAmount - item.thenCancelAmount).toFixed(2)
          //   核销数量
          itemObj.cancelQty = (itemObj.cancelAmount/item.taxPrice).toFixed(2)
        //   未核销金额
          itemObj.notCancelAmount = (item.taxAmount - item.thenCancelAmount).toFixed(2)
          itemObj.note = item.note;
          itemObj.seriesName = item.seriesName;
          itemObj.skuName = item.skuName;
          itemObj.sourceBillId = item.id;
          itemObj.sourceBillNo = item.billNo;

          _this.items.push(itemObj);
        }
        
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.dialogSelectorVisible = false;
        console.log(this.dataForm);

      },
       sum(arr) {
          return arr.reduce(function(prev, curr, idx, arr){
              return Number(prev) + Number(curr);
          });
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true;
            } else {
              _this.isFormLoading = true;
            }

            var list = [];
            for (var i in _this.items) {
              // if (_this.items[i].sourceBillId && _this.items[i].sourceBillId != '') {
              //   list.push(_this.items[i]);
              // }
              list.push(_this.items[i]);
            }
            _this.dataForm.items = list;

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
        console.log(this.items);
        let tempArr = [];
        this.items.forEach(item => [
          tempArr.push(item.cancelAmount)
        ])
        let detailNotCancelAmount = tempArr.reduce((prev, curr) => {
          let value = Number(curr);
          if (!isNaN(value)) {
            return getFloat((Number(prev) + Number(curr)), 4);
          } else {
            return prev;
          }
        }, 0).toFixed(4);
        if(!this.items[0].billNo) {
          this.$message.warning('请选择关联单据')
          return
        }
        if((Number(this.dataForm.notCancelAmount) - detailNotCancelAmount) < 0) {
          this.$message.warning('明细列表核销金额总和不能大于未核销金额,请重新选择')
          return 
        } else {
          this.dataFormSubmit(this, addBill, 'submitSuccess');
        }
      },
      handleTempAddBill() {
        // if (!this.checkItemFuc()) {
        //   return;
        // }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        // for (var i in this.items) {
        //     if (this.items[i].thisRefundAmount === '' || this.items[i].thisRefundAmount === undefined || this.items[i].thisRefundAmount === NaN) {
        //       this.$message.error('第' + (i * 1 + 1) + '行的本次退款金额未填写，请填写了再提交');
        //       return;
        //   }
        // }
        // return true;
      }
    }
  }
</script>
