<template>
  <div class="lock-screen">
    <div class="lock-user-avatar">
      <img :src="avatar+'?imageView2/1/w/80/h/80'">
    </div>
    <div class="lock-user-name">
      {{name}}
    </div>
    <div>
      <el-input type='password' placeholder="请输入密码" v-model="user.password" style="width: 60%"
                @keyup.enter.native="unlock">
        <el-button slot="append" @click="unlock()">
          <i class="iconfont icon-suo" style="color: #87B97E;"></i>
        </el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
  import {
    validate
  } from '@/api/admin/user/index';
  import {mapGetters} from 'vuex';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    props: ['name', 'avatar'],
    computed: {
      ...mapGetters(['tagWel'])
    },
    data() {
      return {
        user: {
          username: undefined,
          password: undefined
        }
      };
    },
    created() {

    },
    methods: {
      unlock() {
        this.user.username = this.$store.getters.username;
        this.loading = true;
        validate(this.user).then((res) => {
          this.loading = false;
          if (res.data.id) {
            this.$emit('closeScreenDialog', this.password);
            this.user.password = undefined;
          } else {
            this.$message.error('密码输入错误，请重新输入');
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('密码输入错误，请重新输入');
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .lock-screen {
    width: 30%;
    margin: 0 auto;
    margin-top: 15vh;
    color: #fff;
    text-align: center;
    .lock-user-avatar {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      img {
        width: 200px;
        height: 200px;
      }
    }
    .lock-user-name {
      line-height: 40px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  #lockScreen .el-dialog__wrapper .el-dialog {
    position: absolute;
    top: 0px;
    bottom: 0px;
    margin: 0px !important;
    background-color: #3A3A3A;
    .el-dialog__header {
      display: none;
    }
  }

</style>
