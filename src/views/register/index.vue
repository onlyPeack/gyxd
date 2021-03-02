<template>
  <div class="register-container pull-height">
    <div class="register-info text-white animated fadeInLeft">
      <h2 class="register-info-title">工业小店</h2>
    </div>
    <div class="register-border animated fadeInRight">
      <div class="register-main">
        <h2 class="register-title" v-if="registerVisible"> 注册工业小店 </h2>
        <h2 class="register-title" v-if="phoneCodeVisible"> 验证码已发送 </h2>
        <h2 class="register-title" v-if="formInfoVisible"> 最后一步 </h2>

        <el-form class="register-form" status-icon :rules="rules" ref="dataForm" :model="dataForm" label-width="0">
          <div v-if="registerVisible">
            <el-form-item prop="mobile">
              <el-input size="small" v-model="dataForm.mobile" auto-complete="off"
                        placeholder="请输入手机号码"
                        onKeyPress="if((event.keyCode<48 || event.keyCode>57))event.returnValue=false" maxlength="11">
              </el-input>
            </el-form-item>
            <el-form-item prop="verificationCode">
              <el-row :span="24">
                <el-col :span="14">
                  <el-input size="small" :maxlength="verificationCode.len"
                            v-model="dataForm.verificationCode"
                            auto-complete="off" placeholder="请输入图形验证码">
                  </el-input>
                </el-col>
                <el-col :span="10">
                  <div class="register-code">
                    <span class="register-code-img" @click="refreshCode" v-if="verificationCode.type == 'text'">{{verificationCode.value}}</span>
                    <img :src="verificationCode.src" class="register-code-img" @click="refreshCode" v-else/>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click.native.prevent="handleSendPhoneCode"
                         class="register-button">
                获取验证码
              </el-button>
            </el-form-item>
          </div>

          <div v-if="phoneCodeVisible">
            <el-form-item prop="phoneCode">
              <el-input size="small" v-model="dataForm.phoneCode" auto-complete="off"
                        placeholder="请输入手机验证码">
                <template slot="append">
                  <span @click="handleSendRegisterSms" class="msg-text" :class="[{display:msgKey}]">{{msgText}}</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleNext" class="register-button">
                下一步
              </el-button>
            </el-form-item>
          </div>

          <div v-if="formInfoVisible">
            <el-form-item prop="companyName">
              <el-input size="small" @keyup.enter.native="handleRegister" v-model="dataForm.companyName"
                        auto-complete="off"
                        placeholder="请输入公司名">
              </el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input size="small" @keyup.enter.native="handleRegister" v-model="dataForm.userName"
                        auto-complete="off"
                        placeholder="请输入用户名">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input size="small" @keyup.enter.native="handleRegister" v-model="dataForm.password"
                        auto-complete="off" placeholder="请输入密码" type="password">
                <i class="el-icon-view el-input__icon" slot="suffix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="surePassword">
              <el-input size="small" @keyup.enter.native="handleRegister" v-model="dataForm.surePassword"
                        auto-complete="off" placeholder="请输入确认码" type="password">
                <i class="el-icon-view el-input__icon" slot="suffix"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleRegister"  :loading="isLoading" class="register-button">
                注册
              </el-button>
            </el-form-item>
          </div>

          <el-row class="operation-box">
            <el-col :span="24" style="text-align: right;">
              <router-link to="/login" class="goback-login">
                已有账号，返回登录
              </router-link>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

  </div>
