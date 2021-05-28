<template> 
  <div class="detail-container">
    <el-dialog title="订单详情"
               append-to-body width="70%" top="0vh" lock-scroll
               class="oms-order-details-dialog"
               :visible.sync="visible" :close-on-click-modal="false"
               @close="detailHandleClose" :before-close="detailHandleClose">
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
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">基本信息</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="8" class="table-cell-title">主订单编号</el-col>
            <el-col :span="8" class="table-cell-title">订单编号</el-col>
            <el-col :span="8" class="table-cell-title">订单类型</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="table-cell">{{order.masterOrderSn}}</el-col>
            <el-col :span="8" class="table-cell">{{order.orderSn}}</el-col>
            <el-col :span="8" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="table-cell-title">发货仓库</el-col>
            <el-col :span="8" class="table-cell-title">配送方式</el-col>
            <el-col :span="8" class="table-cell-title">物流单号</el-col>

          </el-row>
          <el-row>
            <el-col :span="8" class="table-cell">{{order.deliveryWarehouse}}</el-col>
            <el-col :span="8" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
            <el-col :span="8" class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">收货人信息</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="6" class="table-cell-title">收货人</el-col>
            <el-col :span="6" class="table-cell-title">手机号码</el-col>
            <el-col :span="6" class="table-cell-title">邮政编码</el-col>
            <el-col :span="6" class="table-cell-title">收货地址</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.mainDTO ? order.mainDTO.receiverName : ''}}</el-col>
            <el-col :span="6" class="table-cell">{{order.mainDTO ? order.mainDTO.receiverPhone : ''}}</el-col>
            <el-col :span="6" class="table-cell">{{order.mainDTO ? order.mainDTO.receiverPostCode : ''}}</el-col>
            <el-col :span="6" class="table-cell">{{order.mainDTO ? order.mainDTO : {} | formatAddress}}</el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">商品信息</span>
        </div>

        <el-table ref="orderItemTable" :data="order.orderItemList"
                  style="width: 100%;margin-top: 20px" border v-if="order.orderItemList">
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

        <div style="float: right;margin: 20px">
          合计：<span class="color-danger" v-if="order.totalAmount">￥{{order.totalAmount.toFixed(2)}}</span>
        </div>
        <div style="margin-top: 60px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">费用信息</span>
        </div>
        <div class="table-layout">
          <el-row>
            <el-col :span="24" class="table-cell-title">商品合计</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="table-cell">￥{{order.totalAmount}}</el-col>
          </el-row>
        </div>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailHandleClose">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {getOrderSubDetail} from '@/api/erp/mall/oms/order/orderSub';
  import {formatDate} from '@/utils/date';

  export default {
    name: 'orderSubDetail',
    props: ['id', 'visible'],
    data() {
      return {
        order: {},
      }
    },
    created() {
      this.getDetail()
    },
    filters: {
      formatNull(value) {
        if (value === undefined || value === null || value == '') {
          return '暂无';
        } else {
          return value;
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
      }
    },
    methods: {
      detailHandleClose() {
        this.$emit('handleClose', false)
      },
      getDetail() {
        if (!this.id) {
          return;
        }
        getOrderSubDetail(this.id).then(response => {
          this.order = response.data;
        });
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


