<template> 
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose" >
      <span slot="title" class="con-title">
        <span v-if="!id">新增</span>
        <span v-if="id">编辑会员信息</span>
      </span>

    <home-centre :isEdit="isEdit" :id="id" @submitSuccess="submitSuccess"></home-centre>
  </el-dialog>
</template>
<script>
  import HomeCentre from './components/HomeCentre'

  export default {
    name: 'homeAdvertiseForm',
    components: {HomeCentre},
    props: ['dialogFormVisible', 'id', 'isEdit'],
    methods: {
      handleClose() {
        this.$emit('handleClose', false)
      },
      submitSuccess(){
        this.$emit('submitSuccess');
      }
    }
  }
</script>
<style></style>


