<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">F新增销售合同</span>
        <span v-if="dataForm.id">编辑销售合同</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="合同名称:" prop="contractName" class="el-form-flex">
                <el-input v-model="dataForm.contractName" placeholder="请输入合同名称"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="合同编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" placeholder="请输入合同编号"
                          onkeyup="this.value=this.value.replace(/[^\w_-]/g,'');"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in customerArr" :key="tag.id" closable
                          @close="handleCustomerDel">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="业务员:" prop="salerName" class="el-form-flex">
                <div @click.stop="handleSalerUserSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in salerArr" :key="tag.id" closable
                          @close="handleSalerUserDel">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="合同金额:" prop="contractAmount" class="el-form-flex">
                <el-input-number :controls="false" :precision="2" prop="contractAmount"
                                 v-model="dataForm.contractAmount"></el-input-number>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="签约日期:" prop="contractDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.contractDate" align="right" type="date"
                                style="width: 200px" placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="生效日期:" prop="effectiveDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.effectiveDate" align="right" type="date"
                                style="width: 200px" placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.disabledDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客户行业:" prop="industry" class="el-form-flex">
                <el-select v-model="dataForm.industry" style="width: 100%;">
                  <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联项目:" prop="projectName" class="el-form-flex">
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联商机:" prop="businessName" class="el-form-flex">
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
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName" @change="handleEdit(scope.$index, scope.row , 'skuName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
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
      <el-table-column prop="qty" label="数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'price', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" align="right" class-name="col-required">
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
              v-for="item in taxRateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.taxRate}}</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" align="right" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly" class="readonly-el-input right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'tax', $event)"></el-input>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right" class-name="col-required">
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

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <saler-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                           ref="salerUser"></saler-user-selector>
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

    <!-- 新增销售合同弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/sales-contract-print',query:{id:id}}">打 印
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
  import {addBill, getBill, tempAddBill} from '@/api/erp/sales/bill/salesContract';
  import store from '@/store'

  export default {
    name: "salesContractForm",
    components: {
      'saler-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        isLoading: false,
        isFormLoading: false,
        isTemporaryLoading: false,
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          contractName: undefined,
          contractDate: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          contractAmount: undefined,
          customerOrderQty: undefined,
          industry: '1',
          note: undefined,
          billStatus: undefined,
          projectId: undefined,
          projectName: undefined,
          businessId: undefined,
          businessName: undefined,
          items: []
        },
        items: [],
        salerArr: [],
        customerArr: [],
        selectedProducts: [],
        industryOptions: [
          {
            value: '1',
            label: '制造业'
          }, {
            value: '2',
            label: '房地产业'
          }, {
            value: '3',
            label: '批发和零售'
          }, {
            value: '4',
            label: '住宿和餐饮业'
          }, {
            value: '5',
            label: '互联网行业'
          }, {
            value: '6',
            label: '金融业'
          }, {
            value: '7',
            label: '租赁和商务服务业'
          }, {
            value: '8',
            label: '文化、体育和娱乐业'
          }],
        customerVisible: false,
        salerUserVisible: false,
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
          customerName: [
            {
              required: true,
              message: '请选择客户',
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
          contractAmount: [
            {
              required: true,
              message: '请输入合同金额',
              trigger: 'blur'
            }
          ],
          contractDate: [
            {
              required: true,
              message: '请选择签约日期',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 7
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
          var height = 334;
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
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          this.salerArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.salerId = this.$store.state.user.id;
          this.dataForm.salerName = this.$store.state.user.name;
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          date: '',
          taxRate: this.defaultTaxRate
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

      // 客户选择
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
                if (column.property === 'qty') {
                  this.dataForm.customerOrderQty = getFloat((prev + curr), 2)
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
      }
    }
  }
</script>
