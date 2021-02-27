<template>
  <!-- <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose"> -->
      <!-- <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增异仓调拨单</span>
        <span v-if="dataForm.id">编辑异仓调拨单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span> -->
  <div>
    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-button  @click="handleSubmit" :loading="isFormLoading" type="success" plain>提 交</el-button>
      <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 15px"></div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium " label-width="120px" label-position="right">
        <table class="topTable" style="width: 100%" cellspacing="0">
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="单据编号:" class="el-form-flex">
                 <el-input v-model="dataForm.note" type="text" placeholder="单据编号自动带出" disabled></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
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
            <td class="from-item no-border-right no-border-bottom ">
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
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="收货地址:" class="el-form-flex">
                 <el-input v-model="dataForm.receiptAdress" type="text" disabled placeholder=""></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="收货人:" class="el-form-flex">
                 <el-input v-model="dataForm.receiverName" type="text" disabled placeholder=""></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="联系方式:" class="el-form-flex">
                 <el-input v-model="dataForm.receiverPhone" type="text" disabled placeholder=""></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="寄件方式:" class="el-form-flex">
                 <el-input v-model="dataForm.sendType" type="text" placeholder=""></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="物流:" class="el-form-flex">
                 <el-input v-model="dataForm.deliveryCompany" type="text" placeholder=""></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="物流单号:" class="el-form-flex">
                 <el-input v-model="dataForm.deliveryNo" type="text" placeholder=""></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="备注:" class="el-form-flex">
                 <el-input v-model="dataForm.note" type="text" placeholder=""></el-input>
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
      <el-table-column prop="outPositionName" label="调出仓位" width="220" align="left">
      </el-table-column>
      <el-table-column prop="inPositionName" label="调入仓位" width="220" align="left"  class-name="col-required">
        <template slot-scope="scope">
          <div @click.stop="handleWarehousePositionSelector(scope.$index,'in')"
               style="text-align: right;margin-right:  15px;cursor: pointer;">
            <el-tag v-for="(tag,tagIndex) in scope.row.positionInArr" :key="tag.id" closable
                    @close="handleWarehousePositionDel(scope.$index,tagIndex)">
              {{tag.name}}
            </el-tag>
            <span class="el-icon-more" style="opacity: .5;">
                  </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="220">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow()" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName"></el-input>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="qty" label="数量" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"></el-input>
        </template>
      </el-table-column>
      <el-table-column v-if="!!id" label="可调拨数量" prop="canAllotQty" width="150">
      </el-table-column>
      <el-table-column v-if="!id" label="库存数量" prop="stockQty" width="150">
      </el-table-column>
      <el-table-column v-if="!id" label="锁定数量" prop="lockedQty" width="150">
      </el-table-column>
      <el-table-column label="品牌名称" prop="brandName" width="150">
      </el-table-column>
      <el-table-column label="系列名称" prop="seriesName" width="150">
      </el-table-column>
      <el-table-column label="规格型号" prop="specifications" width="150">
      </el-table-column>
      <el-table-column label="订货号" prop="itemNo" width="150">
      </el-table-column>
      <!-- <el-table-column label="批次号" prop="batchNumber" width="150">
      </el-table-column> -->
      <el-table-column label="库存类型" prop="stockType" width="150">
      </el-table-column>
      <!-- <el-table-column label="供应商" prop="supplierName" width="150">
      </el-table-column>
      <el-table-column label="供应商编码" prop="supplierCode" width="150">
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="面价" prop="retailPrice" width="150">
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="调拨价" prop="allocationPrice" width="150">
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="考核价" prop="checkPrice" width="150">
      </el-table-column> -->
      <el-table-column label="入库人员" prop="ownerName" width="150">
      </el-table-column>
      <el-table-column label="入库日期" prop="updTime" width="150">
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
    <div v-if="warehousePositionVisible">
      <el-dialog title="请选择仓位" :visible.sync="warehousePositionVisible" append-to-body>
        <warehouse-position-selector @closeWarehousePositionDialog="closeWarehousePositionDialog" :isSingle="true"
                                    ref="warehousePosition" :warehouseId="warehouseId"
                                    :skuNo="skuNo"></warehouse-position-selector>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelWarehousePosition">取 消</el-button>
          <el-button type="primary" @click="handleSubmitWarehousePosition">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 所有商品库存弹窗-->
    <div v-if="productVisible">
      <el-dialog title="商品库存" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
        <stock-detail-stock ref="goodsSelector" :isSingle="false"
                            @closeGoodsDialog="closeGoodsDialog" :warehouseId="warehouseId" :warehouseName="warehouseName"></stock-detail-stock>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseProduct">取 消</el-button>
          <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新增商品调拨弹窗底部 -->
    <!-- <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div> -->

    <!-- 关联单据 -->
    <allocation-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                         @submitSelectorSuccess="submitSelectorSuccess"
                         @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </allocation-selector>
  </div>
  <!-- </el-dialog> -->
