<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增收货通知变更单</span>
        <span v-if="dataForm.id">编辑收货通知变更单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" @change="handleBillDateChange" align="right" type="datetime"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
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
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
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
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="联系人:" prop="linkPerson" class="el-form-flex">
                <el-input v-model="dataForm.linkPerson" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="联系电话:" prop="linkPhone" class="el-form-flex">
                <el-input v-model="dataForm.linkPhone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="预计到货日期:" prop="deliverDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.deliverDate" @change="handleArrivalDateChange" align="right" type="datetime"
                                style="width: 200px" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到货仓库:" prop="warehouseName" class="el-form-flex">
                <div
                     style="line-height: 40px;margin-right: 15px;">
                  <!-- <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span> -->
                  <span v-for="tag in dataForm.warehouseArr" :key="tag.warehouseId">
                    {{tag.name}}
                  </span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="币别:" prop="currencyName" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;">
                  <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款条件:" prop="repayCondition" class="el-form-flex">
                <el-select v-model="dataForm.repayCondition" style="width: 100%;">
                  <el-option v-for="item in repayConditionOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="结算方式:" prop="accountMethod" class="el-form-flex">
                <el-select v-model="dataForm.accountMethod" style="width: 100%;">
                  <el-option v-for="item in accountMethodOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
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
      <!-- <el-table-column prop="skuName" label="商品名称" width="180">
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
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rebateSeries" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="收货通知数量" width="120" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="canCancleQty" label="可取消数量" width="120" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.canCancleQty" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.canCancleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cancleQty" label="取消数量" width="120" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cancleQty"
                    @change="handleEdit(scope.$index, scope.row , 'cancleQty', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.cancleQty}}</span>
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

    <!-- 到货仓库弹窗-->
    <el-dialog title="请选择到货仓库" :visible.sync="warehouseVisible" append-to-body>
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

    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增采购订单弹窗底部 -->
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
    <purchase-order-cancel-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo" :type="2">
    </purchase-order-cancel-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseReceiptGoodsCancelNotice'
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans'

  export default {
    name: 'receiptGoodsNoticeForm',
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'purchase-order-cancel-selector': () => import('../components/purchaseOrderCancelSelector')
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
          deliverDate: undefined,
          linkPerson: undefined,
          linkPhone: undefined,
          supplierId: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          purchaserCode: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          currencyId: '1',
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          accountMethod: '1',
          repayCondition: '1',
          items: []
        },
        items: [],
        accountMethodOptions: [],
        repayConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
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
              message: '请选择单据',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        warehousePositionIndex: undefined,
        tableElInputNum: 7,
        skuNo: undefined
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleDeliverDateChange(index,val) {
        this.items[index].deliverDate = this.$moment(val).format("YYYY-MM-DD HH:mm:ss")
        console.log('交货日期');
        console.log(this.items[0].deliverDate);
      },
      handleArrivalDateChange(val) {
        this.dataForm.deliverDate = this.$moment(val).format("YYYY-MM-DD HH:mm:ss")
        console.log('预计交货日期');
        console.log(this.dataForm.deliverDate);
      },
      handleBillDateChange(val) {
         this.dataForm.billDate = this.$moment(val).format("YYYY-MM-DD HH:mm:ss")
         console.log('单据日期');
         console.log(this.dataForm.billDate);
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 334
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number)

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number)

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number)

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number)

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number)

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum

        if (type == 'enter' && number + 1 <= total) {
          number++
        } else if (type == 'left' && number - 1 > 0) {
          number--
        } else if (type == 'right' && number + 1 <= total) {
          number++
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus()
        this.$refs['tableElInput' + number].$el.querySelector('input').select()

      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data
              // this.purchaserUserArr = response.data.purchaserUserArr
              this.purchaserUserArr = [{
                'id': response.data.purchaserCode,
                'name': response.data.purchaserName,
                'code': response.data.purchaserCode
              }]
              this.supplierArr = [{
                'id': response.data.supplierCode,
                'supplierName': response.data.supplierName,
                'code': response.data.supplierCode
              }]
              // this.supplierArr = response.data.supplierArr
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = [{billNo: response.data.sourceBillNo}]
              }
              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss")
          this.dataForm.deliverDate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss")
          this.purchaserUserArr.push({
            'id': this.$store.state.user.id,
            'name': this.$store.state.user.name,
            'code': this.$store.state.user.code
          })
          this.dataForm.purchaserId = this.$store.state.user.id
          this.dataForm.purchaserName = this.$store.state.user.name
          this.dataForm.purchaserCode = this.$store.state.user.code
          this.handleValueAdd()
        }
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
          deliverDate: deliverDate
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
        var count = 0
        for (var i in this.items) {
          if (this.items[i].sourceBillId) {
            count++
          }
        }
        if (count == 0) {
          this.dataForm.sourceBillNo = undefined
          this.sourceBillNoArr = []
        }
      },
      handleEdit(index, row, type, val) {
            // canCancleQty
        if (row.cancleQty && row.cancleQty != '') {
          if (type == 'cancleQty') {
            if(isNaN(val)) {
                this.vueSet(this.items[index], 'cancleQty', 0.0)
            } else if (val > row.canCancleQty) {
               this.$message.warning('取消数量不能大于可取消数量,请重新填写!')
               this.vueSet(this.items[index], 'cancleQty', row.canCancleQty)
            }
          }
          this.vueSet(this.items, index, this.items[index])

        }

      },

      // 采购员选择
      handlePurchaserUserSelector() {
        this.purchaseUserVisible = true
      },
      handleCancelPurchaserUser() {
        this.$refs.purchaseUser.reset()
        this.purchaseUserVisible = false
      },
      handlePurchaserUserDel(index) {
        this.purchaserUserArr.splice(index, 1)
        this.dataForm.purchaserId = undefined
        this.dataForm.purchaserName = undefined
        this.dataForm.purchaserCode = undefined
        this.$refs.purchaseUser.reset()
      },
      handleSubmitPurchaserUser() {
        this.$refs.purchaseUser.onSubmit()
      },
      closeUserDialog(list) {
        console.log('list');
        console.log(list);
        this.purchaserUserArr = list
        this.purchaseUserVisible = false
        if (list.length > 0) {
          this.dataForm.purchaserName = list[0].name
          this.dataForm.purchaserId = list[0].id
          this.dataForm.purchaserCode = list[0].purchaserCode
        }
      },

      // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset()
        this.supplierVisible = false
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1)
        this.dataForm.supplierId = undefined
        this.dataForm.supplierName = undefined
        this.dataForm.supplierCode = undefined
        this.$refs.supplier.reset()
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit()
      },
      closeSupplierDialog(list) {
        this.supplierArr = list
        this.supplierVisible = false
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName
          this.dataForm.supplierId = list[0].id
          this.dataForm.supplierCode = list[0].supplierCode
        }
      },

      //到货仓库
      handleWarehouseSelector() {
        this.warehouseVisible = true
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset()
        this.warehouseVisible = false
      },
      handleWarehouseDel(index) {
        this.dataForm.warehouseArr.splice(index, 1)
        this.dataForm.warehouseId = undefined
        this.dataForm.warehouseName = undefined
        for (var i in this.items) {
          this.vueSet(this.items[i], 'positionArr', [])
          this.vueSet(this.items[i], 'positionId', undefined)
          this.vueSet(this.items[i], 'positionName', undefined)
        }
        this.$refs.warehouse.reset()
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit()
      },
      closeWarehouseDialog(list) {
        var warehouseArr = []
        for (var i in list) {
          warehouseArr.push({warehouseId: list[i].id, warehouseName: list[i].name})
        }
        this.dataForm.warehouseArr = warehouseArr
        this.warehouseVisible = false
        if (list.length > 0) {
          this.dataForm.warehouseId = list[0].id
          this.dataForm.warehouseName = list[0].name

          for (var i in this.items) {
            this.vueSet(this.items[i], 'positionArr', [])
            this.vueSet(this.items[i], 'positionId', undefined)
            this.vueSet(this.items[i], 'positionName', undefined)
          }

        }
      },

      //仓位
      handleWarehousePositionSelector(index) {
        if (!this.dataForm.warehouseId) {
          this.$message.error('请先选择到货仓库')
          return
        }
        this.skuNo = this.items[index].skuNo
        this.warehousePositionIndex = index
        this.warehousePositionVisible = true
      },
      handleCancelWarehousePosition() {
        this.warehousePositionIndex = undefined
        this.$refs.warehousePosition.reset()
        this.warehousePositionVisible = false
      },
      handleWarehousePositionDel(index, tagIndex) {
        this.items[index].positionArr.splice(tagIndex, 1)
        this.items[index].positionId = undefined
        this.items[index].positionName = undefined
        this.vueSet(this.items, index, this.items[index])

        this.$refs.warehousePosition.reset()
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit()
      },
      closeWarehousePositionDialog(list) {
        this.items[this.warehousePositionIndex].positionArr = list
        this.warehousePositionVisible = false
        if (list.length > 0) {
          this.items[this.warehousePositionIndex].positionId = list[0].id
          this.items[this.warehousePositionIndex].positionName = list[0].name
        }
        this.vueSet(this.items, this.warehousePositionIndex, this.items[this.warehousePositionIndex])
        this.$refs.warehousePosition.reset()
      },

      //商品选择
      handleProductShow() {
        this.dialogSelectorVisible = true
      },
      handleCloseProduct() {
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit()
      },
      closeGoodsDialog(list) {
        //console.log(list);

        this.selectedProducts = list

        const _this = this
        const dataMap = _this.data2Map(_this.items)

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)

        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          itemObj.skuNo = item.skuNo
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.skuName = item.goodsName
          itemObj.qty = 1 + ''
          itemObj.amount = item.price + ''
          itemObj.taxRate = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1
          itemObj.tax = (item.price * taxRate).toFixed(4)
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(4)
          itemObj.taxAmount = itemObj.taxPrice
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.productVisible = false
        this.selectedProducts = []

        this.$refs.goodsSelector.reset()
      },
      data2Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.skuNo] = item
        })
        return map
      },
      data3Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.sourceBillId] = item
        })
        return map
      },
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        let values = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'qty') {
            values = data.map(item => Number(item.qty))
          } else if (column.property === 'canCancleQty') {
            values = data.map(item => Number(item.canCancleQty))
          } else if (column.property === 'cancleQty') {
            values = data.map(item => Number(item.cancleQty))
          }

          if (column.property === 'qty' || column.property === 'canCancleQty' || column.property === 'cancleQty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                return getFloat((prev + curr), 4)
              } else {
                return prev
              }
            }, 0).toFixed(4)

            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleCancel() {
        this.$emit('handleCancelForm')
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        this.dialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1)
        this.dataForm.sourceBillNo = undefined
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = []
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key

        const _this = this
        const dataMap = _this.data3Map(_this.items)

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index]
          console.log(item);
          if (index == 0) {
            if (item.mainDTO.warehouseName) {
              _this.dataForm.warehouseArr = [];
              _this.dataForm.warehouseArr = item.mainDTO.warehouseArr;
              _this.dataForm.warehouseName = item.mainDTO.warehouseArr[0].name;
              _this.dataForm.warehouseId = item.mainDTO.warehouseArr[0].id
            }
            _this.supplierArr = item.mainDTO.supplierArr
            _this.dataForm.supplierId = item.mainDTO.supplierId
            _this.dataForm.supplierName = item.mainDTO.supplierName
            _this.dataForm.supplierCode = item.mainDTO.supplierCode
            _this.dataForm.sourceBillNo = item.mainDTO.billNo
            _this.sourceBillNoArr = [{billNo: item.mainDTO.billNo}]
          }
          console.log(_this.dataForm.warehouseArr);
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }

          var itemObj = {}
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          itemObj.skuNo = item.skuNo
          itemObj.sourceBillId = item.id
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.sourceBillId = item.id
          itemObj.sourceBillNo = item.mainDTO.billNo
          itemObj.price = item.price + ''
          itemObj.skuName = item.skuName
          itemObj.qty = item.qty
          itemObj.rebateSeries = item.rebateSeries
          itemObj.canCancleQty = item.qty - item.stockInPurchaseQty
          itemObj.canGoodsQty = item.canGoodsQty + ''
          itemObj.amount = item.amount + ''
          itemObj.taxRate = item.taxRate + ''
          itemObj.tax = item.tax + ''
          itemObj.taxPrice = item.taxPrice + ''
          itemObj.taxAmount = item.taxAmount + ''
          itemObj.sourceObjectKey = obj.sourceObject.key
          itemObj.sourceObjectName = obj.sourceObject.name
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.dialogSelectorVisible = false

      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (!this.items[i].cancleQty || this.items[i].cancleQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商取消数量必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()

              return
            }
          }
        }
        return true
      },
      handleAuditBill(val) {
        auditBill(this.id, val).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submitSuccess')
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
