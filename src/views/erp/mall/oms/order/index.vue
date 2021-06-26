<template> 
  <div class="bill-container orderIndex">
    <div class="filter-container">
      <div class="filter-container">
        <div style="margin-bottom: 10px;">
          <el-checkbox-group v-model="checkList">
            <el-checkbox class="checkbox-select" label="待付款"></el-checkbox>
            <el-checkbox class="checkbox-select" label="部分支付"></el-checkbox>
            <el-checkbox class="checkbox-select" label="待发货"></el-checkbox>
            <el-checkbox class="checkbox-select" label="发货中"></el-checkbox>
            <el-checkbox class="checkbox-select" label="已发货"></el-checkbox>
            <el-checkbox class="checkbox-select" label="已完成"></el-checkbox>
            <el-checkbox class="checkbox-select" label="已关闭"></el-checkbox>
            <el-checkbox class="checkbox-select" label="无效订单"></el-checkbox>
            <el-checkbox class="checkbox-select" label="异常订单"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <!--<el-select v-model="listQuery.status" class="input-width" placeholder="订单状态" clearable>-->
          <!--<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <el-input clearable v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"
                    v-if="choose == 'first'"></el-input>
          <el-input clearable v-model="listQuery.masterOrderSn" class="input-width" placeholder="主订单编号"
                    v-if="choose != 'first'"></el-input>
          <el-input clearable v-model="listQuery.orderSn" class="input-width" placeholder="子订单编号"
                    v-if="choose != 'first'"></el-input>
          <el-input clearable v-model="listQuery.customer" class="input-width" placeholder="客户编号"></el-input>
          <el-input clearable class="input-width" v-model="listQuery.customerName" v-if="choose == 'first'"
                    placeholder="客户名称"></el-input>
          <el-select v-model="listQuery.auditStatus" class="filter-item" placeholder="审核状态" clearable
                     style="width: 200px">
            <el-option v-for="item in auditOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input clearable class="input-width" v-if="choose == 'second'" placeholder="请输入仓库"
                    v-model="listQuery.deliveryWarehouse"></el-input>
          <el-input clearable v-model="listQuery.sp1" v-if="choose == 'third'" class="input-width"
                    placeholder="订货号"></el-input>
          <el-input clearable v-model="listQuery.sp2" v-if="choose == 'third'" class="input-width"
                    placeholder="型号"></el-input>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearchList()">查询</el-button>
          <el-button type="danger" icon="el-icon-refresh" size="mini" @click="restClick">重置</el-button>
<!--          <el-button type="warning" icon="el-icon-download" size="mini" @click="handleDownload()"-->
<!--                     :loading="downloadLoading">导出-->
<!--          </el-button>-->
        </div>

        <div style="margin-top: 10px;">
          <el-input clearable class="input-width" v-model="listQuery.crtUserNo" placeholder="客服工号"></el-input>
          <el-input clearable class="input-width" v-if="choose == 'first'" v-model="listQuery.note"
                    placeholder="买家留言"></el-input>
          <el-input clearable class="input-width" v-if="choose == 'second'" placeholder="请输入发货单号"
                    v-model="listQuery.deliverBillNo"></el-input>

          <el-input clearable class="input-width" v-model="listQuery.deliverySn" v-if="choose == 'second'"
                    placeholder="物流编号"></el-input>
          <!--          <el-date-picker class="input-width" v-model="listQuery.startDate" clearable-->
          <!--                          value-format="yyyy-MM-dd" type="date" placeholder="订单开始时间"></el-date-picker>-->
          <!--          <el-date-picker class="input-width" v-model="listQuery.endDate" clearable-->
          <!--                          value-format="yyyy-MM-dd" type="date" placeholder="订单结束时间"></el-date-picker>-->
          <el-date-picker
            v-model="billDate"
            type="daterange"
            align="right"
            unlink-panels
            style="width: 403px"
            range-separator="至"
            start-placeholder="订单开始日期"
            end-placeholder="订单结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>

      </div>
    </div>
    <div class="filter-container">
      <el-button type="text" v-if="choose == 'first'" icon="el-icon-upload2" @click="handlePush" :disabled="noPush">推送订单
      </el-button>
      <el-button type="text" v-if="choose == 'first'" icon="el-icon-circle-close" :disabled="noClose"
                 @click="handleClose">关闭订单
      </el-button>
<!--      <el-button type="text" v-if="choose != 'third'" icon="el-icon-edit" :class="select===3?'selectActive':'select'"-->
<!--                 @click="handleDelayed()">延时发货-->
<!--      </el-button>-->
      <el-button type="text" icon="el-icon-download" v-if="choose == 'first'" :disabled="multipleSelection.length!==1"
                 @click="downloadContract" style="margin-left: 10px;">下载合同
      </el-button>
<!--      <el-upload-->
<!--        v-if="choose == 'first'"-->
<!--        class="upload-demo"-->
<!--        style="display: inline-block;margin-left: 10px;"-->
<!--        action="api/goods/storage/create"-->
<!--        accept=".pdf"-->
<!--        :disabled="multipleSelection.length!==1"-->
<!--        :before-upload="beforeAvatarUpload"-->
<!--        :on-success="handleSuccess"-->
<!--        :on-error="handleError"-->
<!--        :show-file-list="false">-->
<!--        <el-button type="text" icon="el-icon-upload" :disabled="multipleSelection.length!==1">上传合同-->
<!--        </el-button>-->
<!--      </el-upload>-->
      <el-button type="text" icon="el-icon-circle-check" v-if="choose == 'first'&&$store.getters.code==='00000'" :disabled="isForceBy"
                 @click="forceBy" style="margin-left: 10px;">强制审核
      </el-button>
      <el-tabs v-model="choose" value="first" @tab-click="handleSwitch">
        <el-tab-pane label="主订单" name="first">

          <el-table ref="orderTableMain" key="orderTable2"
                    :data="list" style="width: 100%;"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading" border @row-click="handleRowClick"
                    :row-style="handleTableRowStyle" :default-sort="{prop: 'orderSn', order: 'descending'}" show-summary
                    :summary-method="getSummaries">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="审核状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.auditStatus==1?'success':scope.row.auditStatus==2?'danger':scope.row.auditStatus==0?'warning':''" effect="plain">{{scope.row.auditStatus | formatAuditStatus}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="订单状态" width="100" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.status == 0 ? 'lightBlue orderStaus':scope.row.status == 7||scope.row.status==1||scope.row.status==11?'Blue orderStaus':scope.row.status == 4||scope.row.status==5?'gray orderStaus':scope.row.status == 6?'red orderStaus':scope.row.status == 8?'lineGreen orderStaus':scope.row.status == 2?'linesGreen orderStaus':scope.row.status == 3?'Green orderStaus':''">{{scope.row.status | formatStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否推送" prop="pushType" width="100" align="left" v-slot="{row}">
              <span v-if="pushType[row.pushType]==='否'" style="color:#F56C6C;">{{pushType[row.pushType]}}</span>
              <span v-else style="color:#67C23A">{{pushType[row.pushType]}}</span>
            </el-table-column>
            <el-table-column label="店主是否审核" prop="isReview" width="100" align="left" v-slot="{row}">
              <span v-if="isReview[row.isReview]==='未审核'" style="color:#F56C6C;">{{isReview[row.isReview]}}</span>
              <span v-else style="color:#67C23A">{{isReview[row.isReview]}}</span>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderSn" width="180" align="center" sortable>
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewOrder(scope.$index, scope.row)">{{scope.row.orderSn}}</div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" width="80" align="center">
              <template slot-scope="scope">{{scope.row.customer}}</template>
            </el-table-column>
            <el-table-column label="客户名称" width="170" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.customerName}}</template>
            </el-table-column>
<!--            <el-table-column label="客服账号" width="140">-->
<!--              <template slot-scope="scope">{{scope.row.crtUserNo}}/{{scope.row.salesmanName}}</template>-->
<!--            </el-table-column>-->
            <el-table-column label="订单来源" width="100" align="center">
              <template slot-scope="scope">
