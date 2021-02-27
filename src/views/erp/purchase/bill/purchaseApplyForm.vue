<template>
  <!--  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog purchaseApplyForm"-->
  <!--             :close-on-click-modal="false" :before-close="handleClose">-->
  <!--      <span slot="title" class="con-title">-->
  <!--        <svg-icon icon-class="contract"></svg-icon>-->
  <!--        <span v-if="!dataForm.id">新增采购申请单</span>-->
  <!--        <span v-if="dataForm.id">编辑采购申请单</span>-->
  <!--        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>-->
  <!--      </span>-->
  <div>
    <div class="center-container">
      <el-button  @click="handleSubmit" :loading="isFormLoading" type="success" plain>提 交</el-button>
      <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 15px"></div>
      <el-form :model="dataForm" :rules="dataForm.type != 0? rules:rulesOne" ref="dataForm" label-width="120px" label-position="right">
        <table class="topTable" style="width: 100%" cellspacing="0">
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="需求客户:" prop="customerName" class="el-form-flex">
                <div @click.stop="handleCustomerSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.customerName" closable @close="handleCustomerDel()">
                    {{dataForm.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="需求仓库:" prop="warehouseName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.warehouseName" closable @close="handleWarehouseDel()">
                    {{dataForm.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="申请类型:" prop="type" class="el-form-flex">
                <el-select v-model="dataForm.type" style="width: 100%;" @change="handleChangeType">
                  <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td class="from-item no-border-bottom">
              <el-form-item label="关联单据:" prop="sourceBillWarehouseName" class="el-form-flex">
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
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="是否批量设置:" class="el-form-flex">
                <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
              </el-form-item>
            </td>
            <td colspan="3" class="from-item no-border-bottom">
              <el-form-item label="备注:" prop="note">
                <el-input v-model="dataForm.note" placeholder="请输入内容" style="width: 97%"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- 非闲置表格 -->
    <el-table :data="items" v-if="dataForm.type != '3'" border highlight-current-row width="100%" ref="table" show-summary :summary-method="getSummaries" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="salesOrderBillNo" label="客户订货单编号" width="180" v-if="dataForm.type=='1' || dataForm.type=='2'">
        <template slot-scope="scope">
          <div @click.stop="handleSalesOrderSelector(scope.$index)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.salesOrderBillNo" :readonly="dataForm.type == 3"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="notOrderQty" label="未订货数量" width="150" align="right" v-if="dataForm.type=='1'|| dataForm.type=='2'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.notOrderQty" readonly="readonly"
                    class="right-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="masterOrderSn" label="订单号" width="120" align="right" v-if="dataForm.type == 3" class-name="gray">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="160" class-name="gray">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="150" class-name="gray">
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="160" class-name="gray">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="160" class-name="gray">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180" class-name="gray">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="150" class-name="gray">
      </el-table-column>
      <el-table-column prop="channelTypeCode" label="渠道类型编号" width="150" class-name="gray">
      </el-table-column>
      <el-table-column prop="channelTypeName" label="渠道类型名称" width="150" class-name="gray">
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码" min-width="150" class-name="gray">
      </el-table-column>
      <el-table-column prop="crtUserName" label="业务员" min-width="140" class-name="gray">
         <template slot-scope="scope">
            {{scope.row.crtUserName}}
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="业务员工号" min-width="140" class-name="gray">
         <template slot-scope="scope">
            {{scope.row.crtUserNo}}
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期" width="90" class-name="gray">
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center" class-name="gray">
         <template slot-scope="scope">
            {{scope.row.unit}}
        </template>
      </el-table-column>
      <el-table-column prop="releaseQty" label="可用数量" width="100" align="right" v-show="dataForm.type != 3" class-name="gray">
        <template slot-scope="scope">
          <div>{{scope.row.releaseQty}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="applyQty" label="申请数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.applyQty" class="right-el-input"
                    min="1"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @change="handleEdit(scope.$index, scope.row , 'applyQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="retailPrice" label="面价" width="120" align="right" class-name="gray">
      </el-table-column>
      <el-table-column prop="transferPrice" label="调拨价(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPrice"
                    @input="handleInputFun($event, scope.row, 'transferPrice')"
                    @change="handleEdit(scope.$index, scope.row , 'transferPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    class="readonly-el-input  right-el-input" readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferDiscount"
                    @input="handleInputFun($event, scope.row, 'transferDiscount')"
                    @change="handleEdit(scope.$index, scope.row , 'transferDiscount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
                    class="readonly-el-input  right-el-input" readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="transferPriceSum" label="调拨金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPriceSum" disabled class="readonly-el-input  right-el-input"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <!-- 闲置表格 -->
    <el-table :data="items" v-if="dataForm.type == '3'" border highlight-current-row width="100%" ref="table" show-summary :summary-method="getSummaries" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.skuName}}
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.brandName}}
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.seriesName}}
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.specifications}}
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" class-name="gray">
         <template slot-scope="scope">
            {{scope.row.itemNo}}
        </template>
      </el-table-column>
      <el-table-column prop="channelTypeCode" label="渠道类型编号" width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.channelTypeCode}}
        </template>
      </el-table-column>
      <el-table-column prop="channelTypeName" label="渠道类型名称" width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.channelTypeName}}
        </template>
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码" min-width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.supplierCode}}
        </template>
      </el-table-column>
      <el-table-column prop="crtUserName" label="业务员" min-width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.crtUserName}}
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="业务员工号" min-width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.crtUserNo}}
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期" width="180" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.deliveryDate}}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.unit}}
        </template>
      </el-table-column>
      <el-table-column prop="applyQty" label="申请数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.applyQty" class="right-el-input"
                    min="1"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @change="handleEdit(scope.$index, scope.row , 'applyQty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="orderQty" label="已采购数量" align="right" width="150" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.orderQty}}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="本次锁库数量" align="right" width="150" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.count}}
        </template>
      </el-table-column>
      <el-table-column label="本次可采购数量" width="120" align="right" class-name="gray">
        <template slot-scope="scope">
          {{scope.row.count - scope.row.orderQty}}
        </template>
      </el-table-column>
      <el-table-column prop="percentage" label="成色" width="100" align="right" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.percentage}}
        </template>
      </el-table-column>
      <el-table-column prop="productionDate" label="生产日期" width="100" align="right" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.productionDate}}
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="right" class-name="gray">
        <template slot-scope="scope">
            {{scope.row.retailPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="调拨价(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPrice"
                    @input="handleInputFun($event, scope.row, 'transferPrice')"
                    @change="handleEdit(scope.$index, scope.row , 'transferPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    class="readonly-el-input  right-el-input" readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferDiscount"
                    @input="handleInputFun($event, scope.row, 'transferDiscount')"
                    @change="handleEdit(scope.$index, scope.row , 'transferDiscount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
                    class="readonly-el-input  right-el-input" readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="transferPriceSum" label="调拨金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPriceSum" disabled class="readonly-el-input  right-el-input"></el-input>
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

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true"
                         ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!--客户订货单-->
    <el-dialog title="请选择客户订货单" :visible.sync="salesOrderVisible" append-to-body v-if="salesOrderVisible">
      <sales-order-selector @closeSalesOrderDialog="closeSalesOrderDialog" :isSingle="true"
                            :skuNo="skuNo" :customerCode="dataForm.customerCode"
                            :selectType="selectedSelectType"
                            ref="salesOrder" width="60%"></sales-order-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSalesOrder">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSalesOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联单据 -->
    <purchase-goods-release-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                                     @submitSelectorSuccess="submitSelectorSuccess"
                                     @handleSelectorClose="handleSelectorClose"
                                     :type="dataForm.type"
                                     :customerCode="dataForm.customerCode"
                                     :warehouseName="dataForm.sourceBillWarehouseName">
    </purchase-goods-release-selector>

    <!--    &lt;!&ndash; 新增采购申请单弹窗底部 &ndash;&gt;-->
    <!--    <div slot="footer" class="dialog-footer">-->
    <!--      <div v-if="dataForm.billStatus && dataForm.billStatus==1">-->
    <!--        &lt;!&ndash;<el-button type="primary" style="float: left;">&ndash;&gt;-->
    <!--        &lt;!&ndash;<router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印&ndash;&gt;-->
    <!--        &lt;!&ndash;</router-link>&ndash;&gt;-->
    <!--        &lt;!&ndash;</el-button>&ndash;&gt;-->
    <!--      </div>-->
    <!--      <el-button @click="handleClose">取 消</el-button>-->
    <!--      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>-->
    <!--      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>-->
    <!--    </div>-->
  </div>
  <!--  </el-dialog>-->
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseApply';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "purchaseApplyForm",
    components: {
      'purchase-goods-release-selector': () => import('../components/purchaseGoodsReleaseSelector'),
      'sales-order-selector': () => import('../components/salesOrderSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelectorWithDefault'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        typeOption:[],
        selectedSelectType:undefined,
        dataForm: {
          id: undefined,
          billNo: undefined,
          customerCode: undefined,
          customerName: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          type: '0',
          note: undefined,
          billStatus: undefined,
          sourceBillWarehouseName: undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        isSwitch: false,
        warehouseVisible: false,
        customerVisible: false,
        salesOrderVisible: false,
        salesOrderIndex: undefined,
        skuNo: undefined,
        rules: {
          customerName: [
            {
              required: true,
              message: '请选择客户',
              trigger: 'blur'
            }
          ],
          warehouseName: [
            {
              required: true,
              message: '请选择需求仓库',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择申请类型',
              trigger: 'blur'
            }
          ],
          // sourceBillWarehouseName: [
          //   {
          //     required: true,
          //     message: '请选择关联单据',
          //     trigger: 'blur'
          //   }
          // ]
        },
        rulesOne: {
          warehouseName: [
            {
              required: true,
              message: '请选择需求仓库',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择申请类型',
              trigger: 'blur'
            }
          ],
          sourceBillWarehouseName: [
            {
              required: true,
              message: '请选择关联单据',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogSelectorVisible: false,
        tableElInputNum: 3
      }
    },
    created() {
      // this.init()
      // this.changeDivHeight()
      // const _this = this
      // window.onresize = function () {
      //   _this.changeDivHeight()
      // }
      let groupName = this.$store.getters.groupNames;
      //console.log(groupName)
      this.typeOption = [];

      if(groupName.indexOf('供应链')>-1||groupName.indexOf('商务')>-1||groupName.indexOf('渠道')>-1||groupName.indexOf('采购')>-1){
        this.typeOption = [{
          value: '0',
          label: '备货'
        }]
        this.dataForm.type = '0';
      } else if(groupName.indexOf('客服')>-1||groupName.indexOf('销售')>-1||groupName.indexOf('区域')>-1){
        this.typeOption=[{
          value: '1',
          label: '按期货订单采购'
        },{
          value: '2',
          label: '按调拨订单采购'
        },
        {
          value: '3',
          label: '按闲置订单采购'
        }
        ];
        this.dataForm.type = '1';
      }
      if((groupName.indexOf('供应链')>-1||groupName.indexOf('商务')>-1||groupName.indexOf('渠道')>-1||groupName.indexOf('采购')>-1)&&(groupName.indexOf('供应链')>-1||groupName.indexOf('商务')>-1||groupName.indexOf('渠道')>-1||groupName.indexOf('采购')>-1)||groupName.indexOf('总经理')>-1){
        this.typeOption = [{
          value: '0',
          label: '备货'
        }, {
          value: '1',
          label: '按期货订单采购'
        },{
          value: '2',
          label: '按调拨订单采购'
        },
        {
          value: '3',
          label: '按闲置订单采购'
        }
        ]
        this.dataForm.type = '0';
      }
    },
    updated() {
      this.changeDivHeight()
      this.$refs['table'].doLayout()
    },
    watch:{
      id(old,fresh){
        this.init()
      }
    },
    computed: {
      groupNames() {
        return this.$store.getters.groupNames;
      }
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 252
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
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'applyQty') {
            values = data.map(item => Number(item.applyQty));
          } else if (column.property === 'transferPriceSum') {
            values = data.map(item => Number(item.transferPriceSum));
          }

          if (column.property === 'applyQty' || column.property === 'transferPriceSum' ) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'applyQty') {
                  this.dataForm.applyQty = getFloat((prev + curr), 4)
                }
                if (column.property === 'transferPriceSum') {
                  this.dataForm.transferPriceSum = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(2);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
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
              if (response.data.items == undefined) {
                this.this.items = []
              } else {
                this.items = response.data.items
              }
            })
        }
      },
      handleValueDelete(index, r) {
        this.items.splice(index, 1)
        if (this.items.length == 0) {
          this.dataForm.sourceBillWarehouseName = undefined
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleChangeType(val) {
        switch(val) {
          case '0':
            this.selectedSelectType = 4;
            break;
          case '1':
            this.selectedSelectType = 6;
            break;
          case '2':
            this.selectedSelectType = 7;
            break;
          case '3':
            this.selectedSelectType = 4;
            break;
        }
        if (this.items.length < 1) {
          return
        }
        this.$confirm('您确定要切换吗？切换后将会清除明细表数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.items = []
          this.dataForm.sourceBillWarehouseName = undefined
        }).catch(() => {
          this.dataForm.type = val == '0' ? '1' : '0'
        })
      },
      handleEdit(index, row, type, val) {
        if (type == 'transferDiscount') {
          val = (val * 1).toFixed(4)
          if (this.isSwitch) {
            for (var i in this.items) {
              this.vueSet(this.items[i], 'transferDiscount', val)
              this.vueSet(this.items[i], 'transferPrice', Number(val * this.items[i].retailPrice).toFixed(4))
            }
          } else {
            this.vueSet(this.items[index], 'transferDiscount', val)
            this.vueSet(this.items[index], 'transferPrice', Number(val * row.retailPrice).toFixed(4))
          }
        } else if (type == 'transferPrice') {

          val = (val * 1).toFixed(4)
          this.vueSet(this.items[index], 'transferPrice', val)
          this.vueSet(this.items[index], 'transferDiscount', Number(val / row.retailPrice).toFixed(4))

        } else if (type == 'applyQty') {
          if (Number(val) < 1) {
            this.$message.warning('申请数量不能小于1')
            this.vueSet(this.items[index], 'applyQty', 1)
            return
          }
          if (this.dataForm.type == '1' || this.dataForm.type == '2' || this.dataForm.type == '3' ) {
            if (row.notOrderQty == undefined){
              this.$message.warning('请先选择订货单编号')
              this.vueSet(this.items[index], 'applyQty', undefined)
              return
            }
            // 期货调拨控制
            if(this.dataForm.type != 3) {
              // if (this.items[index].notOrderQty && val * 1 > this.items[index].notOrderQty * 1) {
              //   this.$message.warning('申请数量不能大于未订货数量')
              //   this.vueSet(this.items[index], 'applyQty', this.items[index].notOrderQty)
              // }
              // if (this.items[index].releaseQty && val * 1 > this.items[index].releaseQty * 1) {
              //   this.$message.warning('申请数量不能大于可用数量')
              //   this.vueSet(this.items[index], 'applyQty', this.items[index].releaseQty)
              // }
              if ((this.items[index].notOrderQty && val * 1 > this.items[index].notOrderQty * 1) || (this.items[index].releaseQty && val * 1 > this.items[index].releaseQty * 1)) {
                this.$message.warning('申请数量不能大于未订货数量或可用数量')
                if(this.items[index].notOrderQty * 1 > this.items[index].releaseQty * 1) {
                  this.vueSet(this.items[index], 'applyQty', this.items[index].releaseQty)
                } else {
                  this.vueSet(this.items[index], 'applyQty', this.items[index].notOrderQty)
                }
              }
            } else {
              // 闲置控制
              if (val * 1 > (this.items[index].count * 1 - this.items[index].orderQty * 1)) {
                this.$message.warning('申请数量不能大于本次可采购数量')
                this.vueSet(this.items[index], 'applyQty', this.items[index].count * 1 - this.items[index].orderQty * 1)
              }
            }
          } else {
            if (val * 1 > row.releaseQty) {
              this.$message.warning('申请数量不能大于可用数量')
              this.vueSet(this.items[index], 'applyQty', row.releaseQty)
            }
          }
          if (row.applyQty && row.transferPrice) {
            row.transferPriceSum = (Number(row.applyQty)*Number(row.transferPrice)).toFixed(4)
          }
        }
        this.vueSet(this.items, index, this.items[index])
      },

      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true
      },
      handleCancelCustomer() {
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      handleCustomerDel() {
        if (this.items.length < 1) {
          this.dataForm.customerName = undefined
          this.dataForm.customerCode = undefined
          if (this.$refs.customer) {
            this.$refs.customer.reset()
          }
          return
        }

        this.$confirm('您确定要删除吗？删除后将会清除明细表数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.items = []
          this.dataForm.sourceBillWarehouseName = undefined
          this.dataForm.customerName = undefined
          this.dataForm.customerCode = undefined
          if (this.$refs.customer) {
            this.$refs.customer.reset()
          }
        }).catch(() => {
        })
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName
          this.dataForm.customerCode = list[0].customerCode
          this.$refs.dataForm.validateField('customerName')
        }
        this.$refs.customer.reset()
      },

      //仓库
      handleWarehouseSelector() {
        this.warehouseVisible = true
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset()
        this.warehouseVisible = false
      },
      handleWarehouseDel() {
        this.dataForm.warehouseId = undefined
        this.dataForm.warehouseName = undefined
        if (this.$refs.warehouse) {
          this.$refs.warehouse.reset()
        }
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit()
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false
        if (list.length > 0) {
          this.dataForm.warehouseId = list[0].id
          this.dataForm.warehouseName = list[0].name
          this.$refs.warehouse.reset()
          this.$refs.dataForm.validateField('warehouseName')
        }
      },

      // 客户订货单选择
      handleSalesOrderSelector(index) {
        if(this.dataForm.type == 3) {
          this.salesOrderVisible = false
        } else {
          this.salesOrderVisible = true
          this.salesOrderIndex = index
          this.skuNo = this.items[index].skuNo
          switch(this.dataForm.type) {
            case '0':
              this.selectedSelectType = 4;
              break;
            case '1':
              this.selectedSelectType = 6;
              break;
            case '2':
              this.selectedSelectType = 7;
              break;
            case '3':
              this.selectedSelectType = 4;
              break;
          }
        }
      },
      handleCancelSalesOrder() {
        this.salesOrderVisible = false
        this.salesOrderIndex = undefined
        this.skuNo = undefined
      },
      handleSubmitSalesOrder() {
        this.$refs.salesOrder.onSubmit()
      },
      closeSalesOrderDialog(list) {
        this.salesOrderVisible = false
        if (list.length > 0) {
          var index = this.salesOrderIndex
          this.items[index].salesOrderBillNo = list[0].mainDTO.billNo
          this.items[index].salesOrderItemId = list[0].id
          switch(this.selectedSelectType) {
            case 4:
              this.items[index].notOrderQty = list[0].qty * 1 - list[0].orderQty * 1
              break;
            case 6:
              this.items[index].notOrderQty = list[0].applicableFutureQty;
              break;
            case 7:
              this.items[index].notOrderQty = list[0].applicableSynergyQty;
              break;
          }

          this.vueSet(this.items, index, this.items[index])
        }
        this.salesOrderIndex = undefined
        this.skuNo = undefined
      },

      data2Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.sourceBillId] = item
        })
        return map
      },
      //关联单据
      handleSelectorOpen() {
        if(this.dataForm.type != 0){
          if (!this.dataForm.customerName) {
            this.$message.warning('请先选择客户')
            return
          }
        }

        this.dialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = []
        }
        const _this = this
        const dataMap = _this.data2Map(_this.items)
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index]
          console.log('item');
          console.log(item);
          if (index == 0) {
            _this.dataForm.sourceBillWarehouseName = item.warehouseName ? item.warehouseName : item.mainDTO.warehouseName
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          if(_this.dataForm.type == 3) {
            itemObj.skuNo = item.goodsCode
          } else {
            itemObj.skuNo = item.skuNo
          }
          itemObj.sourceBillId = item.id
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.specifications = item.specifications ? item.specifications : item.specModel
          itemObj.unit = item.unit
          itemObj.itemNo = item.itemNo
          itemObj.crtUserNo = item.crtUserNo
          itemObj.crtUserName = item.crtUserName
          console.log('业务员');
          console.log(itemObj.crtUserName);
          itemObj.rebateSeries = item.rebateSeries
          itemObj.supplyPrice = item.supplyPrice
          itemObj.salesOrderItemId = item.salesOrderItemId
          if(_this.dataForm.type == 3) {
            itemObj.publisherId = item.publisherId
            itemObj.publisherName = item.publisherName
          } else {
            itemObj.publisherId = item.crtUserId
            itemObj.publisherName = item.crtUserName
          }
          if(item.mainDTO && item.mainDTO.supplierCode) {
            itemObj.supplierCode = item.mainDTO.supplierCode
            itemObj.supplierName = item.mainDTO.supplierName
          } else {
            itemObj.supplierCode = item.supplierCode
            itemObj.supplierName = item.supplierName
          }
          if(itemObj && itemObj.channelTypeName) {
            itemObj.channelTypeName = item.mainDTO.channelTypeName;
            itemObj.channelTypeCode = item.mainDTO.channelType;
          } else {
            itemObj.channelTypeName = '厂家';
            itemObj.channelTypeCode = '01';
          }
          if(item.masterOrderSn) {
            itemObj.salesOrderBillNo = item.masterOrderSn
          }
          itemObj.retailPrice = Number(item.retailPrice).toFixed(4)+ ''
          if(_this.dataForm.type == 3) {
            itemObj.transferPrice = Number(item.releasePrice).toFixed(4) + ''
          } else {
            itemObj.transferPrice = Number(item.price).toFixed(4) + ''
          }
          itemObj.notOrderQty = item.notOrderQty ? item.notOrderQty + '' : ''
          if(_this.dataForm.type == 3) {
            itemObj.releaseQty = item.releaseQty
            itemObj.releasePrice = item.releasePrice
            itemObj.transferDiscount = (item.releasePrice/item.retailPrice).toFixed(4)
          } else {
            itemObj.releaseQty = item.qty * 1 - item.purchasedQty * 1
            itemObj.releasePrice = item.price + '';
            itemObj.transferDiscount = item.discount + '';
          }
          if(_this.dataForm.type == 3) {
            itemObj.applyQty = item.count - item.orderQty

            itemObj.orderQty = item.orderQty
            itemObj.masterOrderSn = item.masterOrderSn
            itemObj.count = item.count
            itemObj.transferPriceSum = (Number(itemObj.applyQty)*Number(itemObj.transferPrice)).toFixed(4)
          }
          itemObj.skuName = item.skuName ? item.skuName : item.name
          itemObj.deliveryDate = item.deliveryDate ? item.deliveryDate + '天' : '3天'
          itemObj.qty = item.qty + ''
          itemObj.percentage = item.percentage
          itemObj.productionDate = item.productionDate
          itemObj.warranty = item.warranty
          itemObj.categoryName = item.categoryName
          // 闲置库存id
          itemObj.iid = item.iid
          // 闲置库存锁库记录id
          itemObj.idleLockId = item.id
          itemObj.productionDate = _this.$moment(item.productionDate).format('YYYY-MM-DD')
          itemObj.warranty = _this.$moment(item.warranty).format('YYYY-MM-DD')
          // itemObj.note = Number(item.price) * Number(item.applyQty)
          _this.items.push(itemObj)
        }
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        this.dialogSelectorVisible = false
      },
      handleSubmit() {
        if(this.dataForm.type == '1' || this.dataForm.type == '0'){
          if(this.dataForm.warehouseName == undefined) {
            this.vueMessage('warning', '请选择需求仓库!');
            return
          }
        }
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if(this.dataForm.type == '3'){
          this.vueMessage('warning','请选择申请类型!');
          return
        }
        if(this.dataForm.type == '1' || this.dataForm.type == '0'){
          if(this.dataForm.warehouseName == undefined) {
            this.vueMessage('warning', '请选择需求仓库!');
            return
          }

        }
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        if (this.items.length == 0) {
          this.$message.error('请选择关联单据')
          return false
        } else {
          if (this.id) {
            this.dataForm.sourceBillWarehouseName = this.dataForm.warehouseName
          }
        }
        if(this.dataForm.type != 3) {
          if (this.dataForm.sourceBillWarehouseName && this.dataForm.sourceBillWarehouseName != '所有仓库' && this.dataForm.warehouseName != this.dataForm.sourceBillWarehouseName) {
            this.$message.error('需求仓库必须与已选单据的到货仓库[' + this.dataForm.sourceBillWarehouseName + ']保持一致')
            return false
          }
        }

        for (var i in this.items) {
          if (!this.items[i].applyQty || this.items[i].applyQty == '' || this.items[i].applyQty * 1 < 1) {
            this.$message.error('第' + (i * 1 + 1) + '行的申请数量为大于0的数字，请填写了再提交')

            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()

            return
          }

          if (!this.items[i].transferPrice || this.items[i].transferPrice == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的调拨价必填项，请填写了再提交')

            this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus()
            this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select()

            return
          }

          if (!this.items[i].transferDiscount || this.items[i].transferDiscount == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的调拨折扣必填项，请填写了再提交')

            this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus()
            this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select()

            return
          }
          // if (!this.items[i].salesOrderBillNo || this.items[i].salesOrderBillNo == '') {
          if (this.dataForm.type != '0' && !this.items[i].salesOrderBillNo ) {
            this.$message.error('第' + (i * 1 + 1) + '行的客户订货单编号必填项，请填写了再提交')
            return
          }
        }
        return true
      }
    }
  }
</script>

<style lang="scss">
  .purchaseApplyForm {

    .gray {
      .cell {
        background-color: rgba(247,247,247,0.5)!important;
      }
    }
  }
</style>

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
  >>>.center-container .el-form-item--mini .el-form-item__label{
    line-height: 36px;
  }
  >>>.el-input--mini .el-input__inner{
    height: 36px;
    line-height: 36px;
  }
</style>
