<template>
  <div class="manualOrder">
    <div class="center-container">
      <el-button  @click="handleSubmit" :loading="isFormLoading" type="success" plain>提 交</el-button>
      <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 15px"></div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium" label-width="120px" label-position="right">
        <table class="topTable" style="width: 100%" cellspacing="0">
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                <div
                  @click="handleCustomerSelector"
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <span>{{dataForm.customerCode}}</span>
                </div>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" disabled></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker
                  v-model="dataForm.billDate"
                  align="right"
                  type="date"
                  style="width: 200px;"
                  placeholder="请选择日期"
                ></el-date-picker>
              </el-form-item>
            </td>
            <td class="from-item">
              <el-form-item label="业务员:" prop="managerName" class="el-form-flex">
                <el-input v-model="dataForm.managerName" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-bottom">
              <el-form-item label="下单方式:" prop="createType" class="el-form-flex">
                <el-select v-model="dataForm.createType" style="width: 100%;" disabled>
                  <el-option
                    v-for="item in createOption"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td colspan="3" class="from-item no-border-left no-border-top no-border-bottom">
              <el-form-item label="备注:" prop="note">
                <el-input v-model="dataForm.note" placeholder="请输入内容" style="width: 97%"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- items2 -->
    <el-table
    v-if="dataForm.createType == 2"
      :data="items2"
      border
      highlight-current-row
      width="100%"
      :height="clientHeight"
      class="tb-edit"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180">
        <template slot-scope="scope">
          {{scope.row.billNo}}
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="单据时间" width="180">
        <template slot-scope="scope">
          {{scope.row.crtTime}}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="productSkuCode" label="商品编码" width="180"></el-table-column>
      <el-table-column prop="sp1" label="订货号" width="180">
         <template slot-scope="scope">
          {{scope.row.sp1}}
        </template>
      </el-table-column>
      <el-table-column prop="sp2" label="型号" width="180"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="180">
        <template slot-scope="scope">
          {{scope.row.retailPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="productPrice" label="销售价" width="180">
          <template slot-scope="scope">
          {{scope.row.productPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="库存总数量" width="180">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column prop="promptQty" label="现货数量" width="180">
        <template slot-scope="scope">
          {{scope.row.promptQty}}
        </template>
      </el-table-column>
      <el-table-column prop="synergyQty" label="调拨数量" width="180">
        <template slot-scope="scope">
          {{scope.row.synergyQty}}
        </template>
      </el-table-column>
      <el-table-column prop="futuresQty" label="期货数量" width="180">
         <template slot-scope="scope">
          {{scope.row.futuresQty}}
        </template>
      </el-table-column>
    </el-table>
    <!-- items明细 -->
    <el-table
      :data="items"
      border
      highlight-current-row
      width="100%"
      height="520px"
      class="tb-edit"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-minus"
            @click="handleValueDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
       <el-table-column prop="source == '2' ? '调拨' : '现货'" label="渠道类型" align="right" width="100px">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.source == '0'">现货</span>
          <span v-if="scope.row.source == '1'">期货</span>
          <span v-if="scope.row.source == '2'">调拨</span> -->
          <el-select v-model="scope.row.source" style="width: 100%;"
                           @change="handleSourceChange(scope.$index,scope.row.source)">
                  <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow(scope.row)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.productName"
                     ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productBrand" label="品牌">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.productBrand"
            class="readonly-el-input left-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productSeries" label="系列">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.productSeries"
            class="readonly-el-input left-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sp2" label="规格型号">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sp2"
            class="readonly-el-input left-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sp1" label="订货号">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sp1"
            class="readonly-el-input left-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.retailPrice"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sallQty" label="可售数量" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sallQty"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="allocationDiscount" label="调拨折扣" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.allocationDiscount"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="allocationPrice" label="调拨价" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.allocationPrice"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="销售折扣" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.discount"
            class="right-el-input"
            @input="handleInputFun($event, scope.row, 'discount')"
             @change="handleEdit('discount',$event,scope.$index,scope.row)"
             @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
             :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productPrice" label="销售价" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.productPrice"
            class="right-el-input"
            @input="handleInputFun($event, scope.row, 'productPrice')"
             @change="handleEdit('productPrice',$event,scope.$index,scope.row)"
              @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
               :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="productQuantity" label="购买数量" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.productQuantity"
            class="right-el-input"
            @input="handleInputFun($event, scope.row, 'productQuantity')"
            @change="handleEdit('productQuantity',$event,scope.$index,scope.row)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
             :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"
          ></el-input>
        </template>
      </el-table-column>
       <el-table-column prop="subtotal" label="价税合计" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.subtotal"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
       <el-table-column prop="referencePrice" label="参考价" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.referencePrice"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
       <el-table-column prop="deliveryWarehouse" label="仓库" align="right" width="120">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.deliveryWarehouse"
            class="readonly-el-input right-el-input"
            readonly
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="dataForm" :rules="rules" ref="dataForm2" size="medium" label-width="120px" label-position="right" :inline-message="true">
      <table class="topTable" style="width: 100%" cellspacing="0">
        <tr>
          <td class="from-item no-border-right no-border-bottom no-border-top">
            <el-form-item label="省份/直辖市:" prop="receiverProvince" class="el-form-flex">
              <div @click="handleCustomerAddressSelector">
                <el-input type="input" v-model="dataForm.receiverProvince" placeholder="请输入省份/直辖市"></el-input>
              </div>
            </el-form-item>
          </td>
          <td class="from-item no-border-right no-border-bottom no-border-top">
            <el-form-item label="城市:" prop="receiverCity" class="el-form-flex">
              <el-input type="input" v-model="dataForm.receiverCity" placeholder="请输入城市" readonly></el-input>
            </el-form-item>
          </td>
          <td class="from-item no-border-right no-border-bottom no-border-top">
            <el-form-item label="区:" prop="receiverRegion" class="el-form-flex">
              <el-input type="input" v-model="dataForm.receiverRegion" placeholder="请输入区" readonly></el-input>
            </el-form-item>
          </td>
          <td class="from-item no-border-bottom no-border-top">
            <el-form-item label="收货地址:" prop="deliverDetailAddress" class="el-form-flex">
              <el-input type="input" v-model="dataForm.deliverDetailAddress" placeholder="请输入收货地址" readonly></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="from-item no-border-right">
             <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
              <el-input v-model="dataForm.receiverName" placeholder="请输入收货人"></el-input>
            </el-form-item>
          </td>
          <td class="from-item no-border-right  ">
            <el-form-item label="联系电话:" prop="receiverPhone" class="el-form-flex">
              <el-input v-model="dataForm.receiverPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </td>
          <td class="from-item no-border-right  ">
            <el-form-item label="寄件方式:" prop="distributionMode" class="el-form-flex">
              <el-select v-model="dataForm.distributionMode" style="width: 100%;">
                <el-option
                  v-for="item in distributionOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td class="from-item">
            <el-form-item label="是否代发:" prop="isReplaceDelivery" class="el-form-flex">
              <el-switch
                style="padding-top:20px;float:left"
                v-model="dataForm.isReplaceDelivery"
                active-text="是" inactive-text="否"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </td>
        </tr>
        <tr v-if="dataForm.isReplaceDelivery===1">
          <td class="from-item no-border-right no-border-top">
             <el-form-item label="代发公司:" prop="replaceDeliveryCompany" class="el-form-flex">
              <el-input v-model="dataForm.replaceDeliveryCompany" @change="$refs.dataForm2.validateField('replaceDeliveryCompany')" placeholder="请输入代发公司"></el-input>
            </el-form-item>
          </td>
          <td class="from-item no-border-right no-border-top ">
              <el-form-item label="代发联系人:" prop="replaceLinkMan" class="el-form-flex">
                <el-input v-model="dataForm.replaceLinkMan" @change="$refs.dataForm2.validateField('replaceLinkMan')" :rows="2" placeholder="请输入代发联系人"></el-input>
              </el-form-item>
          </td>
          <td class="from-item no-border-right no-border-top">
              <el-form-item label="代发联系电话:" prop="replaceLinkPhone" class="el-form-flex">
                <el-input v-model="dataForm.replaceLinkPhone" @change="$refs.dataForm2.validateField('replaceLinkPhone')" :rows="2" placeholder="请输入联系电话"></el-input>
              </el-form-item>
          </td>
          <td class="from-item no-border-top">

          </td>
        </tr>

      </table>
    </el-form>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <div style="height: 30px"></div>
    <!-- 申请人列表弹窗-->
    <el-dialog title="请选择申请人" :visible.sync="applicantUserVisible" append-to-body>
      <purchase-user-selector
        @closeUserDialog="closeUserDialog"
        :isSingle="true"
        ref="applicantUser"
      ></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelApplicantUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitApplicantUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 所有商品弹窗 渠道类型不为期货时-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" v-if="productVisible" append-to-body class="goodsDialog">
      <goods-detail-selector ref="goodsSelector" :isSingle="false" :source="source" @closeGoodsDialog="closeGoodsDialog" key="goodsSelector"></goods-detail-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 渠道类型为期货时关联单据 -->
    <el-dialog title="所有商品" width="60%" :visible.sync="dialogSelectorVisible" v-if="dialogSelectorVisible" append-to-body class="goodsDialog">
      <purchase-contract-selector  ref="futureGoodsSelector" :isSingle="false" @closeGoodsDialog="closeFutureDialog"
                                @handleSelectorClose="handleSelectorClose">
      </purchase-contract-selector >
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 收货地址列表弹窗-->
    <el-dialog title="请选择收货地址" :visible.sync="customerAddressVisible" append-to-body v-if="customerAddressVisible">
      <customer-address-selector @closeCustomerAddressDialog="closeCustomerAddressDialog" :isSingle="true"
                                 ref="customerAddress"
                                 :customerCode="dataForm.customerCode"></customer-address-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomerAddress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomerAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector
        @closeCustomerDialog="closeCustomerDialog"
        :isSingle="true"
        ref="customer"
      ></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFloat } from "@/utils/util";
import {
  addBill,
  getBill,
  tempAddBill,
  auditBill
} from "@/api/erp/mall/oms/order/manualOrder";
  // import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/mall/oms/order/manualOrder';
import { getObj } from "@/api/admin/user/index";
import { getQtyAndPriceType } from "@/api/erp/sales/price/pricePlan";
import {getProcessId} from '@/api/erp/oa/task/taskBill';

export default {
  name: "manualOrderFormCopy",
  components: {
    "purchase-user-selector": () => import("@/components/ERP/User/user"),
    'goods-detail-selector': () => import('@/components/ERP/Goods/GoodsDetailSelector'),
    'customer-address-selector': () => import('../../../wms/bill/stock_out/components/customerAddressSelector'),
    'purchase-contract-selector': () => import('./components/purchaseContractSelector'),
    'taskHistory': () => import('@/components/ERP/Task/taskHistory'),
    "supplier-selector": () =>
      import("@/components/ERP/Supplier/supplierSelector"),
    "customer-selector": () =>
      import("@/components/ERP/Customer/customerSelector")
  },
  props: ["id", "dialogFormVisible", "paymentsMeansOptions", 'taskType', 'step'],
  data() {
    return {
      clientHeight: 300,
      isFormLoading: false,
      isTemporaryLoading: false,
      customerVisible: false,
      tableElInputNum: 1,
      isRejectLoading: false,
      customerAddressVisible: false,
      comment:undefined,
      isAgreeLoading:false,
      sourceOptions: [{
        value: '0',
        label: '现货'
      }, {
        value: '1',
        label: '期货'
      }, {
        value: '2',
        label: '调拨'
      }],
      source:"",
      dataForm: {
        id: undefined,
        billNo: undefined,
        billDate: undefined,
        supplierId: undefined,
        supplierName: undefined,
        supplierCode: undefined,
        departId: undefined,
        departName: undefined,
        applicantId: undefined,
        applicantName: undefined,
        paymentForm: "0",
        paymentsMeans: undefined,
        applyAmount: undefined,
        currencyId: "1",
        bankName: undefined,
        bankAccount: undefined,
        note: undefined,
        billStatus: undefined,
        sourceBillNo: undefined,
        sourceObjectKey: undefined,
        items: [],
        createType:1,
        distributionMode:0,
        isReplaceDelivery:0,
        memberUsername:this.$store.state.user.name
      },
      processId:'',
      fileList:[],
      customerManagerArr:[{}],
      items: [],
      chanedIndex:[],
      createOption:[
          {
            value: 0,
            label: "商城订单"
          },
          {
            value: 1,
            label: "手工订单"
          },
          {
            value: 2,
            label: "企业购订单"
          },
        ],
      distributionOptions: [
        {
          value: 0,
          label: "快递运输"
        },
        {
          value: 1,
          label: "运费到付"
        },
        {
          value: 2,
          label: "货物自提"
        },
        {
          value: 3,
          label: "货运物流"
        }
      ],
      customerArr:[],
      applicantUserArr: [],
      supplierArr: [],
      sourceBillNoArr: [],

      applicantUserVisible: false,
      supplierVisible: false,
      items2:[],
      rules: {
        billDate: [
          {
            required: true,
            message: "请选择单据日期",
            trigger: "blur"
          }
        ],
        receiverProvince: [
          {
            required: true,
            message: "请选择省份/直辖市",
            trigger: "blur"
          }
        ],
        receiverPhone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          }
        ],
        replaceDeliveryCompany: [
          {
            required: true,
            message: "请输入代发公司",
            trigger: "blur"
          }
        ],
        replaceLinkMan: [
          {
            required: true,
            message: "请输入代发联系人",
            trigger: "blur"
          }
        ],
        replaceLinkPhone: [
          {
            required: true,
            message: "请输入代发联系电话",
            trigger: "blur"
          }
        ],
      },
      // rules1:{
      //    billDate: [
      //     {
      //       required: true,
      //       message: "请选择单据日期",
      //       trigger: "blur"
      //     }
      //   ],
      //   receiverProvince: [
      //     {
      //       required: true,
      //       message: "请选择省份/直辖市",
      //       trigger: "blur"
      //     }
      //   ],
      //   receiverPhone: [
      //     {
      //       required: true,
      //       message: "请输入联系电话",
      //       trigger: "blur"
      //     }
      //   ],
      // },
      productVisible: false,
      dialogSelectorVisible: false
    };
  },
  created() {
    this.init();
    this.changeDivHeight();
    const _this = this;
    window.onresize = function() {
      _this.changeDivHeight();
    };
  },
  updated() {
    this.changeDivHeight();
  },
  watch:{
    id(old,fresh){
      this.init()
    }
  },
  methods: {
    handleAuditBill(val) {
      if(this.dataForm.createType == 2) {
        if (!this.checkSkuAndNumber()) {
          return;
        }
      }
      this.dataForm.taskMap = {
        step: this.step,
        opinion: val,
        comment: this.comment
      };
      this.dataForm.items2 = this.items2
      this.dataForm.items = this.items
      if(val != '驳回' && !this.dataForm.fileUrl) {
        this.$message.warning('请先上传合同')
      } else {
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
      }
    },
    checkSkuAndNumber() {
      let itemsSp1 = [];
      let itemsSp2 = [];
      this.items.forEach(item => {
        itemsSp1.push(item.sp1)
      })

      this.items2.forEach(item => {
        itemsSp2.push(item.sp1)
      })
      itemsSp1 = [...new Set(itemsSp1)]
      itemsSp2 = [...new Set(itemsSp2)]
      if(itemsSp1.sort().toString() != itemsSp2.sort().toString()) {
        this.$message.warning('请保证选择的订货号和企业采购订单的订货号相同!')
        return
      }
      // 计算出items里所有订货号的数量,与items2进行比价
      let num1 = [];
      this.items.forEach(item => {
        // 如果数组没有改订货号,则push进去,如果已经存在改订货号,则将productQuantity加进去
        let sp1Index = num1.findIndex(i => {
          return i.sp1 == item.sp1
        })
        if(sp1Index > -1) {
          switch(item.source) {
            case '0':
               num1[sp1Index].promptQty += item.productQuantity
            case '1':
               num1[sp1Index].futureQty += item.productQuantity
            case '2':
               num1[sp1Index].synergyQty += item.productQuantity
          }
          // 计算平均价
          num1[sp1Index].productPrice = (Number(num1[sp1Index].productPrice)*Number(num1[sp1Index].productQuantity) + Number(item.productPrice)*Number(item.productQuantity))/(Number(num1[sp1Index].productQuantity) + Number(item.productQuantity))
          num1[sp1Index].productQuantity += Number(item.productQuantity)
        } else {
          switch(item.source) {
            case '0':
              num1.push({
                sp1:item.sp1,
                productQuantity:Number(item.productQuantity),
                productPrice:item.productPrice,
                promptQty:Number(item.productQuantity)
              })
              break;
            case '1':
              num1.push({
                sp1:item.sp1,
                productQuantity:Number(item.productQuantity),
                productPrice:item.productPrice,
                futureQty:Number(item.productQuantity)
              })
              break;
            case '2':
              num1.push({
                sp1:item.sp1,
                productQuantity:Number(item.productQuantity),
                productPrice:item.productPrice,
                synergyQty:Number(item.productQuantity)
              })
              break;
          }
        }
      })
      let num2 = [];
      this.items2.forEach(item => {
        num2.push({
          sp1:item.sp1,
          productQuantity:item.quantity
        })
      })
      // 对比num1和bum2,如果只要有某一项的价格不一样,则提示
      for(let i = 0;i < num1.length;i++) {
        let tempIndex = num2.findIndex(j => {
          return j.sp1 == num1[i].sp1
        })
        if(num1[tempIndex].productQuantity === num2[tempIndex].productQuantity) {
          console.log('数量一样');
        } else {
          this.$message.warning('请保证选择的数量和企业采购订单的订货号相同!')
          return
        }
      }
      // 将平均价赋值给items2
      for(let j = 0;j<this.items2.length;j++) {
          let num1Index = num1.findIndex(i => {
          return i.sp1 == this.items2[j].sp1
        })
        this.items2[j].productPrice = num1[num1Index].productPrice
      }
      return true
    },
    uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          this.dataForm.fileName = response.data.name;
          this.dataForm.fileUrl = response.data.url;
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    // 渠道类型选择
    handleSourceChange(index,source) {
      this.items[index] = []
      this.source = source
      this.items[index].source = source
        // this.$refs.goodsSelector.handleSource()
    },
     // 收货地址选择
    handleCustomerAddressSelector() {
      if(!this.dataForm.customerCode) {
        this.$message.warning('请先选择客户!')
      } else {
        this.customerAddressVisible = true
      }
    },
    handleCancelCustomerAddress() {
        this.$refs.customerAddress.reset()
        this.customerAddressVisible = false
      },
      handleSubmitCustomerAddress() {
        this.$refs.customerAddress.onSubmit()
      },
      closeCustomerAddressDialog(list) {
        if (list.length > 0) {
          this.dataForm.linkPhone = list[0].phoneNumber
          this.dataForm.deliverDetailAddress = list[0].province + '' + list[0].city + '' + list[0].region + '' + list[0].detailAddress
          this.dataForm.linkPerson = list[0].name
          this.dataForm.addressId = list[0].id
          // this.dataForm.receiverProvince = list[0].province
          this.$set(this.dataForm,'receiverProvince',list[0].province)
          this.dataForm.receiverName = list[0].name
          //this.dataForm.receiverPhone = list[0].phoneNumber
          this.$set(this.dataForm,'receiverPhone',list[0].phoneNumber)

          this.dataForm.receiverCity = list[0].city
          this.dataForm.receiverRegion = list[0].region
          this.$refs.dataForm2.validateField('receiverProvince')
          this.$refs.dataForm2.validateField('receiverPhone')
          // this.$refs.dataForm.validateField('linkAddress')
        }
        // this.$refs.customerAddress.reset()
        this.customerAddressVisible = false
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
    //商品选择
      handleProductShow(row) {
        if(!this.dataForm.customerCode) {
          this.$message.warning('请先选择客户')
        } else if(!row.source) {
          this.$message.warning('请先选择渠道来源')
        } else if(row.source == 1) {
          // dialogSelectorVisible
          this.dialogSelectorVisible = true
        } else {
          this.productVisible = true
        }
      },
      handleCloseProduct() {
        this.productVisible = false
        this.dialogSelectorVisible = false
        this.selectedProducts = []
         if(this.$refs.goodsSelector) {
          this.$refs.goodsSelector.reset()
        } else {
          this.$refs.futureGoodsSelector.reset()
        }
      },
      handleSubmitProduct() {
        if(this.$refs.goodsSelector) {
          this.$refs.goodsSelector.OnSubmit()
        } else {
          this.$refs.futureGoodsSelector.OnSubmit()
        }
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      // 不为期货
      closeGoodsDialog(list) {
        this.selectedProducts = list

        const _this = this
        const dataMap = _this.data2Map(_this.items)

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)

        // 遍历当前选中项
        for (let index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // // 判断data数据中是否有和item.sckName
          // // 包含相同数据 根据对象中包含的index值删除指定位置商品
          // if (filter) {
          //   continue
          // }
          var itemObj = {}
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          itemObj.skuNo = item.skuNo
          itemObj.billNo = item.batchNumber
          // 发货仓库
          itemObj.deliveryWarehouse = item.warehouseName
          // 库存id
          itemObj.iid = item.id
          // 系列
          itemObj.productSeries = item.seriesName
          // 商品sku条码
          itemObj.productSkuCode = item.skuNo
          // 商品sku编号
          // itemObj.productSkuId = item.skuNo


          itemObj.brandId = item.brandId
          itemObj.productBrand = item.brandName
          itemObj.productSeries = item.seriesName
          // 面价
          itemObj.retailPrice = item.retailPrice
          if(_this.source == 1) {
            itemObj.sallQty = item.qty - item.purchasedQty
          } else {
            itemObj.sallQty = item.qty - item.lockedQty
          }
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.productSkuCode = item.skuNo
          itemObj.sp1 = item.itemNo
          itemObj.productName = item.skuName
          itemObj.sp2 = item.specifications
          itemObj.sp3 = _this.source
          if(_this.source == 1) {
            itemObj.allocationPrice = ""
            itemObj.allocationDiscount = ""
          } else {
            // 调拨价
            itemObj.allocationPrice = item.allocationPrice
            // 调拨折扣
            itemObj.allocationDiscount = (item.allocationPrice/item.retailPrice).toFixed(4)
          }
          if(_this.source != 1) {
            itemObj.iid = item.id
          }
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.source = _this.source
          // if(_this.source == 1) {
          //   itemObj.source = _this.source
          // } else {
          //   itemObj.source = item.source
          // }
          itemObj.deliveryWarehouse = item.warehouseName
          itemObj.amount = item.price + ''
          itemObj.taxRate = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1
          itemObj.tax = (item.price * taxRate).toFixed(4)
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(4)
          itemObj.taxAmount = itemObj.taxPrice
          _this.items.push(itemObj)
          _this.items.forEach((item,index) => {
            // chanedIndex
            if(_this.chanedIndex.indexOf(index) < 0) {
              // 根据customerCode和skuNo请求销售价
              getQtyAndPriceType(this.dataForm.customerCode,item.skuNo).then(res => {
                if(res[item.skuNo]) {
                    item.referencePrice = res[item.skuNo].customerPrice
                    item.productPrice = res[item.skuNo].customerPrice
                    this.$set(item,'productPrice', res[item.skuNo].customerPrice)
                    // fuck the shit
                    // this.$set(itemObj,'productPrice', res[item.skuNo].customerPrice)
                }
                 // 销售折扣
                this.$set(item,'discount',(Number(item.productPrice)/Number(item.retailPrice)).toFixed(4))
              })
            }
          })
        }
        // 添加一个空行
        // _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.productVisible = false
        this.dialogSelectorVisible = false
        this.selectedProducts = []

        if(this.$refs.goodsSelector) {
          this.$refs.goodsSelector.reset()
        } else {
          this.$refs.futureGoodsSelector.reset()
        }
      },
      // 期货
      closeFutureDialog(list) {
        this.selectedProducts = list

        const _this = this
        const dataMap = _this.data2Map(_this.items)

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)

        // 遍历当前选中项
        for (let index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // // 判断data数据中是否有和item.sckName
          // // 包含相同数据 根据对象中包含的index值删除指定位置商品
          // if (filter) {
          //   continue
          // }
          var itemObj = {}
          itemObj.deliverDate = item.deliverDate ? item.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          itemObj.skuNo = this.selectedProducts[index].skuNo
          itemObj.brandId = item.brandId
          itemObj.productBrand = item.brandName
          itemObj.productSeries = item.seriesName
          // 面价
          itemObj.retailPrice = item.retailPrice
          // 商品sku条码
          itemObj.productSkuCode = this.selectedProducts[index].skuNo




          itemObj.goodsId = item.goodsId
          itemObj.productCategoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.sp1 = item.itemNo
          itemObj.productName = item.goodsName
          itemObj.sp2 = item.specifications
          itemObj.sp3 = _this.source
          // if(_this.source == 1) {
          //   itemObj.allocationPrice = ""
          //   itemObj.allocationDiscount = ""
          // } else {
          //   // 调拨价
          //   itemObj.allocationPrice = item.allocationPrice
          //   // 调拨折扣
          //   itemObj.allocationDiscount = (item.allocationPrice/item.retailPrice).toFixed(4)
          // }
          if(_this.source != 1) {
            itemObj.iid = item.id
          }
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.source = _this.source
          // if(_this.source == 1) {
          //   itemObj.source = _this.source
          // } else {
          //   itemObj.source = item.source
          // }
          itemObj.deliveryWarehouse = item.warehouseName
          itemObj.amount = item.price + ''
          itemObj.taxRate = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1
          itemObj.tax = (item.price * taxRate).toFixed(4)
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(4)
          itemObj.taxAmount = itemObj.taxPrice
          _this.items.push(itemObj)
          _this.items.forEach((item,index) => {
            // chanedIndex
            if(_this.chanedIndex.indexOf(index) < 0) {
              // 根据customerCode和skuNo请求销售价
              getQtyAndPriceType(this.dataForm.customerCode,item.skuNo).then(res => {
                if(res[item.skuNo]) {
                    item.referencePrice = res[item.skuNo].customerPrice
                    this.$set(item,'productPrice', res[item.skuNo].customerPrice)
                    // fuck the shit
                    // this.$set(itemObj,'productPrice', res[item.skuNo].customerPrice)
                }
                 // 销售折扣
                this.$set(item,'discount',(Number(item.productPrice)/Number(item.retailPrice)).toFixed(4))
              })
            }
          })
        }
        // 添加一个空行
        // _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.productVisible = false
        this.dialogSelectorVisible = false
        this.selectedProducts = []

        if(this.$refs.goodsSelector) {
          this.$refs.goodsSelector.reset()
        } else {
          this.$refs.futureGoodsSelector.reset()
        }
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
    handleCustomerDel(index) {
      this.customerArr.splice(index, 1);
      this.dataForm.customer = undefined;
      // this.dataForm.customerName = undefined;
      this.$refs.customer.reset();
    },
    // 客户选择
    handleCustomerSelector() {
      this.customerVisible = true;
    },
    closeCustomerDialog(list) {
      // 单选
      let tempList = [];
      tempList.push(list[list.length - 1]);
      this.customerArr = tempList;
      this.customerVisible = false;
      if (list.length > 0) {
        this.dataForm.customer = list[0].customerCode;
        this.dataForm.customerCode = list[0].customerCode;
        this.dataForm.customerName = list[0].customerName;
        this.dataForm.managerId = list[0].managerId;
        this.dataForm.managerName = list[0].managerName;
        // this.dataForm.receiverName = list[0].managerName;
        if(list[0].linkPhone) {
          this.dataForm.deliverDetailAddress = list[0].linkAddress;
          this.dataForm.receiverPhone = list[0].linkPhone;
          this.dataForm.receiverName = list[0].linkMan;
        }
        this.dataForm.salesmanId = list[0].managerId;
        this.dataForm.salesmanName = list[0].managerName;
      }
    },
    handleCancelCustomer() {
      this.$refs.customer.reset();
      this.customerVisible = false;
    },
    handleSubmitCustomer() {
      this.$refs.customer.onSubmit();
    },
    handleValueDelete(index, r) {
      let ValueIndex = this.items.length;
      if (ValueIndex === 1) {
        return;
      }
      this.items.splice(index, 1);
      var count = 0;
      for (var i in this.items) {
        if (this.items[i].sourceBillId) {
          count++;
        }
      }
      if (count == 0) {
        this.dataForm.sourceBillNo = undefined;
        this.sourceBillNoArr = [];
      }
    },
    changeDivHeight() {
      if (document.getElementsByClassName("center-container")[0]) {
        var height = document.getElementsByClassName("center-container")[0]
          .clientHeight;
      } else {
        var height = 334;
      }
      if (this.id && this.id != "") {
        height = height + 20;
      }
      this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
    },
    init() {
      if (this.id != "") {
        getBill(this.id).then(response => {
          this.dataForm = response.data;
          this.dataForm.customerName = response.data.memberUsername
          this.dataForm.customerCode = response.data.customer
          this.applicantUserArr = response.data.applicantUserArr;
          this.supplierArr = response.data.supplierArr;
          this.items2 = response.data.items2
          if (response.data.sourceBillNo && response.data.sourceBillNo != "") {
            this.sourceBillNoArr = response.data.sourceBillNo.split(",");
          }
          var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
          this.getProcessId(billPrefix);
          if (response.data.items == undefined) {
            this.handleValueAdd();
          } else {
            this.items = response.data.items;
          }
          console.log('this.items2');
          console.log(this.items2);
        });
      } else {
        let date = new Date().toLocaleDateString().replace(/\//g, "-");
        this.dataForm.billDate = date;
        this.dataForm.applicantId = this.$store.state.user.id;
        this.dataForm.applicantName = this.$store.state.user.name;
        getObj(this.$store.state.user.id).then(response => {
          if (response.data.departId.indexOf("{") != -1) {
            this.dataForm.departId = JSON.parse(response.data.departId).id;
            this.dataForm.departName = JSON.parse(response.data.departId).name;
            this.applicantUserArr.push({
              id: this.$store.state.user.id,
              name: this.$store.state.user.name,
              departId: JSON.parse(response.data.departId).id,
              departName: JSON.parse(response.data.departId).name
            });
          }
        });
        this.handleValueAdd();
      }
    },
    getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
    handleClose() {
      this.$emit("handleClose", false);
    },
    handleValueAdd() {
      let tempLength = 0
      this.items.forEach(item => {
        if(JSON.stringify(item) == "{}") {
          tempLength ++
        }
      })
      if(tempLength <= 0) {
        this.items.push({});
      }
      // const d = {
      //   sourceBillDate: undefined,
      //   sourceBillNo: undefined
      // };
    },
    handleEdit(type, val, index, row) {
      // 购买数量更改
     if(type == 'productQuantity') {
       if(val > row.sallQty) {
         this.$message.warning('购买数量不能大于可售数量')
         row.productQuantity = row.sallQty;
         row.subtotal = Number(row.productQuantity*row.productPrice).toFixed(2)
       } else {
         row.subtotal = Number(row.productQuantity*row.productPrice).toFixed(2)
       }
     }
    //  销售折扣更改
     if(type == 'discount') {
         //  计算销售价
         //  this.vueSet(this.items[index], 'productPrice', row.retailPrice*row.discount);
          row.productPrice = row.retailPrice*row.discount
         //  计算价税合计
       if(row.productQuantity) {
         row.subtotal = Number(row.productQuantity * row.productPrice).toFixed(2)
       }
     }
    //  销售价更改
       if(type == 'productPrice') {
         row.productPrice = val
         console.log(row);
        if(row.productQuantity != '' && row.productQuantity != undefined) {
          //  计算销售折扣
          row.discount = (Number(row.productPrice)/Number(row.retailPrice)).toFixed(4)
          //  计算价税合计
          row.subtotal = Number(row.productQuantity*row.productPrice).toFixed(2)
        }
        // 如果销售价更改了,则下次导入产品时不用重新计算这个商品的销售价
        this.chanedIndex.push(index)
       }

      this.vueSet(this.items, index, this.items[index]);
    },

    // 申请人选择
    handleApplicantUserSelector() {
      this.applicantUserVisible = true;
    },
    handleCancelApplicantUser() {
      this.$refs.applicantUser.reset();
      this.applicantUserVisible = false;
    },
    handleApplicantUserDel(index) {
      this.applicantUserArr.splice(index, 1);
      this.dataForm.applicantId = undefined;
      this.dataForm.applicantName = undefined;
      this.dataForm.departId = undefined;
      this.dataForm.departName = undefined;
      this.$refs.applicantUser.reset();
    },
    handleSubmitApplicantUser() {
      this.$refs.applicantUser.onSubmit();
    },
    closeUserDialog(list) {
      this.applicantUserArr = list;
      this.dataForm.departId = JSON.parse(list[0].departId).id;
      this.dataForm.departName = JSON.parse(list[0].departId).name;
      this.applicantUserVisible = false;
      if (list.length > 0) {
        this.dataForm.applicantName = list[0].name;
        this.dataForm.applicantId = list[0].id;
        this.dataForm.departId = JSON.parse(list[0].departId).id;
        this.dataForm.departName = JSON.parse(list[0].departId).name;
      }
    },

    // 供应商选择
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
      this.dataForm.bankName = undefined;
      this.dataForm.bankAccount = undefined;
      this.dataForm.paymentsMeans = undefined;
      this.dataForm.applyAmount = undefined;
      this.items = [];
      this.handleSourceBillNoDel().close();
      this.$refs.supplier.reset();
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
        this.dataForm.bankName = list[0].bankName;
        this.dataForm.bankAccount = list[0].bankAccount;
        this.dataForm.paymentsMeans = list[0].paymentsMeans;
      }
    },

    data2Map(data) {
      let map = {};
      data.forEach(function(item, index) {
        item.index = index;
        map[item.skuNo] = item;
      });
      return map;
    },
    data3Map(data) {
      let map = {};
      data.forEach(function(item, index) {
        item.index = index;
        map[item.sourceBillId] = item;
      });
      return map;
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property === "productQuantity") {
          values = data.map(item => Number(item.productQuantity));
        } else if (column.property === "subtotal") {
          values = data.map(item => Number(item.subtotal));
        }

        if (
          column.property === "productQuantity" ||
          column.property === "subtotal"
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return prev;
              }
            }, 0)
            .toFixed(4);

          sums[index] += " ";
        } else {
          sums[index] = " ";
        }
      });

      return sums;
    },
    handleCancel() {
      this.$emit("handleCancelForm");
    },
    handleSourceBillNoDel(index) {
      this.sourceBillNoArr.splice(index, 1);
      this.dataForm.sourceBillNo = this.sourceBillNoArr.join(",");
    },
    dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
      _this.$refs['dataForm'].validate('receiverPhone')
      _this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (subFunName == "tempAddBill") {
            _this.isTemporaryLoading = true;
          } else {
            _this.isFormLoading = true;
          }

          var list = [];
          for (var i in _this.items) {
            // if (
            //   _this.items[i].sourceBillId &&
            //   _this.items[i].sourceBillId != ""
            // ) {
            //   }
              list.push(_this.items[i]);
          }
          _this.dataForm.items = list;

          subFun(_this.dataForm)
            .then(response => {
              if (subFunName == "tempAddBill") {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }

              if (response.code == "2000") {
                _this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                  duration: 2000
                });
                _this.$emit(subFunSuccessName);
              } else {
                _this.$notify({
                  title: "失败",
                  message: response.msg,
                  type: "warning",
                  duration: 2000
                });
              }
            })
            .catch(res => {
              if (subFunName == "tempAddBill") {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }
            });
        } else {
          return false;
        }
      });
    },
    handleSubmit() {
      if(this.items.length < 1) {
        this.$message.warning('明细不能为空！')
        return;
      }
      if (!this.checkItemFuc()) {
        return;
      }
      this.$refs['dataForm2'].validate((valid) => {
        if(valid){
          this.dataFormSubmit(this, addBill, "submitSuccess");
        }else{
          this.$message.warning('请正确填写单据!')
        }
      })

    },
    handleTempAddBill() {
      if (!this.checkItemFuc()) {
        return;
      }
      this.$refs['dataForm2'].validate((valid) => {
        if(valid){
          this.dataFormSubmit(this, tempAddBill, "submitSuccess", "tempAddBill");
        }else{
          this.$message.warning('请正确填写单据!')
        }
      })

    },
    checkItemFuc() {
      for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].productQuantity || this.items[i].productQuantity == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的购买数量为必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

          }
        }
      return true;
    },
  },

};
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
  >>>.center-container .el-input__inner,>>> .tb-edit .el-input__inner,>>>.from-item .el-input__inner{
    border: 0!important;
  }
</style>
