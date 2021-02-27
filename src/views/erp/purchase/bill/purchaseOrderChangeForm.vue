<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增采购订单变更单</span>
        <span v-if="dataForm.id">编辑采购订单变更单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handleSalesContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag.billNo"
                          @close="handleSourceBillNoDel">
                    {{tag.billNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="采购员:" prop="purchaserName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in purchaserUserArr" :key="tag.id">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in supplierArr" :key="tag.id">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="币别:" prop="currencyName" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;" readonly="readonly">
                  <el-option v-for="item in currencyOptions" v-if="dataForm.currencyId==item.value" :key="item.value"
                             :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="变更原因:" prop="changeReason" class="el-form-flex">
                <el-input v-model="dataForm.changeReason" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName" readonly="readonly" class="readonly-el-input"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rebateSeries" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="原数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="原发布单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oldPrice" label="付款单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldPrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.oldPrice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="amount" label="原采购金额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="newQty" label="新购买数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newQty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newQty', $event)"
                    onkeypress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.newQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cancelMount" label="取消数量" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cancelMount" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.cancelMount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newPrice" label="新付款单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    @input="handleInputFun($event, scope.row, 'newPrice')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.newPrice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="newAmount" label="新采购金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newAmount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newAmount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    @input="handleInputFun($event, scope.row, 'newAmount')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.newAmount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="unit" label="交货日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.deliverDate" type="date"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.deliverDate}}</span>
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

    <!-- 新增采购订单变更单弹窗底部 -->
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
    <purchase-order-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo" :type="3">
    </purchase-order-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseOrderChange';

  export default {
    name: "purchaseOrderChangeForm",
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'purchase-order-selector': () => import('../components/purchaseOrderSelector')
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
          purchaserId: undefined,
          purchaserName: undefined,
          supplierId: undefined,
          supplierName: undefined,
          currencyId: '1',
          oldPurchaseAmount: undefined,
          newPurchaseAmount: undefined,
          changeReason: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        supplierVisible: false,
        purchaseUserVisible: false,
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          purchaserName: [
            {
              required: true,
              message: '请选择采购员',
              trigger: 'blur'
            }
          ],
          supplierName: [
            {
              required: true,
              message: '请选择供应商',
              trigger: 'blur'
            }
          ],
          sourceBillNo: [
            {
              required: true,
              message: '请选择关联单据',
              trigger: 'blur'
            }
          ],
          changeReason: [
            {
              required: true,
              message: '请填写变更原因',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 3
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
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 211;
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
              this.purchaserUserArr = response.data.purchaserUserArr;
              this.supplierArr = response.data.supplierArr;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = [{billNo: response.data.sourceBillNo}];
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
          this.purchaserUserArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.purchaserId = this.$store.state.user.id;
          this.dataForm.purchaserName = this.$store.state.user.name;
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var deliverDate = new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          date: '',
          deliverDate: deliverDate
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
        if (row.newQty && row.newQty != '') {
          if (type == 'newQty' || type == 'newPrice') {
            if (type == 'newQty') {
              if(Number(row.newQty) > Number(row.qty)) {
                this.$message.warning('新购买数量不能大于原数量!')
                this.vueSet(this.items[index], 'newQty', this.items[index].qty);
              }
              this.vueSet(this.items[index], 'cancelMount', this.items[index].qty - this.items[index].newQty );
            }
            if(type == 'newPrice') {
              if (row.newPrice && row.newPrice != '') {
                //新订货金额
                this.vueSet(this.items[index], 'newPrice', Number(val).toFixed(4));
                row.newAmount = Number(row.newQty * row.newPrice).toFixed(4);
                this.vueSet(this.items[index], 'newAmount', row.newAmount);
              } else {
                this.vueSet(this.items[index], 'newAmount', '0.00');
                return;
              }
            }
          } else if (type == 'newAmount') {
            //新单价
            this.vueSet(this.items[index], 'newPrice', Number(row.newAmount / row.newQty).toFixed(4));
          }
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
        this.dataForm.purchaserId = undefined;
        this.dataForm.purchaserName = undefined;
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
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
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
          console.log('item');
          console.log(item);
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo];

          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }

          var itemObj = {};
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-');
          itemObj.skuNo = item.skuNo;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.releasePrice + '';
          itemObj.newPrice = item.taxPrice + '';
          itemObj.skuName = item.goodsName;
          itemObj.qty = 1 + '';
          itemObj.newQty = 1 + '';
          itemObj.amount = item.price + '';
          itemObj.newAmount = item.taxPrice + '';
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'newQty') {
            values = data.map(item => Number(item.newQty));
          } else if (column.property === 'newAmount') {
            values = data.map(item => Number(item.newQty * item.newPrice));
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'newQty' || column.property === 'newAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'amount') {
                  this.dataForm.oldPurchaseAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'newAmount') {
                  this.dataForm.newPurchaseAmount = getFloat((prev + curr), 4)
                }
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
      handleSalesContractSelector() {
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
        //console.log(obj);
        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.purchaserUserArr = item.mainDTO.purchaserUserArr;
            _this.dataForm.purchaserName = item.mainDTO.purchaserName;
            _this.dataForm.purchaserId = item.mainDTO.purchaserId;
            _this.supplierArr = item.mainDTO.supplierArr;
            _this.dataForm.supplierId = item.mainDTO.supplierId;
            _this.dataForm.supplierName = item.mainDTO.supplierName;

            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.sourceBillNoArr = [{billNo: item.mainDTO.billNo}];
            _this.dataForm.currencyId = item.mainDTO.currencyId;
            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.sourceBillNoArr = [{billNo: item.mainDTO.billNo}];
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-');
          itemObj.skuNo = item.skuNo;
          itemObj.sourceBillId = item.id;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = Number(item.releasePrice).toFixed(4);
          itemObj.newPrice = Number(item.taxPrice).toFixed(4);
          itemObj.oldPrice = Number(item.taxPrice).toFixed(4);
          itemObj.skuName = item.skuName;
          itemObj.qty = item.qty + '';
          itemObj.newQty = '';
          itemObj.rebateSeries = item.rebateSeries
          itemObj.amount = item.amount + '';
          itemObj.newAmount = item.taxPrice + '';
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          itemObj.cancelMount = Number(itemObj.qty) - Number(itemObj.newQty)
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.dialogSelectorVisible = false;

      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (Number(this.items[i].newQty) > Number(this.items[i].qty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的新购买数量不能大于原数量,请重新提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }
            if (!this.items[i].skuName || this.items[i].skuName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].newQty || this.items[i].newQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的新购买数量必填项，请填写了再提交');

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
          }
        }
        return true;
      }
    }
  }
</script>
