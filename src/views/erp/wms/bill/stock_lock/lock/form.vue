<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增锁库单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="锁库仓库:" prop="warehouseName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in dataForm.warehouseArr" :key="tag.warehouseId" closable
                          @close="handleWarehouseDel">
                    {{tag.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="锁库期限:" prop="deadline" class="el-form-flex">
                <el-date-picker v-model="dataForm.deadline" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
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
      <el-table-column prop="positionName" label="仓位" width="150" align="left">
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
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="200">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="150" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="canUseQty" label="可用数量" width="180" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.canUseQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.canUseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="库存数量" width="180" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lockedQty" label="锁库数量(*)" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.lockedQty" class="right-el-input"
                    onkeypress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.lockedQty}}</span>
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

    <!-- 所有商品库存弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <stock-detail-stock ref="goodsSelector" :isSingle="false"
                          @closeGoodsDialog="closeGoodsDialog" :warehouseId="dataForm.warehouseId"></stock-detail-stock>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 锁库仓库弹窗-->
    <el-dialog title="请选择锁库仓库" :visible.sync="warehouseVisible" append-to-body>
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
    <!-- 新增锁库单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {lock} from '@/api/erp/wms/config/stockLock';

  export default {
    name: "stockLockForm",
    components: {
      'stock-detail-stock': () => import('@/components/ERP/Stock/StockDetailSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          deadline: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择锁库期限',
              trigger: 'blur'
            }
          ],
          warehouseName: [
            {
              required: true,
              message: '请选择锁库仓库',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        warehousePositionIndex: undefined,
        tableElInputNum: 2,
        skuNo: undefined
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
          var height = 72;
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
        let date = new Date().toLocaleDateString().replace(/\//g, '-');
        this.dataForm.deadline = date;
        this.handleValueAdd();
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
      //锁库仓库
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
          this.$message.warning('请先选择锁库仓库');
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
        if (!this.dataForm.warehouseId) {
          this.$message.warning('请先选择锁库仓库');
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
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.skuName = item.skuName;
          itemObj.canUseQty = item.lockedQty ? (item.qty - item.lockedQty) + '' : item.qty + '';
          itemObj.qty = item.qty + '';
          itemObj.lockedQty = 1 + '';
          _this.items.push(itemObj);
        }
        // 添加一个空行
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
          if (column.property === 'lockedQty') {
            values = data.map(item => Number(item.lockedQty));
          } else if (column.property === 'canUseQty') {
            values = data.map(item => Number(item.canUseQty));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'lockedQty' || column.property === 'canUseQty' || column.property === 'qty') {
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
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, lock, 'submitSuccess');
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

            if (!this.items[i].lockedQty || this.items[i].lockedQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的锁库数量必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }

            if (this.items[i].lockedQty && Number(this.items[i].lockedQty) > Number(this.items[i].canUseQty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的锁库数量大于可用数量，请重新填写');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }

          }
        }
        return true;
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .purchaseQuotationDialog {
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
