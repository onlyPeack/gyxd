<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.billNo">新增其它出库单</span>
        <span v-if="dataForm.billNo">编辑其它出库单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="association-creation">关联创建</div>
    <el-form :model="dataForm" :rules="rules" ref="dataForm">
      <table class="topTable">
        <tr>
          <td colspan="2">
            <el-form-item label="合同编号" prop="billNumber" class="el-form-flex">
              <el-input v-model="dataForm.billNo" placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <el-form-item label="合同名称" prop="contractName" class="el-form-flex">
              <el-input v-model="dataForm.contractName" placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="签约日期" prop="contractDate" class="el-form-flex">
              <el-date-picker v-model="dataForm.contractDate" align="right" type="date"
                              style="width: 200px" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="供应商" prop="supplierName" class="el-form-flex">
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
            <el-form-item label="采购员" prop="purchaserName" class="el-form-flex">
              <div @click.stop="handlePurchaserUserSelector"
                   style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                <el-tag v-for="tag in purchaserUserArr" :key="tag.id" closable
                        @close="handlePurchaserUserDel">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="币别" prop="currencyName" class="el-form-flex">
              <el-select v-model="dataForm.currencyId" style="width: 100%;">
                <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <el-form-item label="合同金额" prop="contractAmount" class="el-form-flex">
              <el-input-number :controls="false" :precision="2" prop="contractAmount"
                               v-model="dataForm.contractAmount"></el-input-number>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="生效日期" prop="effectiveDate" class="el-form-flex">
              <el-date-picker v-model="dataForm.effectiveDate" align="right" type="date"
                              style="width: 200px" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </td>
          <td>
            <el-form-item label="到期日期" prop="disabledDate" class="el-form-flex">
              <el-date-picker v-model="dataForm.disabledDate" align="right" type="date"
                              style="width: 200px;" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <el-form-item label="备注" prop="note" class="el-form-flex">
              <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
            </el-form-item>
          </td>
        </tr>

      </table>
    </el-form>

    <el-table :data="items" border highlight-current-row width="100%" height="420"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName" @change="handleEdit(scope.$index, scope.row , 'skuName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'price', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'amount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.taxRate" size="small" placeholder=" "
                     @change="handleEdit(scope.$index, scope.row , 'taxRate', $event)"
                     @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+5)"
                     :ref="'tableElInput'+(scope.$index*tableElInputNum+5)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.options}}</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly" class="readonly-el-input right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'tax', $event)"></el-input>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxAmount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+7)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+7)"></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'unit', $event)"></el-input>
          <span>{{scope.row.unit}}</span>
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

    <!-- 采购员列表弹窗-->
    <el-dialog title="请选择采购员" :visible.sync="purchaseUserVisible" append-to-body>
      <purchase-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                              ref="purchaseUser"></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelPurchaserUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitPurchaserUser">确 定</el-button>
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

    <!-- 新增合同弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="!dataForm.billStatus || dataForm.billStatus==1">
        <el-button @click="handleClose">取 消</el-button>
        <el-button @click="">暂 存</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==2" style="text-align: left">
        <el-button type="warning" @click="">驳 回</el-button>
        <el-button type="primary" @click="">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="text-align: left">
        <el-button type="primary" @click="">撤 销</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill} from '@/api/erp/purchase/bill/purchaseContract';

  export default {
    name: "other_stock_out_form",
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector')
    },
    props: ['billNo', 'dialogFormVisible'],
    data() {
      return {
        dataForm: {
          id: undefined,
          billNo: undefined,
          contractName: undefined,
          contractDate: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          contractAmount: undefined,
          currencyId: undefined,
          note: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        selectedProducts: [],
        supplierVisible: false,
        purchaseUserVisible: false,
        productVisible: false,
        rules: {
          contractName: [
            {
              required: true,
              message: '请输入合同名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
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
        options: [{
          value: '0',
          label: '0%'
        }, {
          value: '16',
          label: '16%'
        }, {
          value: '17',
          label: '17%'
        }, {
          value: '18',
          label: '18%'
        }, {
          value: '19',
          label: '19%'
        }, {
          value: '20',
          label: '20%'
        }],
        currencyOptions: [{
          value: '1',
          label: '人民币'
        }, {
          value: '2',
          label: '加元'
        }, {
          value: '3',
          label: '澳元'
        }],
        tableElInputNum: 7
      };
    },
    created() {
      this.init();
    },
    methods: {
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
        if (this.billNo != '') {
          getBill(this.billNo)
            .then(response => {
              this.dataForm = response.data;
              console.log(this.dataForm.billStatus);
              this.purchaserUserArr = response.data.purchaserUserArr;
              this.supplierArr = response.data.supplierArr;
              this.items = response.data.items;
              if (this.items == undefined) {
                this.handleValueAdd();
              }
            });
        } else {
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

        if (row.qty && row.qty != '') {
          if (type == 'qty' || type == 'price' || type == 'taxRate') {
            if (row.price && row.price != '') {
              //金额
              row.amount = Number(row.qty * row.price).toFixed(2);
              this.vueSet(this.items[index], 'amount', row.amount);
            } else {
              this.vueSet(this.items[index], 'amount', '0.00');
              this.vueSet(this.items[index], 'tax', '0.00');
              this.vueSet(this.items[index], 'taxAmount', '0.00');
              return;
            }
          } else if (type == 'amount') {
            //单价
            this.vueSet(this.items[index], 'price', Number(row.amount / row.qty).toFixed(2));
          } else if (type == 'taxPrice') {
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2);
            this.vueSet(this.items[index], 'price', row.price);
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2));
          } else if (type == 'taxAmount') {
            //含税单价
            row.taxPrice = Number(row.taxAmount / row.qty).toFixed(2);
            //this.vueSet(this.items[index], 'taxPrice',row.taxPrice);
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2);
            this.vueSet(this.items[index], 'price', row.price);
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2));
          }
          //税额
          this.vueSet(this.items[index], 'tax', Number(row.amount * parseInt(row.taxRate) / 100).toFixed(2));
          //含税单价
          this.vueSet(this.items[index], 'taxPrice', Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(2));
          //价税合计
          this.vueSet(this.items[index], 'taxAmount', Number(row.taxPrice * row.qty).toFixed(2));

          this.vueSet(this.items, index, this.items[index]);

        }

      },

      // 采购员选择
      handlePurchaserUserSelector() {
        this.purchaseUserVisible = true;
      },
      handleCancelPurchaserUser() {
        this.$refs.purchaseUser.reset();
        this.purchaseUserVisible = false;
      },
      handlePurchaserUserDel(index) {
        this.purchaserUserArr.splice(index, 1);
        this.$refs.purchaseUser.reset();
      },
      handleSubmitPurchaserUser() {
        this.$refs.purchaseUser.onSubmit();
      },
      closeUserDialog(list) {
        this.purchaserUserArr = list;
        this.purchaseUserVisible = false;
        if (list.length > 0) {
          this.dataForm.purchaserName = list[0].name;
          this.dataForm.purchaserId = list[0].id;
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
        }
      },

      handleProductShow() {
        this.productVisible = true;
      },
      handleProductClick(row, event, column) {
        //判断是否已选中
        this.$refs.selectProductTable.toggleRowSelection(row);
        this.selectedProducts.push(Object.assign({}, row))
      },
      handleProductSelect(selection, row) {
        this.selectedProducts = Object.assign([], selection)
      },
      handleProductSelectAll(selection) {
        this.selectedProducts = Object.assign([], selection)
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
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.price + '';
          itemObj.skuName = item.goodsName;
          itemObj.qty = 1 + '';
          itemObj.amount = item.price + '';
          itemObj.taxRate = _this.defaultTaxRate;
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(2) * 1;
          itemObj.tax = (item.price * taxRate).toFixed(2);
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(2);
          itemObj.taxAmount = itemObj.taxPrice;
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
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax));
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount));
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'tax' || column.property === 'taxAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'taxAmount') {
                  this.dataForm.contractAmount = getFloat((prev + curr), 2)
                }
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

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
      handleSubmit() {
        var list = [];

        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].skuName || this.items[i].skuName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品数量必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].price || this.items[i].price == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品单价必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select();

              return;
            }

            list.push(this.items[i]);
          }

        }


        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var list = [];
            for (var i in this.items) {
              if (this.items[i].skuNo && this.items[i].skuNo != '') {
                list.push(this.items[i]);
              }
            }
            this.dataForm.items = list;

            addBill(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            return false;
          }
        })

      }
    }
  }
</script>
