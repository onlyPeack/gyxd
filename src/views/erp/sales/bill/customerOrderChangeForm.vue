<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增客户订货变更单</span>
        <span v-if="dataForm.id">编辑客户订货变更单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
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
              <el-form-item label="订货单位:" prop="customerName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in customerArr" :key="tag.id">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供货单位:" prop="companyName" class="el-form-flex">
                <el-input v-model="dataForm.companyName" readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="业务员:" prop="salerName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in salerArr" :key="tag.id">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
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
            <td width="50%">
              <el-form-item label="联系人:" prop="linkPerson" class="el-form-flex">
                <el-input v-model="dataForm.linkPerson" placeholder="请输入联系人" readonly="readonly"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="联系电话:" prop="linkPhone" class="el-form-flex">
                <el-input v-model="dataForm.linkPhone" placeholder="请输入联系电话" readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收货地址:" prop="linkAddress" class="el-form-flex">
                <el-input v-model="dataForm.linkAddress" placeholder="请输入收货地址" readonly="readonly"></el-input>
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
      <el-table-column prop="brandName" label="品牌" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="原数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="原单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="原订货金额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newQty" label="新数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newQty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"
                    @input="handleInputFun($event, scope.row, 'qty')"></el-input>
          <span>{{scope.row.newQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newPrice" label="新单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    @input="handleInputFun($event, scope.row, 'newPrice')"></el-input>
          <span>{{scope.row.newPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newAmount" label="新订货金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newAmount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newAmount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
                    @input="handleInputFun($event, scope.row, 'newAmount')"></el-input>
          <span>{{scope.row.newAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
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

    <!-- 订货单位列表弹窗-->
    <el-dialog title="请选择订货单位" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <sales-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                           ref="salerUser"></sales-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSalerUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSalerUser">确 定</el-button>
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

    <!-- 新增客户订货单弹窗底部 -->
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
    <sales-order-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                          @submitSelectorSuccess="submitSelectorSuccess"
                          @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </sales-order-selector>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/sales/bill/salesOrderChange';
  import {getObj} from '@/api/erp/crm/customer';
  import {getSelfCompany} from '@/api/admin/company'

  export default {
    name: "salesOrderChangeForm",
    components: {
      'sales-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'sales-order-selector': () => import('../components/salesOrderSelector')
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
          linkPerson: undefined,
          linkPhone: undefined,
          linkAddress: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          currencyId: '1',
          oldSalesAmount: undefined,
          newSalesAmount: undefined,
          changeReason: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          companyName: undefined,
          companyId: undefined,
          items: []
        },
        items: [],
        salerArr: [],
        customerArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        customerVisible: false,
        salerUserVisible: false,
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          companyName: [
            {
              required: true,
              message: '请选择供货单位',
              trigger: 'blur'
            }
          ],
          salerName: [
            {
              required: true,
              message: '请选择业务员',
              trigger: 'blur'
            }
          ],
          customerName: [
            {
              required: true,
              message: '请选择订货单位',
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
          var height = 293;
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
              this.salerArr = response.data.salerArr;
              this.customerArr = response.data.customerArr;
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
          this.handleValueAdd();
          getSelfCompany().then(response => {
            this.dataForm.companyId = response.id ? response.id : undefined
            this.dataForm.companyName = response.companyName ? response.companyName : undefined
          })
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
            if (row.newPrice && row.newPrice != '') {
              //新订货金额
              row.newAmount = Number(row.newQty * row.newPrice).toFixed(2);
              this.vueSet(this.items[index], 'newAmount', row.newAmount);
            } else {
              this.vueSet(this.items[index], 'newAmount', '0.00');
              return;
            }
          } else if (type == 'newAmount') {
            //新单价
            this.vueSet(this.items[index], 'newPrice', Number(row.newAmount / row.newQty).toFixed(2));
          }
          this.vueSet(this.items, index, this.items[index]);
        }
      },

      // 业务员选择
      handleSalerUserSelector() {
        this.salerUserVisible = true;
      },
      handleCancelSalerUser() {
        this.$refs.salerUser.reset();
        this.salerUserVisible = false;
      },
      handleSalerUserDel(index) {
        this.salerArr.splice(index, 1);
        this.dataForm.salerId = undefined;
        this.dataForm.salerName = undefined;
        this.$refs.salerUser.reset();
      },
      handleSubmitSalerUser() {
        this.$refs.salerUser.onSubmit();
      },
      closeUserDialog(list) {
        this.salerArr = list;
        this.salerUserVisible = false;
        if (list.length > 0) {
          this.dataForm.salerName = list[0].name;
          this.dataForm.salerId = list[0].id;
        }
      },

      // 订货单位选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerId = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerId = list[0].id;
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
          itemObj.price = item.price + '';
          itemObj.newPrice = item.price + '';
          itemObj.skuName = item.goodsName;
          itemObj.qty = 1 + '';
          itemObj.newQty = 1 + '';
          itemObj.amount = item.price + '';
          itemObj.newAmount = item.price + '';
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
                if (column.property === 'newAmount') {
                  this.dataForm.newSalesAmount = getFloat((prev + curr), 2)
                }
                if (column.property === 'amount') {
                  this.dataForm.oldSalesAmount = getFloat((prev + curr), 2)
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
            _this.salerArr = item.mainDTO.salerArr;
            _this.dataForm.salerName = item.mainDTO.salerName;
            _this.dataForm.salerId = item.mainDTO.salerId;

            _this.customerArr = item.mainDTO.customerArr;
            _this.dataForm.customerId = item.mainDTO.customerId;
            _this.dataForm.customerName = item.mainDTO.customerName;

            _this.dataForm.linkPerson = item.linkPerson;
            _this.dataForm.linkPhone = item.linkPhone;
            _this.dataForm.linkAddress = item.linkAddress;
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
          itemObj.price = item.price + '';
          itemObj.newPrice = item.price + '';
          itemObj.skuName = item.skuName;
          itemObj.qty = item.qty + '';
          itemObj.newQty = item.qty + '';
          itemObj.amount = item.amount + '';
          itemObj.newAmount = item.amount + '';
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;

          _this.items.push(itemObj);

        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        getObj(obj.list[0].mainDTO.customerId).then(res => {
          this.dataForm.linkPhone = res.data.linkPhone
          this.dataForm.linkPerson = res.data.linkMan
          this.dataForm.linkAddress = res.data.linkAddress
        })
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
          }
        }
        return true;
      },
      handleAuditBill(val) {
        auditBill(this.id, val).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
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
      }
    }
  }
</script>

<!--<style lang="scss" rel="stylesheet/scss" scoped>
  .customerOrderChangeDialog {
    font-size: 12px;

    .con-title {
      font-size: 16px;
      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }
      .cont-title-billNo {
        font-weight: bold;
        float: right;
        margin-right: 30px;
      }
    }
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }
    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

    .topTable {
      width: 100%;
      margin-bottom: 20px;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;

      td {
        border: 1px solid #e0e0e0;
        height: 40px;
        padding: 0px;
        margin: 0px;
        padding-left: 10px;
      }
      readonly-td {
        background: #f6f6f6;
      }
      .el-form-flex {
        display: flex;
        margin-bottom: 0px;
      }
      .el-input, .el-select, .el-input-number {
        margin-top: 6px;
      }
      .el-input input.el-input__inner {
        border: none;
        text-align: left;
      }
      .el-textarea__inner {
        border: none;
        resize: none;
        padding: 10px 15px;
      }
    }

    .association-creation {
      height: 30px;
      line-height: 30px;
      text-align: right;
    }
    .order-making {
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
    }

    .tb-edit {
      .el-input + span {
        display: none
      }
      .el-select + span {
        display: none
      }
      .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
        background-color: #fff;
      }
      td, th {
        padding: 0px;
        margin: 0px;
        height: 40px;
      }
      th {
        font-weight: 400;
        color: #000;
        background-color: #F7F7F7;
      }
      td {
        .cell {
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding: 0px;
          text-align: center;
          background-color: #fff;
        }
        .el-input, el-select {
          width: 100% !important;
          height: 40px;
        }
        .el-input&#45;&#45;mini .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }
        .el-select&#45;&#45;small .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }
        .readonly-el-input {
          background-color: rgba(247, 247, 247, 0.5);
          .el-input__inner {
            background-color: rgba(247, 247, 247, 0.5);
          }
        }
        .right-el-input {
          .el-input__inner {
            text-align: right;
          }
        }
        .center-el-input {
          .el-input__inner {
            text-align: center;
          }
        }
      }
    }
  }
</style>-->
