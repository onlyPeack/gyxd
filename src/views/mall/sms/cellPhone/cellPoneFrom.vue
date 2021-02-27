<template> 
  <el-card class="form-container home-advertise-detail" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="用户">
        <div>
          <i v-if="homeAdvertise.userName==null" class="el-icon-plus avatar-uploader-icon"  @click="handlePurchaserUserSelector"></i>
          <div v-else @click="handlePurchaserUserSelector">
            {{homeAdvertise.userName}}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="模块" prop="module">
        <el-input v-model="homeAdvertise.module" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                   accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl" :class="homeAdvertise.img?'avatar-box':''">
          <img v-if="homeAdvertise.img" :src="homeAdvertise.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>img
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="请选择用户" :visible.sync="purchaseUserVisible" append-to-body>
      <purchase-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                              ref="purchaseUser"></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelPurchaserUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitPurchaserUser">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
  import {uploadPath} from '@/api/erp/goods/storage'
  import {create,select,update} from '@/api/mall/page/index'
  const defaultHomeAdvertise = {
    module: null,
    status: 0,
    img: null,
    userName:undefined,
    userId:undefined,
    id:undefined,
  };
  export default {
    name: 'HomeAdvertiseDetail',
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
    },
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
        uploadPath,
        homeAdvertise: null,
        rules: {
          module: [
            {required: true, message: '请输入模块名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 5个字符', trigger: 'blur'}
          ],
        },
        purchaseUserVisible:false,
      }
    },
    created() {
      // this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
      console.log(this.isEdit);
      if (this.isEdit) {
        this.homeAdvertise = {
          module: null,
          status: 0,
          img: null,
          userName:undefined,
          userId:undefined,
          id:undefined,
        }
      } else {
        select(this.id).then(res=>{
          if(res.code == '2000'||res.code == '200'){
            this.homeAdvertise = {
              module: res.data.module,
              status: res.data.status,
              img: res.data.img,
              userName:res.data.userName,
              userId:res.data.id,
            }
          }
        })
      }

    },
    methods: {
      // 采购员选择
      handlePurchaserUserSelector() {
        this.purchaseUserVisible = true;

      },
      handleSubmitPurchaserUser() {
        this.$refs.purchaseUser.onSubmit();
      },
      handleCancelPurchaserUser() {
        this.$refs.purchaseUser.reset();
        this.purchaseUserVisible = false;
      },
      closeUserDialog(list) {
        this.purchaserUserArr = list;
        this.purchaseUserVisible = false;
        console.log(list);
        if (list.length > 0) {
          this.homeAdvertise.userName = list[0].name;
          this.homeAdvertise.userId = list[0].crtUserId;
        }
      },
      onSubmit(formName) {
        //console.log(this.homeAdvertise);
        this.$refs[formName].validate((valid) => {
          if(valid){
            // if(this.homeAdvertise.img==null){
            //   this.vueMessage('warning','请选择图片!');
            // }else{

              if(this.homeAdvertise.userName==undefined){
                this.vueMessage('warning','请选择用户');
              }else{
                if(this.isEdit){
                  create(this.homeAdvertise).then(res=>{
                    if(res.code == '200' || res.code == '2000'){
                      this.vueMessage('success','新增成功');
                    }else{
                      this.vueMessage('warning',res.msg);
                    }
                  })
                }else {
                  this.homeAdvertise.id = this.id;
                  update(this.homeAdvertise).then(res=>{
                    if(res.code == '200' || res.code == '2000'){
                      this.vueMessage('success','修改成功');
                    }else{
                      this.vueMessage('warning',res.msg);
                    }

                  })
                }
                this.$emit('handleClose',false);
              }
           // }
          }
        })



      },
      resetForm(formName) {
        this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);

      },
      uploadPicUrl: function (response) {
        this.homeAdvertise.img = response.data.url;
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


