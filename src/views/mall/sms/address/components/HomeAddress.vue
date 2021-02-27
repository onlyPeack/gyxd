<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <!--<el-form-item label="编号：" prop="id">-->
        <!--<el-input v-model="homeAdvertise.id" class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="homeAdvertise.username" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="homeAdvertise.nickname" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
      <el-input v-model="homeAdvertise.mobile" class="input-width"></el-input>
      </el-form-item>
      <!--<el-form-item label="生日：" prop="birthday">-->
        <!--<el-input v-model="homeAdvertise.birthday" class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="性别：" prop="gender">
        <el-select v-model="homeAdvertise.gender" placeholder="请选择" class="input-width">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
          <el-option label="未知" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日：" prop="birthday">
      <el-date-picker
        class="input-width"
        v-model="homeAdvertise.birthday"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="所在城市：" prop="city">
        <el-input v-model="homeAdvertise.city" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="职业：" prop="job">
        <el-input v-model="homeAdvertise.job" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-model="homeAdvertise.companyName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="公司编号：" prop="customer">
        <el-input v-model="homeAdvertise.customer" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="个人签名：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.note">
        </el-input>
      </el-form-item>
      <el-form-item label="启动/禁用：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">启动</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')" :loading="islaoding">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createHomeCentre, getHomeCentre, updateHomeCentre} from '@/api/mall/sms/homeCenter'
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
    name: 'HomeAddress',
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
          username: [
            {required: true, message: '请输入会员名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          job: [
            {required: true, message: '请输入职业', trigger: 'blur'}
          ],
          companyName: [
            {required: true, message: '请输入公司名称', trigger: 'blur'}
          ],
          customer: [
            {required: true, message: '请输入公司名称', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ]
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


