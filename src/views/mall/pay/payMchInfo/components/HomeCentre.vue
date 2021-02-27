<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="商户ID：" prop="mchId">
        <el-input v-model="homeAdvertise.mchId" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-input v-model="homeAdvertise.type" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="请求私钥：" prop="reqKey">
        <el-input v-model="homeAdvertise.reqKey" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="响应私钥：" prop="resKey">
        <el-input v-model="homeAdvertise.resKey" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="商户状态：" prop="state">
        <el-select v-model="homeAdvertise.state" placeholder="请选择" class="input-width">
          <el-option label="使用中" value="1"></el-option>
          <el-option label="停止使用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="!isEdit" @click="onSubmit('homeAdvertiseFrom')" :loading="islaoding">提交
        </el-button>
        <!--<el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createHomeCentre, getHomeCentre, updateHomeCentre} from '@/api/mall/pay/information'
  import {uploadPath} from '@/api/erp/goods/storage'


  const defaultHomeAdvertise = {
    name: null,
    type: null,
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
        rules: {
          mchId: [
            {required: true, message: '请输入商户ID', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          // reqKey: [
          //   {required: true, message: '请输入请求私匙', trigger: 'blur'}
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
        this.homeAdvertise = this.row;
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


