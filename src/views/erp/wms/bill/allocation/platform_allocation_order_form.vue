<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增平台调拨单</span>
        <span v-if="dataForm.id">编辑平台调拨单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" disabled></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调拨总金额:" prop="totalTransferAmt" class="el-form-flex">
                <el-input v-model="dataForm.totalTransferAmt" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调出货主编码:" prop="shipperCode" class="el-form-flex">
                <el-input v-model="dataForm.shipperCode" disabled></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调出货主名称:" prop="shipperName" class="el-form-flex">
                <el-input v-model="dataForm.shipperName" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调往客户编码:" prop="customerCode" class="el-form-flex">
                <el-input v-model="dataForm.customerCode" disabled></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调往客户名称:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" disabled></el-input>
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
      <el-table-column prop="goodsName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more" v-model="scope.row.goodsName"></el-input>
          </div>
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="series" label="标准系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.series" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.series}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="series" label="返点系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rebateSeries" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specModel" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferQty" label="调拨数量" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferQty" class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'transferQty', $event)"
                    @input="handleInput(scope.$index, scope.row , 'transferQty', $event)"></el-input>
          <span>{{scope.row.transferQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsCode" label="产品编码" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.goodsCode" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.goodsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="库存数量" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="平台调拨价" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPrice" readonly="readonly" class="readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sysTransferPrice" label="系统调拨价" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sysTransferPrice" class="right-el-input"
                    @input="handleInput(scope.$index, scope.row , 'sysTransferPrice', $event)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="profitAmt" label="调拨利润" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.profitAmt" class="readonly-el-input" readonly></el-input>
          <span>{{scope.row.profitAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferAmt" label="调拨金额" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferAmt" class="readonly-el-input" readonly></el-input>
          <span>{{scope.row.transferAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="houseName" label="仓库名称" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.houseName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.houseName}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column prop="locationName" label="仓位" width="180" align="left">-->
<!--        <template slot-scope="scope">-->
<!--          <div @click.stop="handleWarehousePositionSelector(scope.$index)"-->
<!--               style="text-align: left;margin-left: 15px;cursor: pointer;">-->
<!--                  <span>-->
<!--                    <svg-icon icon-class="add"></svg-icon>-->
<!--                  </span>-->
<!--            <el-tag v-if="scope.row.locationName" closable @close="handleWarehousePositionDel(scope.$index)">-->
<!--              {{scope.row.locationName}}-->
<!--            </el-tag>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
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

    <!-- 调往客户列表弹窗-->
    <el-dialog title="请选择调往客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector :shipperCode="dataForm.shipperCode" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="handleCancelCustomer">取 消</el-button>-->
        <!--<el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>-->
      </span>
    </el-dialog>

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
    <el-dialog title="请选择仓位" :visible.sync="warehousePositionVisible" append-to-body v-if="warehousePositionVisible">
      <warehouse-position-selector @closeWarehousePositionDialog="closeWarehousePositionDialog" :isSingle="true"
                                   ref="warehousePosition"
                                   :warehouseArr="warehousePositionIndex!=undefined?[{warehouseId:items[warehousePositionIndex].houseCode}]:[{}]"></warehouse-position-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehousePosition">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehousePosition">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 共享库存弹窗-->
    <el-dialog title="共享库存" width="70%" v-if="productVisible" :visible.sync="productVisible" append-to-body class="goodsDialog dropDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗底部 -->
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
  </el-dialog>
</template>

<script>
  import { getFloat } from '@/utils/util'
  import { addBill, getBill, tempAddBill } from '@/api/erp/wms/bill/platformAllocation'
  import {findSelfConsignor} from '@/api/erp/wms/config/settleOrg'

  export default {
    name: 'platformAllocationOrderForm',
    components: {
      'goods-selector': () => import('./components/goodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
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
          customerOrderNo: undefined,
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          shipperCode: undefined,
          shipperName: undefined,
          lockingOrderNo: undefined,
          allocationType: 1,
          note: undefined,
          billStatus: undefined,
          totalTransferAmt: undefined,
          totalProfitAmt: undefined,
          items: []
        },
        items: [],
        customerArr: [],
        selectedProducts: [],
        customerVisible: false,
        productVisible: false,
        rules: {},
        allocationTypeOptions: [
          {
            value: 0,
            label: '调出'
          },
          {
            value: 1,
            label: '调入'
          }
        ],
        list: null,
        dialogVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        warehouseIndex: undefined,
        warehousePositionIndex: undefined
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function() {
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
          var height = 221
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data
              this.customerArr = response.data.customerArr
              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          this.handleValueAdd()
          findSelfConsignor().then(res=>{
            if(res.code == 2000){
              this.dataForm.customerName = res.data.shipperName;
              this.dataForm.customerCode = res.data.shipperCode;
            }
          })
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          goodsName: undefined,
          goodsCode: undefined
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleInput(index, item, key, $event) {
        if (key == 'transferQty') {
          item[key] = ($event || '').replace(/\D/g, '')
          if (item.sysTransferPrice) {
            this.vueSet(this.items[index], 'transferAmt', Number(item.transferPrice * item.transferQty).toFixed(2))
            this.vueSet(this.items[index], 'transferAmt', Number(item.transferPrice * item.transferQty).toFixed(2))
            this.vueSet(this.items[index], 'profitAmt', Number((Number(item.sysTransferPrice-item.transferPrice)*Number(item.transferQty))).toFixed(2))
          }
        } else {
          item[key] = ($event || '').replace(/[^\d^\.]+/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          if (item.transferQty) {
            this.vueSet(this.items[index], 'transferAmt', Number(item.transferPrice * item.transferQty).toFixed(2))
            this.vueSet(this.items[index], 'profitAmt', Number((Number(item.sysTransferPrice-item.transferPrice)*Number(item.transferQty))).toFixed(2))
          }
        }
      },
      // transferQty
       handleEdit(index, row, type, val) {
              // this.vueSet(this.items[index], 'amount', '0.00');
        if (row.transferQty && row.transferQty != '') {
          if (type == 'transferQty') {
            if (row.transferQty >  row.qty ) {
              this.$message.warning('调拨数量不能大于库存数量,请重新填写')
              row.transferQty = Number(row.qty);
              this.vueSet(this.items[index], 'transferQty', row.transferQty);
            } else {
              this.vueSet(this.items[index], 'transferQty', row.transferQty);
            }
          }
          this.vueSet(this.items, index, this.items[index]);
        }
      },
      //仓库
      handleWarehouseSelector(index) {
        if (!this.items[index].goodsCode) {
          this.$message.warning('请先选择商品')
          return
        }
        this.warehouseIndex = index
        this.warehouseVisible = true
      },
      handleCancelWarehouse() {
        this.warehouseIndex = undefined
        this.$refs.warehouse.reset()
        this.warehouseVisible = false
      },
      handleWarehouseDel(index) {
        this.items[index].houseCode = undefined
        this.items[index].houseName = undefined
        this.items[index].locationCode = undefined
        this.items[index].locationName = undefined
        this.vueSet(this.items, index, this.items[index])

        this.$refs.warehouse.reset()
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit()
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false
        if (list.length > 0) {
          this.items[this.warehouseIndex].houseCode = list[0].id
          this.items[this.warehouseIndex].houseName = list[0].name
        }
        this.vueSet(this.items, this.warehouseIndex, this.items[this.warehouseIndex])
        this.$refs.warehouse.reset()
      },

      //仓位
      handleWarehousePositionSelector(index) {
        /*if (!this.items[index].houseCode) {
          this.$message.warning('请先选择仓库');
          return;
        }*/
        this.warehousePositionIndex = index
        this.warehousePositionVisible = true
      },
      handleCancelWarehousePosition() {
        this.warehousePositionIndex = undefined
        this.$refs.warehousePosition.reset()
        this.warehousePositionVisible = false
      },
      handleWarehousePositionDel(index) {
        this.items[index].locationCode = undefined
        this.items[index].locationName = undefined
        this.vueSet(this.items, index, this.items[index])

        this.$refs.warehousePosition.reset()
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit()
      },
      closeWarehousePositionDialog(list) {
        this.warehousePositionVisible = false
        if (list.length > 0) {
          this.items[this.warehousePositionIndex].locationCode = list[0].id
          this.items[this.warehousePositionIndex].locationName = list[0].name
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
        if(list.isClearAll){
          this.items = [];
        }
        this.selectedProducts = list.list
        for(let i in this.selectedProducts){
          for(let j in this.items){
            if(this.items[j].itemNo == this.selectedProducts[i].itemNo){
              this.vueMessage('warning','同一单同一型号只支持一条明细，请分多次制单！'+ this.selectedProducts[i].itemNo);
              return
            }
          }
        }
        const _this = this
        const dataMap = _this.data2Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.goodsCode]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.goodsName = item.goodsName
          itemObj.goodsCode = item.goodsCode
          itemObj.brandName = item.brandName
          itemObj.series = item.series
          itemObj.goodsId = item.id
          itemObj.itemNo = item.itemNo
          itemObj.specModel = item.specModel
          itemObj.unit = item.unit
          itemObj.shipperCode = item.shipperCode
          itemObj.shipperName = item.shipperName
          itemObj.houseCode = item.houseCode
          itemObj.houseName = item.houseName
          itemObj.retailPrice = item.retailPrice
          itemObj.transferPrice = Number(item.transferPrice).toFixed(4)
          itemObj.sysTransferPrice = Number(item.transferPrice).toFixed(4)
          itemObj.qty = item.qty
          itemObj.transferQty = 1
          itemObj.profitAmt =  ((Number(itemObj.sysTransferPrice) - Number(itemObj.transferPrice))*Number(itemObj.transferQty)).toFixed(2)
          itemObj.transferAmt = (Number(itemObj.transferPrice) * Number(itemObj.transferQty)).toFixed(2);
          _this.items.push(itemObj)
        }
        if (this.selectedProducts.length > 0) {
          this.dataForm.shipperCode = this.selectedProducts[0].shipperCode
          this.dataForm.shipperName = this.selectedProducts[0].shipperName
        }
        // 添加一个空行
        _this.handleValueAdd()
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      getSummaries(param) {
        let { columns, data } = param
        let sums = []
        let values = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'transferQty') {
            values = data.map(item => Number(item.transferQty))
          } else if (column.property === 'transferAmt') {
            values = data.map(item => Number(item.transferAmt))
          }

          if (column.property === 'transferQty' || column.property === 'transferAmt') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'transferAmt') {
                  this.dataForm.totalTransferAmt = getFloat((prev + curr), 2)
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
      data2Map(data) {
        let map = {}
        data.forEach(function(item, index) {
          item.index = index
          if (item.goodsCode) {
            map[item.goodsCode] = item
          }
        })
        return map
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true
            } else {
              _this.isFormLoading = true
            }

            let items = []
            for (var i in _this.items) {
              if (_this.items[i].goodsCode) {
                items.push(_this.items[i])
              }
            }
            _this.dataForm.items = items

            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }

              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                _this.$emit(subFunSuccessName)
              } else {
                _this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataForm.totalProfitAmt = 0;
        for(let i in this.items){
          if(this.items[i].profitAmt){
            this.dataForm.totalProfitAmt = Number(this.dataForm.totalProfitAmt) + Number(this.items[i].profitAmt);
          }
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataForm.totalProfitAmt = 0;
        for(let i in this.items){
          if(this.items[i].profitAmt){
            this.dataForm.totalProfitAmt = Number(this.dataForm.totalProfitAmt) + Number(this.items[i].profitAmt);
          }
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].goodsCode && this.items[i].goodsCode != '') {
            if (!this.items[i].goodsName || this.items[i].goodsName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称为必填项，请填写了再提交')
              return
            }
            if (!this.items[i].sysTransferPrice || this.items[i].sysTransferPrice == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的系调拨价为必填项，请填写了再提交')
              return
            }
            if (!this.items[i].transferQty || this.items[i].transferQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的调拨数量为必填项，请填写了再提交')
              return
            }
          }
        }
        return true
      }
    }
  }
</script>
<style>
  .dropDialog>.el-dialog{
    height: auto!important;
  }

</style>
