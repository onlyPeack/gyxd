<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="支付订单号：" prop="payOrderId">
        <el-input v-model="homeAdvertise.payOrderId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商品ID：" prop="mchId">
        <el-input v-model="homeAdvertise.mchId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商户订单号：" prop="mchOrderNo">
        <el-input v-model="homeAdvertise.mchOrderNo" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道ID：" prop="channelId">
        <el-input v-model="homeAdvertise.channelId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="支付金额：" prop="amount">
        <el-input v-model="homeAdvertise.amount" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="支付货币：" prop="currency">
        <el-select v-model="homeAdvertise.currency" placeholder="请选择" class="input-width">
          <el-option  label="人民币" value="cny"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态：" prop="status">
        <el-select v-model="homeAdvertise.status"  class="input-width">
          <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label" v-if="item.value==homeAdvertise.status">{{item.label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户端IP：" prop="clientIp">
        <el-input v-model="homeAdvertise.clientIp" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="设备：" prop="device">
        <el-input v-model="homeAdvertise.device" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商品描述信息：" prop="body">
        <el-input v-model="homeAdvertise.body" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道商户ID：" prop="channelMchId">
        <el-input v-model="homeAdvertise.channelMchId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道订单号：" prop="channelOrderNo">
        <el-input v-model="homeAdvertise.channelOrderNo" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道支付错误码：" prop="errCode">
        <el-input v-model="homeAdvertise.errCode" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="通知地址：" prop="notifyUrl">
        <el-input v-model="homeAdvertise.notifyUrl" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="通知次数：" prop="notifyCount">
        <el-input v-model="homeAdvertise.notifyCount" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="最后一次通知时间：" prop="lastNotifyTime">
        <el-input v-model="homeAdvertise.lastNotifyTime" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="订单失效时间：" prop="expireTime">
        <el-input v-model="homeAdvertise.expireTime" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="订单支付成功时间：" prop="paySuccTime">
        <el-input v-model="homeAdvertise.paySuccTime" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="createTime">
        <el-input v-model="homeAdvertise.createTime" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="更新时间：" prop="updateTime">
        <el-input v-model="homeAdvertise.updateTime" class="input-width"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createHomeCentre, getHomeCentre, updateHomeCentre} from '@/api/mall/pay/order'
  import {uploadPath} from '@/api/erp/goods/storage'


  const defaultHomeAdvertise = {
    name: null,
    type: 1,
    pic: null,
    startTime: null,
    endTime: null,
    status: 0,
    url: null,
    note: null,
    sort: 0
  };
  export default {
    name: 'HomeCentre',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      row: {
        type: Object
      }
    },
    data() {
      return {
        islaoding: false,
        uploadPath,
        homeAdvertise: {
          username: undefined
        },
        statusOptions: [
          {
            value: 0,
            label: '订单生成'
          },
          {
            value: 1,
            label: '支付中'
          },
          {
            value: 2,
            label: '支付成功'
          },
          {
            value: 3,
            label: '业务处理完成'
          }
        ]
      }
    },
    created() {
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      if (this.isEdit) {
        this.homeAdvertise = this.row;
      } else {
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      },
      uploadPicUrl: function (response) {
        this.homeAdvertise.pic = response.data.url;
      },
    }
  }
</script>
<style lang="scss">
  .home-advertise-detail {
    .avatar-box {
      .el-upload {
        width: 402px;
      }
    }
    .avatar {
      width: 400px;
      height: 146px;
    }
    .input-width {
      width: 70%;
    }
  }
</style>


