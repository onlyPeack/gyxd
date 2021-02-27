<template>
  <el-dialog title="转发" :visible.sync="dialogVisible" width="30%" @close="handleTaskForwardClose"
             class="taskForwardDialog" :modal="false"
             :close-on-click-modal="false" :before-close="handleTaskForwardClose">
    <el-row style="margin-bottom: 5px;">
      <span>转发给：</span>
    </el-row>
    <el-row class="selector-user" style="margin-bottom: 10px;">

      <span @click="handleUserShow">
        <svg-icon icon-class="add"></svg-icon>
      </span>
      <el-tag v-for="(tag,tagIndex) in executorName" :key="6666-tagIndex" closable size="medium"
              @close="handleUserDel">
        {{tag}}
      </el-tag>

    </el-row>
    <el-row style="margin-bottom: 5px;">
      <span>转发原因(选填)：</span>
    </el-row>
    <el-row>
      <el-input v-model="note" type="textarea" :rows="2"></el-input>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="checked" style="float: left;">自己仍为任务执行人</el-checkbox>
      <el-button @click="handleTaskForwardClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

    <el-dialog title="请选择人员" :visible.sync="userVisible" append-to-body>
      <user-dialog @closeUserDialog="closeUserDialog" :isSingle="false"
                   ref="userDialog"></user-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUserCancel">取 消</el-button>
        <el-button type="primary" @click="handleUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </el-dialog>
</template>

<script>
  import {getObj, putObj} from '@/api/erp/oa/schedule';
  import userDialog from '@/components/ERP/User/user';

  export default {
    name: "taskForward",
    props: ['dialogVisible', 'id'],
    components: {
      userDialog
    },
    data() {
      return {
        userVisible: false,
        dataForm: {},
        executor: [],
        executorName: [],
        note: undefined,
        checked: false
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
      handleTaskForwardClose() {
        this.$emit('closeTaskForwardDialog', false);
      },
      handleSubmit() {
        if (this.executor == undefined || this.executor.length == 0) {
          this.$message('请选择用户');
          return;
        }

        var executor = this.executor.join(',');
        var executorName = this.executorName.join(',');
        if(this.checked){
          executor=executor+','+this.$store.state.user.id;
          executorName=executorName+','+this.$store.state.user.name;
        }
        this.dataForm.executor = executor;
        this.dataForm.executorName = executorName;
        this.dataForm.note = this.dataForm.note ? this.dataForm.note + ',' + this.note : this.note;

        putObj(this.dataForm.id, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('taskForwardSubmitSuccess', this.dataForm.id);
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })

      },
      handleUserShow() {
        this.userVisible = true;
      },
      handleUserCancel() {
        this.userVisible = false;
      },
      handleUserSubmit() {
        this.$refs.userDialog.onSubmit();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          this.executor = [];
          this.executorName = [];
          for (var i in list) {
            this.executor.push(list[i].id);
            this.executorName.push(list[i].name);
          }
        }
      },
      handleUserDel(index) {
        this.executor.splice(index, 1);
        this.executorName.splice(index, 1);
        this.$refs.userDialog.handleTagClose(index);
      }
    }
  }
</script>

<style scoped>
  .selector-user {
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .svg-icon {
    margin: 0px 10px;
  }

  .el-tag {
    margin: 5px 5px 5px 0px;
  }
</style>
