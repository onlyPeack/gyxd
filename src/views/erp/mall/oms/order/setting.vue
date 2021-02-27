<template> 
  <el-card class="form-container" shadow="never">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form :model="orderSetting"
                 ref="orderSettingForm"
                 :rules="rules"
                 label-width="150px">
          <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.flashOrderOvertime"
                             class="input-width">
              <template slot="append">分</template>
            </el-input-number>
            <span class="note-margin"><font>分</font>未付款，订单自动关闭</span>
          </el-form-item>
          <el-form-item label="订单超过：" prop="autoAuditTime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.autoAuditTime"
                             class="input-width">
              <template slot="append">分</template>
            </el-input-number>
            <span class="note-margin"><font>分</font>未审核，订单自动审核</span>
          </el-form-item>
          <el-form-item label="正常订单超过：" prop="normalOrderOvertime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.normalOrderOvertime"
                             class="input-width">
              <template slot="append">分</template>
            </el-input-number>
            <span class="note-margin"><font>分</font>未付款，订单自动关闭</span>
          </el-form-item>
          <el-form-item label="订单最长延时：" prop="maxDelayedTime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.maxDelayedTime"
                             class="input-width">
              <template slot="append">天</template>
            </el-input-number>
            <span class="note-margin"><font>天</font>发货</span>
          </el-form-item>
          <el-form-item label="发货超过：" prop="confirmOvertime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.confirmOvertime"
                             class="input-width">
              <template slot="append">天</template>
            </el-input-number>
            <span class="note-margin"><font>天</font>未收货，订单自动完成</span>
          </el-form-item>
          <el-form-item label="订单完成超过：" prop="finishOvertime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.finishOvertime"
                             class="input-width">
              <template slot="append">天</template>
            </el-input-number>
            <span class="note-margin"><font>天</font>自动结束交易，不能申请售后</span>
          </el-form-item>
          <el-form-item label="订单完成超过：" prop="commentOvertime">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.commentOvertime"
                             class="input-width">
              <template slot="append">天</template>
            </el-input-number>
            <span class="note-margin"><font>天</font>自动五星好评</span>
          </el-form-item>
          <el-form-item label="订单高于：" prop="maxProfitPercent">
            <el-input-number :controls="false" :min="1" :max="999" v-model="orderSetting.maxProfitPercent"
                             class="input-width">
              <template slot="append">%</template>
            </el-input-number>
            <span class="note-margin"><font>%</font>要走审核流程</span>
          </el-form-item>
          <el-form-item label="订单低于：" prop="minProfitPercent">
            <el-input-number :controls="false" :min="0" :max="999" v-model="orderSetting.minProfitPercent"
                             class="input-width">
              <template slot="append">%</template>
            </el-input-number>
            <span class="note-margin"><font>%</font>要走审核流程</span>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="confirm('orderSettingForm')"
              type="primary">提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  import { getOrderSetting, updateOrderSetting } from '@/api/erp/mall/oms/order/setting'

  const defaultOrderSetting = {
    id: null,
    flashOrderOvertime: 0,
    autoAuditTime: 0,
    maxDelayedTime: 0,
    normalOrderOvertime: 0,
    confirmOvertime: 0,
    finishOvertime: 0,
    commentOvertime: 0
  }
  const checkTime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('时间不能为空'))
    }
    console.log('checkTime', value)
    let intValue = parseInt(value)
    if (!Number.isInteger(intValue)) {
      return callback(new Error('请输入数字值'))
    }
    callback()
  }
  export default {
    name: 'orderSetting',
    data() {
      return {
        orderSetting: Object.assign({}, defaultOrderSetting),
        rules: {
          flashOrderOvertime: { validator: checkTime, trigger: 'blur' },
          autoAuditTime: { validator: checkTime, trigger: 'blur' },
          maxDelayedTime: { validator: checkTime, trigger: 'blur' },
          normalOrderOvertime: { validator: checkTime, trigger: 'blur' },
          confirmOvertime: { validator: checkTime, trigger: 'blur' },
          finishOvertime: { validator: checkTime, trigger: 'blur' },
          commentOvertime: { validator: checkTime, trigger: 'blur' }
        }
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否要提交修改?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              updateOrderSetting(this.orderSetting).then(response => {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                  duration: 1000
                })
              })
            })
          } else {
            this.$message({
              message: '提交参数不合法',
              type: 'warning'
            })
            return false
          }
        })
      },
      getDetail() {
        getOrderSetting(1).then(response => {
          this.orderSetting = response.data
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin font {
    color: red;
    font-size: 20px;
  }

  .form-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 800px;
    padding: 35px 35px 15px;
    margin: 20px auto;
  }
</style>


