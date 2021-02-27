<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="tenantId">

      <svg-icon icon-class="tenant1" style="font-size: 16px!important;"/>
      <span>租户账号</span>
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.tenantId" auto-complete="off"
                placeholder="请输入租户账号">

      </el-input>
    </el-form-item>
    <el-form-item prop="username">

      <svg-icon icon-class="user"/>
      <span>用户名</span>
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off"
                placeholder="请输入用户名">

      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <svg-icon icon-class="password"/>
      <span>密码</span>
      <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model="loginForm.password"
                auto-complete="off" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="14">
          <el-input size="small" @keyup.enter.native="handleLogin" :maxlength="code.len" v-model="loginForm.code"
                    auto-complete="off" placeholder="请输入验证码">
            <!--<i slot="prefix" class="icon-yanzhengma"></i>-->
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <span class="login-code-img" @click="refreshCode" v-if="code.type == 'text'">{{code.value}}</span>
            <img :src="code.src" class="login-code-img" @click="refreshCode" v-else/>
            <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
          </div>
        </el-col>
      </el-row>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
    </el-form-item>
    <el-row class="operation-box">
      <el-col :span="24">
        <el-checkbox v-model="checked">记住账号</el-checkbox>
      </el-col>
    </el-row>
    <el-row class="dividing-line"></el-row>
    <el-row class="operation-box">
      <el-col :span="12">
        <router-link to="/password" class="register">
          忘记密码
        </router-link>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <router-link to="/register" class="register">
          免费注册
        </router-link>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import {randomLenNum} from '@/utils/util';
  import {mapGetters} from 'vuex';

  export default {
    name: 'userlogin',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      const validateCode = (rule, value, callback) => {
        if (this.code.value != value) {
          this.loginForm.code = '';
          this.refreshCode();
          callback(new Error('请输入正确的验证码'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          tenantId: '10001',
          username: '',
          password: '',
          code: '',
          redomStr: ''
        },
        checked: false,
        code: {
          src: '',
          value: '',
          len: 4,
          type: 'text'
        },
        loginRules: {
          tenantId: [
            {required: true, message: '租户账号不能为空', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '账户不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {required: true, trigger: 'blur', validator: validateCode}
          ]
        },
        passwordType: 'password'
      };
    },
    created() {
      this.refreshCode();
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['tagWel'])
    },
    props: [],
    methods: {
      refreshCode() {
        this.loginForm.redomStr = randomLenNum(this.code.len, true);
        this.code.type == 'text'
          ? this.code.value = randomLenNum(this.code.len)
          : this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`;
        this.loginForm.code = this.code.value;
      },
      showPassword() {
        this.passwordType == "text"
          ? (this.passwordType = "password")
          : (this.passwordType = "text");
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('user/LoginByUsername', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({
                path: '/'
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false
          }
        })
      },
      afterQRScan() {
      },
      created() {
      },
      destroyed() {
      }
    },
  };
</script>

<style lang="scss" scoped>
  .login-form {
    .icon-class {
      /* 以下内容参照第三方图标库本身的规则 */
      font-size: 18px !important;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .operation-box {
      font-size: 14px;
      color: #ABABAB;
      a {
        font-size: 14px;
        color: #ABABAB;
      }
      .register {
        color: #409EFF;
      }
    }
    .dividing-line {
      margin: 18px 0px;
      height: 1px;
      background-color: #DCDCDC;
    }
  }
</style>