<!--                <span v-if="scope.row.orderType == 0">常规订单</span>-->
<!--                <span v-if="scope.row.orderType == 1">手工订单</span>-->
<!--                <span v-if="scope.row.orderType == 2">API订单</span>-->
<!--                <span v-if="scope.row.orderType == 3">小程序订单</span>-->
                <span>优选订单</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="发货方式" width="100" align="center">
              <template slot-scope="scope">{{scope.row.sendType === 0 ? '现货先发' : '整单发货'}}</template>
            </el-table-column> -->
            <el-table-column label="配送方式" width="100" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.distributionMode==0?'info':scope.row.distributionMode==1?'danger':'warning'"
                        effect="plain">
                  {{scope.row.distributionMode==0?"快递运输":scope.row.distributionMode==1?'运费到付':scope.row.distributionMode==2?'货物自提':'货运物流'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="买家留言" width="180">
              <template slot-scope="scope">{{scope.row.note}}</template>
            </el-table-column>
            <el-table-column label="订单金额" width="120" prop="totalAmount" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.totalAmount">￥{{scope.row.totalAmount.toFixed(4)}}</template>
            </el-table-column>
            <el-table-column label="已支付金额" width="120" prop="paymentedAmount" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.paymentedAmount">￥{{scope.row.paymentedAmount.toFixed(4)}}
              </template>
            </el-table-column>
            <el-table-column label="利润（参考）" width="120" prop="cost" align="right" class-name="col-required" sortable>
              <template slot-scope="scope" v-if="scope.row.cost">
                <span v-if="scope.row.cost.toFixed(4)>0">
                  ￥{{scope.row.cost.toFixed(4)}}
                </span>
                <span v-else style="color: #0078D7">
                  ￥{{scope.row.cost.toFixed(4)}}
                </span>
              </template>
            </el-table-column>
<!--            <el-table-column label="委托状态" width="110" align="center">-->
<!--              <template slot-scope="scope">{{scope.row.entrustStatus == 0?'不需委托':scope.row.entrustStatus ==-->
<!--                1?'待委托支付':'委托支付完成'}}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="代发货" width="60" align="center">-->
<!--              <template slot-scope="scope">{{scope.row.isReplaceDelivery === 0 ? '否' : '是'}}</template>-->
<!--            </el-table-column>-->
            <el-table-column label="提交时间" width="160" prop="createTime" align="center" sortable>
              <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
            </el-table-column>
            <el-table-column label="审核时间" width="160" prop="modifyTime" align="center" sortable>
              <template slot-scope="scope">{{scope.row.modifyTime }}</template>
            </el-table-column>
            <el-table-column label="优惠金额" width="120" prop="couponAmount" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.couponAmount">￥{{scope.row.couponAmount.toFixed(4)}}
              </template>
            </el-table-column>
            <el-table-column label="应付金额" width="120" prop="payAmount" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.payAmount">￥{{scope.row.payAmount.toFixed(4)}}</template>
            </el-table-column>
            <el-table-column label="未支付金额" width="120" align="right" prop="unpaidAmount" class-name="col-required">
              <template slot-scope="scope">￥{{scope.row.unpaidAmount}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template slot-scope="scope">
<!--                <el-button v-if="scope.row.status == 0 && scope.row.entrustStatus == 1"-->
<!--                           @click="doEntrustPay(scope.row.orderSn)">委托支付-->
<!--                </el-button>-->
                <el-button @click="handleUpdateAuditStatusOrder(1, scope.row)" :loading="isFormLoading"
                           v-if="scope.row.status != 4&&scope.row.status != 0 &&scope.row.auditStatus == 0&&isReview[scope.row.isReview]==='已审核'">审核通过
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="子订单" name="second">
          <el-table ref="orderTable" key="orderTable1"
                    :data="list" style="width: 100%;"
                    v-loading="listLoading" border @selection-change="handleSelectionChange" show-summary
                    :summary-method="getSummaries" @row-click="handleRowClick"
                    :row-style="handleTableRowStyle">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="审核状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.mainDTO "
                        :type="scope.row.mainDTO.auditStatus==1?'success':scope.row.mainDTO.auditStatus==2?'danger':scope.row.mainDTO.auditStatus==0?'warning':''"
                        effect="plain">{{scope.row.mainDTO.auditStatus | formatAuditStatus}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="主订单编号" prop="masterOrderSn" width="170" align="center" sortable>
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewOrder(scope.$index, scope.row)">{{scope.row.masterOrderSn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="子订单状态" width="90" align="center">
              <template slot-scope="scope">
                  <span
                    :class="scope.row.status == 0 ? 'lightBlue orderStaus':scope.row.status == 7||scope.row.status==1||scope.row.status==11?'Blue orderStaus':scope.row.status == 4||scope.row.status==5?'gray orderStaus':scope.row.status == 6?'red orderStaus':scope.row.status == 8?'lineGreen orderStaus':scope.row.status == 2?'linesGreen orderStaus':scope.row.status == 3?'Green orderStaus':''">{{scope.row.status | formatStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column label="子订单编号" width="170" align="center" prop="orderSn" sortable>
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewOrderSub(scope.$index, scope.row)">{{scope.row.orderSn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" width="70" align="center">
              <template slot-scope="scope">{{scope.row.customer}}</template>
            </el-table-column>
            <el-table-column label="客户名称" width="240">
              <template slot-scope="scope">{{scope.row.customerName}}</template>
            </el-table-column>
<!--            <el-table-column label="客服账号" width="140">-->
<!--              <template slot-scope="scope">{{scope.row.crtUserNo}}/{{scope.row.salesmanName}}</template>-->
<!--            </el-table-column>-->
            <el-table-column label="订单金额" prop="totalAmount" width="120" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.totalAmount">￥{{scope.row.totalAmount.toFixed(4)}}</template>
            </el-table-column>
            <el-table-column label="利润（参考）" width="120" prop="cost" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.cost">
                <span v-if="scope.row.cost.toFixed(4)>0">
                  ￥{{scope.row.cost.toFixed(4)}}
                </span>
                <span v-else style="color: #0078D7">
                  ￥{{scope.row.cost.toFixed(4)}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="发货仓库" width="90" align="center">
              <template slot-scope="scope">{{scope.row.deliveryWarehouse}}</template>
            </el-table-column>
            <el-table-column label="发货单号" width="120" align="center">
              <template slot-scope="scope">{{scope.row.deliverBillNo}}</template>
            </el-table-column>
            <el-table-column label="物流公司" width="100" align="center">
              <template slot-scope="scope">{{scope.row.deliveryCompany}}</template>
            </el-table-column>
            <el-table-column label="物流单号" width="140">
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewDelivery(scope.$index, scope.row)" style="cursor: pointer">
                  {{scope.row.deliverySn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单类型" width="80" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.orderType === 0">现货订单</span>
                <span v-else-if="scope.row.orderType ===1">秒杀订单</span>
                <span v-else-if="scope.row.orderType ===2" class="colum-orderSn" style="cursor: pointer"
                      @click="showDelivery(scope.row)">期货订单</span>
<!--                <span v-else-if="scope.row.orderType ===2">期货订单</span>-->
                <span v-else-if="scope.row.orderType ===3" class="colum-orderSn" style="cursor: pointer" @click="showDelivery(scope.row)">调拨订单</span>
                <span v-else>闲置订单</span>
              </template>
            </el-table-column>
            <el-table-column label="应付金额" prop="payAmount" width="120" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.payAmount">￥{{scope.row.payAmount.toFixed(4)}}</template>
            </el-table-column>
            <el-table-column label="订单时间" width="160" prop="createTime" align="center">
              <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column label="发货时间" width="160" prop="deliveryTime" align="center">
              <template slot-scope="scope">{{scope.row.deliveryTime}}</template>
            </el-table-column>
            <el-table-column label="延时天数" width="80" prop="delayedDays" align="center">
              <template slot-scope="scope">{{scope.row.delayedDays}}</template>
            </el-table-column>
            <el-table-column label="延时发货原因" width="120" prop="delayedReason" align="center">
              <template slot-scope="scope">{{scope.row.delayedReason}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template slot-scope="scope" v-if="scope.row.status!= 4">
                <el-button size="mini"
                           @click="handleView(scope.$index, scope.row)"
                           v-show="scope.row.mainDTO && scope.row.mainDTO.auditStatus==1 &&
                            (scope.row.status==1||(scope.row.status==8&&scope.row.orderType==2))">订单取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="详情" name="third">
          <el-table ref="orderTable" key="orderTable1"
                    :data="list" style="width: 100%;"
                    v-loading="listLoading" border @selection-change="handleSelectionChange" show-summary
                    :summary-method="getSummaries" @row-click="handleRowClick"
                    :row-style="handleTableRowStyle" :default-sort="{prop: 'masterOrderSn', order: 'descending'}"
          >
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="审核状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row "
                        :type="scope.row.auditStatus==1?'success':scope.row.auditStatus==2?'danger':scope.row.auditStatus==0?'warning':''"
                        effect="plain">{{scope.row.auditStatus | formatAuditStatus}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="主订单编号" prop="masterOrderSn" width="170" align="center" sortable>
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewOrder(scope.$index, scope.row)">{{scope.row.masterOrderSn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="子订单状态" width="90" align="center">
              <template slot-scope="scope">
                  <span
                    :class="scope.row.status == 0 ? 'lightBlue orderStaus':scope.row.status == 7||scope.row.status==1||scope.row.status==11?'Blue orderStaus':scope.row.status == 4||scope.row.status==5?'gray orderStaus':scope.row.status == 6?'red orderStaus':scope.row.status == 8?'lineGreen orderStaus':scope.row.status == 2?'linesGreen orderStaus':scope.row.status == 3?'Green orderStaus':''">{{scope.row.status | formatStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column label="子订单编号" width="170" align="center" prop="orderSn" sortable>
              <template slot-scope="scope">
                <div class="colum-orderSn" @click="handleViewOrderSub(scope.$index, scope.row)">{{scope.row.orderSn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" width="70" align="center">
              <template slot-scope="scope">{{scope.row.customer}}</template>
            </el-table-column>
            <el-table-column label="客户名称" width="240">
              <template slot-scope="scope">{{scope.row.customerName}}</template>
            </el-table-column>
<!--            <el-table-column label="客服账号" width="140">-->
<!--              <template slot-scope="scope">{{scope.row.crtUserNo}}/{{scope.row.salesmanName}}</template>-->
<!--            </el-table-column>-->
            <el-table-column label="订单类型" width="80" align="center">
              <template slot-scope="scope">{{scope.row.orderType === 0 ? '正常订单' : scope.row.orderType ===1 ?
                '秒杀订单': scope.row.orderType ===2?'期货订单':scope.row.orderType ===3 ?
                '调拨订单':'闲置订单'}}
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="productPrice" width="100" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.productPrice">￥{{scope.row.productPrice.toFixed(4)}}
              </template>
            </el-table-column>
            <el-table-column label="数量" width="60" align="right">
              <template slot-scope="scope">{{scope.row.productQuantity}}</template>
            </el-table-column>
            <el-table-column label="利润（参考）" prop="cost" width="110" align="right" class-name="col-required">
              <template slot-scope="scope" v-if="scope.row.cost">
                <span v-if="((scope.row.productPrice-scope.row.cost)*scope.row.productQuantity).toFixed(4)>0">
                  ￥{{((scope.row.productPrice-scope.row.cost)*scope.row.productQuantity).toFixed(4)}}
                </span>
                <span v-else style="color: #0078D7">
                  ￥{{((scope.row.productPrice-scope.row.cost)*scope.row.productQuantity).toFixed(4)}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="订货号" width="180">
              <template slot-scope="scope">{{scope.row.sp1}}</template>
            </el-table-column>
            <el-table-column label="型号" width="180">
              <template slot-scope="scope">{{scope.row.sp2}}</template>
            </el-table-column>
            <el-table-column label="品牌" width="100">
              <template slot-scope="scope">{{scope.row.productBrand}}</template>
            </el-table-column>
            <el-table-column label="品名" width="180">
              <template slot-scope="scope">{{scope.row.productName}}</template>
            </el-table-column>
            <el-table-column label="订单时间" width="160" prop="createTime" align="center">
              <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
             
      </el-tabs>
    </div>
    <div class="table-container">
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        :page-sizes="[10,20,50,100]"
        :total="total">
      </el-pagination>
    </div>
    <order-detail @listBtn="listBtn" :id="id" :visible="detailDialogVisible" @handleClose="detailHandleClose"
                  @renovateClick="renovateClick"></order-detail>
    <order-sub-detail :id="id" :visible="detailSubDialogVisible" v-if="detailSubDialogVisible"
                      @handleClose="detailHandleClose"></order-sub-detail>
    <el-dialog title="订单发货"
               append-to-body width="70%" top="0vh" lock-scroll
               class="oms-order-deliver-dialog"
               :visible.sync="deliverDialogVisible" :close-on-click-modal="false"
               @close="deliverHandleClose" :before-close="deliverHandleClose"
    >
      <deliver-order-list :list="deliverList"
                          @submitCancel="getDeliverSubmitCancel"
                          @submitSuccess="getDeliverSubmitSuccess"
                          @handleClose="deliverHandleClose"></deliver-order-list>
      <span slot="footer" class="dialog-footer">
          <el-input
            type="textarea"
            :autosize="{ minRows: 12, maxRows: 12}"
            placeholder="请结合已有订单备注填写发货备注"
            v-model="note" style="margin-bottom: 20px;">
            </el-input>
          <el-button @click="deliverDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="sendLoading" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单标签"
               append-to-body
               :visible.sync="labelDialogVisibles"
               @close="labelHandleClose" :before-close="labelHandleClose"
    >
      <el-form :model="labelOrder"
               label-width="150px">
        <el-form-item label="标签名称：">
          <el-input v-model="labelOrder.label"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="labelHandleClose">取 消</el-button>
        <el-button type="primary" @click="handleUpdateLabel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible" width="30%"
      style="height: 35vh !important; margin-top: 20vh; overflow: hidden;" class="diglogs">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.note">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm" :loading="closeType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialognItialiseVisiblelt" @close="handleCloses" width="70%" title="期货订单变更"
               class="Intialisedialogn" :close-on-click-modal="false" :before-close="handleCloses">
      <div class="view_body" style="width: 100%;height: 100%;">
        <el-card class="box-card" style="width:42%;height: 100%;">
          <div style="font-size: 20px;margin-bottom: 16px;">原订单明细</div>
          <el-table :data="orderItem" border highlight-current-row width="100%"
                    @selection-change="handleSelectionChangeRight">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名称">
            </el-table-column>
            <el-table-column prop="sp1" label="订货号">
            </el-table-column>
            <el-table-column prop="sp2" label="型号">
            </el-table-column>
            <el-table-column prop="productQuantity" label="数量" class-name="col-required" align="right">
            </el-table-column>
          </el-table>
        </el-card>
        <div style="width:12%;" class="xuanzhe">
          <div
            style="font-size:14px;background:red;margin-bottom: 20px;color:white;border-radius: 4px;padding: 0px 6px 0px 2px;display: flex;flex-direction: row;justify-content: center;align-items: center;"
            @click="futuresViewLeft"><i
            class="el-icon-circle-close" style="font-size: 16px;margin: 5px;color:white;"></i>删除已选明细
          </div>
          <div
            style="font-size:14px;background:#46a6ff;margin-bottom: 20px;color:white;border-radius: 4px;padding: 0px 6px 0px 2px;display: flex;flex-direction: row;justify-content: center;align-items: center;"
            @click="futuresViewRight">
            <i class="el-icon-arrow-right" style="font-size: 16px;margin: 5px;color:white;"></i>选入取消明细
          </div>
        </div>
        <el-card class="box-card" style="width: 46%;height: 100%;">
          <div style="font-size: 20px;margin-bottom: 16px;">取消明细</div>
          <el-table :data="orderItemNo" border highlight-current-row width="100%"
                    @selection-change="handleSelectionChangeLeft">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名称">
            </el-table-column>
            <el-table-column prop="sp1" label="订货号" width="100">
            </el-table-column>
            <el-table-column prop="productQuantity" label="原购买数量" align="right">
            </el-table-column>
            <el-table-column prop="productQuantity" align="right" label="现购买数量">
              <template slot-scope="scope">{{scope.row.productQuantity-scope.row.num}}</template>
            </el-table-column>
            <el-table-column prop="cancelQuantity" label="取消数量" width="150" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" size="mini" @change="handleChange" :min="0"
                                 :max="scope.row.productQuantity"></el-input-number>
              </template>

            </el-table-column>
          </el-table>
          <!--<div v-for="(o,index) in orderItem" :key="index" class="text item">-->
          <!--<span>{{o.productName + '-' + o.sp1 + '-' + o.productQuantity}}</span>-->
          <!--</div>-->
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloses">取消</el-button>
        <el-button type="primary" @click="handleItialise" :loading="changeLoading">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请输入延时期限" class="delayedDialog" :visible.sync="delayedDialogVisible" width="30%"
               style="height: 330px !important;overflow: hidden;margin-top: 33vh;">
      <div style="margin-bottom: 20px;">
        <span style="margin-top: 4px;">天数：</span>
        <el-input
          style="width: 140px;"
          type="text"
          placeholder="延时天数" @input="delayedDaysInput($event)"
          v-model="delayedDays">
        </el-input>
        <span v-if="maxDelayedTime!=undefined"
              style="color: rgb(245, 108, 108);">（注：最大天数不能超过{{this.maxDelayedTime}}）</span>
      </div>
      <div>
        <span style="vertical-align: top">原因：</span>
        <el-input
          style="width: 80%"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="delayedReason">
        </el-input>
      </div>
      <div style="color: #F56C6C;margin-top: 10px;">此项操作会生成待办任务，且该任务必须在下午四点前流转结束否则将影响<br/>延时发货！</div>
      <span slot="footer">
        <el-button @click="delayedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="isDelayed" @click="delayedSend" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流信息" width="65%" :visible.sync="isShowDelivery" style="margin-top: 13vh;overflow: hidden" class="order-detail">
      <el-carousel :interval="4000" :autoplay="false" arrow="always" indicator-position="outside">
        <el-carousel-item v-for="(item,index) in futuresLogisticsData" :key="item.id">
          <table :style="`max-height: 204px;width: 37.7vw;margin: 0 auto;overflow-y: ${item.list&&item.list.length>6?'scroll;overflow-x:hidden':'unset'};border-collapse: collapse;`">
            <tr style="background-color: rgb(18,149,235);color: white;">
              <td style="padding: 7px" colspan="3">
                <span>物流单号：{{item.logisticsName}}/{{item.logisticsNo}}</span><span
                style="margin-left: 25px;">发货时间：{{item.updTime}}</span>
                <span style="float: right;cursor: pointer"
                      @click="handleViewDelivery(index,item,'期货')">查看物流信息</span>
              </td>
            </tr>
            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0">
              <td style="padding: 7px;border-right: 1px solid #E4E7ED">
                <span>产品型号</span>
              </td>
              <td style="padding: 7px;border-right: 1px solid #E4E7ED">
                <span>订货号</span>
              </td>
              <td style="padding: 7px;">
                <span>数量</span>
              </td>
            </tr>
            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0"
                v-for="detailExpress in item.list">
              <td style="padding: 7px;border-right: 1px solid #E4E7ED">
                <span>{{detailExpress.productCode}}</span>
              </td>
              <td style="padding: 7px;border-right: 1px solid #E4E7ED">
                <span>{{detailExpress.orderNo}}</span>
              </td>
              <td style="padding: 7px">
                <span>{{detailExpress.quantity}}</span>
              </td>
            </tr>
            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0">
              <td style="padding: 7px;" colspan="3">
                <span>备注：{{item.note}}</span>
              </td>
            </tr>
          </table>
        </el-carousel-item>
      </el-carousel>
      <el-table :data="futuresLogisticsDetail" style="width: 100%;" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="标题" width="160" align="center" v-slot="{row}" show-overflow-tooltip >
          <span>{{row.productBrand}} {{row.productName}}</span>
        </el-table-column>
        <el-table-column label="订货号" width="120" align="center" prop="sp1"></el-table-column>
        <el-table-column label="型号" width="120" align="center" prop="sp2"></el-table-column>
        <el-table-column label="折扣价" width="120" align="center" prop="productPrice"></el-table-column>
        <el-table-column label="购买数量" width="120" align="center" prop="productQuantity"></el-table-column>
        <el-table-column label="已发货数量" align="center" prop="deliverQuantity"></el-table-column>
        <el-table-column label="金额" align="center" prop="commodityPrice" width="120">
          <template slot-scope="scope">
            ￥{{(scope.row.productPrice*scope.row.productQuantity).toFixed(4)}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <logisticsDialog v-if="isTracking" :isTracking="isTracking" @closeTracking="closeTracking" :itemData="itemData"
                     :logisticsData="logisticsData"/>
    <!-- 采购申请变更单详情弹窗 -->
    <orderListView :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                   @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </orderListView>
  </div>
</template>
<script>
  import {
    deleteOrder,
    selectPage,
    auditOrder,
    updateOrderLabel,
    deliverMainOrder,
    deliverSubOrder,
    doEntrustPay,
    checkLogistics,
    upload,
    futuresLogistics,
    auditOrderForce,
    pushOrder,
    closeOrder
  } from '@/api/erp/mall/oms/order/order'
  import {selectPageByItem, selectPageByDetail} from '@/api/erp/mall/oms/order/orderSub'
  import {cancelFutureOrderPart, closeNowOrderSub} from '@/api/erp/mall/oms/order/order'
  import {formatDate} from '@/utils/date'
  import OrderDetail from './orderDetail'
  import orderListView from './orderListView'
  import OrderSubDetail from './orderSubDetail'
  import logisticsDialog from './components/logisticsDialog'
  import DeliverOrderList from './deliverOrderList'
  import {getOrderSubDetail} from '@/api/erp/mall/oms/order/orderSub'
  import {delayedDeliver} from '@/api/erp/mall/oms/order/orderDelayed'
  import {getOrderSetting} from '@/api/erp/mall/oms/order/setting'
  import {pushType,isReview} from '../../../../../dic'

  const defaultListQuery = {
    statusList: null,
    page: 1,
    limit: 10,
    masterOrderSn: null,
    orderSn: null,
    customer: null,
    deliverySn: null,
    status: null,
    startDate: '',
    endDate: '',
    note: '',
    crtUserNo: '',
    deliveryWarehouse: '',
    orderLabel: '',
    memberUsername: '',
    delivery_sn: null,
    deliverBillNo: null
  }
  export default {
    name: 'orderList',
    components: {OrderDetail, OrderSubDetail, DeliverOrderList, logisticsDialog, orderListView},
    data() {
      const validateNote = (rule, value, callback) => {
        if (this.note.length < 1) {
          this.dataForm.verificationCode = ''
          this.refreshCode()
          callback(new Error('备注不能为空'))
        } else {
          callback()
        }
      }
      return {
        orderSn: '',
        pushType,
        isReview,
        noPush:false,
        noClose:false,
        isShowDelivery:false,
        dialogDetailVisible: false,
        closeType: false,
        isTracking: false,
        itemData: undefined,
        logisticsData: undefined,
        maxDelayedTime: undefined,
        delayedReason: undefined,
        isDelayed: false,
        delayedDialogVisible: false,
        changeLoading: false,
        checkList: ['待付款', '部分支付', '待发货', '发货中', '已发货', '已完成'],
        sendLoading: false,
        delivery_sn: undefined,
        orderLists: undefined,
        type: 1,
        delayedDays: '',
        num: 1,
        dialognItialiseVisiblelt: false,
        futuresLogisticsData:[],
        futuresLogisticsDetail:{},
        nowRow:{},
        nowIndex:{},
        note: '',
        colck: null,
        select: 0,
        isFormLoading: false,
        choose: 'first',
        listQuery: Object.assign({}, defaultListQuery),
        billDate: [],
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder: {
          dialogVisible: false,
          note: null,
          orderIds: []
        },
        auditOptions: [
          {
            label: '未审核',
            value: 0
          },
          {
            label: '审核中',
            value: 3
          },
          {
            label: '正常',
            value: 1
          }
        ],
        statusOptions: [
          {
            label: '待付款',
            value: 0
          },
          {
            label: '部分支付',
            value: 7
          },
          {
            label: '待发货',
            value: 1
          }, {
            label: '发货中',
            value: 8
          },
          {
            label: '已发货',
            value: 2
          },
          {
            label: '已完成',
            value: 3
          },
          {
            label: '已关闭',
            value: 4
          },
          {
            label: '无效订单',
            value: 5
          },
          {
            label: '异常订单',
            value: 6
          }
        ],
        orderTypeOptions: [
          {
            label: '正常订单',
            value: 0
          },
          {
            label: '秒杀订单',
            value: 1
          },
          {
            label: '期货订单',
            value: 2
          }
        ],
        sourceTypeOptions: [
          {
            label: 'PC订单',
            value: 0
          },
          {
            label: 'APP订单',
            value: 1
          }
        ],
        // logisticsDialogVisible:false
        id: undefined,
        queryVisible: false,
        detailDialogVisible: false,
        detailSubDialogVisible: false,
        deliverList: [],
        deliverDialogVisible: false,
        auditOrder: {
          auditDialogVisible: false,
          orderIds: [],
          status: null,
          note: null
        },
        labelDialogVisibles: false,
        labelOrder: {
          labelDialogVisible: false,
          orderId: null,
          label: null
        },
        rules: {
          note: [{required: true, trigger: 'blur', validator: validateNote}]
        },
        selectedRows: [],
        downloadLoading: false,
        orderItem: [],
        orderItemNo: [],
        multipleSelections: [],
        multipleSelectionLeft: [],
        orderItemList: undefined,
        selIndex: []
      }
    },
    watch: {
      '$route.query': function (val) {
        if (val && val.checkList) {
          this.checkList = val.checkList
        } else {
          this.checkList = ['待付款', '部分支付', '待发货', '发货中', '已发货', '已完成']
        }
      },
      billDate(val) {
        if (val == null || val.length == 0) {
          this.listQuery.startDate = undefined
          this.listQuery.endDate = undefined
        } else {
          this.listQuery.startDate = val[0] + ' 00:00:00'
          this.listQuery.endDate = val[1] + ' 23:59:59'
        }
        this.handleQuery()
      }
    },
    computed:{
      isForceBy(){
        //scope.row.status != 4&&scope.row.status != 0 &&scope.row.auditStatus == 0
        if(this.multipleSelection.length!==1){
          return true
        }
        return (this.multipleSelection[0]?.auditStatus != 0&&this.multipleSelection[0]?.auditStatus != 3)||this.multipleSelection[0]?.status == 4||this.multipleSelection[0]?.status == 0
      }
    },
    created() {
      var Date1 = new Date();
      var Date7 = new Date(Date1.getTime() - 168 * 60 * 60 * 1000);
      this.listQuery.endDate = Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2, '0') + ' 00:00:00';
      this.listQuery.startDate = Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2, '0') + ' 23:59:59';
      this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2, '0'), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2, '0')]
      let status = []
      if (this.checkList.length == 9) {
        this.listQuery.status = null
      } else {
        for (var i in this.checkList) {
          if (this.checkList[i] === '待付款') {
            status.push(0)
          } else if (this.checkList[i] === '待发货') {
            status.push(1)
          } else if (this.checkList[i] === '部分发货') {
            status.push(11)
          } else if (this.checkList[i] === '已发货') {
            status.push(2)
          } else if (this.checkList[i] === '已完成') {
            status.push(3)
          } else if (this.checkList[i] === '已关闭') {
            status.push(4)
          } else if (this.checkList[i] === '无效订单') {
            status.push(5)
          } else if (this.checkList[i] === '异常订单') {
            status.push(6)
          } else if (this.checkList[i] === '部分支付') {
            status.push(7)
          } else if (this.checkList[i] === '发货中') {
            status.push(8)
          } else {
          }
        }
      }
      this.listQuery.statusList = JSON.stringify(status)
      // this.getList()
      this.handleSwitch()
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value) {
        if (value === 0) {
          return '待付款'
        } else if (value === 1) {
          return '待发货'
        } else if (value === 11) {
          return '部分发货'
        } else if (value === 2) {
          return '已发货'
        } else if (value === 3) {
          return '已完成'
        } else if (value === 4) {
          return '已关闭'
        } else if (value === 5) {
          return '无效订单'
        } else if (value === 6) {
          return '异常订单'
        } else if (value === 7) {
          return '部分支付'
        } else if (value === 8) {
          return '发货中'
        } else {

        }
      },
      formatAuditStatus(value) {
        value=Number(value)
        if (value === 0) {
          return '未审核'
        } else if (value === 1) {
          return '正常'
        } else if (value === 2) {
          return '驳回'
        } else {
          return '审核中'
        }
      }
    },
    methods: {
      tagBtn(item) {
        if (item.auditStatus == 3) {
          this.$message.warning('该订单正在审核中，审核时间为3-6分钟，请耐心等待！')
        } else {
          this.id = item.id;
          this.dialogDetailVisible = true;
        }
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        if (this.choose == 'first') {
          this.getList()
        } else if (this.choose == 'second') {
          this.getListByItem()
        } else {
          this.getListByDetail()
        }
      },
      handleQuery() {
        if (this.choose == 'first') {
          this.getList()
        } else if (this.choose == 'second') {
          this.getListByItem()
        } else {
          this.getListByDetail()
        }
      },
      doEntrustPay(orderSn) {
        this.listLoading = true
        doEntrustPay(orderSn).then(res => {
          if (res.code == '2000') {
            this.vueMessage('success', '委托支付成功!')
            this.getList()
          } else {
            this.vueMessage('warning', res.msg)
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      closeTracking() {
        this.isTracking = false
      },
      handleViewDelivery(index, row,flag) {
        console.log(row,'123',flag)
        if (row.deliveryCompany != '自提'&&flag!=='期货') {
          let sum = {
            receiverCity: row.mainDTO.receiverCity,
            receiverAddress: row.mainDTO.receiverDetailAddress,
            receiverName: row.mainDTO.receiverName,
            receiverPhone: row.mainDTO.receiverPhone,
            receiverProvince: row.mainDTO.receiverProvince,
            receiverRegion: row.mainDTO.receiverRegion,
            orderSubList: [
              {
                deliveryCompany: row.deliveryCompany,
                deliverySn: row.deliverySn
              }
            ]
          }
          this.itemData = sum
          if (row.deliveryCompanyEnglish == undefined && row.deliverySn == undefined) {
            this.vueMessage('warning', '暂无物流信息!')
            return
          }
          checkLogistics(row.deliverySn.indexOf('SF') > -1 ? 1 : 2, row.deliverySn, row.mainDTO.receiverPhone.substr(-4)).then(res => {
            if (res.code === '2000') {
              this.logisticsData = res.data.routeResps[0].routes
              if (res.State == 0) {
                this.vueMessage('warning', '暂无物流信息!')
                return
              }
              this.isTracking = true
            } else {
              this.vueMessage('warning', res.msg)
            }
          })
        }else{
          let sum = {
            receiverCity: row.receiverCity,
            receiverAddress: row.receiverAddress,
            receiverName: row.receiverName,
            receiverPhone: row.receiverPhone,
            receiverProvince: row.receiverProvince,
            receiverRegion: row.receiverRegion,
            orderSubList: [
              {
                deliveryCompany: row.logisticsName,
                deliverySn: row.logisticsNo
              }
            ]
          }
          this.itemData = sum
          if (row.logisticsEnName == undefined && row.logisticsNo == undefined) {
            this.vueMessage('warning', '暂无物流信息!')
            return
          }
          checkLogistics(row.logisticsNo.indexOf('SF') > -1 ? 1 : 2, row.logisticsNo, row.receiverPhone.substr(-4)).then(res => {
          // checkLogistics(2, 'DPK363026908694','0178').then(res => {
            if (res.code === '2000') {
              this.logisticsData = res.data.routeResps[0].routes
              if (res.State == 0) {
                this.vueMessage('warning', '暂无物流信息!')
                return
              }
              this.isTracking = true
            } else {
              this.vueMessage('warning', res.msg)
            }
          })
        }
      },
      delayedDaysInput() {
        if (!isNaN(this.delayedDays)) {
          if (this.maxDelayedTime != undefined) {
            if (this.delayedDays > this.maxDelayedTime) {
              this.delayedDays = ''
            }
          }
        } else {
          this.delayedDays = this.delayedDays.replace(/[^0-9]/g, '')
        }
      },
      delayedSend() {
        if (this.delayedDays == '' || this.delayedDays == undefined) {
          this.vueMessage('warning', '请输入延时天数!')
          return
        }
        if (this.delayedReason == '' || this.delayedReason == undefined) {
          this.vueMessage('warning', '请输入原因!')
          return
        }
        delayedDeliver(this.multipleSelection[0].orderSn, this.delayedDays, this.delayedReason).then(res => {
          if (res.code == '2000' || res.code == 2000) {
            this.vueMessage('success', '延时发货成功!')
          } else {
            this.vueMessage('warning', '延时发货失败!')
          }
          this.handleQuery()
        })
        this.delayedDialogVisible = false
      },
      listBtn() {
        this.getList()
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0]
        this.listQuery.endDate = val[1]
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['totalAmount', 'payAmount', 'couponAmount', 'paymentedAmount', 'unpaidAmount'])
      },
      handleSelectionChangeRight(val) {
        this.multipleSelections = val
      },
      handleSelectionChangeLeft(val) {
        this.multipleSelectionLeft = val
      },
      handleChange(val) {
      },
      dataMap(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.productSkuCode] = item
        })
        return map
      },
      futuresViewRight() {
        if (this.orderItemNo.length > 0) {
          const dataMap = this.dataMap(this.orderItemNo)

          for (let i = 0; i < this.multipleSelections.length; i++) {
            const filter = dataMap[this.multipleSelections[i].productSkuCode]
            // 包含相同数据
            if (!filter) {
              this.orderItemNo.push(this.multipleSelections[i])
            }

          }
        } else {
          var data = JSON.parse(JSON.stringify(this.multipleSelections))
          this.orderItemNo = data
        }
      },
      futuresViewLeft() {
        for (let i = 0; i < this.multipleSelectionLeft.length; i++) {
          for (let j = 0; j < this.orderItemNo.length; j++) {
            if (this.multipleSelectionLeft[i].id == this.orderItemNo[j].id) {
              this.orderItemNo.splice(j, 1)
            }
          }
        }
      },
      handleView(index, row) {
        if (row.orderType == 2) {
          this.dialognItialiseVisiblelt = true
          getOrderSubDetail(row.id).then(response => {
            for (var i in response.data.orderItemList) {
              response.data.orderItemList[i]['num'] = response.data.orderItemList[i].productQuantity
            }
            this.orderItem = response.data.orderItemList
            this.orderItemList = response.data
          })
        } else {
          this.type = 2
          this.orderLists = row
          this.closeOrder.dialogVisible = true
        }
      },
      handleCloses() {
        this.dialognItialiseVisiblelt = false
        this.orderItem = []
        this.orderItemNo = []
      },
      handleItialise() {
        if (this.orderItemNo.length < 1) {
          this.vueMessage('warning', '请选择你要变更的商品信息!')
        } else {
          var list = []
          for (var i in this.orderItemNo) {
            if (this.orderItemNo[i].num < 1) {
              this.vueMessage('warning', '取消数量必须大于0!')
              return
            }
            var obj = {
              masterOrderSn: this.orderItemNo[i].masterOrderSn,
              orderSn: this.orderItemNo[i].orderSn,
              productSkuCode: this.orderItemNo[i].productSkuCode,
              productQuantity: this.orderItemNo[i].productQuantity - this.orderItemNo[i].num,
              cancelQuantity: this.orderItemNo[i].num,
              productPrice: this.orderItemNo[i].productPrice
            }
            list.push(obj)
          }
          this.changeLoading = true
          cancelFutureOrderPart(list).then(res => {
            if (res.code == '200' || res.code == '2000') {
              this.vueMessage('success', '变更成功！')
            } else {
              this.vueMessage('warning', res.msg)
            }
            this.dialognItialiseVisiblelt = false
            this.changeLoading = false
          })
        }
        this.colck = setTimeout(() => {
          this.handleQuery()
        }, 500)
      },
      renovateClick() {
        this.colck = setTimeout(() => {
          this.handleQuery()
        }, 500)
        this.colck = null
        window.clearTimeout(this.colck)
      },
      handleRowClick(row, event, column) {
        this.$refs.orderTableMain.toggleRowSelection(row)
      },
      confirm() {
        this.$confirm('是否要进行发货操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getDeliverSubmitSuccess(true)
        }).catch(() => {
          this.getDeliverSubmitCancel(true)
        })
      },
      restClick() {
        this.checkList = ['待付款', '部分支付', '待发货', '发货中', '已发货', '已完成']
        this.listQuery = {
          page: 1,
          limit: 10,
          status: null,
          masterOrderSn: null,
          orderSn: null,
          customer: null,
          customerName: null,
          deliverySn: null,
          crtUserNo: null,
          note: null,
          startDate: null,
          endDate: null,
          deliveryWarehouse: null,
          deliverBillNo: null,
          statusList: this.listQuery.statusList
        }
        this.handleQuery()
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function () {
          _this.changeDivHeight()
        }, 1)
      },
      handleChangeFun(val) {
        this.selectedRows = val
      },
      handleSwitch() {
        // this.select = 0;
        // this.listQuery.masterOrderSn = undefined
        // this.listQuery.orderSn = undefined
        // this.multipleSelection = [];
        this.selIndex = []
        this.list=[]
        this.listQuery.page = 1
        this.handleQuery()
      },
      getListByDetail() {
        this.listLoading = true
        selectPageByDetail(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleSearchList() {
        let status = []
        for (var i in this.checkList) {
          if (this.checkList[i] === '待付款') {
            status.push(0)
          } else if (this.checkList[i] === '待发货') {
            status.push(1)
          } else if (this.checkList[i] === '部分发货') {
            status.push(11)
          } else if (this.checkList[i] === '已发货') {
            status.push(2)
          } else if (this.checkList[i] === '已完成') {
            status.push(3)
          } else if (this.checkList[i] === '已关闭') {
            status.push(4)
          } else if (this.checkList[i] === '无效订单') {
            status.push(5)
          } else if (this.checkList[i] === '异常订单') {
            status.push(6)
          } else if (this.checkList[i] === '部分支付') {
            status.push(7)
          } else if (this.checkList[i] === '发货中') {
            status.push(8)
          } else {

          }
        }
        this.listQuery.statusList = JSON.stringify(status)
        this.listQuery.page = 1
        if (this.listQuery.startDate != '' && this.listQuery.startDate != undefined && this.listQuery.startDate.indexOf('00:00:00') < 0) {
          this.listQuery.startDate = this.listQuery.startDate + ' 00:00:00'
        }
        if (this.listQuery.endDate != '' && this.listQuery.endDate != undefined && this.listQuery.endDate.indexOf('23:59:59') < 0) {
          this.listQuery.endDate = this.listQuery.endDate + ' 23:59:59'
        }
        this.handleQuery()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.noPush=false
        this.noClose=false
        if(val.length>1){
          this.noClose=true
        }
        if(Number(val[0]?.auditStatus)!==0){
          this.noClose=true
        }
        if(this.choose==='first'){
          for (let i = 0; i <val.length ; i++) {
            if(val[i].isReview!==1||val[i].pushType===1||Number(val[i].auditStatus)===0){
              this.noPush=true
              break
            }
          }
        }
        if (this.choose != 'third') {
          let ids = val.map((item) => {
            return item.orderSn
          })
          let arr = []
          this.list.map((item, index) => {
            for (let i in ids) {
              if (item.orderSn === ids[i]) {
                arr.push(index)
              }
            }
          })
          this.selIndex = arr
        }

      },
      handleTableRowStyle({row, rowIndex}) {
        if (row.orderType == 2) {
          return {
            'background-color': '#DFF0D8'
          }
        }
        if (row.cost < 0) {
          return {
            'background-color': 'rgb(228,177,241)'
          }
        }
        let arr = this.selIndex || []
        if (this.selIndex.includes(rowIndex)) {
          return {
            'background-color': 'rgb(232,244,255)'
          }
        }
      },
      handleViewOrder(index, row) {
        if (this.choose == 'first') {
          this.id = row.id
        } else {
          this.id = row.mainDTO.id
        }

        this.detailDialogVisible = true
        // this.$router.push({path:'/oms/orderDetail',query:{id:row.id}})
      },
      handleViewOrderSub(index, row) {
        this.id = row.orderId ? row.orderId : row.id
        this.detailSubDialogVisible = true
      },
      handleUpdateAuditStatusOrder(status, row) {
        this.auditOrder.orderId = [row.id]
        let params = new URLSearchParams();
        params.append("orderIds", this.auditOrder.orderId);
        params.append("status", status);
        this.isFormLoading = true;
        if (status === 1) {
          this.listLoading = true
          auditOrder(params).then(response => {
            this.getList()
            this.$message({
              message: '审核成功，待审核结束即可发货！',
              type: 'success',
              duration: 1000
            });
            this.auditOrder.auditDialogVisible = false;
            this.listLoading = false;
            this.isFormLoading = false;
          }).catch(() => {
            this.listLoading = false;
            this.isFormLoading = false;
          });
        } else {
          this.$prompt('请输入驳回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: (value) => {
              if (value === '' || value === null) {
                return '请输入驳回原因'
              } else {
                if (value.length < 200) {
                  return null
                } else {
                  return '驳回原因长度在200字符以内'
                }
              }
            }
          }).then(({value}) => {
            params.append('note', value)
            this.listLoading = true
            auditOrder(params).then(response => {
              this.getList()
              this.$message({
                message: '审核成功，待审核结束即可发货！',
                type: 'success',
                duration: 1000
              })
              this.auditOrder.auditDialogVisible = false
              this.listLoading = false
            })
          }).catch(() => {
            this.listLoading = false
          })
        }
      },
      handleCloseOrder(index, row) {
        this.closeOrder.dialogVisible = true
        this.closeOrder.orderIds = [row.id]
      },
      handleDeliveryOrder(index, row) {
        // let listItem = this.covertOrder(row);
        // this.$router.push({path:'/oms/deliverOrderList',query:{list:[listItem]}})
        this.deliverList = [this.covertOrder(row)]
        this.deliverDialogVisible = true
      },
      // handleViewLogistics(index, row){
      //   this.logisticsDialogVisible=true;
      // },
      handleDeleteOrder(index, row) {
        let ids = []
        ids.push(row.id)
        this.deleteOrder(ids)

      },
      handleSelect() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          })
          return
        } else {
          let obj = []
          let ids = []
          //验证订单是否为期货订单
          let orderFlag = true
          //验证订单状态
          let isVerify = true
          //验证审核状态
          let ziFlag = true
          this.multipleSelection.map((item, index) => {
            obj.push(item.orderSn)
            ids.push(item.id)
            if (item.orderType == 2) {
              orderFlag = false
            }
            if (item.status !== 1 && item.status !== 7) {
              isVerify = false
            }
            if (this.choose == 'second') {
              if (item.mainDTO.auditStatus !== 1) {
                ziFlag = false
              }
            } else {
              if (item.auditStatus !== 1) {
                ziFlag = false
              }
            }
          })
          var text = '该订单状态不能发货'

          if (this.multipleSelection.length == 1) {
            if (this.multipleSelection[0].sendType != '0') {
              text = '整单发货请前往销售出库手动发货!'
            } else if (this.multipleSelection[0].status === 0) {
              text = '该订单状态待付款,不能发货!'
            } else if (this.multipleSelection[0].status === 11) {
              return '该订单状态部分发货'
            } else if (this.multipleSelection[0].status === 2) {
              text = '该订单已发货!'
            } else if (this.multipleSelection[0].status === 3) {
              text = '该订单已完成!'
            } else if (this.multipleSelection[0].status === 4) {
              text = '该订单已关闭!'
            } else if (this.multipleSelection[0].status === 5) {
              text = '该订单为无效订单!'
            } else if (this.multipleSelection[0].status === 6) {
              text = '该订单为异常订单!'
            } else if (this.multipleSelection[0].status === 8) {
              text = '该订单发货中!'
            }
          }
          if (this.choose == 'second') {
            if (!orderFlag) {
              this.vueMessage('warning', '期货订单不能发货!')
              return
            }
            if (!ziFlag || !isVerify) {
              this.vueMessage('warning', text)
              return
            }
          } else {
            if (!isVerify || !ziFlag) {
              this.vueMessage('warning', text)
              return
            }
          }
          this.note = ''
          let sum = 0
          var isFreight = false
          var isSelf = false
          this.deliverList = this.multipleSelection
          let salesmanList = ''
          let salesman = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.choose == 'second') {
              if (this.multipleSelection.length == 1) {
                if (this.multipleSelection[i].mainDTO.isReplaceDelivery == 0) {
                  // +'【'+ this.multipleSelection[i].note+'】'
                  salesman.push('【' + this.multipleSelection[i].crtUserNo + '/' + this.multipleSelection[i].salesmanName + '】')
                }
              } else {
                if (this.multipleSelection[i].mainDTO.isReplaceDelivery == 0) {
                  salesman.push('【' + this.multipleSelection[i].crtUserNo + '/' + this.multipleSelection[i].salesmanName + '】')
                }
              }
            } else {
              if (this.multipleSelection[i].isReplaceDelivery == 0) {
                salesman.push('【' + this.multipleSelection[i].crtUserNo + '/' + this.multipleSelection[i].salesmanName + '】')
              }
            }
          }
          let newarr = [...new Set(salesman)]
          for (let i = 0; i < newarr.length; i++) {
            salesmanList = salesmanList + newarr[i]
          }
          //  = salesmanList + '【' + this.multipleSelection[i].crtUserNo + '/' + this.multipleSelection[i].salesmanName + '】';
          this.note = salesmanList
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].distributionMode === 1) {
              sum = 1
            }
            if (this.multipleSelection[i].distributionMode === 2) {
              sum = 2
            }
          }
          if (sum > 0) {
            if (sum === 1) {
              if (this.multipleSelection.length == 1) {
                this.note = this.note + '【此单运费到付】'
              }
            } else {
              if (this.multipleSelection.length == 1) {
                this.note = this.note + '【此单货物自提】'
              }
            }
          }

          let count = 0
          let deliverListnote = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].note) {
              count = 1
              deliverListnote.push(this.multipleSelection[i].note)
            }
          }
          if (this.multipleSelection.length == 1) {
            if (count == 1) {
              this.note = this.note + '(客户备注:' + String(this.hovercUnique(deliverListnote)) + ')'
            }
          }

          this.deliverDialogVisible = true
        }
      },
      hovercUnique(arr) {
        var result = [], hash = {}
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
          if (!hash[elem]) {
            result.push(elem)
            hash[elem] = true
          }
        }
        return result
      },
      handleClose() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          })
          return false
        }
        this.$confirm('是否要进行关闭操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          closeOrder({orderId:this.multipleSelection[0].id}).then(res=>{
            if(Number(res.code)===2000||Number(res.code)===2000){
              this.$message.success('关闭订单成功!')
              this.handleSwitch()
            }else{
              this.$message.error('关闭订单失败!')
            }
          })
        })
      },
      handleDelayed() {
        if (this.multipleSelection.length == 1) {
          if (this.choose == 'second') {
            if (this.multipleSelection[0].status == 1 && this.multipleSelection[0].mainDTO.auditStatus == 1 && this.multipleSelection[0].orderType == 0) {
              this.delayedDialogVisible = true
              this.delayedReason = undefined
              this.delayedDays = undefined
              getOrderSetting(1).then(res => {
                if (res.code == '2000' || res.code == 2000) {
                  this.maxDelayedTime = res.data.maxDelayedTime
                }
              })
            } else {
              this.vueMessage('warning', '请选择已审核并且状态为待发货且订单类型为正常订单类型的订单!')
            }
          } else {
            if (this.multipleSelection[0].status == 1 && this.multipleSelection[0].auditStatus == 1 && this.multipleSelection[0].orderType == 0) {
              this.delayedDialogVisible = true
              this.delayedReason = undefined
              this.delayedDays = undefined
              getOrderSetting(1).then(res => {
                if (res.code == '2000' || res.code == 2000) {
                  this.maxDelayedTime = res.data.maxDelayedTime
                }
              })
            } else {
              this.vueMessage('warning', '请选择已审核并且状态为待发货且订单类型为正常订单类型的订单!')
            }
          }

        } else {
          this.vueMessage('warning', '只能对单个订单操作!')
        }
      },
      handleBatchOperate(val) {
        this.select = val
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          })
          return
        }
        if (this.select > 0 && this.select < 4) {
          let obj = []
          let ids = []
          let fyFlag = false
          if (this.multipleSelection.length > 0) {
            this.multipleSelection.map((item, index) => {
              obj.push(item.orderSn)
              ids.push(item.id)
              if (item.status !== 0 && item.status !== 4) {
                fyFlag = true
              }
            })
            if (this.select === 3) {
              if (fyFlag) {
                this.vueMessage('warning', '请选择为关闭或者待付款状态并且已审核状态的订单!')
                return
              } else {
                this.deleteOrder(ids)
              }

            }
          }
        }
      },
      handleSizeChange(val) {
        this.listQuery.page = 1
        this.listQuery.limit = val
        this.handleQuery()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.handleQuery()
      },
      handleCloseOrderConfirm() {
        if (this.closeOrder.note == null || this.closeOrder.note === '') {
          this.$message({
            message: '操作备注不能为空',
            type: 'warning',
            duration: 1000
          })
          return
        }
        if (this.type == 1) {
          let params = new URLSearchParams()
          params.append('orderId', this.closeOrder.orderIds)
          params.append('note', this.closeOrder.note)
          this.closeType = true
          closeOrderFull(params).then(response => {
            this.closeOrder.orderIds = []
            this.closeOrder.note = ''
            this.closeOrder.dialogVisible = false
            this.closeType = false
            this.colck = setTimeout(() => {
              this.handleQuery()
            }, 500)
            this.colck = null
            window.clearTimeout(this.colck)
            if (response.code == '2000' || response.code == '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'warning',
                duration: 1000
              })
            }
          })
        } else {
          let params = new URLSearchParams()
          params.append('orderSubId', this.orderLists.id)
          params.append('note', this.closeOrder.note)
          this.closeType = true
          closeNowOrderSub(params).then(response => {
            this.closeOrder.orderIds = []
            this.closeOrder.note = ''
            this.closeOrder.dialogVisible = false
            this.closeType = false
            this.colck = setTimeout(() => {
              this.handleQuery()
            }, 500)
            this.colck = null
            window.clearTimeout(this.colck)
            if (response.code == '2000' || response.code == '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'warning',
                duration: 1000
              })
            }
          })
        }
      },
      getList() {
        this.listLoading = true
        selectPage(this.listQuery).then(response => {
          for (let i = 0; i < response.data.records.length; i++) {
            response.data.records[i].unpaidAmount = (response.data.records[i].totalAmount - response.data.records[i].paymentedAmount).toFixed(4)
          }
          this.list = response.data.records
          this.total = response.data.total

          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByItem() {
        this.listLoading = true
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      deleteOrder(ids) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('ids', ids)
          deleteOrder(params).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            })
            this.colck = setTimeout(() => {
              this.getList()
            }, 500)
            this.colck = null
            window.clearTimeout(this.colck)
          })
        })
      },
      covertOrder(order) {
        let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress
        let listItem = {
          orderId: order.id,
          orderSn: order.orderSn,
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverPostCode: order.receiverPostCode,
          address: address,
          deliveryCompany: null,
          deliverySn: null
        }
        return listItem
      },
      getDeliverSubmitCancel(val) {
        if (val) {
          this.deliverDialogVisible = false
          this.deliverList = []
        }
      },
      getDeliverSubmitSuccess(val) {
        this.sendLoading = true
        let obj = []
        this.multipleSelection.map((item, index) => {
          obj.push(item.orderSn)
        })

        if (this.choose == 'second') {
          deliverSubOrder(obj, this.note).then(res => {
            if (res.code === '2000') {
              this.vueMessage('success', '批量发货成功!')
              this.multipleSelection = []
              this.deliverDialogVisible = false
              this.colck = setTimeout(() => {
                this.handleQuery()
              }, 500)
              this.colck = null
              window.clearTimeout(this.colck)

            } else {
              this.vueMessage('warning', res.msg)
            }
            this.sendLoading = false
            this.note = undefined
          })
        } else if (this.choose == 'first') {
          deliverMainOrder(obj, this.note).then(res => {
            if (res.code === '2000') {
              this.vueMessage('success', '批量发货成功!')
              this.multipleSelection = []
              this.deliverDialogVisible = false
              this.colck = setTimeout(() => {
                this.handleQuery()
              }, 500)
              this.colck = null
              window.clearTimeout(this.colck)
            } else {
              this.vueMessage('warning', res.msg)
            }
            this.sendLoading = false
            this.note = undefined
          })
        }

      },
      detailHandleClose(val) {
        this.detailDialogVisible = val
        this.detailSubDialogVisible = val
      },
      deliverHandleClose() {
        this.deliverDialogVisible = false
      },
      showLabelDialog(row) {
        this.labelOrder = {
          orderId: row.id,
          label: row.orderLabel
        }
        this.labelDialogVisibles = true
        this.labelOrder.labelDialogVisible = true
      },
      labelHandleClose() {
        this.$nextTick(() => {
          this.labelOrder.labelDialogVisible = false
          this.labelDialogVisibles = false
          this.vueSet(this.labelOrder, 'labelDialogVisible', false)
        })
      },
      handleUpdateLabel() {
        this.$confirm('是否要修改标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('orderId', this.labelOrder.orderId)
          params.append('label', this.labelOrder.label)
          updateOrderLabel(params).then(response => {
            this.labelOrder.labelDialogVisible = false
            this.labelDialogVisibles = false
            this.$message({
              type: 'success',
              message: '标签修改成功!'
            })
            this.getList()
          })
        })
      },
      handleDownload() {
        this.list = this.list == undefined || this.list == null ? [] : this.list
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单标签', '审核', '订单状态', '客户编号', '订单编号', '发货方式', '订单金额', '优惠金额', '支付金额', '未支付金额', '客服', '提交时间', '买家留言']
          const filterVal = ['orderLabel', 'auditStatus', 'status', 'masterOrderSn', 'orderSn', 'sendType', 'totalAmount', 'discountAmount', 'paymentedAmount', 'unpaymentedAmount','salesmanName', 'createTime', 'note']

          const _this = this

          const list = Object.assign([], this.multipleSelection.length > 0 ? this.multipleSelection : this.list)
          const data = JSON.parse(JSON.stringify(list))
          data.forEach(function (item) {
            item.auditStatus = _this.$options.filters.formatAuditStatus(item.auditStatus)
            item.status = _this.$options.filters.formatStatus(item.status)
            item.sendType = item.sendType === 0 ? '现货先发' : '整单发货'

            item.unpaymentedAmount = '￥' + (item.totalAmount - item.paymentedAmount)

            item.totalAmount = '￥' + item.totalAmount
            item.discountAmount = '￥' + item.discountAmount
            item.paymentedAmount = '￥' + item.paymentedAmount
            item.replaceDelivery = item.replaceDelivery === 0 ? '否' : '是'
          })
          excel.export_json_to_excel2(tHeader, data, filterVal, '订单明细')
          this.downloadLoading = false
        })
      },

      /**
       * 合同上传
       * @param file
       * @returns {boolean|boolean}
       */
      beforeAvatarUpload(file) {
        const isPDF = file.type === 'application/pdf';

        if (!isPDF) {
          this.$message.error('上传合同只能是 PDF 格式!');
        }
        return isPDF;
      },

     /**
      * 合同上传成功后保存合同地址
      */
      handleSuccess(response) {
        let params = {
          id: this.multipleSelection[0].id,
          orderSn: this.multipleSelection[0].orderSn,
          tenantId: this.multipleSelection[0].tenantId,
          contract: response.data.url
        }
        upload(params).then(res => {
          if (Number(res.code) === 2000 || Number(res.code) === 200) {
            this.$message.success('合同上传成功!')
            this.handleSearchList()
          } else {
            this.$message.error('合同上传失败,请检查网络环境!')
          }
        }, error => this.$message.error('合同上传失败,请检查网络环境!'))
      },

      handleError(error) {
        this.$message.error('合同上传失败,请检查网络环境!')
      },

      /**
       * 下载合同
       */
      downloadContract() {
        if (this.multipleSelection[0].contract && this.multipleSelection[0].contract !== '') {
          window.open(this.multipleSelection[0].contract)
        } else {
          window.open('/api/mini/order/download?id=' + this.multipleSelection[0].id)
        }
      },

      showDelivery(row) {
        this.isShowDelivery=true
        futuresLogistics(row.orderSn).then(res=>{
          if (Number(res.code) === 2000 || Number(res.code) === 200) {
            this.futuresLogisticsData=res.data
          } else {
            this.$message.error('查询物流信息失败,请检查网络环境!')
          }
        })
        getOrderSubDetail(row.id).then(response => {
          this.futuresLogisticsDetail = response.data.orderItemList
        })

      },

      /**
       * 强制审核
       */
      forceBy(){
        this.$confirm('是否要强制审核此单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //console.log(this.multipleSelection[0],'test')
          auditOrderForce(this.multipleSelection[0].id).then(res=>{
            if(Number(res.code)===2000||Number(res.code)===200){
              this.$message.success('强制审核成功!')
            }else{
              this.$message.error('强制审核失败!'+res.msg)
            }
          })
        })
      },

      handlePush(){
        let orderIds=[]
        for (let i = 0; i <this.multipleSelection.length ; i++) {
          orderIds.push(this.multipleSelection[i].id)
        }
        let params = new URLSearchParams()
        params.append('orderIds', orderIds)
        // params.append('note', this.closeOrder.note)
        pushOrder(params).then(res=>{
          if(Number(res.code)===2000||Number(res.code)===2000){
            this.$message.success('推送订单成功!')
            this.getList()
          }else {
            this.$message.success('推送订单失败!')
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-width {
    width: 200px;
  }

  .filter-container, .operate-container, .table-container, .batch-operate-container {
    margin-top: 20px;
  }

</style>

<style rel="stylesheet/scss" lang="scss">
  .colum-orderSn {
    color: #0078D7;
  }

  .lightBlue {
    background: rgba(64, 158, 255, .6);
  }

  .Blue {
    background: rgba(64, 158, 255, 1);
  }

  .gray {
    background: rgba(144, 147, 153, 0.6);
  }

  .lineGreen {
    background: rgba(103, 194, 58, 0.4);
  }

  .linesGreen {
    background: rgba(103, 194, 58, 0.6);
  }

  .Green {
    background: rgba(103, 194, 58, 1);
  }

  .red {
    background: #f56c6c;
  }

  .orderStaus {
    display: inline-block;
    height: 20px;
    padding: 0 5px;
    line-height: 20px;
    border-radius: 4px;
    color: white;
  }

  .diglogs {
    .el-dialog {
      height: 34vh !important;
    }

    .el-dialog__body {
      height: 26vh !important;
      overflow: auto;
    }
  }

  .oms-order-details-dialog, .oms-order-deliver-dialog {
    /*.el-dialog {
      height: 100vh;
    }*/
    /*.el-dialog__body {
      height: 85vh;
      overflow-y: auto;
    }*/

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__body {
      padding: 10px 20px 20px 20px !important;
      height: 86vh;
      overflow: auto;
    }

    .el-dialog__footer {
      position: absolute;
      background-color: #fff;
      z-index: 999;
      width: 100%;
      bottom: 0px;
      border-top: 1px solid #dcdfe6;
    }
  }

  .order-label {
    width: 100%;
    height: 30px;
  }

  .selectActive {
    color: #409EFF !important;
    opacity: 1;
  }

  .select {
    color: #409EFF !important;
    opacity: 1;
  }

  .view_body {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .el-card {
      overflow: auto;
    }

    .xuanzhe {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .checkbox-select {
    margin-right: 10px;
  }
</style>
<style lang="scss">
  .delayedDialog {
    .el-dialog {
      height: 330px !important;

      .el-dialog__body {
        height: auto !important;
        overflow: auto;
      }
    }
  }

  .orderIndex {
    .el-select {
      margin-bottom: 1px;
    }

    .tabelCell {
      // background-color: blue;
    }
  }
  .orderDetail {
    display: inline-block;
    width: 22%;
    border-right: 1px dashed #eee;
    margin-left: 2%;
  }

  .orderDetail h4 {
    font-weight: normal;
    color: #aaa;
  }
  .order-detail .el-carousel__container {
    min-height: 306px !important;
    /*margin-top: 3vh!important;*/
  }
  .order-detail .el-carousel__item{
    height: 65%;
  }
  .order-detail .el-dialog__body{
    height: auto;
  }
  .order-detail .el-dialog{
    height: auto;
  }
</style>
