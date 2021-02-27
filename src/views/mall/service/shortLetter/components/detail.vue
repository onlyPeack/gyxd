<template> 
  <el-card class="form-container short-letter-detail" shadow="never">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="150px" size="small">
      <el-form-item label="模板类型：" prop="templateType">
        <el-select v-model="dataForm.templateType">
          <el-option v-for="item in templateTypeOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称：" prop="templateName">
        <el-input v-model="dataForm.templateName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="模板内容：" prop="templateText">
        <el-input class="input-width" type="textarea" :rows="5" placeholder="请输入模板内容"
                  v-model="dataForm.templateText"></el-input>
      </el-form-item>
      <el-form-item label="申请说明：" prop="instructions">
        <el-input class="input-width" type="textarea" :rows="5" placeholder="请输入申请说明"
                  v-model="dataForm.instructions"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('dataForm')" :loading="islaoding">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {create, select, update} from '@/api/mall/SMSmessage/index';

  const defaultDataForm = {
    templateName: null,
    templateType: null,
    templateText: null,
    instructions: null
  };
  export default {
    name: 'shortLetterDetail',
    props: ['id', 'isEdit', 'templateTypeOptions'],
    data() {
      return {
        islaoding: false,
        dataForm: {},
        rules: {
          templateType: [
            {required: true, message: '请选择模板类型', trigger: 'blur'}
          ],
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'blur'}
          ],
          templateText: [
            {required: true, message: '请输入模板内容', trigger: 'blur'}
          ],
          instructions: [
            {required: true, message: '请输入申请说明', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.dataForm = Object.assign({}, defaultDataForm);
      if (this.isEdit) {
        select(this.id).then(response => {
          this.dataForm = response.data;
        });
      } else {
        this.dataForm = Object.assign({}, defaultDataForm);
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
              this.islaoding = true;

              if (this.isEdit) {
                update(this.dataForm).then(response => {
                  this.islaoding = false;
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$emit('submitSuccess');
                }).catch(error => {
                  this.islaoding = false;
                });
              } else {
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
  .short-letter-detail {
    .input-width {
      width: 70%;
    }
  }
</style>


