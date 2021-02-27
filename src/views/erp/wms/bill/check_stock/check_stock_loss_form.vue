<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增盘亏出库单</span>
        <span v-if="dataForm.id">编辑盘亏出库单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <!-- <td width="50%">
              <el-form-item label="出库日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td> -->
            <td>
             <el-form-item label="操作人:" prop="sourceBillNo" class="el-form-flex">
                <div  style="margin-top:5px">
                    {{$store.state.user.name}}
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
      <!-- <el-table-column prop="positionName" label="* 仓位" width="150" align="left" class-name="col-required">
        <template slot-scope="scope">
          <div @click.stop="handleWarehousePositionSelector(scope.$index)"
               style="text-align: left;margin-left: 15px;cursor: pointer;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.positionArr" :key="tag.id" closable
                    @close="handleWarehousePositionDel(scope.$index,tagIndex)">
              {{tag.name}}
            </el-tag>
          </div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="skuName" label="商品名称" min-width="220">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleBillSelect" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.itemNo"></el-input>
          </div>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.warehouseName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousePositionName" label="仓位" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.warehousePositionName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.warehousePositionName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="220">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="unit" label="单位" width="120" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="retailPrice" label="面价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationPrice" label="平均调拨价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.allocationPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.allocationPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" label="平均进价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchasePrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.purchasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="库存数量" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.stockQty" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.stockQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="出库数量" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150">
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

    <!-- 盘点仓库弹窗-->
    <el-dialog title="请选择出库仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 仓位弹窗-->
    <el-dialog title="请选择仓位" :visible.sync="warehousePositionVisible" append-to-body>
      <warehouse-position-selector @closeWarehousePositionDialog="closeWarehousePositionDialog" :isSingle="true"
                                   ref="warehousePosition" :warehouseId="dataForm.warehouseId" :warehouseArr="dataForm.warehouseArr"
                                   :skuNo="skuNo"></warehouse-position-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehousePosition">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehousePosition">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联单据 -->
    <stock-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="closeGoodsDialog" selectType="3"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </stock-selector>
    <!-- 所有商品弹窗-->
    <!-- <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 新增盘亏出库弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/checkStockLoss';

  export default {
    name: "checkStockLossForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'stock-selector': () => import('./components/stockSelector'),
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
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
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
              message: '请选择出库日期',
              trigger: 'blur'
            }
          ],
          warehouseName: [
            {
              required: true,
              message: '请选择出库仓库',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        tableElInputNum: 9,
        warehousePositionIndex: undefined,
        skuNo: undefined,
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
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }

        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;
        this.dataForm.sourceBillId = obj.list[0].id;
        this.dataForm.paymentForm = obj.list[0].paymentForm;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            this.supplierArr = item.supplierArr;
            this.dataForm.supplierId = item.supplierId;
            this.dataForm.supplierName = item.supplierName;
            this.dataForm.bankAccount = item.bankAccount;
            this.dataForm.bankName = item.bankName;
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
          itemObj.sourceBillDate = item.billDate;
          itemObj.itemNo = item.itemNo;
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          itemObj.applyAmount = item.applyAmount;
          itemObj.thisPaymentAmount = item.applyAmount;
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.dialogSelectorVisible = false;
      },
      //关联单据选择
      handleBillSelect() {
          this.dialogSelectorVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 129;
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
          this.dataForm.deliverDate = date;
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
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
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
              // this.vueSet(this.items[index], 'amount', '0.00');
        if (row.qty && row.qty != '') {
          if (type == 'qty') {
            if (row.qty >  row.stockQty - row.lockedQty) {
              this.$message.warning('出库数量不能大于库存数量-锁库数量,请重新填写')
              row.qty = parseInt(Number(row.stockQty - row.lockedQty));
              this.vueSet(this.items[index], 'qty', row.qty);
            } else {
              row.qty = parseInt(row.qty);
              this.vueSet(this.items[index], 'qty', row.qty);
            }
          }
          this.vueSet(this.items, index, this.items[index]);
        }

      },

      //出库仓库选择
      handleWarehouseSelector() {
        this.warehouseVisible = true;
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleWarehouseDel(index) {
        this.dataForm.warehouseArr.splice(index, 1);
        this.dataForm.warehouseId = undefined;
        this.dataForm.warehouseName = undefined;
        for (var i in this.items) {
          this.vueSet(this.items[i], 'positionArr', []);
          this.vueSet(this.items[i], 'positionId', undefined);
          this.vueSet(this.items[i], 'positionName', undefined);
        }
        this.$refs.warehouse.reset();
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },
      closeWarehouseDialog(list) {
        var warehouseArr = [];
        for (var i in list) {
          warehouseArr.push({warehouseId: list[i].id, warehouseName: list[i].name});
        }
        this.dataForm.warehouseArr = warehouseArr;
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.dataForm.warehouseId = list[0].id;
          this.dataForm.warehouseName = list[0].name;

          for (var i in this.items) {
            this.vueSet(this.items[i], 'positionArr', []);
            this.vueSet(this.items[i], 'positionId', undefined);
            this.vueSet(this.items[i], 'positionName', undefined);
          }

        }
      },

      //仓位
      handleWarehousePositionSelector(index) {
        if (!this.dataForm.warehouseId) {
          this.$message.error('请先选择出库仓库');
          return;
        }
        this.skuNo = this.items[index].skuNo;
        this.warehousePositionIndex = index;
        this.warehousePositionVisible = true;
      },
      handleCancelWarehousePosition() {
        this.warehousePositionIndex = undefined;
        this.$refs.warehousePosition.reset();
        this.warehousePositionVisible = false;
      },
      handleWarehousePositionDel(index, tagIndex) {
        this.items[index].positionArr.splice(tagIndex, 1);
        this.items[index].positionId = undefined;
        this.items[index].positionName = undefined;
        this.vueSet(this.items, index, this.items[index]);

        this.$refs.warehousePosition.reset();
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit();
      },
      closeWarehousePositionDialog(list) {
        this.items[this.warehousePositionIndex].positionArr = list;
        this.warehousePositionVisible = false;
        if (list.length > 0) {
          this.items[this.warehousePositionIndex].positionId = list[0].id;
          this.items[this.warehousePositionIndex].positionName = list[0].name;
        }
        this.vueSet(this.items, this.warehousePositionIndex, this.items[this.warehousePositionIndex]);
        this.$refs.warehousePosition.reset();
      },

      //商品选择
      handleProductShow() {
        // if (!this.dataForm.warehouseId) {
        //   this.$message.warning('请先选择出库仓库');
        //   return;
        // }
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
          itemObj.skuNo = item.skuNo;
          itemObj.itemNo = item.itemNo;
          itemObj.iid = item.id;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.retailPrice = item.retailPrice;
          itemObj.price = item.price + '';
          itemObj.skuName = item.skuName;
          itemObj.warehouseName = item.warehouseName;
          itemObj.purchasePrice = item.purchasePrice;
          itemObj.allocationPrice = item.allocationPrice.toFixed(4);
          itemObj.positionName = item.warehousePositionName;
          itemObj.warehousePositionName = item.warehousePositionName;
          itemObj.stockQty = item.qty;
          itemObj.lockedQty = item.lockedQty;
          itemObj.qty = item.qty - item.lockedQty;
          itemObj.amount = item.price + '';
          itemObj.taxRate = _this.defaultTaxRate;
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(2) * 1;
          itemObj.tax = (item.price * taxRate).toFixed(2);
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(2);
          itemObj.taxAmount = itemObj.taxPrice;
          itemObj.cost = itemObj.price;
          itemObj.unitCost = itemObj.amount;
          itemObj.purchaseAmount = '0.00';
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.productVisible = false;
        this.dialogSelectorVisible = false;
        this.selectedProducts = [];

        // this.$refs.goodsSelector.reset();
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
          if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'qty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
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

            // if (!this.items[i].skuName || this.items[i].skuName == '') {
            //   this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');

            //   this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
            //   this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

            //   return;
            // }
            // if (!this.items[i].positionArr || this.items[i].positionArr == '') {
            //   this.$message.error('第' + (i * 1 + 1) + '行的仓位必填项，请填写了再提交')
            //   return
            // }
            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的出库数量必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }

          }
        }
        return true;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .product-container {
    width: 100%;
    height: 50px;
    padding-top: 5px;
  }

  .purchaseStockDialog {
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

        .el-input--mini .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }

        .el-select--small .el-input__inner {
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
</style>
