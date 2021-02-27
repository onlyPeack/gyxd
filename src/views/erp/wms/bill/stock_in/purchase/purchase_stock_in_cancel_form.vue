<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增采购入库取消单</span>
        <span v-if="dataForm.id">编辑采购入库取消单</span>
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
            <!-- <td>
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
            </td> -->
            <td>
              <el-form-item label="入库仓库:" prop="warehouseName" class="el-form-flex">
                <div
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in dataForm.warehouseArr" :key="tag.warehouseId" closable
                          @close="handleWarehouseDel">
                    {{tag.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <!-- <td>
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
            </td> -->
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
       <el-table-column prop="brandName" label="品牌" width="130">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="130">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="130">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="130">
        </el-table-column>
        <el-table-column prop="batchNumber" label="入库单号" width="130">
        </el-table-column>
        <el-table-column prop="qty" label="可取消数量" width="130" class-name="col-required">
        </el-table-column>
        <el-table-column prop="cancelQty" label="取消数量" width="130" class-name="col-required">
          <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cancelQty" class="right-el-input col-required"
                    @change="handleEdit(scope.$index, scope.row , 'cancelQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"
                    @input="handleInputFun($event, scope.row, 'cancelQty')"></el-input>
        </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="130">
        </el-table-column>
        <el-table-column prop="positionName" label="仓位名称" width="130">
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

    <!-- 入库仓库弹窗-->
    <el-dialog title="请选择入库仓库" :visible.sync="warehouseVisible" append-to-body>
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
                                   ref="warehousePosition" :warehouseArr="dataForm.warehouseArr"
                                   :warehouseId="dataForm.warehouseId"
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

    <!-- 新增采购入库弹窗底部 -->
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
    <purchase-stock-in-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo" :type="1">
    </purchase-stock-in-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/purchaseStockInCancel'
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans'

  export default {
    name: 'purchaseStockInForm',
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'purchase-stock-in-selector': () => import('../components/purchaseStockInSelector')
    },
    props: ['id', 'dialogFormVisible', 'type'],
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
          purchaseAmount: undefined,
          sourcePurchaseAmountBillNo: undefined,
          billAmountDistributeMethod: '1',
          supplierId: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          purchaserCode: undefined,
          currencyId: '1',
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          accountMethod: '1',
          repayCondition: '2',
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        sourceBillNoArr: [],
        billAmountDistributeMethodOptions: [{value: '1', label: '按金额分配'}, {value: '2', label: '按数量分配'}],
        repayConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
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
          warehouseName: [
            {
              required: true,
              message: '请选择入库仓库',
              trigger: 'blur'
            }
          ],
          sourceBillNo: [
            {
              required: true,
              message: '请关联单据',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        tableElInputNum: 9,
        warehousePositionIndex: undefined,
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
              this.purchaserUserArr = response.data.purchaserUserArr
              this.supplierArr = response.data.supplierArr
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
          this.dataForm.billDate = date
          this.dataForm.deliverDate = date
          // this.dataForm.purchaserId = this.$store.state.user.id
          this.dataForm.purchaserName = this.$store.state.user.name
          this.dataForm.purchaserCode = this.$store.state.user.code
          this.handleValueAdd()
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-')
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
          deliverDate: deliverDate
        }
        this.items.push(d)
      },
      handleValueDelete(index, row) {

        if (this.items.length === 1) {
          if(row.itemNo){
            this.items=[{}]
          }
          this.supplierArr=[]
          this.purchaserUserArr=[]
          Object.assign(this.$data, this.$options.data())
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
          this.dataForm.deliverDate = date
          // this.dataForm.purchaserId = this.$store.state.user.id
          this.dataForm.purchaserName = this.$store.state.user.name
          this.dataForm.purchaserCode = this.$store.state.user.code
          this.handleValueAdd()
        }else{
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
          if(this.items.length === 1&&!this.items[0].itemNo){
            this.supplierArr=[]
            this.purchaserUserArr=[]
            Object.assign(this.$data, this.$options.data())
            let date = new Date().toLocaleDateString().replace(/\//g, '-')
            this.dataForm.billDate = date
            this.dataForm.deliverDate = date
            // this.dataForm.purchaserId = this.$store.state.user.id
            this.dataForm.purchaserName = this.$store.state.user.name
            this.dataForm.purchaserCode = this.$store.state.user.code
            this.handleValueAdd()
          }
        }

      },
      handleEdit(index, row, type, val) {

        if (row.qty && row.qty != '') {
          if (type == 'cancelQty' || type == 'price' || type == 'taxRate') {
            if(type == 'cancelQty') {
              if(Number(row.cancelQty) > Number(row.qty)) {
                this.$message.warning('取消数量不能大于可取消数量!')
                this.vueSet(this.items[index], 'qty', row.qty)
              }
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
        this.purchaserUserArr = list
        this.purchaseUserVisible = false
        if (list.length > 0) {
          this.dataForm.purchaserName = list[0].name
          // this.dataForm.purchaserId = list[0].id
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

      //入库仓库
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
          this.$message.error('请先选择入库仓库')
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
        this.productVisible = true
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
          itemObj.cost = itemObj.price
          itemObj.unitCost = itemObj.amount
          itemObj.purchaseAmount = '0.00'
          itemObj.isReadOnly = false
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price))
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty))
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax))
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount))
          } else if (column.property === 'purchaseAmount') {
            values = data.map(item => Number(item.purchaseAmount))
          }
          
          if (column.property === 'qty' || column.property === 'amount' || column.property === 'cancelQty'
            || column.property === 'tax' || column.property === 'taxAmount' || column.property === 'purchaseAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'amount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 2)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.taxBillAmount = getFloat((prev + curr), 2)
                }
                return getFloat((prev + curr), 2)
              } else {
                return prev
              }
            }, 0)

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
      handlePurchaseOrderSelector() {
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
        this.purchaserUserArr=[{
          'id': obj.list[0].purchaserId,
          'name': obj.list[0].purchaserName,
        }];
        // this.dataForm.purchaserId = obj.list[0].purchaserId;
        this.dataForm.purchaserName = obj.list[0].purchaserName;
        this.dataForm.supplierCode = obj.list[0].supplierCode;
        this.dataForm.supplierName = obj.list[0].supplierName;
        this.dataForm.sourceBillNo = obj.list[0].batchNumber;
        this.dataForm.purchaserId = obj.list[0].purchaserId;
        this.dataForm.warehousePositionId = obj.list[0].warehousePositionId;
        this.dataForm.warehousePositionName = obj.list[0].warehousePositionName;
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index]
          if (index == 0) {
            if (item.warehouseName) {
              _this.dataForm.warehouseArr = [{
                warehouseName: item.warehouseName,
                warehouseId: item.warehouseId
              }]
              _this.dataForm.warehouseName = item.warehouseName
              _this.dataForm.warehouseId = item.warehouseId
            }
            _this.dataForm.sourceBillNo = item.batchNumber
            _this.sourceBillNoArr = [{billNo: item.batchNumber}]
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.skuNo = item.skuNo
          itemObj.allocationPrice = item.allocationPrice;
          itemObj.batchNumber = item.batchNumber;
          itemObj.brandName = item.brandName;
          itemObj.checkPrice = item.checkPrice;
          itemObj.crtTime = item.crtTime;
          itemObj.deleted = item.deleted;
          itemObj.id = item.id;
          itemObj.iid = item.id;
          itemObj.itemNo = item.itemNo;
          itemObj.lockedQty = item.lockedQty;
          itemObj.lockingOrderNo = item.lockingOrderNo;
          itemObj.ownerId = item.ownerId;
          itemObj.ownerName = item.ownerName;
          itemObj.purchasePrice = item.purchasePrice;
          itemObj.purchaserId = item.purchaserId;
          itemObj.purchaserName = item.purchaserName;
          itemObj.qty = item.qty;
          itemObj.cancelQty = item.qty;
          itemObj.retailPrice = item.retailPrice;
          itemObj.revision = item.revision;
          itemObj.seriesName = item.seriesName;
          itemObj.skuName = item.skuName;
          itemObj.skuNo = item.skuNo;
          itemObj.source = item.source;
          itemObj.specifications = item.specifications;
          itemObj.stockState = item.stockState;
          itemObj.stockType = item.stockType;
          itemObj.supplierCode = item.supplierCode;
          itemObj.supplierName = item.supplierName;
          itemObj.tenantId = item.tenantId;
          itemObj.type = item.type;
          itemObj.updTime = item.updTime;
          itemObj.warehouseId = item.warehouseId;
          itemObj.warehouseName = item.warehouseName;
          itemObj.positionId = item.warehousePositionId;
          itemObj.positionName = item.warehousePositionName
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
        var billAmount = 0
        var taxBillAmount = 0
        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的取消数量为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select()
              return
            }
            if (this.items[i].amount && this.items[i].amount != '' && !isNaN(this.items[i].amount)) {
              billAmount = billAmount * 1 + this.items[i].amount * 1
            }
            if (this.items[i].taxAmount && this.items[i].taxAmount != '' && !isNaN(this.items[i].taxAmount)) {
              taxBillAmount = taxBillAmount * 1 + this.items[i].taxAmount * 1
            }
          }
        }
        this.dataForm.billAmount = billAmount.toFixed(4)
        this.dataForm.taxBillAmount = taxBillAmount.toFixed(4)
        return true
      }
    }
  }
</script>
