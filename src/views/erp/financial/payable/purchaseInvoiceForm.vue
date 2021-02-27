<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增采购发票</span>
        <span v-if="dataForm.id">编辑采购发票</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">
        <el-upload class="upload"  v-if="dataForm.type != 2" action="/api/financial/financial-purchase-invoice/import" :before-upload="beforeUpload"
                   :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                   style="display:inline;" :on-success="uploadCompleted">
          <el-button type="text" icon="el-icon-download">
            导入
          </el-button>
        </el-upload>
        <el-button type="text" icon="el-icon-download" v-if="dataForm.type != 2" >
          <a target="_blank" href="/api/financial/financial-purchase-invoice/downTemplate">下载导入模板</a>
        </el-button>
      </div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" placeholder="自动生成单据编号" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-input v-model="dataForm.billDate" placeholder="自动生成单据日期" disabled readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id" closable
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                <el-select v-model="dataForm.invoiceType" style="width: 100%;">
                  <el-option v-for="item in invoiceTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="采购员:" prop="buyer" class="el-form-flex">
                <el-input v-model="dataForm.buyer"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

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
      <el-table-column prop="invoiceAmount" label="本次到票金额" width="100" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.invoiceAmount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'invoiceAmount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+8)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+8)"></el-input>
          <span>{{scope.row.invoiceAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notTaxPrice" label="不含税金额" width="100" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.notTaxPrice"
                    @change="handleEdit(scope.$index, scope.row , 'notTaxPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+9)"
                    @input="handleInputFun($event, scope.row, 'notTaxPrice')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+9)"></el-input>
          <span>{{scope.row.notTaxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.taxRate" size="small" placeholder=" "
                     @change="handleEdit(scope.$index, scope.row , 'taxRate', $event)"
                     :ref="'tableElInput'+(scope.$index*tableElInputNum+5)"
                     :disabled="scope.row.sourceBillId?true:false"
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in taxRateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.taxRate}}</span></template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="税额" width="180" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="taxAmount" label="价税合计" width="180" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmount" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="invoiceCode" label="发票代码" width="200" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.invoiceCode" class="right-el-input"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+10)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+10)"></el-input>
          <span>{{scope.row.invoiceCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNo" label="发票号码" width="200" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.invoiceNo" class="right-el-input"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+10)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+11)"></el-input>
          <span>{{scope.row.invoiceNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="makeInvoiceDate" label="开票日期" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.makeInvoiceDate" align="right" type="date"
          @change="handleEdit(scope.$index, scope.row , 'makeInvoiceDate', $event)"
           @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+12)"
                    @input="handleInputFun($event, scope.row, 'makeInvoiceDate')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+12)"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
          <span>{{scope.row.makeInvoiceDate}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="ticketDate" label="收票日期" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.ticketDate" align="right" type="date"
          @change="handleEdit(scope.$index, scope.row , 'ticketDate', $event)"
           @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+12)"
                    @input="handleInputFun($event, scope.row, 'ticketDate')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+13)"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
          <span>{{scope.row.ticketDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
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

    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗底部 -->
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

    <!-- 关联单据 -->
    <purchase-invoice-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                               @submitSelectorSuccess="submitSelectorSuccess"
                               @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </purchase-invoice-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financialPurchaseInvoice';

  export default {
    name: "purchaseInvoiceForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'purchase-invoice-selector': () => import('../components/purchaseInvoiceSelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          invoiceNo: undefined,
          supplierId: undefined,
          supplierName: undefined,
          bankName: undefined,
          bankAccount: undefined,
          taxpayerNumber: undefined,
          invoiceType: '1',
          billAmount: undefined,
          invoiceAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        fileList: undefined,
        items: [],
        supplierArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        supplierVisible: false,
        productVisible: false,
        rules: {
          invoiceType: [
            {
              required: true,
              message: '请选择发票类型',
              trigger: 'blur'
            }
          ],
          supplierName: [
            {
              required: true,
              message: '请选择供应商',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 7,
        taxRateOption:[{
          value: '13',
          label: '13%'
        }, {
          value: '6',
          label: '6%'
        }, {
          value: '3',
          label: '3%'
        }, {
          value: '5',
          label: '5%'
        }],
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          console.log('导入');
          console.log(response);
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          if(response.data.length>0){
            this.selectedProducts = response.data;
            const _this = this;
            const dataMap = _this.data2Map(_this.items);

            // 删除最后一个空行
            _this.items.splice(_this.items.length - 1, 1);

            // 遍历当前选中项
            for (var index in this.selectedProducts) {
              var item = this.selectedProducts[index];


              var itemObj = {};
              itemObj.invoiceAmount = item.invoiceAmount;
              itemObj.notTaxPrice = item.notTaxPrice; 
              itemObj.taxRate = String(item.taxRate);
              itemObj.taxPrice = item.taxPrice;
              itemObj.taxAmount = item.taxAmount;
              itemObj.notCancelAmount = item.taxAmount;
              itemObj.invoiceCode = item.invoiceCode;
              itemObj.invoiceNo = item.invoiceNo;
              itemObj.makeInvoiceDate = item.makeInvoiceDate;
              itemObj.ticketDate = item.ticketDate;

              
              _this.items.push(itemObj);

            }
            // 添加一个空行
            // _this.items.push([]);
            _this.handleValueAdd();

            for (var j in this.items) {
              this.vueSet(this.items, j, this.items[j]);
            }

            this.productVisible = false;
            this.selectedProducts = [];
          }
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
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
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 252;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number);

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number);

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number);

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number);

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number);

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum;

        if (type == 'enter' && number + 1 <= total) {
          number++;
        } else if (type == 'left' && number - 1 > 0) {
          number--;
        } else if (type == 'right' && number + 1 <= total) {
          number++;
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum;
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum;
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus();
        this.$refs['tableElInput' + number].$el.querySelector('input').select();

      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.supplierArr = [{
                id:response.data.supplierCode,
                supplierName:response.data.supplierName
              }]
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
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
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
      handleEdit(index, row, type, val) {
          this.vueSet(this.items[index], 'makeInvoiceDate', this.$moment(row.makeInvoiceDate).format('YYYY-MM-DD'));
          this.vueSet(this.items[index], 'ticketDate', this.$moment(row.ticketDate).format('YYYY-MM-DD'));
          if (type == 'invoiceAmount') {
            if(row.invoiceAmount) {
              if(isNaN(row.invoiceAmount)) {
                row.invoiceAmount = 0.00
              } else {
                row.invoiceAmount = Number(val).toFixed(2)
                this.vueSet(this.items[index], 'invoiceAmount', row.invoiceAmount);
                // 不含税金额
                this.vueSet(this.items[index], 'notTaxPrice', Number(row.invoiceAmount/(1 + row.taxRate/100)).toFixed(2));
                //  // 税额
                // row.taxPrice = Number(row.invoiceAmount - row.notTaxPrice).toFixed(2)
                // this.vueSet(this.items[index], 'taxPrice', row.taxPrice);
                // // 价税合计
                // row.taxAmount = (Number(row.invoiceAmount)).toFixed(2)
                // this.vueSet(this.items[index], 'taxAmount', row.taxAmount);
                // // 未核销金额
                // this.vueSet(this.items[index], 'notCancelAmount', row.taxAmount);
              }
            }
          }
           if (type == 'notTaxPrice') {
            if(row.notTaxPrice) {
              if(isNaN(row.notTaxPrice)) {
                row.notTaxPrice = 0.00
              } else {
                if(Number(val) > Number(row.invoiceAmount)) {
                  this.$message.warning('不含税金额不能大于本次到票金额')
                  this.vueSet(this.items[index], 'notTaxPrice', row.invoiceAmount);
                } else {
                  row.notTaxPrice = Number(val).toFixed(2)
                  this.vueSet(this.items[index], 'notTaxPrice', row.notTaxPrice);
                }
              }
            }
          }
          // 税额
          row.taxPrice = Number(row.invoiceAmount - row.notTaxPrice).toFixed(2)
          this.vueSet(this.items[index], 'taxPrice', row.taxPrice);
          // 价税合计
          row.taxAmount = (Number(row.invoiceAmount)).toFixed(2)
          this.vueSet(this.items[index], 'taxAmount', row.taxAmount);
          // 未核销金额
          this.vueSet(this.items[index], 'notCancelAmount', row.taxAmount);
          if (type == 'taxRate') {
            if(row.invoiceAmount) {
              row.invoiceAmount = Number(row.invoiceAmount).toFixed(2)
              // this.vueSet(this.items[index], 'invoiceAmount', row.invoiceAmount);
              // 不含税金额
                row.notTaxPrice = Number(row.invoiceAmount/(1 + row.taxRate/100)).toFixed(2)
                // this.vueSet(this.items[index], 'notTaxPrice', row.notTaxPrice);
                // 税额
                row.taxPrice = Number(row.invoiceAmount - row.notTaxPrice).toFixed(2)
                // this.vueSet(this.items[index], 'taxPrice', row.taxPrice);
              // 价税合计
              row.taxAmount = (Number(row.invoiceAmount)).toFixed(2);
              // this.vueSet(this.items[index], 'taxAmount', row.taxAmount);
              // 未核销金额
              this.vueSet(this.items[index], 'notCancelAmount', row.taxAmount);
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
        this.dataForm.bankName = undefined;
        this.dataForm.bankAccount = undefined;
        this.dataForm.buyer = undefined;
        this.dataForm.taxpayerNumber = undefined;
        this.$refs.supplier.reset();
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      closeSupplierDialog(list) {
        this.supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName;
          this.dataForm.supplierId = list[0].id;
          this.dataForm.supplierCode = list[0].supplierCode;
          this.dataForm.buyer = list[0].supplierManagerArr[0].name;
          this.dataForm.bankName = list[0].bankName;
          this.dataForm.bankAccount = list[0].bankAccount;
          this.dataForm.taxpayerNumber = list[0].taxpayerNumber;
        }
      },

      //商品选择
      handleProductShow() {
        this.productVisible = true;
      },
      handleCloseProduct() {
        this.productVisible = false;
        this.selectedProducts = [];
        this.$refs.goodsSelector.reset();
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit();
      },
      closeGoodsDialog(list) {
        //console.log(list);

        this.selectedProducts = list;

        const _this = this;
        const dataMap = _this.data2Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index];
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.skuName = item.skuName;
          itemObj.brandId = item.brandId;
          itemObj.itemNo = item.itemNo;
          itemObj.brand = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.price + '';
          itemObj.skuName = item.goodsName;
          itemObj.qty = 1 + '';
          itemObj.amount = item.price + '';
          itemObj.taxRate = _this.defaultTaxRate;
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1;
          itemObj.tax = (item.price * taxRate).toFixed(4);
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(4);
          itemObj.taxAmount = itemObj.taxPrice;
          itemObj.notCancelAmount = itemObj.taxPrice;
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.productVisible = false;
        this.selectedProducts = [];

        this.$refs.goodsSelector.reset();
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
          if (column.property === 'invoiceAmount') {
            values = data.map(item => Number(item.invoiceAmount));
          } else if (column.property === 'notTaxPrice') {
            values = data.map(item => Number(item.notTaxPrice));
          } else if (column.property === 'taxPrice') {
            values = data.map(item => Number(item.taxPrice));
          }

          if ( column.property === 'invoiceAmount'
            || column.property === 'notTaxPrice' || column.property === 'taxPrice') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 4);
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
        if (!this.dataForm.supplierName || this.dataForm.supplierName == '') {
          this.$message.warning('请选择供应商');
          return;
        }
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = undefined;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;
        const _this = this;

        if (obj.sourceObject.key == 'CGFKD') {
          _this.items = [];
          _this.handleValueAdd();
          _this.sourceBillNoArr = [];
          obj.list.forEach(function (item, index) {
            _this.sourceBillNoArr.push(item.mainDTO.billNo);
          });
          _this.dataForm.sourceBillNo = _this.sourceBillNoArr.join(',');
          _this.dialogSelectorVisible = false;
          return;
        }

        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.supplierArr = item.mainDTO.supplierArr;
            _this.dataForm.supplierId = item.mainDTO.supplierId;
            _this.dataForm.supplierName = item.mainDTO.supplierName;
            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.sourceBillNoArr = [item.mainDTO.billNo];
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.sourceBillId = item.id;
          itemObj.brandId = item.brandId;
          itemObj.brand = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.price + '';
          itemObj.skuName = item.skuName;
          itemObj.itemNo = item.itemNo;
          itemObj.qty = item.qty + '';
          itemObj.amount = item.amount + '';
          itemObj.taxRate = item.taxRate + '';
          itemObj.tax = item.tax + '';
          itemObj.taxPrice = item.taxPrice + '';
          itemObj.taxAmount = item.taxAmount + '';
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        // 添加一个空行
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.dialogSelectorVisible = false;
      },
      handleSubmit() {
        // 计算票面金额和价税合计
        let invoiceArr = [];
        let taxArr = [];
        if(this.items.length > 0) {
          this.items.forEach(item => {
            invoiceArr.push(item.invoiceAmount)
            taxArr.push(item.taxAmount)
            console.log(invoiceArr);
            console.log(taxArr);
            this.dataForm.invoiceAmount = invoiceArr.reduce((prev, curr) => {
                const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(Number(prev) + Number(curr), 4);
              } else {
                return getFloat(Number(prev), 4);
              }
            }, 0)
            this.dataForm.taxAmount = taxArr.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(Number(prev) + Number(curr), 4);
              } else {
                return getFloat(Number(prev), 4);
              }
            }, 0)
            this.dataForm.notCancelAmount = this.dataForm.taxAmount
          })
        }
        if (!this.checkItemFuc()) {
          return;
        }
        this.handleSubmitForm( addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.handleSubmitForm( tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      handleSubmitForm ( subFun, subFunSuccessName, subFunName) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              this.isTemporaryLoading = true;
            } else {
              this.isFormLoading = true;
            }

            var list = [];
            for (var i in this.items) {
              list.push(this.items[i]);
            }
            this.dataForm.items = list;

            subFun(this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                this.isTemporaryLoading = false;
              } else {
                this.isFormLoading = false;
              }
              if (!response) {
                return;
              }

              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit(subFunSuccessName);
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                this.isTemporaryLoading = false;
              } else {
                this.isFormLoading = false;
              }
            })
          } else {
            return false;
          }
        })
      },
      checkItemFuc() {
        console.log('校验开始');
        for (var i in this.items) {
          if (!this.items[i].invoiceAmount || this.items[i].invoiceAmount == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的本次到票金额必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 8)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 8)].$el.querySelector('input').select();

            return;
          }
          if (!this.items[i].notTaxPrice || this.items[i].notTaxPrice == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的不含税金额必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 9)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 9)].$el.querySelector('input').select();

            return;
          }
          if (!this.items[i].invoiceCode || this.items[i].invoiceCode == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的发票代码必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 10)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 10)].$el.querySelector('input').select();

            return;
          }
          if (!this.items[i].invoiceNo || this.items[i].invoiceNo == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的发票号码必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 11)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 11)].$el.querySelector('input').select();

            return;
          }
          if (!this.items[i].makeInvoiceDate || this.items[i].makeInvoiceDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的开票日期必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 12)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 12)].$el.querySelector('input').select();

            return;
          }
          if (!this.items[i].ticketDate || this.items[i].ticketDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的收票日期必填项，请填写了再提交');

            this.$refs['tableElInput' + (i * this.tableElInputNum + 13)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 13)].$el.querySelector('input').select();

            return;
          }
        }
        return true;
      }
    }
  }
</script>
