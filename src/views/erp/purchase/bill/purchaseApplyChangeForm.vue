<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增采购申请变更单</span>
        <span v-if="dataForm.id">编辑采购申请变更单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="新需求仓库:" prop="newWarehouseName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.newWarehouseName" closable @close="handleWarehouseDel()">
                    {{dataForm.newWarehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="原需求仓库:" prop="oldWarehouseName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-if="dataForm.oldWarehouseName">
                    {{dataForm.oldWarehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click.stop="handleSelectorOpen"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  调入
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="变更原因:" prop="changeReason" class="el-form-flex">
                <el-input v-model="dataForm.changeReason" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" readonly="readonly" class="readonly-el-input"></el-input>
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
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releaseQty" label="发布数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.releaseQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.releaseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oldApplyQty" label="原申请数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldApplyQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.oldApplyQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="canChangeQty" label="可变更数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.canChangeQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.canChangeQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchasedQty" label="已采购数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchasedQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.purchasedQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newApplyQty" label="新申请数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newApplyQty" class="right-el-input"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @change="handleEdit(scope.$index, scope.row , 'newApplyQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.newApplyQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="发布单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.releasePrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.releasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="调拨价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPrice" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferDiscount"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.transferDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
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

    <!-- 关联单据 -->
    <purchase-apply-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo" :type="2">
    </purchase-apply-selector>

    <!-- 新增采购申请单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">-->
        <!--<router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印-->
        <!--</router-link>-->
        <!--</el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseApplyChange';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "purchaseApplyChangeForm",
    components: {
      'purchaseApplySelector': () => import('../components/purchaseApplySelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector')
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
          customerCode: undefined,
          customerName: undefined,
          oldWarehouseId: undefined,
          newWarehouseId: undefined,
          oldWarehouseName: undefined,
          newWarehouseName: undefined,
          note: undefined,
          sourceBillNo: undefined,
          changeReason: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        warehouseVisible: false,
        rules: {
          newWarehouseName: [
            {
              required: true,
              message: '请选择仓库',
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
        dialogSelectorVisible: false,
        tableElInputNum: 1
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
          var height = 158;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
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
              if (response.data.items == undefined) {
                this.this.items = [];
              } else {
                this.items = response.data.items;
              }
            });
        }
      },
      handleValueDelete(index, r) {
        this.items.splice(index, 1);
        if (this.items.length == 0) {
          this.dataForm.sourceBillNo = undefined;
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleEdit(index, row, type, val) {
        if (val * 1 > row.oldApplyQty) {
          this.$message.warning('新申请数量不能大于原申请数量');
          this.vueSet(this.items[index], 'newApplyQty', row.oldApplyQty);
        }
        if (val * 1 < row.purchasedQty) {
          this.$message.warning('新申请数量不能小于已采购数量');
          this.vueSet(this.items[index], 'newApplyQty', row.purchasedQty);
        }
        this.vueSet(this.items, index, this.items[index]);
      },

      //仓库
      handleWarehouseSelector() {
        this.warehouseVisible = true;
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleWarehouseDel() {
        this.dataForm.newWarehouseId = undefined;
        this.dataForm.newWarehouseName = undefined;
        if (this.$refs.warehouse) {
          this.$refs.warehouse.reset();
        }
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.dataForm.newWarehouseId = list[0].id;
          this.dataForm.newWarehouseName = list[0].name;
          this.$refs.warehouse.reset();
          this.$refs.dataForm.validateField('newWarehouseName');
        }
      },

      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
      },
      //关联单据
      handleSelectorOpen() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }

        const _this = this;
        const dataMap = _this.data2Map(_this.items);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.dataForm.oldWarehouseId = item.mainDTO.warehouseId;
            _this.dataForm.oldWarehouseName = item.mainDTO.warehouseName;
            _this.dataForm.customerName = item.mainDTO.customerName;
            _this.dataForm.customerCode = item.mainDTO.customerCode;
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
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.skuName = item.skuName;
          itemObj.itemNo = item.itemNo;
          itemObj.rebateSeries = item.rebateSeries
          itemObj.retailPrice = Number(item.retailPrice).toFixed(4);
          itemObj.releasePrice = Number(item.releasePrice).toFixed(4);
          itemObj.salesOrderBillNo = item.salesOrderBillNo;
          itemObj.transferPrice = Number(item.transferPrice).toFixed(4);
          itemObj.transferDiscount = item.transferDiscount;
          itemObj.releaseQty = item.releaseQty;
          itemObj.oldApplyQty = item.applyQty;
          itemObj.purchasedQty = item.purchasedQty;
          //itemObj.newApplyQty = 1;
          itemObj.canChangeQty = item.applyQty * 1 - item.purchasedQty * 1;
          _this.items.push(itemObj);
        }
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
        if (this.items.length == 0) {
          this.$message.error('请选择关联单据');
          return false;
        } else {
          if (this.id) {
            this.dataForm.sourceBillNo = 'CGSQD';
          }
        }

        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].newApplyQty || this.items[i].newApplyQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的新申请数量为必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

          }
        }
        return true;
      }
    }
  }
</script>
