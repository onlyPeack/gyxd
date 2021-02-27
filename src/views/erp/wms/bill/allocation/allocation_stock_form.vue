<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增商品调拨单</span>
        <span v-if="dataForm.id">编辑商品调拨单</span>
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
              <el-form-item label="调拨类型:" prop="type" class="el-form-flex">
                <el-select v-model="dataForm.type" style="width: 100%;" @change="handleTypeChange">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseOrderSelector"
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
              <el-form-item label="调出仓库:" prop="warehouseOutName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector('out')"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="(tag,tagIndex) in dataForm.warehouseOutArr" :key="tag.warehouseId" closable
                          @close="handleWarehouseDel(tagIndex,'out')">
                    {{tag.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入仓库:" prop="warehouseInName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector('in')"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="(tag,tagIndex) in dataForm.warehouseInArr" :key="tag.warehouseId" closable
                          @close="handleWarehouseDel(tagIndex,'in')">
                    {{tag.warehouseName}}
                  </el-tag>
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
      <el-table-column prop="positionOutName" label="调出仓位" width="220" align="left">
        <template slot-scope="scope">
          <div @click.stop="handleWarehousePositionSelector(scope.$index,'out')"
               style="text-align: right;margin-right: 15px;cursor: pointer;" >
                  <span class="el-icon-more" style="opacity: .5;">
                  </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.positionOutArr" :key="tag.id" closable
                    @close="handleWarehousePositionDel(scope.$index,tagIndex,'out')" >
              {{tag.name}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="positionInName" label="调入仓位" width="220" align="left">
        <template slot-scope="scope">
          <div @click.stop="handleWarehousePositionSelector(scope.$index,'in')"
               style="text-align: right;margin-right:  15px;cursor: pointer;">
            <span class="el-icon-more" style="opacity: .5;">
                  </span>
<!--                  <span>-->
<!--                    <svg-icon icon-class="add"></svg-icon>-->
<!--                  </span>-->
            <el-input size="mini" suffix-icon="el-icon-more"></el-input>
            <el-tag v-for="(tag,tagIndex) in scope.row.positionInArr" :key="tag.id" closable
                    @close="handleWarehousePositionDel(scope.$index,tagIndex,'in')">
              {{tag.name}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="220">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="100" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inUnitCost" label="入库单位成本" width="150" class-name="col-required" v-if="dataForm.type=='1'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.inUnitCost" class="right-el-input"
                    @input="handleInputFun($event, scope.row, 'inUnitCost')"
                    @change="handleEdit(scope.$index, scope.row , 'inUnitCost', $event)"></el-input>
          <span>{{scope.row.inUnitCost}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inCostAmt" label="入库成本" width="150" class-name="col-required" v-if="dataForm.type=='1'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.inCostAmt" class="right-el-input"
                    @input="handleInputFun($event, scope.row, 'inCostAmt')"
                    @change="handleEdit(scope.$index, scope.row , 'inCostAmt', $event)"></el-input>
          <span>{{scope.row.inCostAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
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

    <!-- 仓库弹窗-->
    <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
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
                                   ref="warehousePosition" :warehouseId="dataForm.warehouseId"
                                   :skuNo="skuNo"></warehouse-position-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehousePosition">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehousePosition">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 所有商品库存弹窗-->
    <el-dialog title="商品库存" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <stock-detail-stock ref="goodsSelector" :isSingle="false"
                          @closeGoodsDialog="closeGoodsDialog" :warehouseId="dataForm.warehouseId"></stock-detail-stock>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增商品调拨弹窗底部 -->
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

    <!-- 关联单据 -->
    <allocation-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                         @submitSelectorSuccess="submitSelectorSuccess"
                         @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </allocation-selector>

  </el-dialog>
</template>

<script>
  import {getFloat, isEmpty} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/allocationStock';

  export default {
    name: "allocation_stock_form",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'stock-detail-stock': () => import('@/components/ERP/Stock/StockDetailSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'allocation-selector': () => import('./components/allocationSelector')
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          type: '0',
          note: undefined,
          warehouseInArr: undefined,
          warehouseOutArr: undefined,
          warehouseOutId: undefined,
          warehouseOutName: undefined,
          warehouseInId: undefined,
          warehouseInName: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择调拨类型',
              trigger: 'blur'
            }
          ],
          warehouseOutName: [
            {
              required: true,
              message: '请选择调出仓库',
              trigger: 'blur'
            }
          ],
          warehouseInName: [
            {
              required: true,
              message: '请选择调入仓库',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        warehouseType: undefined,
        warehousePositionType: undefined,
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
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
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
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          positionInArr: [],
          positionOutArr: [],
          positionInId: undefined,
          positionOutId: undefined,
          positionInName: undefined,
          positionOutName: undefined
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
        if (type == 'qty') {
          if (!isEmpty(row.inUnitCost)) {
            this.vueSet(this.items[index], 'inCostAmt', Number(val * row.inUnitCost).toFixed(2));
          }
        } else if (type == 'inUnitCost') {
          val = Number(val).toFixed(2);
          this.vueSet(this.items[index], 'inUnitCost', val);
          if (!isEmpty(row.qty)) {
            this.vueSet(this.items[index], 'inCostAmt', Number(val * row.qty).toFixed(2));
          }
        } else if (type == 'inCostAmt') {
          val = Number(val).toFixed(2);
          this.vueSet(this.items[index], 'inCostAmt', val);
          if (!isEmpty(row.qty)) {
            this.vueSet(this.items[index], 'inUnitCost', Number(val / row.qty).toFixed(2));
          }
        }
        this.vueSet(this.items, index, this.items[index]);
      },
      handleTypeChange(val) {
        if (val == '0') {
          for (var i in this.items) {
            this.items[i].inUnitCost = undefined;
            this.items[i].inCostAmt = undefined;
          }
        }
      },
      //仓库选择
      handleWarehouseSelector(type) {
        this.warehouseType = type;
        this.warehouseVisible = true;
      },
      handleCancelWarehouse() {
        this.warehouseType = undefined;
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleWarehouseDel(index, type) {
        if (type == 'in') {
          this.dataForm.warehouseInArr.splice(index, 1);
          this.dataForm.warehouseInId = undefined;
          this.dataForm.warehouseInName = undefined;
          for (var i in this.items) {
            this.vueSet(this.items[i], 'positionInArr', []);
            this.vueSet(this.items[i], 'positionInId', undefined);
            this.vueSet(this.items[i], 'positionInName', undefined);
          }
        } else {
          this.dataForm.warehouseOutArr.splice(index, 1);
          this.dataForm.warehouseOutId = undefined;
          this.dataForm.warehouseOutName = undefined;
          for (var i in this.items) {
            this.vueSet(this.items[i], 'positionOutArr', []);
            this.vueSet(this.items[i], 'positionOutId', undefined);
            this.vueSet(this.items[i], 'positionOutName', undefined);
          }
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
        this.warehouseVisible = false;
        if (this.warehouseType == 'in') {
          this.dataForm.warehouseInArr = warehouseArr;
        } else {
          this.dataForm.warehouseOutArr = warehouseArr;
        }

        if (list.length > 0) {
          if (this.warehouseType == 'in') {
            this.dataForm.warehouseInId = list[0].id;
            this.dataForm.warehouseInName = list[0].name;
            for (var i in this.items) {
              this.vueSet(this.items[i], 'positionInArr', []);
              this.vueSet(this.items[i], 'positionInId', undefined);
              this.vueSet(this.items[i], 'positionInName', undefined);
            }
          } else {
            this.dataForm.warehouseOutId = list[0].id;
            this.dataForm.warehouseOutName = list[0].name;
            for (var i in this.items) {
              this.vueSet(this.items[i], 'positionOutArr', []);
              this.vueSet(this.items[i], 'positionOutId', undefined);
              this.vueSet(this.items[i], 'positionOutName', undefined);
            }
          }
          this.$refs.warehouse.reset();
        }

        this.$refs['dataForm'].validate(valid => {
        });
      },

      //仓位
      handleWarehousePositionSelector(index, type) {
        this.warehousePositionType = type;
        if (type == 'in') {
          if (!this.dataForm.warehouseInId) {
            this.$message.error('请先选择调入仓库');
            return;
          }
        } else {
          if (!this.dataForm.warehouseOutId) {
            this.$message.error('请先选择调出仓库');
            return;
          }
        }

        this.skuNo = this.items[index].skuNo;
        this.warehousePositionIndex = index;
        this.warehousePositionVisible = true;
      },
      handleCancelWarehousePosition() {
        this.warehousePositionType = undefined;
        this.warehousePositionIndex = undefined;
        this.$refs.warehousePosition.reset();
        this.warehousePositionVisible = false;
      },
      handleWarehousePositionDel(index, tagIndex, type) {
        if (type == 'in') {
          this.items[index].positionInArr.splice(tagIndex, 1);
          this.items[index].positionInId = undefined;
          this.items[index].positionInName = undefined;
        } else {
          this.items[index].positionOutArr.splice(tagIndex, 1);
          this.items[index].positionOutId = undefined;
          this.items[index].positionOutName = undefined;
        }
        this.vueSet(this.items, index, this.items[index]);
        this.$refs.warehousePosition.reset();
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit();
      },
      closeWarehousePositionDialog(list) {
        this.warehousePositionVisible = false;
        if (this.warehousePositionType == 'in') {
          this.items[this.warehousePositionIndex].positionInArr = list;
          if (list.length > 0) {
            this.items[this.warehousePositionIndex].positionInId = list[0].id;
            this.items[this.warehousePositionIndex].positionInName = list[0].name;
          }
        } else {
          this.items[this.warehousePositionIndex].positionOutArr = list;
          if (list.length > 0) {
            this.items[this.warehousePositionIndex].positionOutId = list[0].id;
            this.items[this.warehousePositionIndex].positionOutName = list[0].name;
          }
        }
        this.vueSet(this.items, this.warehousePositionIndex, this.items[this.warehousePositionIndex]);
        this.$refs.warehousePosition.reset();
      },

      //商品选择
      handleProductShow() {
        if (!this.dataForm.warehouseOutId) {
          this.$message.error('请先选择调出仓库');
          return;
        }
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
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.retailPrice ? item.retailPrice + '' : undefined;
          itemObj.skuName = item.skuName;
          itemObj.qty = '1';
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

      //关联单据选择
      handlePurchaseOrderSelector() {
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
          itemObj.price = item.price ? item.price + '' : undefined;
          itemObj.skuName = item.skuName;
          itemObj.qty = '1';
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

            if (isEmpty(this.items[i].qty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');
              return;
            }

            if (isEmpty(this.items[i].qty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的数量必填项，请填写了再提交');
              return;
            }

            //调拨类型为异价调拨则校验入库成本与入库单位成本
            if (this.dataForm.type == '1') {

              if (isEmpty(this.items[i].inUnitCost)) {
                this.$message.error('第' + (i * 1 + 1) + '行的入库单位成本必填项，请填写了再提交');
                return;
              }

              if (isEmpty(this.items[i].inCostAmt)) {
                this.$message.error('第' + (i * 1 + 1) + '行的入库成本必填项，请填写了再提交');
                return;
              }

            }

          }
        }
        return true;
      }
    }
  }
</script>
