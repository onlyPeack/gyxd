<template> 
  <el-card class="form-container sign-up-info-detail" shadow="never">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="150px" size="small">
      <el-form-item label="单位名称：" prop="entityName">
        <el-input v-model="dataForm.entityName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="经营类型：" prop="category">
        <el-input v-model="dataForm.category" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="dataForm.contact" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="dataForm.phone" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="dataForm.email" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="note">
        <el-input class="input-width" type="textarea" :rows="2" placeholder="请输入备注"
                  v-model="dataForm.note"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('dataForm')" :loading="islaoding">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {
    create,

  } from '@/api/mall/online/index';
  import {isvalidePhone} from '@/utils/validate';

  const defaultDataForm = {
    entityName: null,
    category: null,
    contact: null,
    phone: null,
    email: null,
    note: null
  };
  export default {
    name: 'signUpInfoDetail',
    props: ['id', 'isEdit'],
    data() {
      const validatePhone = (rule, value, callback) => {
        var res = isvalidePhone(value);
        if (res[0]) {
          callback(new Error(res[1]))
        } else {
          callback()
        }
      };
      return {
        islaoding: false,
        dataForm: {},
        rules: {
          category: [
            {required: true, message: '请选择经营类型', trigger: 'blur'}
          ],
          entityName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          contact: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {required: true, trigger: 'blur', validator: validatePhone}
          ]
        }
      }
    },
    created() {
      this.dataForm = Object.assign({}, defaultDataForm);
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
              this.islaoding = true;

              if (!this.isEdit) {
                create(this.dataForm).then(response => {
                  this.islaoding = false;
                  this.$refs[formName].resetFields();
                  this.dataForm = Object.assign({}, defaultDataForm);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$emit('submitSuccess');
                }).catch(error => {
                  this.islaoding = false;
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
        this.dataForm = Object.assign({}, defaultDataForm);
      },
    }
  }
</script>
<style lang="scss" scoped>
  .sign-up-info-detail {
    .input-width {
      width: 70%;
    }
  }
</style>


