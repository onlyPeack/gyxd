<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="订单ID：" prop="orderId">
        <el-input v-model="homeAdvertise.orderId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商品ID：" prop="mchId">
        <el-input v-model="homeAdvertise.mchId" class="input-width"></el-input>
      </el-form-item>
      <!--<el-form-item label="订单类型：" prop="orderType">-->
      <!--<el-input v-model="homeAdvertise.orderType" class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="订单类型：" prop="orderType">
        <el-select v-model="homeAdvertise.orderType" placeholder="请选择" class="input-width">
          <el-option v-if="homeAdvertise.orderType=='1'" label="支付" value="1"></el-option>
          <el-option v-if="homeAdvertise.orderType=='0'" label="转账" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知地址：" prop="notifyUrl">
        <el-input v-model="homeAdvertise.notifyUrl" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="通知次数：" prop="notifyCount">
        <el-input v-model="homeAdvertise.notifyCount" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="通知响应结果：" prop="result">
        <el-input v-model="homeAdvertise.result" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="通知状态：" prop="status">
        <el-select v-model="homeAdvertise.status">
          <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label" v-if="item.value==homeAdvertise.status">{{item.label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最后一次通知时间：" prop="lastNotifyTime">
        <el-input v-model="homeAdvertise.lastNotifyTime" class="input-width"></el-input>
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
  import {createHomeCentre, getHomeCentre, updateHomeCentre} from '@/api/mall/pay/inform'
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
            value: 1,
            label: '通话中'
          },
          {
            value: 2,
            label: '通知成功'
          },
          {
            value: 3,
            label: '通知失败'
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


