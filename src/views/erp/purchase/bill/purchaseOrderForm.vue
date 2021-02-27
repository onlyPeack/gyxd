<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增采购订单</span>
        <span v-if="dataForm.id">编辑采购订单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td colspan="2">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" @change="handleBillDateChange" align="right" type="datetime"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="采购类型:" prop="type" class="el-form-flex">
                <el-select v-model="dataForm.type" style="width: 100%;" @change="handleChangeType">
                  <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="订单类型:" prop="orderType" class="el-form-flex">
                <el-select v-model="dataForm.orderType" style="width: 100%;">
                  <el-option label="普通订单" :value="0"></el-option>
                  <el-option label="EDI订单" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联单据:" prop="sourceObjectKey" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNo" :key="tag" closable
                          @close="handleourceDel">
                    {{tag}}
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
                          @close="handleSupplierDel" v-model="dataForm.supplierCode">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="联系人:" prop="linkPerson" class="el-form-flex">
                <el-input v-model="dataForm.linkPerson" readonly="readonly" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="联系电话:" prop="linkPhone" class="el-form-flex">
                <el-input v-model="dataForm.linkPhone" readonly="readonly" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="交货日期:" prop="deliverDate" class="el-form-flex" width="180px">
                <el-date-picker v-model="dataForm.deliverDate" align="right" type="datetime"
                                style="width: 180px" placeholder="请选择日期" @change="handleDeliverDateChange">
                </el-date-picker>
              </el-form-item>
            </td>
            <!-- <td>
              <el-form-item label="币别:" prop="currencyName" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;">
                  <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td> -->
          </tr>
          <tr>
            <td>
              <el-form-item label="仓库:" prop="warehouseName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-if="dataForm.warehouseName">
                    {{dataForm.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="仓库地址:" prop="warehouseAdress" class="el-form-flex">
                <el-input v-model="dataForm.warehouseAdress" readonly="readonly" placeholder="请输入仓库地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发货方式:" prop="deliveryType" class="el-form-flex">
                <el-select v-model="dataForm.deliveryType" style="width: 100%;" @change="handleDeliveryChange">
                  <el-option v-for="item in deliveryOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收货人地址:" prop="factoryAdress" class="el-form-flex">
                <el-input v-model="dataForm.factoryAdress" placeholder="请输入收货人地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收货人:" prop="factoryName" class="el-form-flex">
                <el-input v-model="dataForm.factoryName" placeholder="请输入收货人"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收货人电话:" prop="factoryPhone" class="el-form-flex">
                <el-input v-model="dataForm.factoryPhone" placeholder="请输入收货人电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <!-- <td>
              <el-form-item label="支付方式:" prop="payment" class="el-form-flex">
                <div @click="handlePaymentSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in paymentList" :key="tag" closable
                          @close="handleourceDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td> -->
            <td colspan="2">
              <el-form-item label="是否批量设置:" class="el-form-flex">
                <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-upload class="upload" action="/api/goods/storage/create"
                   :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList" :multiple="true"
                   style="display:inline;" :on-success="uploadCompleted">
                <el-button type="text" icon="el-icon-download">
                  导入合同
                </el-button>
            </el-upload>
            </td>
            <td>
              <el-form-item label="合同:" prop="fileName" class="el-form-flex" >
                <div style="margin-top:5px">
                  <div v-for="(item,index) in dataForm.attachments" :key="item.fileUrl">
                    <span style="display:inline-block;position:relative;top:5px;width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{item.fileName}}
                    </span>
                    <a :href="item.fileUrl" target="_blank" style="color:#1890ff">下载合同</a>
                    <a style="color:#1890ff" @click="handleDeleteContract(index)">删除合同</a>
                  </div>
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
      <el-table-column prop="channelTypeCode" label="渠道类型编号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.channelTypeCode" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.channelTypeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelTypeName" label="渠道类型名称" width="180">
        <template slot-scope="scope">
             <el-select v-model="scope.row.channelTypeName" style="width: 100%;"
                          @change="handleEdit(scope.$index, scope.row , 'channelTypeName', $event)">
                 <el-option v-for="item in channelTypeOptions" :key="item.value" :label="item.label"
                            :value="item.label">
                 </el-option>
               </el-select>
          <span>{{scope.row.channelTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyQty" label="未处理数量" width="180" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.applyQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.applyQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="处理数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column prop="qty" label="实际剩余可采购" width="120" align="right" v-show="dataForm.type == 3">
      </el-table-column> -->
       <el-table-column prop="categoryName" label="商品类别" width="100" align="right" v-show="dataForm.type == 3">
      </el-table-column>
       <el-table-column prop="percentage" label="成色" width="100" align="right" v-show="dataForm.type == 3">
      </el-table-column>
       <el-table-column prop="productionDate" label="生产日期" width="100" align="right" v-show="dataForm.type == 3">
      </el-table-column>
       <el-table-column prop="warranty" label="厂家质保期" width="100" align="right" v-show="dataForm.type == 3">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="发布单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.releasePrice" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.releasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplyPrice" label="供应商发布单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.supplyPrice" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.supplyPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="处理折扣(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.discount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'discount', $event)"
                    @input="handleInputFun($event, scope.row, 'discount')"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="付款单价(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
                    @input="handleInputFun($event, scope.row, 'taxPrice')"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="profit" label="采购利润" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.profit" readonly class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.profit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" readonly class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率(%)" width="80" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.taxRate" size="small" placeholder=" "
                     @change="handleEdit(scope.$index, scope.row , 'taxRate', $event)"
                     @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
                     :ref="'tableElInput'+(scope.$index*tableElInputNum+4)">
            <el-option
              v-for="item in taxRateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.taxRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="不含税单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmount" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliverDate" label="交货日期" width="180">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.deliverDate" type="datetime" value-format="yyyy-MM-dd"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.deliverDate}}</span>
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

    <!-- 新增采购订单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

    <!-- 关联单据 -->
    <purchase-contract-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                                @submitSelectorSuccess="submitSelectorSuccess"
                                @handleSelectorClose="handleSelectorClose"
                                :type="dataForm.type"
                                :warehouseName="dataForm.warehouseName">
    </purchase-contract-selector>
    <policy-channel-type-select v-if="showPolicyChannelTypeSelect" :dialogVisible="showPolicyChannelTypeSelect" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></policy-channel-type-select>
    <el-dialog title="请选择支付方式" :visible.sync="paymentVisible" append-to-body>
      <payment-selector @closePaymentDialog="closePaymentDialog" :isSingle="true"
      ref="payment"></payment-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePayment">取 消</el-button>
        <el-button type="primary" @click="handlePaymentSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseOrder';
  import { page } from '@/api/erp/wms/config/warehouse';
  import {getSimpleTree} from '@/api/erp/mall/cms/area';
  import {page as supplierPage} from '@/api/erp/purchase/supplier/index';
  export default {
    name: "purchaseOrderForm",
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/purchaseUser'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'purchase-contract-selector': () => import('../components/purchaseContractSelector'),
      'payment-selector': () => import('@/components/ERP/Payment/payment'),
      'policyChannelTypeSelect': () => import('@/components/ERP/Purchase/policyChannelTypeSelect'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        paymentList:undefined,
        paymentVisible: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        isSwitch: false,
        showPolicyChannelTypeSelect:false,//是否显示渠道类型选择对话框
        dataForm: {
          type:undefined,
          orderType:0,
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
          warehouseId: undefined,
          warehouseName: undefined,
          currencyId: '1',
          deliveryType:'0',
          sourceBillNo:undefined,
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceObjectKey: undefined,
          sumProfit: undefined,
          paymentsMeans:undefined,
          factoryPhone: undefined,
          factoryName: undefined,
          warehouseAdress: undefined,
          items: [],
          attachments:[]
        },
        channelTypeOptions: [{
          value: '01',
          label: '厂家'
        }, {
          value: '02',
          label: '厂家库存单'
        }, {
          value: '03',
          label: '厂家促销'
        }, {
          value: '04',
          label: '厂家促销第一季度'
        }, {
          value: '05',
          label: '厂家促销第二季度'
        }, {
          value: '06',
          label: '厂家促销第三季度'
        }, {
          value: '07',
          label: '厂家促销第四季度'
        }, {
          value: '08',
          label: '渠道'
        }],
        typeOption:[
          {
            value: '0',
            label: '备货'
          },
          {
            value: '1',
            label: '期货订单采购'
          },
          {
            value: '2',
            label: '调拨订单采购'
          },
          {
            value: '3',
            label: '闲置订单采购'
          }
        ],
        deliveryOption:[
          {
            value: '0',
            label: '销售出库'
          },
          {
            value: '1',
            label: '直发出库'
          },
        ],
        sourceBillNo: undefined,
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        selectedProducts: [],
        supplierVisible: false,
        purchaseUserVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          type:[
            {
              required: true,
              message: '请选择采购类型',
              trigger: 'blur'
            }
          ],
          orderType:[
            {
              required: true,
              message: '请选择订单类型',
              trigger: 'blur'
            }
          ],
          sourceObjectKey: [
            {
              required: true,
              message: '请选择关联单据',
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
          deliverDate: [
            {
              required: true,
              message: '请选择交货日期',
              trigger: 'blur'
            }
          ],
          factoryAdress: [
            {
              // required: this.dataForm.deliveryType == '1' && this.dataForm.type == '2' ? true : false,
              required: false,
              message: '请输入收货人地址',
              trigger: 'blur'
            }
          ],
          factoryName: [
            {
              required: false,
              message: '请输入收货人姓名',
              trigger: 'blur'
            }
          ],
          factoryPhone: [
            {
              required: false,
              message: '请输入收货人电话',
              trigger: 'blur'
            }
          ],
          channelTypeName: [
            {
              required: true,
              message: '请选择渠道类型',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 4,
        fileList:[]
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
      handleDeleteContract(index) {
        this.dataForm.attachments.splice(index,1)
        this.fileList.splice(index,1)
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$set(this.dataForm,'fileName',response.data.name);
          this.$set(this.dataForm,'fileUrl',response.data.url);
          this.dataForm.attachments.push({
            fileName:response.data.name,
            fileUrl:response.data.url,
          })
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
      handleDeliveryChange() {
        if(this.dataForm.deliveryType == 1) {
          this.dataForm.deliverDate = undefined;
          this.dataForm.factoryAdress = undefined;
          this.dataForm.factoryName = undefined;
          this.dataForm.factoryPhone = undefined;
        }

        if(this.dataForm.deliveryType == '1' && this.dataForm.type == '2' ) {
          this.$set(this.rules,'factoryAdress',{
            required: true,
              message: '请输入收货人地址',
              trigger: 'blur'
          })
          this.$set(this.rules,'factoryName',{
            required: true,
              message: '请输入收货人姓名',
              trigger: 'blur'
          })
          this.$set(this.rules,'factoryPhone',{
            required: true,
              message: '请输入收货人电话',
              trigger: 'blur'
          })
        } else {
          this.$set(this.rules,'factoryAdress',{
            required: false,
              message: '请输入收货人地址',
              trigger: 'blur'
          })
          this.$set(this.rules,'factoryName',{
            required: false,
              message: '请输入收货人姓名',
              trigger: 'blur'
          })
          this.$set(this.rules,'factoryPhone',{
            required: false,
              message: '请输入收货人电话',
              trigger: 'blur'
          })
        }
      },
      handleChangeType(val) {
        if(val == '3') {
          this.dataForm.orderType = 1
        } else {
          this.dataForm.orderType = 0
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
        }).catch(() => {
          this.dataForm.type = val == '0' ? '1' : '0'
        })
      },
      handleSourceBillNoDel(){
        this.dataForm.sourceObjectKey = undefined;
        this.dataForm.sourceBillNo = undefined;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 252;
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
              this.sourceBillNo = [response.data.sourceBillNo];
              this.supplierArr = response.data.supplierArr;
              this.items = response.data.items ? response.data.items : [];
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
          this.dataForm.deliverDate = date;
          this.purchaserUserArr.push({
            "id": this.$store.state.user.id,
            "name": this.$store.state.user.name,
            "code": this.$store.state.user.code
          });
          this.dataForm.purchaserId = this.$store.state.user.id;
          this.dataForm.purchaserName = this.$store.state.user.name;
          this.dataForm.purchaserCode = this.$store.state.user.code;
        }
      },
      handleDeliverDateChange(val) {
        this.dataForm.deliverDate = this.$moment(val).format("YYYY-MM-DD HH:mm:ss")
        for (let i in this.items) {
          this.vueSet(this.items[i], 'deliverDate', this.$moment(val).format("YYYY-MM-DD HH:mm:ss"));
        }
      },
      handleBillDateChange(val) {
         this.dataForm.billDate = this.$moment(val).format("YYYY-MM-DD HH:mm:ss")
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        // var date = new Date().toLocaleDateString().replace(/\//g, '-');
        // const d = {
        //   startDate: date,
        //   endDate: date,
        //   type: undefined
        // };
        this.items.push({});
      },
      handleValueDelete(index, r) {
        this.items.splice(index, 1);
        if (this.items.length == 0) {
          this.dataForm.sourceObjectKey = undefined;
        }
      },
      handleEdit(index, row, type, val) {
        if(type == 'channelTypeName') {
          let tempIndex = this.channelTypeOptions.findIndex(item => {
            return item.label == val
          })
          console.log(123);
          console.log(tempIndex);
          row.channelTypeCode = this.channelTypeOptions[tempIndex].value
        }
        if (row.qty && row.qty != '') {
          if (type == 'qty') {
            row.canGoodsQty = row.qty;
            if(val < 1){
              this.$message.warning('处理数量不能小于1');
              row.qty = row.applyQty;
            }
            if (val * 1 > row.applyQty * 1) {
              this.$message.warning('处理数量不能大于未处理数量');
              row.qty = row.applyQty;
              row.canGoodsQty = row.applyQty
            }
          } else if (type == 'taxPrice') {
            val = (val * 1).toFixed(4);
            row.taxPrice = val;
            //不含税单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(4);
            //处理折扣
            row.discount = Number(row.taxPrice / row.retailPrice).toFixed(4);
          } else if (type == 'discount' && !this.isSwitch) {
            val = (val * 1).toFixed(4);
            row.discount = val;
            //付款单价
            row.taxPrice = Number(row.retailPrice * val).toFixed(4);
          } else if (type == 'discount' && this.isSwitch) {
            val = (val * 1).toFixed(4);
            for (var i in this.items) {
              var item = this.items[i];
              item.discount = val;
              item.taxPrice = Number(item.retailPrice * val).toFixed(4);
              item.price = Number(item.taxPrice / (1 + parseInt(item.taxRate) / 100)).toFixed(4);
              item.amount = item.price ? Number(item.qty * item.price).toFixed(4) : item.amount;
              item.tax = Number(item.amount * parseInt(item.taxRate) / 100).toFixed(4);
              item.taxAmount = Number(item.taxPrice * item.qty).toFixed(4);
              this.vueSet(this.items, i, item);
            }
            return;
          } else if (type == 'taxRate') {

          }

          //不含税单价
          row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(4);
          //金额
          row.amount = row.price ? Number(row.qty * row.price).toFixed(4) : row.amount;
          //税额
          row.tax = Number(row.amount * parseInt(row.taxRate) / 100).toFixed(4);
          //价税合计
          row.taxAmount = Number(row.taxPrice * row.qty).toFixed(4);
          //采购利润
          // if (this.dataForm.supplierCode && this.dataForm.supplierCode == '100003') {
          //   row.profit = Number((row.releasePrice - row.taxPrice) * row.qty).toFixed(4);
          // } else {
          //   var profit = Number(row.releasePrice * row.qty) - Number(row.taxPrice * row.qty * 1.013);
          //   row.profit = Number(profit).toFixed(4);
          // }
          row.profit = Number((row.releasePrice - row.taxPrice) * row.qty).toFixed(4);
          this.vueSet(this.items, index, JSON.parse(JSON.stringify(row)));
        }

      },

      // 采购员选择
      handlePurchaserUserSelector() {
        this.purchaseUserVisible = true;
      },
      handleCancelPurchaserUser() {
        this.$refs.purchaseUser.reset();
        this.purchaseUserVisible = false;
      },
      handlePurchaserUserDel(index) {
        this.purchaserUserArr.splice(index, 1);
        this.dataForm.purchaserId = undefined;
        this.dataForm.purchaserName = undefined;
        this.dataForm.purchaserCode = undefined;
        if (this.$refs.purchaseUser) {
          this.$refs.purchaseUser.reset();
        }
      },
      handleSubmitPurchaserUser() {
        this.$refs.purchaseUser.onSubmit();
      },
      closeUserDialog(list) {
        this.purchaserUserArr = list;
        this.purchaseUserVisible = false;
        if (list.length > 0) {
          this.dataForm.purchaserName = list[0].name;
          this.dataForm.purchaserId = list[0].id;
          this.dataForm.purchaserCode = list[0].purchaserCode;
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
      handleourceDel(index){
        this.sourceBillNo.splice(index, 1);
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1);
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
        this.dataForm.supplierCode = undefined;
        this.items = [];
        if (this.$refs.supplier) {
          this.$refs.supplier.reset();
        }
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
          this.dataForm.linkPhone = list[0].linkPhone;
          this.dataForm.linkPerson = list[0].linkMan;
        }
      },

      data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }

          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'qty' || column.property == 'amount' || column.property == 'tax'
              || column.property == 'taxAmount' || column.property == 'profit') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (column.property === 'amount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.taxBillAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'profit') {
                  this.dataForm.sumProfit = getFloat((prev + curr), 4)
                }
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }
          } else {
            sums[index] = ' ';
          }

        });

        return sums;
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        // if (this.dataForm.supplierName == undefined || this.dataForm.supplierName == '') {
        //   this.$message.warning('请先选择供应商');
        //   return;
        // }
        if (this.dataForm.type == undefined || this.dataForm.type == '') {
          this.$message.warning('请先选择采购类型');
          return;
        }
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handlePayment(){
        this.paymentVisible = false;
      },
      handlePaymentSelector(){
        this.paymentVisible = true;
      },
      closePaymentDialog(obj){
        if(obj && obj.length > 0){
          this.paymentList = [obj[0].label];
          this.dataForm.paymentsMeans = obj[0].label;
        }
        this.paymentVisible = false;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }
        let billList = [];
        for(var i in obj.list){
          billList.push(obj.list[i].billNo);
        }
        this.sourceBillNo = [billList[0]];
        this.dataForm.sourceObjectKey = 'CGSQD';
        const _this = this;
        const dataMap = _this.data3Map(_this.items);
        // 删除最后一个空行
        // _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.dataForm.warehouseName = item.mainDTO.warehouseName;
            _this.dataForm.warehouseId = item.mainDTO.warehouseId;
            page({
              page: 1,
              limit: 20,
              selectType: 0,
              name:item.mainDTO.warehouseName
            }).then(res=>{
              if(res.code == 2000){
                if(res.data && res.data.records && res.data.records.length > 0){
                  this.dataForm.warehouseAdress = res.data.records[0].province + res.data.records[0].city + res.data.records[0].county + res.data.records[0].address;
                  // 如果发货方式为销售出库,自动带出收货人地址收货人收货人电话
                  if(this.dataForm.deliveryType == '0') {
                    this.dataForm.factoryName = res.data.records[0].contacts;
                    this.dataForm.factoryPhone = res.data.records[0].phone;
                    this.dataForm.factoryAdress = res.data.records[0].address;
                  }
                }
              }
            })
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.skuNo];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.deliverDate = _this.dataForm.deliverDate ? _this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-');
          itemObj.skuNo = item.skuNo;
          itemObj.warehouseName = item.mainDTO.warehouseName;
          itemObj.warehouseId = item.mainDTO.warehouseId;
          itemObj.itemNo = item.itemNo;
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          itemObj.brandId = item.brandId;
          itemObj.supplyPrice = item.supplyPrice;
          itemObj.taxPrice = item.supplyPrice;
          itemObj.channelTypeCode = item.channelTypeCode;
          itemObj.channelTypeName = item.channelTypeName;

          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.rebateSeries = item.rebateSeries
          itemObj.categoryId = item.categoryId;
          // itemObj.taxPrice = item.supplyPrice ? item.supplyPrice : "";
          // 调拨类型把供应商带出来
          if(item.supplierCode) {
            console.log('有supplierCode');
            _this.dataForm.supplierName = item.supplierName;
            _this.dataForm.supplierCode = item.supplierCode;

            console.log(_this.dataForm);
            // 请求supplierPage查找供应商id
            supplierPage({
              key:item.supplierCode
            }).then(res => {
              _this.dataForm.supplierId = res.data.records[0].id;
              _this.dataForm.linkPhone = res.data.records[0].linkPhone;
              _this.dataForm.linkPerson = res.data.records[0].linkMan;
              _this.supplierArr = [{
                supplierCode:item.supplierCode,
                supplierName:item.supplierName,
                id:itemObj.supplierId,
              }]
            })
          }
          itemObj.factoryId = item.factoryId;
          itemObj.salesOrderItemId = item.salesOrderItemId;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.iid = item.iid;
          itemObj.skuName = item.skuName;
          itemObj.qty = item.applyQty + '';
          itemObj.canGoodsQty = item.applyQty + '';
          itemObj.applyQty = item.applyQty * 1 - item.purchasedQty * 1;
          itemObj.retailPrice = Number(item.retailPrice).toFixed(4);
          itemObj.releasePrice =Number(item.releasePrice).toFixed(4);
          itemObj.taxRate = _this.defaultTaxRate;
          itemObj.percentage = item.percentage
          itemObj.productionDate = item.productionDate
          itemObj.warranty = item.warranty
          itemObj.categoryName = item.categoryName
          itemObj.notOrderQty = item.notOrderQty
          // 闲置库存id
          itemObj.iid = item.iid
          // 闲置库存锁库记录id
          itemObj.idleLockId = item.id
          // 折扣
          itemObj.discount = Number(itemObj.taxPrice / itemObj.retailPrice).toFixed(4);
          // 不含税单价
          itemObj.price = Number(itemObj.taxPrice / (1 + parseInt(itemObj.taxRate) / 100)).toFixed(4);
          //金额
          itemObj.amount = itemObj.price ? Number(itemObj.qty * itemObj.price).toFixed(4) : itemObj.amount;
          //税额
          itemObj.tax = Number(itemObj.amount * parseInt(itemObj.taxRate) / 100).toFixed(4);
          //价税合计
          itemObj.taxAmount = Number(itemObj.taxPrice * itemObj.qty).toFixed(4);
          // 采购利润
          itemObj.profit = Number((itemObj.releasePrice - itemObj.taxPrice) * itemObj.qty).toFixed(4);
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;

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
      handlePaymentSubmit(obj){
        this.$refs.payment.onSubmit();
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
            this.dataForm.sourceObjectKey = 'CGSQD';
          }
        }

        for (var i in this.items) {
          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (this.items[i].qty > this.items[i].applyQty) {
              this.$message.error('第' + (i * 1 + 1) + '行的处理数量不能大于未处理数量,请重新填写');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }
            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的处理数量为必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].discount || this.items[i].discount == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的处理折扣为必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].taxPrice || this.items[i].taxPrice == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的付款单价为必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select();

              return;
            }
          }
        }
        return true;
      },
      /**
       * 关闭渠道类型选择对话框
       */
      handleClosePublic() {
        this.showPolicyChannelTypeSelect=false
        //this.showDialog=false
      },

      /**
       * 从子组件中接收的提交方法
       * @param list
       */
      handleSubmitPublic(list){
        if(list.type==='policyChannelType'){
          this.showPolicyChannelTypeSelect=false
          this.$set(this.dataForm,'channelTypeName',list.arr.name)
          this.dataForm.channelType=list.arr.code
          this.$refs['dataForm'].validateField('channelTypeName')
        }
      },
    }
  }
</script>

<style scoped>
  .tb-edit {
    height:80%!important
  }
</style>
