<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    @close="handleClose"
    class="billFormDialog resizeDialog manualOrder"
    width="70%">
    <span class="con-title" slot="title">
      <svg-icon icon-class="contract"></svg-icon>
      <span v-if="!dataForm.id">新增手工下单</span>
      <span v-if="dataForm.id">编辑手工下单</span>
<!--      <el-upload :file-list="fileList" :limit="5" :on-exceed="handleExceed"-->
<!--                   :on-success="uploadCompleted" :show-file-list="false" action="/api/goods/storage/create" class="upload"-->
<!--                   style="display:inline;" v-if="processId && processId!='' && taskType=='now'">-->
<!--          <el-button icon="el-icon-download" type="text">-->
<!--            导入合同-->
<!--          </el-button>-->
<!--      </el-upload>-->
      <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
    </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="客户编号:" prop="customerCode">
                <div
                  @click="handleCustomerSelector"
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                >
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <span>{{dataForm.customerCode}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="客户名称:" prop="customerName">
                <el-input disabled v-model="dataForm.customerName"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="单据日期:" prop="billDate">
                <el-date-picker
                  align="right"
                  placeholder="请选择日期"
                  style="width: 200px;"
                  type="date"
                  v-model="dataForm.billDate"
                ></el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="业务员:" prop="managerName">
                <el-input disabled v-model="dataForm.managerName"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="下单方式:" prop="createType">
                <el-select disabled style="width: 100%;" v-model="dataForm.createType">
                  <el-option
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in createOption"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="上传合同：" :required="dataForm.createType*1===1">
                <div style="width: 80%">
                  <el-upload :file-list="fileList" :limit="5" :on-exceed="handleExceed"
                             :on-success="uploadCompleted" :show-file-list="true" action="/api/goods/storage/create" class="upload"
                             style="display:inline;" v-if="processId && processId!='' && taskType=='now'">
                  <span style="line-height: 40px">
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  </el-upload>
                </div>

              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item class="el-form-flex" label="备注:" prop="note">
                <el-input :rows="2" placeholder="请输入内容" type="textarea" v-model="dataForm.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- items2 -->
    <el-table
    :data="items2"
      border
      class="tb-edit"
      max-height="250"
      highlight-current-row
      v-if="dataForm.createType == 2"
      width="100%">
      <el-table-column type="index" width="40" align="center"></el-table-column>
      <el-table-column label="库存选择" v-slot="{row,$index}" width="70" align="center">
        <el-button @click="chooseStock(row,$index)" type="primary" v-if="(chooseStockTwoLevelData[$index]&&chooseStockTwoLevelData[$index].length)>0" icon="el-icon-search" circle></el-button>
        <el-button @click="chooseStock(row,$index)" v-else icon="el-icon-search" circle></el-button>
      </el-table-column>
      <el-table-column label="单据编号" prop="billNo" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.billNo}}
        </template>
      </el-table-column>
<!--      <el-table-column label="单据时间" prop="crtTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          {{scope.row.crtTime}}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="商品名称" prop="productName" v-slot="{row}" width="140" align="center">
        <span>{{row.productName}}</span>
      </el-table-column>
      <el-table-column label="品牌" prop="productBrand" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.productBrand}}
        </template>
      </el-table-column>
      <el-table-column label="订货号" prop="sp1"  align="center">
         <template slot-scope="scope">
          {{scope.row.sp1}}
        </template>
      </el-table-column>
      <el-table-column label="型号" prop="sp2" v-slot="{row}" width="160" align="center">
        <span>{{row.sp2}}</span>
      </el-table-column>
      <el-table-column label="面价" prop="retailPrice" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.retailPrice}}
        </template>
      </el-table-column>
      <el-table-column label="销售价" prop="productPrice" width="90" align="center">
          <template slot-scope="scope">
          {{scope.row.productPrice}}
        </template>
      </el-table-column>
      <el-table-column label="总购买" prop="quantity" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column label="现货" prop="promptQty" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.promptQty}}
        </template>
      </el-table-column>
      <el-table-column label="调拨" prop="synergyQty" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.synergyQty}}
        </template>
      </el-table-column>
      <el-table-column label="期货" prop="futuresQty" width="80" align="center">
         <template slot-scope="scope">
          {{scope.row.futuresQty}}
        </template>
      </el-table-column>
    </el-table>
    <!-- items明细 -->
    <el-table
      :data="items"
      :height="clientHeight"
      :summary-method="getSummaries"
      border
      class="tb-edit"
      highlight-current-row
      show-summary
      width="100%">
      <el-table-column type="index" width="50"></el-table-column>
<!--      <el-table-column width="65">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            icon="el-icon-minus"-->
<!--            @click="handleValueDelete(scope.$index, scope.row)"-->
<!--          ></el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
       <el-table-column align="center" label="渠道类型" prop="source" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.source*1 === 0">现货</span>
          <span v-if="scope.row.source*1 === 1">期货</span>
          <span v-if="scope.row.source*1 === 2">调拨</span>
