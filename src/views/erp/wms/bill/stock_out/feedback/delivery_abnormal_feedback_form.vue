<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增发货异常反馈单</span>
        <span v-if="dataForm.id">编辑发货异常反馈单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date" disabled
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联单据:" prop="billNo" class="el-form-flex">
                <div @click="handleSalesOrderSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                    {{dataForm.billNo}}
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="附件：">
                <div style="width: 80%">
                  <el-upload :file-list="fileList" :limit="5" :on-exceed="handleExceed"
                             :on-success="uploadCompleted" :show-file-list="false" action="/api/goods/storage/create" class="upload"
                             style="display:inline;">
                  <span style="line-height: 40px">
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  </el-upload>
                </div>
                <div>
                    <span style="display:inline-block;position:relative;top:5px;width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{dataForm.fileName}}
                    </span>
                    <a :href="dataForm.fileUrl" v-if="dataForm.fileName" target="_blank" style="color:#1890ff">下载合同</a>
                    <a style="color:#1890ff" v-if="dataForm.fileName" @click="handleDeleteContract(index)">删除合同</a>
                  </div>

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
      <el-table-column prop="billNo" label="单据编号" width="100" align="right"></el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据" width="100" align="right"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="100" align="right"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100" align="right"></el-table-column>
      <el-table-column prop="skuNo" label="编码" width="100" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列名称" width="100" align="right"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100" align="right"></el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="100" align="right"></el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="right"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100" align="right"></el-table-column>
      <el-table-column prop="qty" label="数量" width="100" align="right"></el-table-column>
      <el-table-column prop="difQty" label="差异数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.difQty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'difQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    @input="handleInputFun($event, scope.row, 'difQty')"></el-input>
          <span>{{scope.row.difQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="abnormalType" label="异常类型" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-select v-model="scope.row.abnormalType" class="filter-item" placeholder="单据状态" clearable>
            <el-option v-for="item in abnormalOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
            </el-select>
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

    <!-- 供货单位列表弹窗-->
    <el-dialog title="请选择供货单位" :visible.sync="supplierVisible" append-to-body>
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

    <!-- 新增销售出库弹窗底部 -->
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
    <salse-stock-out-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                             :linkPerson="dataForm.linkPerson" :linkPhone="dataForm.linkPhone"
                             :linkAddress="dataForm.linkAddress">
    </salse-stock-out-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/deliveryAdnormalFeedback';
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: "straightStockOutForm",
    components: {
      'sales-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'sales-order-selector': () => import('../components/salesOrderSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'salse-stock-out-selector': () => import('../components/salesStockOutSelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          linkPerson: undefined,
          linkPhone: undefined,
          linkAddress: undefined,
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          salerId: undefined,
          salerName: undefined,
          salerCode: undefined,
          supplierId: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        fileList:[],
        items: [],
        salerArr: [],
        customerArr: [],
        supplierArr: [],
        accountMethodOptions: [],
        selectedProducts: [],
        customerVisible: false,
        supplierVisible: false,
        salerUserVisible: false,
        productVisible: false,
        rules: {
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
          supplierName: [
            {
              required: true,
              message: '请选择供货单位',
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
        },
        abnormalOptions:[
          {
            label:"少货",
            value:'1'
          },
          {
            label:"多货",
            value:'2'
          },
          {
            label:"坏货",
            value:'3'
          },
          {
            label:"其他",
            value:'4'
          },
        ],
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        skuNo: undefined,
        tableElInputNum: 9,
        warehousePositionIndex: undefined
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
      handleDeleteContract() {
        this.dataForm.fileUrl = ''
        this.dataForm.fileName = ''
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$message.success('合同上传成功!')
          this.$set(this.dataForm,'fileName',response.data.name)
          this.$set(this.dataForm,'fileUrl',response.data.url)
          console.log(this.dataForm);
        } else {
          this.$message.error('合同上传失败!'+response.msg||response.data)
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
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
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.salerArr.push({
            "id": this.$store.state.user.id,
            "name": this.$store.state.user.name,
            "code": this.$store.state.user.code
          });
          this.handleValueAdd();
        }
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
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
        console.log(row.maxSum);
        if(type == 'difQty'){
          if(row.difQty >row.qty){
            this.vueSet(this.items[index], 'difQty', row.qty);
          }
        }
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
              this.vueSet(this.items[index], 'unitCost', '0.00');
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

      // 供货单位选择
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
        this.dataForm.supplierCode = undefined;
        if (this.$refs.supplier) {
          this.$refs.supplier.reset();
        }
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
        this.dataForm.salerCode = undefined;
        if (this.$refs.salerUser) {
          this.$refs.salerUser.reset();
        }
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
          this.dataForm.salerCode = list[0].no;
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
        this.dataForm.customerCode = undefined;
        if (this.$refs.customer) {
          this.$refs.customer.reset();
        }
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
          this.dataForm.customerCode = list[0].customerCode;
          this.dataForm.linkPhone = list[0].linkPhone;
          this.dataForm.linkAddress = list[0].linkAddress;
          this.dataForm.linkPerson = list[0].linkMan;
          this.dataForm.addressId = list[0].addressId
          this.$refs.dataForm.validateField('customerName')
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
                if (column.property === 'amount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 2)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.taxBillAmount = getFloat((prev + curr), 2)
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
      handleSalesOrderSelector() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.dataForm.sourceBillNo = undefined;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }
        // this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.dataForm.billNo = item.billNo;
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];

          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }

          var itemObj = {};
          itemObj.amount = item.amount;
          itemObj.billNo = item.billNo;
          itemObj.billStatus = item.billStatus;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.categoryId = item.categoryId;
          itemObj.customerCode = item.mainDTO.customerCode;
          itemObj.customerId = item.mainDTO.customerId;
          itemObj.customerName = item.mainDTO.customerName;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.lockingOrderNo = item.lockingOrderNo;
          itemObj.masterId = item.masterId;
          itemObj.positionId = item.positionId;
          itemObj.positionName = item.positionName;
          itemObj.price = item.price;
          itemObj.qty = item.qty;
          itemObj.difQty = item.qty;
          itemObj.rebateAmount = item.rebateAmount;
          itemObj.saleCostAmount = item.saleCostAmount;
          itemObj.saleCostPrice = item.saleCostPrice;
          itemObj.saleInvoiceQty = item.saleInvoiceQty;
          itemObj.saleProfit = item.saleProfit;
          itemObj.seriesName = item.seriesName;
          itemObj.skuName = item.skuName;
          itemObj.skuNo = item.skuNo;
          itemObj.sourceBillId = item.sourceBillId;
          itemObj.sourceBillNo = item.sourceBillNo;
          itemObj.sourceObjectKey = item.sourceObjectKey;
          itemObj.sourceObjectName = item.sourceObjectName;
          itemObj.specifications = item.specifications;
          itemObj.stockDetailId = item.stockDetailId;
          itemObj.stockReturnQty = item.stockReturnQty;
          itemObj.tax = item.tax; 
          itemObj.taxAmount = item.taxAmount; 
          itemObj.taxPrice = item.taxPrice; 
          itemObj.taxRate = item.taxRate; 
          itemObj.unit = item.unit; 
          itemObj.warehouseId = item.mainDTO.warehouseId; 
          itemObj.warehouseName = item.mainDTO.warehouseName; 
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
            if (this.items[i].difQty > this.items[i].qty) {
              this.$message.error('第' + (i * 1 + 1) + '行的查一数量不能大于数量,请重新填写');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }
            if (!this.items[i].abnormalType || this.items[i].abnormalType == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的异常类型必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }
          }
        }
        return true;
      },
    }
  }
</script>

