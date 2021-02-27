<template> 
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
             :before-close="handleClose" >
      <span slot="title" class="con-title">
        <span v-if="!id">新增广告</span>
        <span v-if="id">编辑广告</span>
      </span>

    <home-advertise-detail :isEdit="isEdit" :id="id" @submitSuccess="submitSuccess"></home-advertise-detail>
  </el-dialog>
</template>
<script>
  import HomeAdvertiseDetail from './components/HomeAdvertiseDetail'

  export default {
    name: 'homeAdvertiseForm',
    components: {HomeAdvertiseDetail},
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


