<template> 
  <el-card class="form-container home-center-detail" shadow="never">
    <el-form :model="homeCenter"
             :rules="rules"
             ref="homeCenterForm"
             label-width="150px"
             size="small">
      <el-form-item label="用户名：" prop="username">
        <el-input disabled v-model="homeCenter.username" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-show="!isEdit">
        <el-input v-model="homeCenter.password" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input disabled v-model="homeCenter.nickname" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="homeCenter.mobile" :readonly="homeCenter.auditStatus!=='2'&&isEdit?true:false" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-select v-model="homeCenter.gender" placeholder="请选择" class="input-width">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
          <el-option label="未知" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日：" prop="birthday">
        <el-date-picker
          class="input-width"
          v-model="homeCenter.birthday"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所在城市：" prop="city">
        <el-input v-model="homeCenter.city" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="职业：" prop="job">
        <el-input v-model="homeCenter.job" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="公司名称：" prop="companyName">
        <el-input disabled v-model="homeCenter.companyName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="公司编号：" prop="customer">
        <el-input disabled v-model="homeCenter.customer" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="个人签名：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeCenter.note">
        </el-input>
      </el-form-item>
      <el-form-item label="启用/禁用：">
        <el-radio-group v-model="homeCenter.status">
          <el-radio :label="1">启动</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付状态">
        <el-radio-group v-model="homeCenter.payStatus">
          <el-radio disabled label="0">正常</el-radio>
          <el-radio disabled label="1">冻结</el-radio>
        </el-radio-group>
        <el-button type="danger" @click="handleChangePayStatus" style="margin-left: 20px;"
                   v-if="homeCenter.payStatus=='1'">解冻
        </el-button>
      </el-form-item>
      <el-form-item label="审核：" prop="auditStatus">
        <el-select v-model="homeCenter.auditStatus" placeholder="请选择" class="input-width">
          <el-option label="审核中" value="0"></el-option>
          <el-option label="未通过" value="1"></el-option>
          <el-option label="通过" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeCenterForm')" :loading="islaoding">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeCenterForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createHomeCentre, getHomeCentre, updateHomeCentre, changePayStatus} from '@/api/mall/sms/homeCenter'
  import {uploadPath} from '@/api/erp/goods/storage'

  const defaultHomeCenter = {
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
        islaoding: false,
        uploadPath,
        homeCenter: {
          username: undefined
        },
        rules: {
          username: [
            {required: true, message: '请输入会员名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
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
      this.homeCenter = Object.assign({}, defaultHomeCenter);
      console.log(this.isEdit)
      if (this.isEdit) {
        getHomeCentre(this.id).then(response => {
          this.homeCenter = response.data;
        });
      } else {
        this.homeCenter = Object.assign({}, defaultHomeCenter);
      }
    },
    methods: {
      handleChangePayStatus() {
        changePayStatus(this.homeCenter.id).then(response => {
          if (response.code == '2000') {
            this.homeCenter.payStatus = '0';
            this.$message({
              message: '支付状态修改成功',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              message: '支付状态修改失败',
              type: 'error',
              duration: 1000
            });
          }
        }).catch(res => {
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.islaoding = true;
              if (this.isEdit) {
                updateHomeCentre(this.id, this.homeCenter).then(response => {
                  this.islaoding = false;
                  if (response.code != '50000000000') {
                    this.$message({
                      message: '修改成功',
                      type: 'success',
                      duration: 1000
                    });
                    this.$emit('submitSuccess');
                    this.$refs[formName].resetFields();
                  } else {
                    this.$message({
                      message: '手机号已经被注册',
                      type: 'error',
                      duration: 1000
                    });
                  }
                });
              } else {
                createHomeCentre(this.homeCenter).then(response => {
                  this.islaoding = false;
                  if (response.code != '50000000000') {
                    this.$refs[formName].resetFields();
                    this.homeCenter = Object.assign({}, defaultHomeCenter);
                    this.$message({
                      message: '提交成功',
                      type: 'success',
                      duration: 1000
                    });
                    this.$emit('submitSuccess');
                  } else {
                    this.$message({
                      message: '手机号已经被注册',
                      type: 'error',
                      duration: 1000
                    });
                  }
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
        this.homeCenter = Object.assign({}, defaultHomeCenter);
      },
      uploadPicUrl: function (response) {
        this.homeCenter.pic = response.data.url;
      },
    }
  }
</script>
<style lang="scss" scoped>
  .home-center-detail {
    .input-width {
      width: 70%;
    }
  }
</style>


