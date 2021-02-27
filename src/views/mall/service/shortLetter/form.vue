<template> 
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose">
      <span slot="title" class="con-title">
        <span v-if="!id">新增</span>
        <span v-if="id">编辑</span>
      </span>
    <detail :isEdit="isEdit" :id="id" :templateTypeOptions="templateTypeOptions"
            @submitSuccess="submitSuccess"></detail>
  </el-dialog>
</template>
<script>
  import detail from './components/detail'

  export default {
    name: 'shortLetterForm',
    components: {detail},
    props: ['dialogFormVisible', 'id', 'isEdit', 'templateTypeOptions'],
    methods: {
      handleClose() {
        this.$emit('handleClose', false)
      },
      submitSuccess() {
        this.$emit('submitSuccess');
      }
    }
  }
</script>
<style></style>


