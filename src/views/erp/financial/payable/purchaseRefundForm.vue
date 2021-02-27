<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增退款单</span>
        <span v-if="dataForm.id">编辑退款单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>
    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="付款日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <!-- <el-form-item label="付款形式:" prop="paymentForm" class="el-form-flex">
                <el-select v-model="dataForm.paymentForm" style="width: 100%;">
                  <el-option v-for="item in paymentFormOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id" v-model="dataForm.supplierName"
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            
            <td>
              <el-form-item label="退款账户:" prop="refundAccount" class="el-form-flex">
                <el-select v-model="dataForm.refundAccount" style="width: 100%;">
                  <el-option v-for="item in bankAccountArr" :key="item.id" :label="item.name"
                             :value="item.accountCode">
                  </el-option>
                </el-select>

              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
           <td>
              <el-form-item label="关联单号:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="(tag,index) in sourceBillNoArr" :key="index"
                          @close="handleSourceBillNoDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="采购员:" prop="purchaserName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="(tag,index) in purchaserUserArr" :key="index">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr> -->
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
    <!-- 承兑单据 -->
    <el-table v-if="dataForm.payAccount == '90006'" show-summary :summary-method="getSummaries" :data="acceptItems" border highlight-current-row width="100%" :height="100"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
     <el-table-column prop="expenditureNo" label="承兑支出单号">
         <template>
          {{dataForm.expenditureNo}}
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号">
        <template>
          {{dataForm.draftNo}}
        </template>
      </el-table-column>
      <el-table-column prop="expenditureType" label="支出类型">
        <template>
          {{dataForm.expenditureType}}
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmt" label="汇票金额">
        <template>
          {{dataForm.paymentAmt}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 普通单据 -->
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
      <el-table-column prop="sourceBillNo" label="关联单据" width="180">
        <template slot-scope="scope">
          <div @click.stop="handlePurchaseContractSelector" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.sourceBillNo"></el-input>
          </div>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="billNo" label="请款单号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.billNo"
                    class="readonly-el-input left-el-input" readonly></el-input>
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="cashAccount" label="请款账户" align="right" min-width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cashAccount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.cashAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseOrderNo" label="采购订单" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchaseOrderNo" readonly></el-input>
          <span>{{scope.row.purchaseOrderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseAmount" label="采购金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchaseAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.purchaseAmount}}</span>
        </template>
      </el-table-column>
      <!--请款金额:返回cashAmount给我-->
      <el-table-column prop="cashAmount" label="请款金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cashAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.cashAmount}}</span>
        </template>
      </el-table-column>
      <!--可退款金额 = 请款金额 :返回canRefundAmount给我-->
      <el-table-column prop="canRefundAmount" label="可退款金额" align="right" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.canRefundAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.canRefundAmount}}</span>
        </template>
      </el-table-column>
      <!--本次退款金额：默认为0，手输入，不能大于可退款金额  -->
      <el-table-column prop="thisRefundAmount" label="本次退款金额" align="right" class-name="col-required" width="100">
        <template slot-scope="scope">
           <el-input size="mini" v-model="scope.row.thisRefundAmount" class="right-el-input"
                    @change="handleEdit('thisRefundAmount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.thisRefundAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="品名" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.specifications}}</span>
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
    <payment-refund-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="submitSelectorSuccess"
                            :supplierCode="dataForm.supplierCode"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </payment-refund-selector>
    <!-- 付款账户为承兑时的关联单据 -->
    <!-- <payment-apply-accept-selector :dialogSelectorVisible="acceptDialogSelectorVisible" v-if="acceptDialogSelectorVisible"
                            @submitAcceptSelectorSuccess="submitAcceptSelectorSuccess"
                            @handleSelectorClose="handleAcceptSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </payment-apply-accept-selector> -->
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseRefund';
  // import {selectPage, batchDelBill} from '@/api/erp/purchase/bill/purchaseRefund';
  import {getObj} from '@/api/admin/user/index';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';


  export default {
    name: "purchasePaymentForm",
    components: {
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'payment-refund-selector': () => import('../components/paymentRefundSelector'),
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
        this.items.push(d);
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
        if (type == 'payAmount') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4);
            this.dataForm.payAmount = val;
          }
        } else if(type == 'thisRefundAmount') {
          if (val * 1 > row.canRefundAmount * 1) {
            this.$message.error('本次退款金额不能大于可退款金额');
            this.vueSet(this.items[index], 'thisRefundAmount',row.canRefundAmount);
          } else {
            if (val != undefined && val != '') {
              val = Number(val).toFixed(4);
              this.vueSet(this.items[index], 'thisPaymentAmount', val);
            } else {
              this.vueSet(this.items[index], 'thisPaymentAmount', '0.0000');
            }
          }
        }

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
          console.log('property:' + column.property);
          console.log(column.property === 'thisRefundAmount');
          if (column.property === 'thisRefundAmount') {
            values = data.map(item => Number(item.thisRefundAmount));
            console.log('thisRefundAmount:' + values);
          } else if (column.property === 'applyAmount') {
            values = data.map(item => Number(item.applyAmount));
          }
          if (column.property === 'applyAmount' || column.property === 'thisRefundAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 4);
              } else {
                console.log('没值');
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
        if(!this.dataForm.supplierCode) {
          this.$message.warning('请先选择供应商');
          return;
        } else {
          this.dialogSelectorVisible = true;
        }
      },
      handlePurchaseAcceptContractSelector() {
        this.acceptDialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleAcceptSelectorClose() {
        this.acceptDialogSelectorVisible = false;
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
      submitSelectorSuccess(obj) {
        console.log('obj');
        console.log(obj);
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
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          // itemObj.sourceObjectKey = this.dataForm.sourceObjectKey;
          // itemObj.sourceObjectName = this.dataForm.sourceObjectName;
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          itemObj.purchaseOrderNo = item.sourceBillNo;
          itemObj.cashAccount = item.mainDTO.bankAccount;
          itemObj.cashAmount = item.mainDTO.applyAmount;
          itemObj.canRefundAmount = item.applyAmount - item.thenRefundAmount;
          itemObj.thisRefundAmount = item.applyAmount - item.thenRefundAmount;
          itemObj.purchaseAmount = item.purchaseAmount;
          itemObj.skuName = item.skuName;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
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
        this.items.forEach(item => {
          tempArr.push(item.thisRefundAmount)
        })
        console.log(tempArr);
        this.dataForm.refundAmount = this.sum(tempArr)
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {
          console.log(this.items[i].thisRefundAmount);
            if (this.items[i].thisRefundAmount === '' || this.items[i].thisRefundAmount === undefined || this.items[i].thisRefundAmount === NaN) {
              this.$message.error('第' + (i * 1 + 1) + '行的本次退款金额未填写，请填写了再提交');
              return;
          }
        }
        return true;
      }
    }
  }
</script>