</template>
<script>
  import {addObj, registerCheckMobile, registerCheckUserName, sendRegisterSms} from "@/api/admin/company";
  import {isvalidatemobile} from "@/utils/validate";
  import {randomLenNum} from '@/utils/util';
  import {mapGetters} from "vuex";

  const MSGINIT = "发送验证码",
    // MSGERROR = "验证码发送失败",
    MSGSCUCCESS = "${time}秒后重发",
    MSGTIME = 60;

  export default {
    name: 'register',
    data() {
      const validateMobile = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      const validateSurePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          if (this.dataForm.password == this.dataForm.surePassword) {
            callback()
          } else {
            callback(new Error('确认码与密码不一致'))
          }
        }
      };
      const validateCode = (rule, value, callback) => {
        if (this.verificationCode.value != value) {
          this.dataForm.verificationCode = '';
          this.refreshCode();
          callback(new Error('请输入正确的验证码'));
        } else {
          callback();
        }
      };
      const validatePhoneCode = (rule, value, callback) => {
        if (this.registerCode != value) {
          this.dataForm.phoneCode = '';
          callback(new Error("请输入正确的验证码"));
        } else {
          callback();
        }
      };

      return {
        isLoading:false,
        msgText: MSGINIT,
        msgTime: MSGTIME,
        msgKey: false,
        dataForm: {
          userName: '',
          password: '',
          surePassword: '',
          verificationCode: '',
          phoneCode: '',
          redomStr: ''
        },
        registerCode: undefined,
        verificationCode: {
          src: '',
          value: '',
          len: 4,
          type: 'text'
        },
        registerVisible: true,
        phoneCodeVisible: false,
        formInfoVisible: false,
        rules: {
          mobile: [{required: true, trigger: "blur", validator: validateMobile}],
          companyName: [
            {required: true, message: '公司名不能为空', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, trigger: 'blur', validator: validatePass},
            {min: 6, message: '密码长度最少为6位', trigger: 'blur'}
          ],
          surePassword: [
            {required: true, trigger: 'blur', validator: validateSurePass},
            {min: 6, message: '密码长度最少为6位', trigger: 'blur'}
          ],
          verificationCode: [
            {required: true, message: '请输入图形验证码', trigger: 'blur'},
            {min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur'},
            {required: true, trigger: 'blur', validator: validateCode}
          ],
          phoneCode: [{required: true, trigger: 'blur', validator: validatePhoneCode}]
        }
      }
    },
    created() {
      this.refreshCode();
    },
    destroyed() {
    },
    methods: {
      refreshCode() {
        this.dataForm.redomStr = randomLenNum(this.verificationCode.len, true);
        this.verificationCode.type == 'text'
          ? this.verificationCode.value = randomLenNum(this.verificationCode.len)
          : this.verificationCode.src = `${this.codeUrl}/${this.dataForm.redomStr}`;
      },
      checkMobile() {
        registerCheckMobile(this.dataForm.mobile).then((res) => {
          if (res > 0) {
            this.$message({
              message: '此手机号已被注册，请更换后尝试',
              type: 'warning'
            });
          } else {
            this.handleSendRegisterSms();
          }
        });
      },
      handleSendRegisterSms() {
        sendRegisterSms(this.dataForm.mobile).then((res) => {
          //验证码发送成功
          if (res.code === 2000) {
            this.registerCode = res.data;

            if (this.msgKey) return;
            this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
            this.msgKey = true;
            this.registerVisible = false;
            this.phoneCodeVisible = true;
            this.formInfoVisible = false;
            const time = setInterval(() => {
              this.msgTime--;
              this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
              if (this.msgTime == 0) {
                this.msgTime = MSGTIME;
                this.msgText = MSGINIT;
                this.msgKey = false;
                clearInterval(time);
              }
            }, 1000);

          } else {
            this.registerCode = undefined;
            this.$message({
              message: '注册失败!触发分钟级流控Permits:1',
              type: 'error'
            });
          }
        }).catch(() => {
          this.registerCode = undefined;
          this.$message({
            message: '验证码发送失败',
            type: 'error'
          });
        })
      },
      handleSendPhoneCode() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.checkMobile();
          } else {
            return false
          }
        });
      },
      handleNext() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.registerVisible = false;
            this.phoneCodeVisible = false;
            this.formInfoVisible = true;
          } else {
            return false
          }
        });
      },
      handleRegister() {
        this.isLoading =true;
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.checkUserName();
          } else {
            this.isLoading =false;
            return false
          }
        })
      },
      checkUserName() {
        registerCheckUserName(this.dataForm.userName).then((res) => {
          if (res > 0) {
            this.$message({
              message: '此用户名已被注册，请更换后尝试',
              type: 'warning'
            });
            this.isLoading =false;
          } else {
            this.handleRegisterSubmit();
          }
        });
      },
      handleRegisterSubmit() {
        this.loading = true;
        addObj(this.dataForm).then(() => {
          this.loading = false;
          this.$notify({
            title: '成功',
            message: '注册成功',
            type: 'success',
            duration: 2000
          });
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {
          this.loading = false
        })
      }
    },
    computed: {
      ...mapGetters(["website"])
    },
  }
</script>

<style lang="scss" scoped="scoped">
  @import "../../styles/avue/style/common.scss";
  /*@import "../../styles/avue/style/index.css";*/
  @import "../../styles/avue/style/animate.css";

  .register-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .register-container::before {
    z-index: -999;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../styles/avue/static/login.png');
    background-size: cover;
  }

  .register-info {
    padding-left: 60px;
  }

  .register-info-title {
    line-height: 90px;
  }

  .register-border {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 30px 50px 30px 50px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 1px 1px 2px #eee;
  }

  .register-main {
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .register-main > h3 {
    margin-bottom: 20px;
  }

  .register-main > p {
    color: #76838f;
  }

  .register-title {
    margin: 0 0 20px;
    text-align: center;
    color: #000000;
    /*letter-spacing: 3px;*/
    font-family: MicrosoftYaHei;
  }

  .register-code {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 0 0 10px;
  }

  .register-code-img {
    width: 100px;
    height: 32px;
    background-color: #fdfdfd;
    border: 1px solid #f0f0f0;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 5px;
    line-height: 32px;
    text-indent: 5px;
    text-align: center;
  }

  .pull-height {
    height: 100%;
    overflow: hidden;
  }

  .text-white {
    color: #fff;
  }

  .msg-text {
    display: block;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }

  .msg-text.display {
    color: #ccc;
  }
</style>
<style lang="scss">
  .register-container {
    .register-form {
      .el-form-item__content {
        width: 270px !important;
      }
      .el-input {
        input {
          text-indent: 5px;
          border-color: #dcdcdc;
          border-radius: 3px;
          padding: 0 15px;
        }
        .el-input__prefix {
          i {
            padding: 0 5px;
            font-size: 16px !important;
          }
        }
      }

      .register-button {
        width: 100%;
      }
      .operation-box {
        .goback-login {
          text-decoration: none;
          font-size: 14px;
          color: #409EFF;
        }
      }
    }
  }
</style>