</template>

<script>
  import {getFloat, isEmpty} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/changeWarehouse';
  import { queryXSStockDetail } from '@/api/erp/wms/stock_query/index'

  export default {
    name: "allocation_stock_form",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'stock-detail-stock': () => import('./components/StockDetailSelector'),
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
        warehouseId:'',
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
          // warehouseOutName: [
          //   {
          //     required: true,
          //     message: '请选择调出仓库',
          //     trigger: 'blur'
          //   }
          // ],
          // warehouseInName: [
          //   {
          //     required: true,
          //     message: '请选择调入仓库',
          //     trigger: 'blur'
          //   }
          // ],
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
                this.dataForm.warehouseInArr = [{
                  warehouseId: response.data.inWarehouseCode,
                  warehouseName: response.data.inWarehouseName
                }]
                this.dataForm.warehouseInName = response.data.inWarehouseName
                this.dataForm.warehouseOutArr = [{
                  warehouseId: response.data.outWarehouseCode,
                  warehouseName: response.data.outWarehouseName
                }]
                this.dataForm.warehouseOutName = response.data.outWarehouseName
                this.items.forEach(item => {
                  item.positionInArr = [{
                    name:item.inPositionName
                  }]
                  // 查询可调拨数量
                  queryXSStockDetail({
                    id:item.iid
                  }).then(res => {
                    item.canAllotQty = res.data.records[0].qty - res.data.records[0].lockedQty
                  })
                })
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
          inPositionId: undefined,
          outPositionId: undefined,
          inPositionName: undefined,
          outPositionName: undefined
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
          if(!!this.id) {
            if (val > row.canAllotQty) {
              this.$message.warning('数量不能大于可调拨数量')
              this.vueSet(this.items[index], 'qty', row.canAllotQty);
            }
          } else {
            if (val > row.stockQty - row.lockedQty) {
              this.$message.warning('数量不能大于非锁库数量')
              this.vueSet(this.items[index], 'qty', row.stockQty - row.lockedQty);
            }
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
            this.vueSet(this.items[i], 'inPositionId', undefined);
            this.vueSet(this.items[i], 'inPositionName', undefined);
          }
        } else {
          this.dataForm.warehouseOutArr.splice(index, 1);
          this.dataForm.warehouseOutId = undefined;
          this.dataForm.warehouseOutName = undefined;
          for (var i in this.items) {
            this.vueSet(this.items[i], 'positionOutArr', []);
            this.vueSet(this.items[i], 'outPositionId', undefined);
            this.vueSet(this.items[i], 'outPositionName', undefined);
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
            // this.dataForm.warehouseInId = list[0].id;
            this.dataForm.warehouseInName = list[0].name;
            this.dataForm.inWarehouseCode = list[0].id;
            this.dataForm.inWarehouseName = list[0].name;
            this.dataForm.receiptAdress = list[0].location + list[0].address;
            this.dataForm.receiverName = list[0].contacts;
            this.dataForm.receiverPhone = list[0].phone;
            for (var i in this.items) {
              this.vueSet(this.items[i], 'positionInArr', []);
              this.vueSet(this.items[i], 'inPositionId', undefined);
              this.vueSet(this.items[i], 'inPositionName', undefined);
            }
          } else {
            // this.dataForm.warehouseOutId = list[0].id;
            this.dataForm.warehouseOutName = list[0].name;
            this.dataForm.outWarehouseCode = list[0].id;
            this.dataForm.outWarehouseName = list[0].name;
            for (var i in this.items) {
              this.vueSet(this.items[i], 'positionOutArr', []);
              this.vueSet(this.items[i], 'outPositionId', undefined);
              this.vueSet(this.items[i], 'outPositionName', undefined);
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
          if (!this.dataForm.inWarehouseCode) {
            this.$message.warning('请先选择调入仓库');
            return;
          }
        } else {
          if (!this.dataForm.outWarehouseCode) {
            this.$message.warning('请先选择调出仓库');
            return;
          }
        }
        this.warehouseId = this.dataForm.warehouseInArr[0].warehouseId;
        this.warehouseName = this.dataForm.warehouseInArr[0].warehouseName;

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
        this.items[index].positionInArr.splice(tagIndex, 1);
        this.items[index].inPositionId = undefined;
        this.items[index].inPositionName = undefined;
        
        this.vueSet(this.items, index, this.items[index]);
        this.$refs.warehousePosition.reset();
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit();
      },
      closeWarehousePositionDialog(list) {
        this.warehousePositionVisible = false;
        this.items[this.warehousePositionIndex].positionInArr = list;
        if (list.length > 0) {
          this.items[this.warehousePositionIndex].inPositionId = list[0].id;
          this.items[this.warehousePositionIndex].inPositionName = list[0].name;
        }
        this.vueSet(this.items, this.warehousePositionIndex, this.items[this.warehousePositionIndex]);
        this.$refs.warehousePosition.reset();
      },

      //商品选择
      handleProductShow() {
        if (!this.dataForm.warehouseOutArr) {
          this.$message.warning('请先选择调出仓库');
          return;
        }
        if (!this.dataForm.inWarehouseCode) {
          this.$message.warning('请先选择调入仓库');
          return;
        }
        this.warehouseId = this.dataForm.warehouseOutArr[0].warehouseId
        this.warehouseName = this.dataForm.warehouseOutArr[0].warehouseName
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
          itemObj.allocationPrice = item.allocationPrice
          itemObj.batchNumber = item.batchNumber
          itemObj.brandName = item.brandName
          itemObj.checkPrice = item.checkPrice
          itemObj.crtTime = item.crtTime
          itemObj.deleted = item.deleted
          itemObj.iid = item.id
          itemObj.itemNo = item.itemNo
          itemObj.lockedQty = item.lockedQty
          itemObj.lockingOrderNo = item.lockingOrderNo
          itemObj.ownerId = item.ownerId
          itemObj.ownerName = item.ownerName
          itemObj.purchasePrice = item.purchasePrice
          itemObj.purchaserName = item.purchaserName
          itemObj.purchaserId = item.purchaserId
          itemObj.qty = JSON.parse(JSON.stringify(item.qty - item.lockedQty))
          itemObj.stockQty = JSON.parse(JSON.stringify(item.qty))
          itemObj.retailPrice = item.retailPrice
          itemObj.revision = item.revision
          itemObj.seriesName = item.seriesName
          itemObj.skuName = item.skuName
          itemObj.skuNo = item.skuNo
          itemObj.source = item.source
          itemObj.specifications = item.specifications
          itemObj.stockState = item.stockState
          itemObj.stockType = item.stockType
          itemObj.supplierCode = item.supplierCode
          itemObj.supplierName = item.supplierName
          itemObj.tenantId = item.tenantId
          itemObj.type = item.type
          itemObj.updTime = item.updTime
          itemObj.warehouseId = item.warehouseId
          itemObj.warehouseName = item.warehouseName
          itemObj.outPositionId = item.warehousePositionId
          itemObj.outPositionName = item.warehousePositionName
          // itemObj.positionInArr = JSON.parse(JSON.stringify(_this.positionInArr))
          // itemObj.positionOutArr = JSON.parse(JSON.stringify(_this.positionOutArr))
          
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
      async handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        await this.dataFormOnSubmit(this, addBill, 'submitSuccess')
        this.dataForm={}
        this.items=[]
      },
      async handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        await this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
        this.dataForm={}
        this.items=[]
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (isEmpty(this.items[i].inPositionName)) {
               this.$message.error('第' + (i * 1 + 1) + '行的调入仓位为必填项，请填写了再提交');
               return;
            }
            if (isEmpty(this.items[i].skuName)) {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称为必填项，请填写了再提交');
              return;
            }

            if (isEmpty(this.items[i].qty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的数量必填项，请填写了再提交');
              return;
            }
          }
        }
        return true;
      }
    }
  }
</script>

<style scoped>
  .from-title{
    border: 1px solid #E4E7ED;
    width: 5%;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    background-color: rgb(234,242,254);
  }
  .from-title-required:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .from-item{
    width: 25%;
    border: 1px solid #E4E7ED;
    padding: 5px 0;
  }
  .no-border{
    border: 0!important;
  }
  .no-border-left{
    border-left:0
  }
  .no-border-right{
    border-right:0
  }
  .no-border-top{
    border-top:0
  }
  .no-border-bottom{
    border-bottom:0
  }
  .table-from-title{
    display: inline-block;
  }
  .table-from{
    height: 100%;
  }
  .el-form-item{
    margin-bottom: 0!important;
  }
  >>>.center-container .el-input__inner,>>> .tb-edit .el-input__inner{
    border: 0!important;
  }
</style>