<template>
  <div class="group-div">
    <div class="filter-container">
      <el-button type="text" icon="el-icon-plus" @click="handleCreateShow">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdateShow">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDel">删除</el-button>
    </div>
    <el-table border :data="list" style="width: 100%" @selection-change="handleChangeFun" ref="dataTable">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="群组名称" align="center">
        <template slot-scope="scope">
          <span style="color: #4F90E2" @click="handleGroupInfoShow(scope.row.id)">{{scope.row.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupUserName" label="成员" align="center">
      </el-table-column>
      <el-table-column prop="groupManager" label="管理员" align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新建群组弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="groupDialogVisible">
      <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="rules">
        <el-form-item label="群组头像:">
          <el-upload class="avatar-uploader" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :action="uploadPath" :on-success="handleFileSuccess">
            <img v-if="dataForm.groupIcon" :src="dataForm.groupIcon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="群组名称:" prop="groupName">
          <el-input v-model="dataForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="群组描述:">
          <el-input type="textarea" v-model="dataForm.groupDescription"></el-input>
        </el-form-item>
        <el-form-item label="群组成员:" prop="groupUserName">
          <span @click="handleUserShow">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-tag v-for="(tag,tagIndex) in groupUserName" :key="tag" closable
                  @close="handleUserDel(tagIndex)" size="medium">
            {{tag}}
          </el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 群组详情弹窗 -->
    <el-dialog title="群组详情" :visible.sync="groupDescDialogVisible" class="groupDescDialog" width="60%">
      <table class="publicTable" v-if="detailData">
        <tr>
          <td colspan="2" bgcolor="#F5F7FA">
            <el-row>
              <el-col :span="24">
                <span>群组详情</span>
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>
            <span>群组名称：{{detailData.groupName}}</span>
          </td>
          <td width="50%">
            <span>管理员：{{detailData.groupManager}}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <span>成员：
              <span>{{detailData.groupUserName}}</span>
            </span>
          </td>
        </tr>
      </table>
      <!--<el-tabs v-model="activeName">
        <el-tab-pane label="消息" name="first">
          <el-table border :data="newsData" style="width: 100%" highlight-current-row>
            <el-table-column label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="消息内容" align="center">
            </el-table-column>
            <el-table-column label="发起人" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="投票" name="second">
          <el-table border :data="voteData" style="width: 100%" highlight-current-row>
            <el-table-column label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="结束时间" align="center">
            </el-table-column>
            <el-table-column label="投票内容" align="center">
            </el-table-column>
            <el-table-column label="参与人数" align="center">
            </el-table-column>
            <el-table-column label="发起人" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="问卷" name="third">
          <el-table border :data="questionnaireData" style="width: 100%" highlight-current-row>
            <el-table-column label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="结束时间" align="center">
            </el-table-column>
            <el-table-column label="投票内容" align="center">
            </el-table-column>
            <el-table-column label="参与人数" align="center">
            </el-table-column>
            <el-table-column label="发起人" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDescDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 群组成员弹窗 -->
    <el-dialog title="群组成员详情" :visible.sync="groupMemberDialogVisible">
      <el-table border :data="memberData" style="width: 100%" highlight-current-row>
        <el-table-column label="人员" align="center">
        </el-table-column>
        <el-table-column label="职务" align="center">
        </el-table-column>
        <el-table-column label="电话" align="center">
        </el-table-column>
        <el-table-column label="手机" align="center">
        </el-table-column>
        <el-table-column label="邮箱" align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupMemberDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="groupMemberDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--选择用户-->
    <el-dialog title="请选择人员" :visible.sync="userVisible" append-to-body>
      <user-dialog @closeUserDialog="closeUserDialog" :isSingle="false"
                   ref="userDialog"></user-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUserCancel">取 消</el-button>
        <el-button type="primary" @click="handleUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {page, addObj, getObj, putObj, delObj} from '@/api/erp/oa/contactsGroup';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage';
  import userDialog from '@/components/ERP/User/user';

  export default {
    name: "group",
    data() {
      const validateGroupMember = (rule, value, callback) => {
        if (this.groupUser.length==0) {
          callback(new Error('请选择群组成员'))
        } else {
          callback()
        }
      };
      return {
        listQuery: {
          page: 1,
          limit: 20
        },
        total: undefined,
        list: [],
        selectedRows: [],
        dataForm: {
          groupName: undefined,
          groupDescription: undefined,
          groupIcon: undefined,
          groupUser: undefined,
          groupUserName: undefined,
          groupManager:this.$store.state.user.name
        },
        rules: {
          groupName: [
            {
              required: true,
              message: '请填写群组名称',
              trigger: 'blur'
            }
          ],
          groupUserName: [
            {
              required: true,
              validator: validateGroupMember
            }
          ]
        },
        detailData: undefined,
        groupUser: [],
        groupUserName: [],
        uploadPath,
        newsData: [],
        voteData: [],
        memberData: [],
        questionnaireData: [],
        activeName: 'first',
        userVisible: false,
        groupDialogVisible: false,
        groupDescDialogVisible: false,
        groupMemberDialogVisible: false,
        dialogTitle:'创建群组'
      }
    },
    components: {
      userDialog
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        page(this.listQuery).then(response => {
          this.list = response.records;
          this.total = response.total;
        });
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      //分页
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },

      //创建
      resetDataForm() {
        this.dataForm = {
          groupName: undefined,
          groupDescription: undefined,
          groupIcon: undefined,
          groupUser: undefined,
          groupUserName: undefined,
          groupManager:this.$store.state.user.name
        };
        this.groupUser = [];
        this.groupUserName = [];
      },
      handleCreateShow() {
        this.dialogTitle='创建群组';
        this.groupDialogVisible = true;
        this.resetDataForm();
      },
      handleSubmit() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {

            this.dataForm.groupUser = this.groupUser.join(',');
            this.dataForm.groupUserName = this.groupUserName.join(',');

            if (this.dataForm.id) {
              this.handleUpdateSubmit();
            } else {
              this.handleCreateSubmit();
            }

          } else {
            return false
          }
        })
      },
      handleCreateSubmit() {
        addObj(this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.groupDialogVisible = false;
            this.resetDataForm();
            this.getList();
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
      handleUpdateShow() {
        if (!this.handleCheckdSelectRow()) {
          return;
        }

        this.dialogTitle='编辑群组';
        getObj(this.selectedRows[0].id).then(response => {
          this.groupDialogVisible = true;
          this.dataForm = response.data;
          this.groupUser = response.data.groupUser.split(',');
          this.groupUserName = response.data.groupUserName.split(',');
        });
      },
      handleUpdateSubmit() {
        putObj(this.dataForm.id, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
            this.groupDialogVisible = false;
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
      handleCheckdSelectRow() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能选择一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        return true;
      },
      handleDel() {
        if (!this.handleCheckdSelectRow()) {
          return;
        }

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.selectedRows[0].id).then(response => {
            if (response.code == '2000') {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            }
          });
        });
      },


      //选择群组成员
      handleUserShow() {
        this.userVisible = true;
      },
      handleUserCancel() {
        this.userVisible = false;
        //this.$refs.userDialog.reset();
      },
      handleUserSubmit() {
        this.$refs.userDialog.onSubmit();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          this.groupUser = [];
          this.groupUserName = [];
          for (var i in list) {
            this.groupUser.push(list[i].id);
            this.groupUserName.push(list[i].name);
          }
          //this.$refs.userDialog.reset();
        }
      },
      handleUserDel(index) {
        this.groupUser.splice(index, 1);
        this.groupUserName.splice(index, 1);
        this.$refs.userDialog.handleTagClose(index);
      },


      handleGroupInfoShow(id) {
        this.groupDescDialogVisible = true;
        getObj(id).then(response => {
          this.detailData = response.data;
        });
      },
      handleGroupMemberList() {
        this.groupMemberDialogVisible = true;
      },
      handleFileSuccess(response) {
        this.dataForm.groupIcon = response.data.url;
      }
    }
  }
</script>

<style scoped lang="scss">
  .group-div {
    padding: 20px;

    .publicTable {
      width: 100%;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;
      margin-bottom: 30px;

      td {
        border: 1px solid #e0e0e0;
        height: 45px;
        padding: 0px 10px 0px 20px;
        margin: 0px;
      }

      .el-col {
        margin: 0px;
      }
    }
  }
</style>
<!--弹窗高度到最大-->
<style lang="scss">
  .group-div {
    .el-form{
      .el-form-item__label {
        white-space: nowrap;
      }
    }
    .groupDescDialog {
      .el-dialog {
        margin-top: 0vh !important;
        margin-bottom: 0vh !important;
        height: 100vh !important;
        min-width: 1000px;
      }

      .el-dialog__footer {
        position: absolute;
        width: 100%;
        bottom: 20px;
      }
    }
    .avatar-uploader {
      height: 50px;

      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 50px;
        height: 50px;
      }

      .el-upload:hover {
        border-color: #20a0ff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }

      .avatar {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
    .el-tag {
      margin-right: 5px;
    }
  }
</style>
