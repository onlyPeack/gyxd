<template> 
  <div class="detail-container">
    <el-dialog title="订单详情"
               append-to-body width="70%" top="0vh" lock-scroll
               class="oms-order-details-dialog"
               :visible.sync="visible" :close-on-click-modal="false"
               @close="detailHandleClose" @renovateClick="renovateClick" :before-close="detailHandleClose">
      <div>
        <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
          <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
          <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
          <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
          <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
          <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
        </el-steps>
      </div>
      <el-card shadow="never" style="margin-top: 15px">
        <div class="operate-container">
          <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
          <span class="color-danger">当前订单状态：{{order.status | formatStatus}}</span>

          <div class="operate-button-container" v-show="order.status===0">
            <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
            <!--<el-button size="mini">修改商品信息</el-button>-->
            <!--<el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>-->
            <!--          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>-->
            <!-- <el-button size="mini" @click="showCloseOrderDialog" v-if="isClose">关闭订单</el-button> -->
            <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
          </div>
          <div class="operate-button-container" v-show="order.status===1||order.status===7">
            <el-button size="mini" @click="showUpdateReceiverDialog" v-show="order.status===1">修改收货人信息</el-button>
            <!--          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>-->
            <el-button size="mini" @click="showCloseOrderDialog" v-show="(order.status===1||order.status===7)&&isClose">
              关闭订单
            </el-button>
            <el-button size="mini" @click="showMarkOrderDialog" v-show="order.status===1">备注订单</el-button>
          </div>
          <div class="operate-button-container" v-show="order.status===2||order.status===3">
            <!--          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>-->
            <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
          </div>
          <div class="operate-button-container" v-show="order.status===4">
            <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
            <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
          </div>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">基本信息</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="6" class="table-cell-title">订单编号</el-col>
            <el-col :span="6" class="table-cell-title">用户账号</el-col>
            <el-col :span="4" class="table-cell-title">支付方式</el-col>
            <el-col :span="4" class="table-cell-title">订单来源</el-col>
            <el-col :span="4" class="table-cell-title">订单类型</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.orderSn}}</el-col>
            <el-col :span="6" class="table-cell">{{order.memberUsername}}</el-col>
            <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
            <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
            <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">收货人信息1</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="6" class="table-cell-title">收货人</el-col>
            <el-col :span="6" class="table-cell-title">手机号码</el-col>
            <el-col :span="6" class="table-cell-title">邮政编码</el-col>
            <el-col :span="6" class="table-cell-title">收货地址</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.receiverName}}</el-col>
            <el-col :span="6" class="table-cell">{{order.receiverPhone}}</el-col>
            <el-col :span="6" class="table-cell">{{order.receiverPostCode}}</el-col>
            <el-col :span="6" class="table-cell">{{order | formatAddress}}</el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">子订单信息</span>
        </div>
        <div class="table-layout" v-for="orderSub in order.orderSubList" v-if="order.orderSubList">
          <el-row>
            <el-col :span="5" class="table-cell-title">订单编号</el-col>
            <el-col :span="5" class="table-cell-title">订单金额</el-col>
            <el-col :span="5" class="table-cell-title">发货仓库</el-col>
            <el-col :span="5" class="table-cell-title">物流公司</el-col>
            <el-col :span="4" class="table-cell-title">物流单号</el-col>
          </el-row>
          <el-row>
            <el-col :span="5" class="table-cell">{{orderSub.orderSn}}</el-col>
            <el-col :span="5" class="table-cell">{{orderSub.totalAmount.toFixed(2)}}</el-col>
            <el-col :span="5" class="table-cell">{{orderSub.deliveryWarehouse}}</el-col>
            <el-col :span="5" class="table-cell">{{orderSub.deliveryCompany}}</el-col>
            <el-col :span="4" class="table-cell">{{orderSub.deliverySn}}</el-col>
          </el-row>

          <el-table ref="orderItemTable" :data="orderSub.omsOrderItemList"
                    style="width: 100%;margin-top: 20px" border v-if="orderSub.omsOrderItemList">
            <el-table-column label="商品图片" width="120" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.productPic" style="height: 80px">
              </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.productName}}</p>
                <p>品牌：{{scope.row.productBrand}}</p>
              </template>
            </el-table-column>
            <el-table-column label="订货号/型号" width="280" align="center">
              <template slot-scope="scope">
                <p>订货号：{{scope.row.sp1}}</p>
                <p>型号：{{scope.row.sp2}}</p>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="200" align="center">
              <template slot-scope="scope">
                ￥{{scope.row.productPrice.toFixed(2)}}
              </template>
            </el-table-column>
            <!--<el-table-column label="属性" width="120" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--{{scope.row.productAttr | formatProductAttr}}-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="数量" width="120" align="center">
              <template slot-scope="scope">
                {{scope.row.productQuantity}}
              </template>
            </el-table-column>
            <el-table-column label="小计" width="120" align="center">
              <template slot-scope="scope">
                ￥{{(scope.row.productPrice*scope.row.productQuantity).toFixed(2)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="float: right;margin: 20px">
          合计：<span class="color-danger" v-if="order.totalAmount">￥{{order.totalAmount.toFixed(2)}}</span>
        </div>
        <div style="margin-top: 60px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">费用信息</span>
        </div>
        <div class="table-layout" v-if="order">
          <el-row>
            <el-col :span="6" class="table-cell-title">商品合计</el-col>
            <el-col :span="6" class="table-cell-title">运费</el-col>
            <el-col :span="6" class="table-cell-title">订单总金额</el-col>
            <el-col :span="6" class="table-cell-title">应付款金额</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">
              <span v-if="order.totalAmount">
                ￥{{(order.distributionMode===1?order.totalAmount:order.totalAmount-order.freightAmount).toFixed(2)}}
              </span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span>￥{{order.freightAmount.toFixed(2)}}</span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span class="color-danger" v-if="order.totalAmount">￥{{(order.totalAmount).toFixed(2)}}</span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span class="color-danger" v-if="order.totalAmount">￥{{(order.totalAmount).toFixed(2)}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell-title">活动优惠</el-col>
            <el-col :span="6" class="table-cell-title">折扣金额</el-col>
            <el-col :span="6" class="table-cell-title">优惠券</el-col>
            <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">
              <span v-if="order.promotionAmount">-￥{{order.promotionAmount.toFixed(2)}}</span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span v-if="order.couponAmount">-￥{{order.couponAmount.toFixed(2)}}</span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span v-if="order.couponAmount">-￥{{order.couponAmount.toFixed(2)}}</span>
            </el-col>
            <el-col :span="6" class="table-cell">
              <span v-if="order.integrationAmount">-￥{{order.integrationAmount.toFixed(2)}}</span>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">支付信息</span>
        </div>
        <el-table style="margin-top: 20px;width: 100%"
                  ref="orderPaymentTable"
                  :data="order.paymentList" border v-if="order.paymentList">
          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              {{scope.row.channel | formatChannel}}
            </template>
          </el-table-column>
          <el-table-column label="支付金额" align="center">
            <template slot-scope="scope">
              ￥{{scope.row.amount.toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column label="支付时间" align="center">
            <template slot-scope="scope">
              {{scope.row.paymentTime}}
            </template>
          </el-table-column>
          <el-table-column label="交易号" align="center">
            <template slot-scope="scope">
              {{scope.row.tradingFlow}}
            </template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              {{scope.row.accountCode}}
            </template>
          </el-table-column>
        </el-table>

        <!--<div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">订单标签</span>
          <el-button type="primary" icon="el-icon-edit" @click="showLabelDialog"></el-button>
        </div>
        <div style="margin-top: 20px;width: 100%;border: 1px solid #EBEEF5; min-height: 50px;">
          <el-tag v-for="label in labelList" :key="label" style="margin: 5px;">
            {{label}}
          </el-tag>
        </div>-->

        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">操作信息</span>
        </div>
        <el-table style="margin-top: 20px;width: 100%"
                  ref="orderHistoryTable"
                  :data="order.historyList" border>
          <el-table-column label="操作者" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.operateMan}}
            </template>
          </el-table-column>
          <el-table-column label="操作时间" width="160" align="center">
            <template slot-scope="scope">
              {{formatTime(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.orderStatus | formatStatus}}
            </template>
          </el-table-column>
          <el-table-column label="付款状态" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.orderStatus | formatPayStatus}}
            </template>
          </el-table-column>
          <el-table-column label="发货状态" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.orderStatus | formatDeliverStatus}}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              {{scope.row.note}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailHandleClose">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改收货人信息" append-to-body
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <el-cascader
            :options="options"
            v-model="receiverInfo.regionCodes"
            style="width: 100%"
            placeholder="请选择所在区域"
            @change="handleChange"/>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息" append-to-body
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">
            <span v-if="order.totalAmount">￥{{order.totalAmount.toFixed(2)}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount.toFixed(2)" size="mini">
              <template slot="prepend">￥</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span v-if="order.couponAmount">-￥{{order.couponAmount.toFixed(2)}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span v-if="order.integrationAmount">-￥{{order.integrationAmount.toFixed(2)}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">
            <span v-if="order.promotionAmount">-￥{{order.promotionAmount.toFixed(2)}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.couponAmount.toFixed(2)" size="mini">
              <template slot="prepend">-￥</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger" v-if="order.totalAmount">￥{{order.totalAmount.toFixed(2)}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount-moneyInfo.couponAmount.toFixed(2)}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送站内信" append-to-body
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单" append-to-body
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单" append-to-body
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改订单标签" append-to-body
               :visible.sync="labelDialogVisible"
               width="40%">

      <el-tag v-for="(label, index) in labelList" :key="label" style="margin: 5px;"
              closable @close="handleLabelClose(index)">
        {{label}}
      </el-tag>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleAddLabel">新 增</el-button>
        <el-button @click="labelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateLabel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getOrderDetail,
    updateReceiverInfo,
    updateMoneyInfo,
    closeOrder,
    updateOrderNote,
    deleteOrder,
    closeOrderFull,
    updateOrderLabel
  } from '@/api/erp/mall/oms/order/order';
  import {formatDate} from '@/utils/date';
  import {regionData, CodeToText, TextToCode} from 'element-china-area-data';

  const defaultReceiverInfo = {
    orderId: null,
    receiverName: null,
    receiverPhone: null,
    receiverPostCode: null,
    receiverDetailAddress: null,
    receiverProvince: null,
    receiverCity: null,
    receiverRegion: null,
    status: null,
    regionCodes: [],
  };
  export default {
    name: 'orderDetail',
    props: ['id', 'visible'],
    data() {
      return {
        isClose: true,
        index : 0,
        order: {},
        options: regionData,
        receiverDialogVisible: false,
        receiverInfo: Object.assign({}, defaultReceiverInfo),
        moneyDialogVisible: false,
        moneyInfo: {orderId: null, freightAmount: 0, couponAmount: 0, status: null},
        messageDialogVisible: false,
        message: {title: null, content: null},
        closeDialogVisible: false,
        closeInfo: {note: null, id: null},
        markOrderDialogVisible: false,
        markInfo: {note: null},
        labelList: [],
        labelDialogVisible: false,
        labelInfo: {id: null}
      }
    },
    created() {
      this.getDetail()
    },
    filters: {
      formatChannel(channel) {
        switch (channel) {
          case 1:
            return '支付宝';
          case 2:
            return '微信';
          case 3:
            return '双乾支付-支付宝';
          case 4:
            return '双乾支付-微信';
          default:
            return '余额支付';
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else if (value === 3) {
          return '客户余额';
        } else {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单';
        } else {
          return 'PC订单';
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return '秒杀订单';
        } else {
          return '正常订单';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
      },
      formatStatus(value) {
        if (value === 1) {
          return '待发货';
        } else if (value === 2) {
          return '已发货';
        } else if (value === 3) {
          return '已完成';
        } else if (value === 4) {
          return '已关闭';
        } else if (value === 5) {
          return '无效订单';
        } else if (value === 6) {
          return '异常订单';
        } else if (value === 7) {
          return '部分支付';
        } else if (value === 8) {
          return '发货中';
        } else {
          return '待付款';
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付';
        } else if (value === 4) {
          return '已退款';
        } else {
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0 || value === 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      },
      formatProductAttr(value) {
        if (value == null) {
          return '';
        } else {
          let attr = JSON.parse(value);
          let result = '';
          for (let i = 0; i < attr.length; i++) {
            result += attr[i].key;
            result += ":";
            result += attr[i].value;
            result += ";";
          }
          return result;
        }
      }
    },
    methods: {
      handleChange() {
        this.receiverInfo.receiverProvince = CodeToText[this.receiverInfo.regionCodes[0]];
        this.receiverInfo.receiverCity = CodeToText[this.receiverInfo.regionCodes[1]];
        this.receiverInfo.receiverRegion = CodeToText[this.receiverInfo.regionCodes[2]];
      },
      detailHandleClose() {
        this.isClose = true;
        this.$emit('handleClose', false)
      },
      renovateClick() {
        this.$emit('renovateClick', false)
      },
      getDetail() {
        if (!this.id) {
          return;
        }
        getOrderDetail(this.id).then(response => {
          this.order = response.data;
          const orderLabel = response.data.orderLabel
          this.labelList = orderLabel ? orderLabel.split(',') : [];
        });
      },
      onSelectRegion(data) {
        this.receiverInfo.receiverProvince = data.province.value;
        this.receiverInfo.receiverCity = data.city.value;
        this.receiverInfo.receiverRegion = data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === 1) {
          //待发货
          return 2;
        } else if (value === 2) {
          //已发货
          return 3;
        } else if (value === 3) {
          //已完成
          return 4;
        } else {
          //待付款、已关闭、无限订单
          return 1;
        }
      },
      showUpdateReceiverDialog() {
        this.receiverDialogVisible = true;
        let code = [];
        for (let i in regionData) {
          if (this.order.receiverProvince == regionData[i].label) {
            code.push(regionData[i].value);
            for (let j in regionData[i].children) {
              if (this.order.receiverCity === regionData[i].children[j].label) {
                code.push(regionData[i].children[j].value);
                for (let m in regionData[i].children[j].children) {
                  if (this.order.receiverRegion === regionData[i].children[j].children[m].label) {
                    code.push(regionData[i].children[j].children[m].value);
                  }
                }
              }
            }
          }

        }
        this.receiverInfo = {
          orderId: this.order.id,
          receiverName: this.order.receiverName,
          receiverPhone: this.order.receiverPhone,
          receiverPostCode: this.order.receiverPostCode,
          receiverDetailAddress: this.order.receiverDetailAddress,
          receiverProvince: this.order.receiverProvince,
          receiverCity: this.order.receiverCity,
          receiverRegion: this.order.receiverRegion,
          status: this.order.status,
          regionCodes: code,
        }
      },
      handleUpdateReceiverInfo() {
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response => {
            this.receiverDialogVisible = false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.getDetail();
            this.$emit('listBtn');
          });
        });
      },
      showUpdateMoneyDialog() {
        this.moneyDialogVisible = true;
        this.moneyInfo.orderId = this.order.id;
        this.moneyInfo.freightAmount = this.order.freightAmount;
        this.moneyInfo.couponAmount = this.order.couponAmount;
        this.moneyInfo.status = this.order.status;
      },
      handleUpdateMoneyInfo() {
        this.$confirm('是否要修改费用信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response => {
            this.moneyDialogVisible = false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.getDetail();
          });
        });
      },
      showMessageDialog() {
        this.messageDialogVisible = true;
        this.message.title = null;
        this.message.content = null;
      },
      handleSendMessage() {
        this.$confirm('是否要发送站内信?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.messageDialogVisible = false;
          this.$message({
            type: 'success',
            message: '发送成功!'
          });
        });
      },
      showCloseOrderDialog() {
        if (this.order.auditStatus != 1) {
          this.vueMessage('warning', '订单处于未审核或驳回状态不能进行关闭操作!');
          return
        }
        this.closeDialogVisible = true;
        this.closeInfo = {
          id: [this.order.id],
          note: ''
        };
      },
      handleCloseOrder() {
        if (this.closeInfo.note === null || this.closeInfo.note === undefined || this.closeInfo.note.length === 0) {
          this.$message({
            type: 'error',
            message: '操作备注不能为空!'
          });
          return;
        }
        this.$confirm('是否要关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("orderIds", [this.closeInfo.id]);
          params.append("note", this.closeInfo.note);
          closeOrderFull(params).then(response => {
            this.closeDialogVisible = false;
            this.isClose = false;
            this.$message({
              type: 'success',
              message: '订单关闭成功!'
            });
            this.renovateClick();
            this.$emit('listBtn');
          });
        });
      },
      showMarkOrderDialog() {
        this.markOrderDialogVisible = true;
        this.markInfo = {
          id: this.order.id,
          note: ''
        }
        this.closeOrder.note = null;
      },
      handleMarkOrder() {
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("id", this.markInfo.id);
          params.append("note", this.markInfo.note);
          updateOrderNote(params).then(response => {
            this.markOrderDialogVisible = false;
            this.$message({
              type: 'success',
              message: '订单备注成功!'
            });
            this.getDetail();
            this.$emit('listBtn');
          });
        });
      },
      handleDeleteOrder() {
        let _this = this;
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.detailHandleClose();

          let params = new URLSearchParams();
          params.append("ids", [this.order.id]);
          deleteOrder(params).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.$emit('listBtn');
            // this.$router.back();
          });
        })
      },
      showLabelDialog() {
        this.labelDialogVisible = true;
        this.labelInfo = {
          id: this.order.id
        }
      },
      handleAddLabel() {
        this.$prompt('请输入标签名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (value) => {
            if (value === '' || value === null) {
              return '请输入标签名称';
            } else {
              if (value.length < 10) {
                if (this.labelList.indexOf(value) === -1) {
                  return null
                } else {
                  return '已存在相同标签';
                }
              } else {
                return '标签名称长度在10字符以内';
              }
            }
          }
        }).then(({value}) => {
          this.labelList.push(value);
        }).catch(() => {
        });
      },
      handleUpdateLabel() {
        this.$confirm('是否要修改标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("orderId", this.labelInfo.id);
          params.append("label", this.labelList);
          updateOrderLabel(params).then(response => {
            this.labelDialogVisible = false;
            this.$message({
              type: 'success',
              message: '标签修改成功!'
            });
            this.getDetail();
          });
        });
      },
      handleLabelClose(index) {
        this.labelList.splice(index, 1)
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.getDetail();
        }
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 100%;
    /*padding: 20px 20px 20px 20px;*/
    /*margin: 20px auto;*/
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }

  .color-danger {
    color: #F56C6C;
  }
</style>


