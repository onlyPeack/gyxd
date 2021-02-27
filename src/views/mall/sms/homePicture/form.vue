<template>
  <el-dialog :visible.sync="dialogFormVisible" width="50%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
    <span slot="title" class="con-title">
        <span v-if="!dataForm.id">新增</span>
        <span v-if="dataForm.id">编辑</span>
      </span>

    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="150px" size="small">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="dataForm.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="status">
        <el-select v-model="dataForm.status" class="input-width" @change="dataForm.pic = undefined">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="pic">
        <el-upload v-if="dataForm.status==0" class="avatar-uploader" :action='uploadPath' list-type="picture-card"
                   :show-file-list="false"
                   accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl" :class="dataForm.pic?'avatar-box':''"
                   style="overflow: hidden">
          <img v-if="dataForm.pic" :src="dataForm.pic" class="avatar" width="146">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input v-if="dataForm.status==1" v-model="dataForm.pic" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input class="input-width" type="textarea" :rows="2" placeholder="请输入内容" v-model="dataForm.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {create, update} from '@/api/mall/sms/homePicture';
  import {uploadPath} from '@/api/erp/goods/storage'

  export default {
    name: "homePictureForm",
    props: ['dialogFormVisible', 'row', 'typeOptions'],
    data() {
      return {
        uploadPath,
        isFormLoading: false,
        dataForm: {
          id: undefined,
          name: undefined,
          status: 0,
          pic: 0,
          note: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          pic: [
            {
              required: true,
              message: '请输入内容',
              trigger: 'blur'
            }
          ]
        },
      };
    },
    created() {
      if (this.row) {
        this.dataForm = this.row;
      }
    },
    methods: {
      uploadPicUrl: function (response) {
        this.dataForm.pic = response.data.url;
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isFormLoading = true;
            if (this.dataForm.id == null || this.dataForm.id == undefined) {
              //添加操作
              create(this.dataForm).then(response => {
                this.isFormLoading = false;
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  });
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
                this.$emit('submitSuccess');
              }).catch(() => {
                this.isFormLoading = false;
              });
            } else {
              //编辑操作
              update(this.dataForm.id, this.dataForm).then(response => {
                this.isFormLoading = false;
                this.dataForm.id = null;
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              }).catch(() => {
                this.isFormLoading = false;
              });
            }
          }
        });
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .input-width {
    width: 70%;
  }
</style>
