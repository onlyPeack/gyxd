<template>
  <el-dialog title="任务评分" :visible.sync="dialogVisible" width="30%" @close="handleTaskRecordClose"
             class="taskRecordDialog" :modal="false"
             :close-on-click-modal="false" :before-close="handleTaskRecordClose">
    <el-row style="margin-bottom: 5px;">
      <span>评分（十分制）：</span>
    </el-row>
    <el-row style="margin-bottom: 10px;">
      <el-input v-model="dataForm.score"></el-input>
    </el-row>
    <el-row style="margin-bottom: 5px;">
      <span>评价：</span>
    </el-row>
    <el-row>
      <el-input v-model="dataForm.scoreWord"></el-input>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleTaskRecordClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getObj, putObj} from '@/api/erp/oa/schedule';

  export default {
    name: "taskRecord",
    props: ['dialogVisible', 'id'],
    data() {
      return {
        dataForm: {
          score: undefined,
          scorer: this.$store.state.user.id,
          scoreWord: undefined
        }
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        getObj(this.id).then(response => {
          this.dataForm = response.data;
          if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
            this.dataForm.attachment = JSON.parse(response.data.attachment);
          } else {
            this.dataForm.attachment = undefined;
          }

          var comments = response.data.comments;
          if (comments && comments.length > 0) {
            for (var x in comments) {
              if (comments[x].attachment && comments[x].attachment != "null" && comments[x].attachment != '"null"') {
                comments[x].attachment = JSON.parse(comments[x].attachment);
              } else {
                comments[x].attachment = undefined;
              }
            }
          }
          this.dataForm.comments = comments;
        });
      },
      handleTaskRecordClose() {
        this.$emit('closeTaskRecordDialog', false);
      },
      handleSubmit() {
        this.dataForm.scorer = this.$store.state.user.id;

        if (this.dataForm.score == undefined || this.dataForm.score == '' || isNaN(this.dataForm.score) ||
          this.dataForm.score * 1 > 10 || this.dataForm.score * 1 < 0) {
          this.$message('评分为0-10之间的数字');
          return;
        }

        putObj(this.dataForm.id, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('taskRecordSubmitSuccess', this.dataForm.id);
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })

      }
    }
  }
</script>

<style scoped>

</style>
