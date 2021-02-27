<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="渠道ID：" prop="channelId">
        <el-input v-model="homeAdvertise.channelId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称：" prop="channelName">
        <el-input v-model="homeAdvertise.channelName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道商户ID：" prop="channelMchId">
      <el-input v-model="homeAdvertise.channelMchId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商户ID：" prop="mchId">
        <el-input v-model="homeAdvertise.mchId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道状态：" prop="state">
        <el-select v-model="homeAdvertise.state" placeholder="请选择" class="input-width">
          <el-option label="使用中" value="1"></el-option>
          <el-option label="停止使用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置参数：" prop="param">
        <el-input v-model="homeAdvertise.param" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="!isEdit" @click="onSubmit('homeAdvertiseFrom')" :loading="islaoding">提交</el-button>
        <!--<el-button type="primary" @click="onSubmit('homeAdvertiseFrom')" :loading="islaoding">提交</el-button>-->
        <!--<el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createHomeCentre, getHomeCentre, updateHomeCentre} from '@/api/mall/pay/homePayChannel'
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
      id: {
        type: Number || String
      }
    },
    data() {
      return {
        islaoding:false,
        uploadPath,
        homeAdvertise: {
          username:undefined
        },
        rules: {
          channelId: [
            {required: true, message: '请输入渠道ID', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          // channelName: [
          //   {required: true, message: '请输入渠道名称', trigger: 'blur'}
          // ],
          // companyName: [
          //   {required: true, message: '请输入公司名称', trigger: 'blur'}
          // ],
          // customer: [
          //   {required: true, message: '请输入公司名称', trigger: 'blur'}
          // ],
          // mobile: [
          //   {required: true, message: '请输入手机号', trigger: 'blur'}
          // ]
        },

      }
    },
    created() {
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      if (this.isEdit) {
        console.log(this.id)
        getHomeCentre(this.id).then(response => {
          this.homeAdvertise = response.data;
        });
      } else {
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateHomeCentre(this.id, this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$emit('submitSuccess');
                });
              } else {
                createHomeCentre(this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$emit('submitSuccess');
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
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