<!--          <el-select v-model="scope.row.source" style="width: 100%;"-->
<!--                           @change="handleSourceChange(scope.$index,scope.row.source)">-->
<!--                  <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label"-->
<!--                             :value="item.value">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--          <el-select v-model="scope.row.source">-->
<!--            <el-option value="0" label="现货"></el-option>-->
<!--            <el-option value="1" label="期货"></el-option>-->
<!--            <el-option value="2" label="调拨"></el-option>-->
<!--          </el-select>-->
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" width="180">
<!--        <template slot-scope="scope">-->
<!--          <div @click="handleProductShow(scope.row)" style="cursor: pointer;">-->
<!--            <el-input size="mini" suffix-icon="el-icon-more"-->
<!--                      v-model="scope.row.productName"></el-input>-->
<!--          </div>-->
<!--          <span>{{scope.row.productName}}</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="品牌" prop="productBrand">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input left-el-input"
            readonly
            size="mini"
            v-model="scope.row.productBrand"
          ></el-input>
          <span>{{scope.row.productBrand}}</span>
        </template>
      </el-table-column>
      <el-table-column label="系列" prop="productSeries">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input left-el-input"
            readonly
            size="mini"
            v-model="scope.row.productSeries"
          ></el-input>
          <span>{{scope.row.productSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" prop="sp2">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input left-el-input"
            readonly
            size="mini"
            v-model="scope.row.sp2"
          ></el-input>
          <span>{{scope.row.sp2}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订货号" prop="sp1" width="200">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input left-el-input"
            readonly
            size="mini"
            v-model="scope.row.sp1"
          ></el-input>
          <span>{{scope.row.sp1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="面价" prop="retailPrice">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.retailPrice"
          ></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="可售数量" prop="sallQty">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.sallQty"
          ></el-input>
          <span>{{scope.row.sallQty}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="调拨折扣" prop="allocationDiscount">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.allocationDiscount"
          ></el-input>
          <span>{{scope.row.allocationDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="调拨价" prop="allocationPrice">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.allocationPrice"
          ></el-input>
          <span>{{scope.row.allocationPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="销售折扣" prop="discount">
<!--        <template slot-scope="scope">-->
<!--          <el-input-->
<!--            size="mini"-->
<!--            v-model="scope.row.discount"-->
<!--            class="right-el-input"-->
<!--            @input="handleInputFun($event, scope.row, 'discount')"-->
<!--             @change="handleEdit('discount',$event,scope.$index,scope.row)"-->
<!--             @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"-->
<!--             :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"-->
<!--          ></el-input>-->
<!--          <span>{{scope.row.discount}}</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="销售价" prop="productPrice" v-slot="{row}">
        <span>{{row.productPrice}}</span>
<!--        <template slot-scope="scope">-->
<!--          <el-input-->
<!--            size="mini"-->
<!--            v-model="scope.row.productPrice"-->
<!--            class="right-el-input"-->
<!--            @input="handleInputFun($event, scope.row, 'productPrice')"-->
<!--             @change="handleEdit('productPrice',$event,scope.$index,scope.row)"-->
<!--              @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"-->
<!--               :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"-->
<!--          ></el-input>-->
<!--          <span>{{scope.row.productPrice}}</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column align="right" class-name="col-required" label="购买数量" prop="productQuantity">
<!--        <template slot-scope="scope">-->
<!--          <el-input-->
<!--            size="mini"-->
<!--            v-model="scope.row.productQuantity"-->
<!--            class="right-el-input"-->
<!--            @input="handleInputFun($event, scope.row, 'productQuantity')"-->
<!--            @change="handleEdit('productQuantity',$event,scope.$index,scope.row)"-->
<!--            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"-->
<!--             :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"-->
<!--          ></el-input>-->
<!--          <span>{{scope.row.productQuantity}}</span>-->
<!--        </template>-->
      </el-table-column>
       <el-table-column align="right" label="价税合计" prop="subtotal">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.subtotal"
          ></el-input>
          <span>{{scope.row.subtotal}}</span>
        </template>
      </el-table-column>
       <el-table-column align="right" label="参考价" prop="referencePrice">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.referencePrice"
          ></el-input>
          <span>{{scope.row.referencePrice}}</span>
        </template>
      </el-table-column>
       <el-table-column align="right" label="仓库" prop="deliveryWarehouse" width="120">
        <template slot-scope="scope">
          <el-input
            class="readonly-el-input right-el-input"
            readonly
            size="mini"
            v-model="scope.row.deliveryWarehouse"
          ></el-input>
          <span>{{scope.row.deliveryWarehouse}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm2">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="省份/直辖市:" prop="receiverProvince">
                <div @click="handleCustomerAddressSelector">
                  <el-input placeholder="请输入省份/直辖市" type="input" v-model="dataForm.receiverProvince"></el-input>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="城市:" prop="receiverCity">
                <el-input placeholder="请输入城市" readonly type="input" v-model="dataForm.receiverCity"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="区:" prop="receiverRegion">
                <el-input placeholder="请输入区" readonly type="input" v-model="dataForm.receiverRegion"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="收货地址:" prop="deliverDetailAddress">
                <el-input placeholder="请输入收货地址" readonly type="input" v-model="dataForm.deliverDetailAddress"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="收货人:" prop="receiverName">
                <el-input placeholder="请输入收货人" v-model="dataForm.receiverName"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="联系电话:" prop="receiverPhone">
                <el-input placeholder="请输入联系电话" v-model="dataForm.receiverPhone"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item class="el-form-flex" label="寄件方式:" prop="distributionMode">
                <el-select style="width: 100%;" v-model="dataForm.distributionMode">
                  <el-option
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in distributionOptions"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex" label="是否代发:" prop="isReplaceDelivery">
                <el-switch
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  active-text="是"
                  inactive-color="#ff4949" inactive-text="否"
                  style="padding-top:20px;float:left"
                  v-model="dataForm.isReplaceDelivery">
                </el-switch>
              </el-form-item>
            </td>
            <td v-if="dataForm.isReplaceDelivery===1">
              <el-form-item class="el-form-flex" label="代发公司:" prop="replaceDeliveryCompany">
                <el-input @change="$refs.dataForm2.validateField('replaceDeliveryCompany')" placeholder="请输入代发公司" v-model="dataForm.replaceDeliveryCompany"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.isReplaceDelivery===1">
            <td>
              <el-form-item class="el-form-flex" label="代发联系人:" prop="replaceLinkMan">
                <el-input :rows="2" @change="$refs.dataForm2.validateField('replaceLinkMan')" placeholder="请输入代发联系人" v-model="dataForm.replaceLinkMan"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="el-form-flex" label="代发联系电话:" prop="replaceLinkPhone">
                <el-input :rows="2" @change="$refs.dataForm2.validateField('replaceLinkPhone')" placeholder="请输入联系电话" v-model="dataForm.replaceLinkPhone"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <task-history :billNo="dataForm.billNo" :processId="processId"
                  v-if="dataForm.billNo && processId && processId!=''"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 申请人列表弹窗-->
    <el-dialog :visible.sync="applicantUserVisible" append-to-body title="请选择申请人">
      <purchase-user-selector
        :isSingle="true"
        @closeUserDialog="closeUserDialog"
        ref="applicantUser"
      ></purchase-user-selector>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCancelApplicantUser">取 消</el-button>
        <el-button @click="handleSubmitApplicantUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 供应商列表弹窗-->
    <el-dialog :visible.sync="supplierVisible" append-to-body title="请选择供应商">
      <supplier-selector :isSingle="true" @closeSupplierDialog="closeSupplierDialog" ref="supplier"></supplier-selector>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button @click="handleSubmitSupplier" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 所有商品弹窗 渠道类型不为期货时-->
<!--    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" v-if="productVisible" append-to-body class="goodsDialog">-->
<!--      <goods-detail-selector ref="goodsSelector" :isSingle="false" :source="source" @closeGoodsDialog="closeGoodsDialog" key="goodsSelector" :sp1="nowSp1"></goods-detail-selector>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="handleCloseProduct">取 消</el-button>-->
<!--        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
    <!-- 渠道类型为期货时关联单据 -->
    <el-dialog :visible.sync="dialogSelectorVisible" append-to-body class="goodsDialog" title="所有商品" v-if="dialogSelectorVisible" width="60%">
      <purchase-contract-selector  :isSingle="false" :sp1="nowSp1" @closeGoodsDialog="closeFutureDialog" @handleSelectorClose="handleSelectorClose"
                                ref="futureGoodsSelector">
      </purchase-contract-selector >
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button @click="handleSubmitProduct" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增付款申请单弹窗底部 -->
    <div class="dialog-footer" slot="footer">
      <!-- <div v-if="dataForm.billStatus && dataForm.billStatus==1 && taskType != 'now'"> -->
      <div v-if="taskType != 'now'">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="isTemporaryLoading" @click="handleTempAddBill()" v-if="dataForm.billStatus != '5'">暂 存</el-button>
      <el-button :loading="isFormLoading" @click="handleSubmit" type="primary" v-if="dataForm.billStatus != '5'">提 交</el-button>
      </div>
    </div>
    <!-- 收货地址列表弹窗-->
    <el-dialog :visible.sync="customerAddressVisible" append-to-body title="请选择收货地址">
      <customer-address-selector :customerCode="dataForm.customerCode" :isSingle="true"
                                 @closeCustomerAddressDialog="closeCustomerAddressDialog"
                                 ref="customerAddress"></customer-address-selector>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCancelCustomerAddress">取 消</el-button>
        <el-button @click="handleSubmitCustomerAddress" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 客户列表弹窗-->
    <el-dialog :visible.sync="customerVisible" append-to-body title="请选择客户">
      <customer-selector
        :isSingle="false"
        @closeCustomerDialog="closeCustomerDialog"
        ref="customer"
      ></customer-selector>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button @click="handleSubmitCustomer" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增实际回款弹窗底部 -->
    <div class="dialog-footer" slot="footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input :rows="2" placeholder="请输入流转备注" style="width: 100%;" type="textarea" v-model="comment"></el-input>
      </div>
      <div style="float: left;display: inline-block;" v-if="processId && processId!='' && taskType=='now'">
        <el-button :loading="isRejectLoading" @click="handleAuditBill('驳回')" type="warning"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button :loading="isAgreeLoading" @click="handleAuditBill('同意')" type="primary">同 意</el-button>
      </div>
      <div style="float: left;display: inline-block;" v-if="dataForm.billStatus && dataForm.billStatus==4">
      </div>
      <!-- <el-button @click="handleClose">取 消</el-button> -->
    </div>

    <!-- 库存选择弹窗-->
    <el-dialog :visible.sync="showChooseStock" append-to-body title="请选择库存" v-if="showChooseStock" width="70%">
      <el-table :data="nowRow" border class="tb-edit" highlight-current-row width="100%">
        <el-table-column label="商品名称" prop="productName" width="150"></el-table-column>
        <el-table-column label="订货号" prop="sp1"></el-table-column>
        <el-table-column label="型号" prop="sp2" width="180"></el-table-column>
        <el-table-column label="面价" prop="retailPrice" width="100"></el-table-column>
        <el-table-column label="销售价" prop="productPrice" width="100"></el-table-column>
        <el-table-column label="购买总数量" prop="quantity"></el-table-column>
        <el-table-column label="购买现货数量" prop="promptQty" width="100"></el-table-column>
        <el-table-column label="购买调拨数量" prop="synergyQty" width="100"></el-table-column>
        <el-table-column label="购买期货数量" prop="futuresQty" width="100"></el-table-column>
      </el-table>
      <div style="margin-top: 15px;margin-bottom: 15px">
        <span>当前已选择</span>
        <span>现货：</span>
        <span style="color: red">{{chooseStockXHSum}}</span>
        <span>个，</span>
        <span>期货：</span>
        <span style="color: red">{{chooseStockQHSum}}</span>
        <span>个，</span>
        <span>调拨：</span>
        <span style="color: red">{{chooseStockDBSum}}</span>
        <span>个，</span>
        <span>待选择</span>
        <span>{{nowRow[0].quantity-chooseStockSum}}</span>
        <span>个</span>
        <i class="el-icon-circle-close" style="color: red;margin-left: 15px;" v-if="nowRow[0].quantity-chooseStockSum<0"></i>
        <span style="color:red;" v-if="nowRow[0].quantity-chooseStockSum<0">选择数量不能超过购买数量</span>
      </div>
      <el-tabs type="border-card" v-model="nowTabIndex">
        <el-tab-pane label="现货" name="0">
          <el-table :data="chooseStockData[0]" border class="tb-edit" highlight-current-row width="100%">
            <el-table-column label="仓库" prop="warehouseName"></el-table-column>
            <el-table-column label="可售库存" v-slot="{row}" width="100">
              <span>{{row.qty-row.lockedQty}}</span>
            </el-table-column>
            <el-table-column label="调拨价" prop="allocationPrice" width="100"></el-table-column>
            <el-table-column align="right" label="调拨折扣" prop="discount" sortable width="100">
              <template slot-scope="scope">{{ (scope.row.allocationPrice / scope.row.retailPrice).toFixed(4) }}</template>
            </el-table-column>
            <el-table-column label="库存来源" prop="source" v-slot="{row}" width="80">
              <span v-if="row.source*1===0">线上</span>
              <span v-else-if="row.source*1===1">线下</span>
              <span v-else-if="row.source*1===2">调拨</span>
            </el-table-column>
            <el-table-column label="库存操作人（归属人）" prop="ownerName"></el-table-column>
            <el-table-column label="入库类型" prop="stockType" width="100"></el-table-column>
            <el-table-column label="入库时间" prop="crtTime" width="150"></el-table-column>
            <el-table-column class-name="no-border" label="销售折扣" label-class-name="red-title" v-slot="{row}" width="90">
              <el-input @input="handleInputFun(row,'discount',nowRow[0].retailPrice)" v-model="row.discount"></el-input>
            </el-table-column>
            <el-table-column class-name="no-border" label="销售价" label-class-name="red-title" v-slot="{row}" width="110">
              <el-input @input="handleInputFun(row,'productPrice',nowRow[0].retailPrice)"v-model="row.productPrice"></el-input>
            </el-table-column>
            <el-table-column label="数量" label-class-name="red-title" v-slot="{row}" width="160">
              <el-input-number :max="row.qty-row.lockedQty" :min="0" v-model.number="row.productQuantity"></el-input-number>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label='期货' name="1">
          <el-table :data="chooseStockData[1]" border class="tb-edit" highlight-current-row width="100%">
            <el-table-column label="商品名称" prop="name" width="150"></el-table-column>
            <el-table-column label="订货号" prop="itemNo"></el-table-column>
            <el-table-column label="型号" prop="specModel" width="180"></el-table-column>
            <el-table-column label="面价" prop="retailPrice" width="100"></el-table-column>
            <el-table-column class-name="no-border" label="销售折扣" label-class-name="red-title" v-slot="{row}" width="90">
              <el-input @input="handleInputFun(row,'discount',nowRow[0].retailPrice)" v-model="row.discount"></el-input>
            </el-table-column>
            <el-table-column class-name="no-border" label="销售价" label-class-name="red-title" v-slot="{row}" width="110">
              <el-input @input="handleInputFun(row,'productPrice',nowRow[0].retailPrice)"v-model="row.productPrice"></el-input>
            </el-table-column>
            <el-table-column label="数量" label-class-name="red-title" v-slot="{row}" width="160">
              <el-input-number :max="row.qty-row.lockedQty" :min="0" v-model.number="row.productQuantity"></el-input-number>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="调拨" name="2">
          <el-table :data="chooseStockData[2]" border class="tb-edit" highlight-current-row width="100%">
<!--            <el-table-column label="仓库" prop="warehouseName"></el-table-column>-->
            <el-table-column label="可售库存" v-slot="{row}">
              <span>{{row.qty-row.lockedQty}}</span>
            </el-table-column>
            <el-table-column align="right" label="调拨折扣" prop="discount" sortable>
              <template slot-scope="scope">{{ (scope.row.allocationPrice / scope.row.retailPrice).toFixed(4) }}</template>
            </el-table-column>
            <el-table-column label="调拨价" prop="allocationPrice" sortable></el-table-column>
            <el-table-column label="库存来源" prop="source" v-slot="{row}">
              <span v-if="row.source*1===0">线上</span>
              <span v-else-if="row.source*1===1">线下</span>
              <span v-else-if="row.source*1===2">调拨</span>
            </el-table-column>
<!--            <el-table-column label="库存操作人（归属人）" prop="ownerName"></el-table-column>-->
<!--            <el-table-column label="入库类型" prop="stockType" width="100"></el-table-column>-->
<!--            <el-table-column label="入库时间" prop="crtTime" width="150"></el-table-column>-->
            <el-table-column class-name="no-border" label="销售折扣" label-class-name="red-title" v-slot="{row}">
              <el-input @input="handleInputFun(row,'discount',nowRow[0].retailPrice)" v-model="row.discount"></el-input>
            </el-table-column>
            <el-table-column class-name="no-border" label="销售价" label-class-name="red-title" v-slot="{row}">
              <el-input @input="handleInputFun(row,'productPrice',nowRow[0].retailPrice)"v-model="row.productPrice"></el-input>
            </el-table-column>
            <el-table-column label="数量" label-class-name="red-title" v-slot="{row}">
              <el-input-number :max="row.qty-row.lockedQty" :min="0" v-model.number="row.productQuantity"></el-input-number>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>



    <span class="dialog-footer" slot="footer">
        <el-button @click="showChooseStock=false">取 消</el-button>
        <el-button @click="handleSubmitChooseStock(nowRow[0].quantity-chooseStockSum===0)" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>

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
import {selectDetailItem} from '@/api/erp/wms/stock_query/index'
import {page} from '@/api/erp/goods/goods';

export default {
  name: "paymentApplyForm",
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
      nowTabIndex:'0',
      isFormLoading: false,
      isTemporaryLoading: false,
      customerVisible: false,
      tableElInputNum: 1,
      nowRow:[],
      nowIndex:0,
      isRejectLoading: false,
      customerAddressVisible: false,
      comment:undefined,
      showChooseStock:false,//是否展示库存选择弹窗
      chooseStockData:[],//库存选择弹窗库存数据储存
      chooseStockTwoLevelData:[],
      isAgreeLoading:false,
      nowSp1:'',
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
        isReplaceDelivery:'0',
        memberUsername:this.$store.state.user.name
      },
      processId:'',
      fileList:[],
      customerManagerArr:[{}],
      isReplaceDelivery:false,
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
  computed:{
    chooseStockSum(){
      let sum=0
      sum=(this.chooseStockQHSum||0)+(this.chooseStockXHSum||0)+(this.chooseStockDBSum||0)
      return sum
    },
    /*统计当前已选择的现货数量*/
    chooseStockXHSum(){
      let sum=0
      if(this.chooseStockData[0]){
        for (let i = 0; i <this.chooseStockData[0].length ; i++) {
          sum+=this.chooseStockData[0][i].productQuantity
        }
      }
      return sum
    },
    /*统计当前已选择的期货数量*/
    chooseStockQHSum(){
      let sum=0
      if(this.chooseStockData[1]){
        for (let i = 0; i <this.chooseStockData[1].length ; i++) {
          sum+=this.chooseStockData[1][i].productQuantity
        }
      }
      return sum
    },
    /*统计当前已选择的调拨数量*/
    chooseStockDBSum(){
      let sum=0
      if(this.chooseStockData[2]){
        for (let i = 0; i <this.chooseStockData[2].length ; i++) {
          sum+=this.chooseStockData[2][i].productQuantity
        }
      }
      return sum
    }
  },
  updated() {
    this.changeDivHeight();
  },
  methods: {
    handleAuditBill(val) {
      if(this.dataForm.createType == 2) {
        if (!this.checkSkuAndNumber()) {
          return;
        }
      }
      if(this.items2.length!==this.chooseStockTwoLevelData.length){
        this.$message.warning('还有未选择的商品!')
        return false;
      }
      //console.log(this.items2,this.items,'item')
      this.dataForm.taskMap = {
        step: this.step,
        opinion: val,
        comment: this.comment
      };
      this.dataForm.items2 = this.items2
      this.dataForm.items = this.items
      if(val != '驳回' && (!this.dataForm.fileUrl||this.dataForm.fileUrl==='')&&(Number(this.dataForm.createType)===1)) {
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
      // if(itemsSp1.sort().toString() != itemsSp2.sort().toString()) {
      //   this.$message.warning('请保证选择的订货号和企业采购订单的订货号相同!')
      //   return
      // }
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
      try {
        for(let i = 0;i < num1.length;i++) {
          let tempIndex = num2.findIndex(j => {
            return j.sp1 == num1[i].sp1
          })
          // if(num1[tempIndex].productQuantity == num2[tempIndex].productQuantity) {
          //   console.log('数量一样');
          // } else {
          //   this.$message.warning('请保证选择的数量和企业采购订单的订货号相同!')
          //   return
          // }
        }

        // 将平均价赋值给items2
        for(let j = 0;j<this.items2.length;j++) {
          let num1Index = num1.findIndex(i => {
            return i.sp1 == this.items2[j].sp1
          })
          this.items2[j].productPrice = num1[num1Index].productPrice
        }
      }catch (e) {

      }

      return true
    },
    uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          // this.$notify({
          //   title: '成功',
          //   message: response.msg,
          //   type: 'success',
          //   duration: 2000
          // });
          this.$message.success('合同上传成功!')
          this.dataForm.fileName = response.data.name;
          this.dataForm.fileUrl = response.data.url;
        } else {
          // this.$notify({
          //   title: '失败',
          //   message: response.msg,
          //   type: 'warning',
          //   duration: 2000
          // })
          this.$message.error('合同上传失败!'+response.msg||response.data)
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
          this.dataForm.receiverPhone = list[0].phoneNumber
          this.dataForm.receiverCity = list[0].city
          this.dataForm.receiverRegion = list[0].region
          this.$refs.dataForm2.validateField('receiverProvince')
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
      this.nowSp1=row.sp1
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
          itemObj.skuNo = item.goodsCode
          itemObj.brandId = item.brandId
          itemObj.productBrand = item.brandName
          itemObj.productSeries = item.seriesName
          // 面价
          itemObj.retailPrice = item.retailPrice
          // 商品sku条码
          itemObj.productSkuCode = item.goodsCode




          itemObj.goodsId = item.goodsId
          itemObj.productCategoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.sp1 = item.itemNo
          itemObj.productName = item.name
          itemObj.sp2 = item.specModel
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
    handleDeliveryChange() {
      this.dataForm.isReplaceDelivery = !!this.isReplaceDelivery ? '1' : '0'
      // this.$refs.dataForm.validate('replaceDeliveryCompany')
      // this.$refs.dataForm.validate('replaceLinkMan')
      // this.$refs.dataForm.validate('replaceLinkPhone')
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
          console.log(this.dataForm,'hello')
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
            //this.handleValueAdd();
            for (let i = 0; i <this.items2.length ; i++){
              let source='0'
              if(this.items2[i].promptQty>0){
                source='0'
              }else if(this.items2[i].synergyQty>0){
                source='2'
              }else{
                source='1'
              }
              //this.items.push({source:source,sp1:this.items2[i].sp1})
            }
          } else {
            this.items = response.data.items;
          }
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
           row.subtotal = Number(row.productQuantity*row.productPrice).toFixed(2)
         }
     }
    //  销售价更改
       if(type == 'productPrice') {
         row.productPrice = val
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

    /**
     * 库存选择
     * @param row
     * @param index
     */
    chooseStock(row,index){
      this.chooseStockData=[]
      this.showChooseStock=true
      this.nowRow=[Object.assign({},row)]
      this.nowIndex=index

        let params={
          page:1,
          limit:200,
          itemNo:row.sp1,
          publishType: 0,
          selectType: 1
        }
        page(params).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            for (let i = 0; i <res.data.records.length ; i++) {
              res.data.records[i].productQuantity=0
              res.data.records[i].iid = res.data.records[i].id
              res.data.records[i].productPrice=this.nowRow[0].productPrice
              res.data.records[i].discount=this.division(res.data.records[i].productPrice*1,this.nowRow[0].retailPrice*1).toFixed(4)
            }
            if(this.chooseStockTwoLevelData[this.nowIndex]&&this.chooseStockTwoLevelData[this.nowIndex].length>0){
              for (let i = 0; i <this.chooseStockTwoLevelData[this.nowIndex].length ; i++) {
                for (let j = 0; j <res.data.records.length ; j++) {
                  if(res.data.records[j].id===this.chooseStockTwoLevelData[this.nowIndex][i].id){
                    res.data.records[j]=Object.assign(res.data.records[j],this.chooseStockTwoLevelData[this.nowIndex][i])
                  }
                }
              }
            }
            // this.chooseStockData[1]=res.data.records
            this.$set(this.chooseStockData,1,res.data.records)
          }else{
            this.$message.error('获取期货商品数据失败!'+res.msg||res.data)
          }
        },error=>this.$message.error('获取期货商品数据失败!'+error))

        params={
          page:1,
          limit:200,
          itemNo:row.sp1,
          selectType:1,
          source:0
        }
        //查询现货库存
        selectDetailItem(params).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            for (let i = 0; i <res.data.records.length ; i++) {
              res.data.records[i].productQuantity=0
              res.data.records[i].iid = res.data.records[i].id
              res.data.records[i].productPrice=this.nowRow[0].productPrice
              res.data.records[i].discount=this.division(res.data.records[i].productPrice*1,this.nowRow[0].retailPrice*1).toFixed(4)
            }
            if(this.chooseStockTwoLevelData[this.nowIndex]&&this.chooseStockTwoLevelData[this.nowIndex].length>0){
              for (let i = 0; i <this.chooseStockTwoLevelData[this.nowIndex].length ; i++) {
                for (let j = 0; j <res.data.records.length ; j++) {
                  if(res.data.records[j].id===this.chooseStockTwoLevelData[this.nowIndex][i].id){
                    res.data.records[j]=Object.assign(res.data.records[j],this.chooseStockTwoLevelData[this.nowIndex][i])
                  }
                }
              }
            }
            if(!(this.chooseStockData[0] instanceof Array)){
              this.chooseStockData[0]=[]
            }
             this.chooseStockData[0].push(...res.data.records)
            // this.$set(this.chooseStockData,0,res.data.records)

          }else{
            this.$message.error('获取现货线上库存数据失败!'+res.msg||res.data)
          }
        },error=>this.$message.error('获取现货线上库存数据失败!'+error))

        params={
          page:1,
          limit:200,
          itemNo:row.sp1,
          selectType:1,
          source:1
        }
        //查询现货线下库存
        selectDetailItem(params).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            for (let i = 0; i <res.data.records.length ; i++) {
              res.data.records[i].productQuantity=0
              res.data.records[i].iid = res.data.records[i].id
              res.data.records[i].productPrice=this.nowRow[0].productPrice
              res.data.records[i].discount=this.division(res.data.records[i].productPrice*1,this.nowRow[0].retailPrice*1).toFixed(4)
            }
            if(this.chooseStockTwoLevelData[this.nowIndex]&&this.chooseStockTwoLevelData[this.nowIndex].length>0){
              for (let i = 0; i <this.chooseStockTwoLevelData[this.nowIndex].length ; i++) {
                for (let j = 0; j <res.data.records.length ; j++) {
                  if(res.data.records[j].id===this.chooseStockTwoLevelData[this.nowIndex][i].id){
                    res.data.records[j]=Object.assign(res.data.records[j],this.chooseStockTwoLevelData[this.nowIndex][i])
                  }
                }
              }
            }
            if(!(this.chooseStockData[0] instanceof Array)){
              this.chooseStockData[0]=[]
            }
            // this.chooseStockData[0]=res.data.records
            this.chooseStockData[0].push(...res.data.records)
          }else{
            this.$message.error('获取现货线下库存数据失败!'+res.msg||res.data)
          }
        },error=>this.$message.error('获取现货线下库存数据失败!'+error))

        params={
          page:1,
          limit:200,
          itemNo:row.sp1,
          selectType:1,
          source:2
        }
        //查询调拨库存
        selectDetailItem(params).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            for (let i = 0; i <res.data.records.length ; i++) {
              res.data.records[i].productQuantity=0
              res.data.records[i].iid = res.data.records[i].id
              res.data.records[i].productPrice=this.nowRow[0].productPrice
              res.data.records[i].discount=this.division(res.data.records[i].productPrice,this.nowRow[0].retailPrice).toFixed(4)
            }
            if(this.chooseStockTwoLevelData[this.nowIndex]&&this.chooseStockTwoLevelData[this.nowIndex].length>0){
              for (let i = 0; i <this.chooseStockTwoLevelData[this.nowIndex].length ; i++) {
                for (let j = 0; j <res.data.records.length ; j++) {
                  if(res.data.records[j].id===this.chooseStockTwoLevelData[this.nowIndex][i].id){
                    res.data.records[j]=Object.assign(res.data.records[j],this.chooseStockTwoLevelData[this.nowIndex][i])
                  }
                }
              }
            }
            // this.chooseStockData[2]=res.data.records
            this.$set(this.chooseStockData,2,res.data.records)
          }else{
            this.$message.error('获取调拨库存数据失败!'+res.msg||res.data)
          }
        },error=>this.$message.error('获取调拨库存数据失败!'+error))

    },

    async handleSubmitChooseStock(flag){
      if(flag){
        for (let i = 0; i <this.chooseStockData.length ; i++) {
          for (let j = 0; j <this.chooseStockData[i].length ; j++) {
            if(this.chooseStockData[i][j].productQuantity>0&&(!this.chooseStockData[i][j].discount||this.chooseStockData[i][j].discount===0)){
              let msg=''
              switch (i) {
                case 0:
                  msg='现货'
                    break;
                  case 1:
                    msg='期货'
                      break;
                    default:
                      msg='调拨'
                      break;
              }
              this.$message.warning(`请正确填写${msg}第${i+1}行的销售价和销售折扣`)
              return false
            }
          }
        }
        this.showChooseStock=false
        let checkArr=[]
        let copyArr=[...this.chooseStockData]
        for (let i = 0; i <this.chooseStockData.length ; i++) {
          if(i===1){
            for (let j = 0; j <copyArr[1].length ; j++) {
              if(copyArr[i][j].productQuantity&&copyArr[1][j].productQuantity>0){

                copyArr[1][j].productSeries=copyArr[1][j].seriesName
                copyArr[1][j].source=1
                //   copyArr[1][j].sallQty=copyArr[1][j].qty-copyArr[1][j].lockedQty
                //   copyArr[1][j].allocationDiscount=this.division(copyArr[1][j].allocationPrice,copyArr[1][j].retailPrice).toFixed(2)
                copyArr[1][j].subtotal=this.accMulti(copyArr[1][j].productQuantity||0,copyArr[1][j].productPrice||0).toFixed(2)
                copyArr[1][j].sp3=copyArr[1][j].source
                //   copyArr[1][j].deliveryWarehouse=copyArr[1][j].warehouseName
                await getQtyAndPriceType(this.dataForm.customerCode,copyArr[1][j].goodsCode).then(res => {
                  if(res[copyArr[1][j].goodsCode]) {
                    copyArr[1][j].referencePrice = res[copyArr[1][j].goodsCode].customerPrice
                  }
                })
                let ATS=[...this.nowRow]
                //console.log(i,'index',ATS[0],copyArr[1][j],copyArr[1])
                checkArr.push(Object.assign({},ATS[0],copyArr[1][j]))
              }
            }
          }else{
            //现货商品数据处理
            for (let j = 0; j <copyArr[i].length ; j++) {
              if(copyArr[i][j].productQuantity&&copyArr[i][j].productQuantity>0){
                copyArr[i][j].productSeries=copyArr[i][j].seriesName
                copyArr[i][j].sallQty=copyArr[i][j].qty-copyArr[i][j].lockedQty
                copyArr[i][j].allocationDiscount=this.division(copyArr[i][j].allocationPrice,copyArr[i][j].retailPrice).toFixed(2)
                copyArr[i][j].subtotal=this.accMulti(copyArr[i][j].productQuantity||0,copyArr[i][j].productPrice||0).toFixed(2)
                copyArr[i][j].deliveryWarehouse=copyArr[i][j].warehouseName
                copyArr[i][j].sp3=copyArr[i][j].source
                await getQtyAndPriceType(this.dataForm.customerCode,copyArr[i][j].skuNo).then(res => {
                  if(res[copyArr[i][j].skuNo]) {
                    copyArr[i][j].referencePrice = res[copyArr[i][j].skuNo].customerPrice
                  }
                })
                let ATS=[...this.nowRow]
                // console.log(i,'index',ATS[0],copyArr[i][j],copyArr)
                checkArr.push(Object.assign({},ATS[0],copyArr[i][j]))
              }

            }
          }
        }







        this.chooseStockTwoLevelData[this.nowIndex]=[...checkArr]
        let arr=this.chooseStockTwoLevelData.flat(Infinity)
        // console.log(arr)
        this.items=[...arr]
        for (let i = 0; i <this.chooseStockTwoLevelData.length ; i++) {
          let productPrice=0
          for (let j = 0; j <this.chooseStockTwoLevelData[i].length ; j++) {
            if(this.chooseStockTwoLevelData[i][j].productPrice&&this.chooseStockTwoLevelData[i][j].productPrice>0){
              productPrice=this.chooseStockTwoLevelData[i][j].productPrice
            }
          }
          this.items2[i].productPrice=productPrice
        }
        this.items2[this.nowIndex].promptQty=this.chooseStockXHSum
        this.items2[this.nowIndex].synergyQty=this.chooseStockDBSum
        this.items2[this.nowIndex].futuresQty=this.chooseStockQHSum

        console.log(this.items,'items')
      }else{
        this.$message.warning('请选择正确的数量!')
      }

    },

    handleInputFun(row,type,retailPrice){
      if(type==='discount'){
        let TS=Object.assign({},row)
        for (let i = 0; i <this.chooseStockData.length ; i++) {
          for (let j = 0; j <this.chooseStockData[i].length ; j++) {
            this.chooseStockData[i][j].discount=TS.discount
            this.chooseStockData[i][j].productPrice=this.accMulti(TS.discount,retailPrice).toFixed(4)
          }

        }
        //row.productPrice=this.accMulti(row.discount,retailPrice).toFixed(4)
      }else{
        //row.discount=this.division(row.productPrice,retailPrice).toFixed(4)
        let TS=Object.assign({},row)
        for (let i = 0; i <this.chooseStockData.length ; i++) {
          for (let j = 0; j <this.chooseStockData[i].length ; j++) {
            this.chooseStockData[i][j].productPrice=TS.productPrice
            this.chooseStockData[i][j].discount=this.division(TS.productPrice,retailPrice).toFixed(4)
          }

        }
      }
    }
  }
};
</script>
<style lang="scss">
.manualOrder {
  .red-title{
    color: red;
  }
  .no-border .el-input__inner{
    border: 0!important;
  }
  .bill-container .el-table{
    min-height: 300px!important;
  }
  .el-form-item__content {
    width: 70%!important;
  }
}
</style>
