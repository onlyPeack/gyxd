<template>
  <div id="app">
    <router-view></router-view>
    <div v-if="userRelistVisible">
      <el-dialog title="重新登录" :visible.sync="userRelistVisible"
                 @closeUserRelistDialog="closeUserRelistDialog" width="30%" :append-to-body="true"
                 :close-on-click-modal="false">
        <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
          <el-form-item prop="password">
            <svg-icon icon-class="password"/>
            <span>密码</span>
            <el-input size="small" @keyup.enter.native="handleSubmitUserRelist" :type="passwordType"
                      v-model="loginForm.password"
                      auto-complete="off" placeholder="请输入密码">
              <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>

            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeUserRelistDialog">取 消</el-button>
          <el-button type="primary" @click.native.prevent="handleSubmitUserRelist">登 录</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Communication from './utils/communication';
  import store from '@/store';
  import '@/styles/bill.scss';

  export default {
    name: 'APP',
    mounted() {
      const that = this;
      Communication.$on('openDialog', () => {
        that.openUserRelistDialog();
      })
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: undefined,
          password: undefined
        },
        userRelistVisible: false,
        loginRules: {
          password: [
            { required: true, trigger: 'blur', validator: validatePass },
            { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
          ]
        },
        passwordType: 'password'
      }
    },
    methods: {
      init() {
        this.loginForm = {
          username: undefined,
          password: undefined
        };
        this.passwordType = 'password';
      },
      openUserRelistDialog() {
        if (location.hash == '#/login') {
          location.reload();
          return
        }

        this.loginForm.username = sessionStorage.username;
        this.userRelistVisible = true;
      },
      closeUserRelistDialog() {
        this.userRelistVisible = false;
        this.init();
      },
      showPassword() {
        this.passwordType == ''
          ? this.passwordType = 'password'
          : this.passwordType = '';
      },
      handleSubmitUserRelist() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            store.dispatch('user/LogOut').then(() => {
              this.loading = true;
              this.$store.dispatch('user/LoginByUsername', this.loginForm).then(() => {
                this.loading = false;
                this.closeUserRelistDialog();
                location.reload()
                /* this.$router.push({
                  path: '/dashboard'
                })*/
              }).catch(() => {
                this.loading = false
              })
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
