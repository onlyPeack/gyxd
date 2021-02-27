<template>
  <div class="tab-company-div">
    <el-tabs :tab-position="tabPosition" style="height: 85vh">
      <el-tab-pane label="公司信息">
        <el-form ref="companyForm" :model="companyForm" :rules="rules" label-width="80px" style="width: 40%"
                 class="company-info">
          <el-form-item label="公司标志:" label-width="100px">
            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                       accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
              <img v-if="companyForm.avatar" :src="companyForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="公司名称:" label-width="100px">
            <el-input v-model="companyForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="管理员账号:" label-width="100px">
            <el-input v-model="companyForm.userName" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="管理员手机:" label-width="100px">
            <el-input v-model="companyForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="公司固话:" label-width="100px">
            <el-input v-model="companyForm.telephone"></el-input>
          </el-form-item>

          <el-form-item label="公司地址:" label-width="100px">
            <el-input v-model="companyForm.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账户信息">
        <div class="account-info-container">
          <div class="title">
            套餐情况
            <span class="span-vip">VIP</span>
          </div>
          <div class="set-meal">
            <div>在用模块：{{text}}
              <el-button type="text" icon="el-icon-upload2" @click="setup">初始化</el-button>
            </div>
            <div>到期时间：{{date}}</div>
            <div>规模人数：{{size}}</div>
          </div>
          <div class="title">账户信息</div>
          <div class="account-info-card">
            <el-card class="card-item">
              <div>
                <svg-icon icon-class="setting"></svg-icon>
                <div class="card-content">
                  <div>
                    公司套餐配置
                  </div>
                  <div>
                    <el-button type="text">功能暂未开放,敬请期待...</el-button>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="card-item">
              <div>
                <svg-icon icon-class="email"></svg-icon>
                <div class="card-content">
                  <div>
                    可用短信条数
                    <span class="card-num">0</span>
                  </div>
                  <div>
                    <el-button type="text">功能暂未开放,敬请期待...</el-button>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="card-item">
              <div>
                <svg-icon icon-class="form"></svg-icon>
                <div class="card-content">
                  <div>
                    淘宝订单可用数
                    <span class="card-num">0</span>
                  </div>
                  <div>
                    <el-button type="text">功能暂未开放,敬请期待...</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="title">线下打款</div>
          <div class="offline-payment">
            <div>收款单位：和稷(上海)工业控制系统有限公司</div>
            <div>收款帐号：755918771510902</div>
            <div>开户行：招商银行高新园支行</div>
            <div>服务热线：400-858-8268</div>
            <div style="color: #999;">
              注： 通过支付宝打款，如果是支付宝个人账号，发票抬头只能开个人的，
              通过对公账号或者支付宝企业账号，开票抬头为公司名称
              线下打款请注明您的联系方式，方便我们跟进服务。
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" @close="handleClose" width="70%" title="模块启用" :close-on-click-modal="false" :before-close="handleClose" class="Intialisedialogn">
      <span style="color:#F54D4D;font-size:12px;margin:0px 10px;">* 资金结算模块说明：启用该模块后相关单据将进行资金的结算，不启用该模块，相关单据将不进行资金的结算。其它模块暂全部开放，启用与否不影响系统的使用。</span>
      <el-transfer
        filterable
        v-model="value"
        :props="props"
        :titles="['可用模块', '已选可用模块']"
        :data="data" style="margin-top:10px;">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button  type="primary" @click="handleItialise" >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {uploadPath} from '@/api/erp/goods/storage'
  import {getSelfCompany, putObj} from '@/api/admin/company';
  import {fetchAllParent,add,allUsedMenu} from '@/api/admin/menu/index';
  export default {
    name: "systemCompany",
    data() {
      return {
        dialogVisible: false,
        tabPosition: 'left',
        companyForm: {
          id: undefined,
          companyName: undefined,
          userName: undefined,
          telephone: undefined,
          mobile: undefined,
          address: undefined,
          avatar: undefined
        },
        date:'',
        size:'',
        text:'',
        data:[],
        value:undefined,
        props: {
          key: 'id',
          label: 'title'
        },
        rules: {
          companyName: [{required: true, message: '请输入公司名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}],
          userName: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
          telephone: [{required: true, message: '请输入固定电话', trigger: 'blur'}],
          mobile: [{required: true, message: '请输入移动电话', trigger: 'blur'},
            {min: 11, max: 11, message: '长度在 11个字符', trigger: 'blur'}]
        },

        uploadPath
      }
    },
    created() {
      getSelfCompany()
        .then(response => {
          this.companyForm = response ? response : {};
        });
     this.allUsedMenus();
    },
    methods: {
      allUsedMenus(){
        allUsedMenu().then(res=>{
          let text = '';
          for(let i in res){
            console.log((res.length-1)===i)
            let sum = parseInt((res.length-1))===parseInt(i)?'':'、'
            text = text+res[i].moduleTitle+sum
          }
          this.text = text
          this.date = res[0].disabledDate;
          this.size = res[0].numberSize;
          console.log(text)
        })
      },
      handleClose(){
        this.dialogVisible = false;
      },
      handleItialise(){
        let obj = []
        for(let i in this.value){
          for(let j in this.data){
            if(this.value[i] === this.data[j].id){
              let list = {
                id :this.data[j].id,
                title:this.data[j].title
              }
              obj.push(list);
            }
          }
        }
        console.log(obj)
        add(obj).then(res=>{
          console.log(res);
          if(res.code='2000'){
            this.vueMessage('success','新增成功!');
            this.allUsedMenus();
          }else{
            this.vueMessage('warning','新增失败!');
          }

        })
        this.dialogVisible = false;
      },
      setup(){
        this.fetchAll()
        this.allUsedMenu()
      },
      fetchAll(){
        fetchAllParent().then(res=>{
          console.log(res)
          this.data = res;
          this.dialogVisible = true;
        })
      },
      allUsedMenu(){
        allUsedMenu().then(res=>{
          console.log(res)
          let obj = []
          if(res.length<1){
            this.value = ['a776dab13e484a099813b9bc7b6f522a'];
            return
          }
          for(let i in res){
            obj.push(res[i].moduleId)
          }
          this.value = obj;
          console.log(this.value)
        })
      },
      uploadPicUrl: function (response) {
        this.companyForm.avatar = response.data.url;
      },
      update() {
        const set = this.$refs;
        set['companyForm'].validate(valid => {
          if (valid) {
            putObj(this.companyForm.id, this.companyForm).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      handleSubmit() {

      }
    }
  }
</script>

<style lang="scss">
  .tab-company-div {
    .el-transfer-panel{
      width: 260px;
    }
    .el-transfer{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-transfer-panel__body {
      height: 286px;
    }
    .el-transfer-panel__list.is-filterable {
      height: 239px;
      padding-top: 0;
    }
    .Intialisedialogn {
      .el-dialog {
        margin-top: 20vh !important;
        width: 35% !important;
        height: auto !important;
        .el-dialog__body{
          height: 46vh !important;
        }
      }
    }
    .el-tabs__nav {
      padding: 0px 40px;
    }

    .el-tabs__content {
      padding-top: 20px;
    }

    .company-info {
      .avatar-uploader {
        height: 80px;

        .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 80px;
          height: 80px;
        }

        .el-upload:hover {
          border-color: #20a0ff;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
        }

        .avatar {
          width: 80px;
          height: 80px;
          display: block;
        }
      }
    }

    .account-info-container {
      padding-left: 15px;
      color: #606266;
      font-size: 14px;

      .title {
        font-weight: 700;
        margin-bottom: 20px;

        .span-vip {
          background-color: #409EFF;
          color: #fff;
          padding: 0px 2px;
          font-weight: normal;
          font-size: 12px;
        }
      }

      .set-meal, .offline-payment {
        margin-bottom: 40px;

        div {
          color: #444;
          padding-left: 30px;
          line-height: 30px;
        }
      }

      .account-info-card {
        margin-bottom: 40px;

        .card-item {
          display: inline-block;
          margin-right: 30px;

          .el-card__body {
            width: 200px;
            padding: 0px;
            text-align: center;

            .svg-icon {
              font-size: 50px;
              margin: 15px;
              color: #409EFF;
            }

            .card-content {
              border-top: 1px solid #dddddd;
              padding: 10px;

              .card-num {
                color: #409EFF;
              }
            }
          }
        }
      }

      .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
        -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .2);
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .2);
      }

    }
  }
</style>
