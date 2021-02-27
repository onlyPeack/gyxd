<template>
  <div class="notice-div">
    <el-container>
      <el-header>
        <!-- <el-select clearable placeholder="优先级" style="width: 200px" class="filter-item" v-model="listQuery.level">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select> -->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="标题" v-model="listQuery.title"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <!-- <el-input clearable class="filter-item" style="width: 200px;" placeholder="内容" v-model="listQuery.content"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker clearable style="width: 200px;" v-model="listQuery.issueTime" type="date"
                        placeholder="发版时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker> -->
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="resetListQuery">重置</el-button>
        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreateShow">新建
        </el-button>
      </el-header>
      <el-container>
        <!--列表-->
        <el-aside width="40%">
          <div class="notice-item" v-if="list && list.length>0" v-for="item in list" :key="item.id"
               @click.stop="handleDetailsShow(item.id)">
            <el-card>
              <div slot="header">
                <div class="header-img"></div>
                <div class="header-title">
                  <span class="hoverClass">{{item.crtUserName}}</span>
                </div>
                <!-- <span style="float: right; padding: 3px 0">
                   发版日志
                </span> -->
              </div>
              <div style="padding: 15px; font-size: 16px">
                <span class="hoverClass" @click.stop="handleDetailsShow(item.id)">{{item.title}}</span>
                <div class="card-bottom">
                  <span>{{item.crtTime}}</span>
                  <div class="card-function">
                    <el-button type="text" @click.stop="handleDel(item.id)"><i
                      class="iconfont icon-weibiaoti6"></i>删除
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-aside>
        <el-main>
          <!--创建-->
          <div class="create-notice" v-if="!detailsOrCreateVisible">
            <div class="create-main" :style="{height: clientHeight +'px'}" style="overflow: auto;">
              <div class="type-title">
              <span>
                <i class="iconfont icon-gonggao"></i>新建版本日志
              </span>
              </div>
              <el-row>
                <el-col :span="24">
                  <span><span class="notice-required">*</span>标题</span>
                </el-col>
                <el-col :span="24">
                  <el-input v-model="dataForm.title" style="width: 100%"></el-input>
                </el-col>
                <el-col :span="24">
                  <editor v-model="dataForm.content" style="width: 99%" :init="editorInit"></editor>
                </el-col>
                <!-- <el-col :span="24">
                  <span><span class="notice-required">*</span>发送范围</span>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="dataForm.receiveType" style="width: 100%;" @change="handleReceiverChange">
                    <el-option v-for="item in receiveTypeOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <span><span class="notice-required">*</span>接收对象</span>
                </el-col>
                <el-col :span="24" class="create-selector">
                <span @click="handleReceiverShow">
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="(tag,tagIndex) in receiverName" :key="6666-tagIndex" closable size="medium"
                          @close="handleReceiverDel(tagIndex)">
                    {{tag}}
                  </el-tag>
                </el-col>
                <el-col :span="24">
                  <span><span class="notice-required">*</span>优先级</span>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="dataForm.level" style="width: 100%;">
                    <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-col> -->
              </el-row>
            </div>
            <div class="right-footer">
              <span class="two">
                  <el-button @click="handleCreateCancel">取消</el-button>
                  <el-button type="primary" @click="handleSubmit(1)">发送</el-button>
                </span>
            </div>
          </div>
          <!--详情-->
          <div class="notice-details" v-if="detailsOrCreateVisible && detailData">
            <div class="right-main" :style="{height: clientHeight +'px'}">
              <div class="type-title">
                <span>
                  <i class="iconfont icon-gonggao"></i>
                  发版日志
                </span>
              </div>
              <div class="right-content">
                <div class="header-item">
                  <div class="header-img"></div>
                  <div class="header-title">
                    <span class="hoverClass">{{detailData.crtUserName}}</span>
                    <span>{{detailData.crtTime}}</span>
                    <span>编辑</span>
                  </div>
                </div>
                <div class="header-cont">
                  <span>{{detailData.title}}</span>
                </div>
              </div>
              <div class="main-bottom">
                <div class="content" v-html="detailData.content"></div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--接收人-->
    <!--用户-->
    <el-dialog title="请选择人员" :visible.sync="userVisible" append-to-body>
      <user-dialog @closeUserDialog="closeUserDialog" :isSingle="false"
                   ref="userDialog"></user-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUserCancel">取 消</el-button>
        <el-button type="primary" @click="handleUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--部门-->
    <el-dialog title="请选择人员" :visible.sync="departVisible" append-to-body>
      <depart-dialog @closeDepartDialog="closeDepartDialog" :isSingle="false"
                     ref="departDialog"></depart-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDepartCancel">取 消</el-button>
        <el-button type="primary" @click="handleDepartSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--群组-->
    <el-dialog title="请选择人员" :visible.sync="groupVisible" append-to-body>
      <group-dialog @closeGroupDialog="closeGroupDialog" :isSingle="false"
                    ref="groupDialog"></group-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleGroupCancel">取 消</el-button>
        <el-button type="primary" @click="handleGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--公司-->
    <el-dialog title="请选择人员" :visible.sync="customerVisible" append-to-body>
      <customer-dialog @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                       ref="customerDialog"></customer-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCustomerCancel">取 消</el-button>
        <el-button type="primary" @click="handleCustomerSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { page, addObj, getObj, delObj } from "@/api/erp/oa/oaIssueLog";
  import PersonalDynamicsDialog from "./personalDynamicsDialog";
  import userDialog from '@/components/ERP/User/user';
  import departDialog from '@/components/ERP/Depart/depart';
  import customerDialog from '@/components/ERP/Customer/customerSelector';
  import groupDialog from '@/components/ERP/Group/groupSelector';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage'

  export default {
    name: "notice",
    components: {
      PersonalDynamicsDialog,
      userDialog,
      departDialog,
      groupDialog,
      customerDialog,
      'Editor': () => import('@tinymce/tinymce-vue'),
    },
    data() {
      return {
        listQuery: {
          level: undefined,
          title:undefined,
          content:undefined,
          issueTime: undefined,
        },
        detailsOrCreateVisible: true,
        replyVisible: false,
        userVisible: false,
        departVisible: false,
        groupVisible: false,
        customerVisible: false,
        clientHeight: 300,
        receiver: [],
        receiverName: [],
        dataForm: {
          type: 1,
          level: 1,
          title: undefined,
          content: undefined,
          receiver: undefined,
          attachment: undefined,
          receiveType: 1,
          state: 0
        },
        receiveTypeOptions: [
          {
            value: 0,
            label: '所有人',
          }, {
            value: 1,
            label: '个人',
          }, {
            value: 2,
            label: '部门',
          }, {
            value: 3,
            label: '群组',
          }/*, {
            value: 4,
            label: '公司',
          }*/
        ],
        levelOptions: [
          {
            value: 1,
            label: '低',
          }, {
            value: 2,
            label: '中',
          }, {
            value: 3,
            label: '高',
          }
        ],
        detailData: undefined,
        list: [],
        disableTabs: false,
        uploadPath,
        attachmentList: undefined,
        editorInit: {
          language: 'zh_CN',
          plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
          toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
          images_upload_handler: function (blobInfo, success, failure) {
            const formData = new FormData();
            formData.append('file', blobInfo.blob());
            createStorage(formData).then(res => {
              success(res.data.data.url)
            }).catch(() => {
              failure('上传失败，请重新上传')
            })
          }
        }
      }
    },
    component: {
      'personalDialog': () => import('@/views/erp/oa/personalDynamicsDialog'),
    },
    watch: {
      '$route.query'(val) {
        this.getList(val.id);
      }
    },
    mounted() {
      this.changeDivHeight();
      if (this.$route.query && this.$route.query.id) {
        this.getList(this.$route.query.id);
      } else {
        this.getList();
      }
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        this.clientHeight = (document.body.clientHeight - 220) * 0.98;
      },
      getList(id) {
        page(this.listQuery).then(response => {
          this.list = response.records;
          if (response.records.length > 0) {
            if (id) {
              this.handleDetailsShow(id);
            } else {
              this.handleDetailsShow(this.list[0].id);
            }
          } else {
            this.detailData = undefined;
          }
        });
      },
      handleFilter() {
        this.getList();
      },
      resetListQuery() {
        this.listQuery = {
          level: undefined,
          title:undefined,
          content:undefined,
          issueTime: undefined,
        };
        this.getList();
      },

      /*创建*/
      resetDataForm() {
        this.dataForm = {
          type: 1,
          level: 1,
          title: undefined,
          content: undefined,
          receiver: undefined,
          receiverName: undefined,
          attachment: undefined,
          receiveType: 1,
          state: 0
        };
        this.attachmentList = [];
        this.receiver = [];
        this.receiverName = [];
      },
      handleCreateShow() {
        this.detailsOrCreateVisible = false;
        this.replyVisible = false;
        this.disableTabs = false;
        this.resetDataForm();
      },
      handleCreateCancel() {
        this.detailsOrCreateVisible = true;
      },
      handleSubmit(type) {
        this.dataForm.type = type;
        if (this.dataForm.title == undefined || this.dataForm.title == '') {
          this.$message.error('请输入标题');
          return;
        }
        if (this.dataForm.content == undefined || this.dataForm.content == '') {
          this.$message.error('请输入正文');
          return;
        }
        this.handleCreate();
        // if (this.dataForm.receiveType != 0 && (this.receiver == undefined || this.receiver.length == 0)) {
        //   this.$message.error('请选择接收对象');
        //   return;
        // }

        // this.dataForm.receiver = this.receiver.length > 0 ? this.receiver.join(',') : undefined;
        // this.dataForm.receiverName = this.receiverName.length > 0 ? this.receiverName.join(',') : undefined;

        // if (this.attachmentList && this.attachmentList.length > 0) {
        //   this.dataForm.attachment = this.attachmentList;
        // } else {
        //   this.dataForm.attachment = undefined;
        // }

        // if (this.dataForm.id) {
        //   this.handleUpdate();
        // } else {
        //   this.handleCreate();
        // }
      },
      handleCreate() {
        addObj(this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
            this.resetDataForm();
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
      handleUpdateShow(id) {
        getObj(id).then(response => {
          this.dataForm = response.data;
          this.detailsOrCreateVisible = false;
          this.disableTabs = true;
          if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
            this.attachmentList = JSON.parse(response.data.attachment);
          } else {
            this.attachmentList = [];
          }

          this.receiver = response.data.receiver ? response.data.receiver.split(',') : [];
          this.receiverName = response.data.receiverName ? response.data.receiverName.split(',') : [];
        });
      },
      handleUpdate() {
        putObj(this.dataForm.id, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.getList(this.dataForm.id);
            this.disableTabs = false;
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
      handleDel(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(id).then(response => {
            if (response.code == '2000') {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              });
              if (this.list.length == 1) {
                this.detailData = undefined;
              }
              this.getList();
            }
          });

        });

      },

      /*获取详情*/
      handleDetailsShow(id, isReply) {
        this.resetDataForm();
        getObj(id).then(response => {
          this.detailData = response.data;
          this.detailsOrCreateVisible = true;
          this.disableTabs = false;

          if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
            this.detailData.attachment = JSON.parse(response.data.attachment);
          } else {
            this.detailData.attachment = undefined;
          }
        });
      },
      /*接收人*/
      handleReceiverChange() {
        if (this.dataForm.receiveType == 0) {
          this.receiver = ['所有人'];
          this.receiverName = ['所有人'];
        } else {
          this.receiver = [];
          this.receiverName = [];
        }
      },
      handleReceiverShow() {
        if (this.dataForm.receiveType == 1) {
          this.handleUserShow();
        } else if (this.dataForm.receiveType == 2) {
          this.handleDepartShow();
        } else if (this.dataForm.receiveType == 3) {
          this.handleGroupShow();
        } else if (this.dataForm.receiveType == 4) {
          this.handleCustomerShow();
        }
      },
      handleReceiverDel(index) {
        if (this.dataForm.receiveType == 0) {
          return;
        }

        this.receiver.splice(index, 1);
        this.receiverName.splice(index, 1);
        if (this.dataForm.receiveType == 1) {
          this.$refs.userDialog.handleTagClose(index);
        } else if (this.dataForm.receiveType == 2) {
          this.$refs.departDialog.reset();
        } else if (this.dataForm.receiveType == 3) {
          this.$refs.groupDialog.handleTagClose(index);
        } else if (this.dataForm.receiveType == 4) {
          this.$refs.customerDialog.handleTagClose(index);
        }
      },
      /*选择人员*/
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
          this.receiver = [];
          this.receiverName = [];
          for (var i in list) {
            this.receiver.push(list[i].id);
            this.receiverName.push(list[i].name);
          }
          //this.$refs.userDialog.reset();
        }
      },

      /*选择部门*/
      handleDepartShow() {
        this.departVisible = true;
      },
      handleDepartCancel() {
        this.departVisible = false;
        //this.$refs.departDialog.reset();
      },
      handleDepartSubmit() {
        this.$refs.departDialog.onSubmit();
      },
      closeDepartDialog(depart) {
        this.departVisible = false;
        if (depart.id) {
          this.receiver = [];
          this.receiverName = [];
          this.receiver.push(depart.id);
          this.receiverName.push(depart.label);
          //this.$refs.departDialog.reset();
        }
      },

      /*选择群组*/
      handleGroupShow() {
        this.groupVisible = true;
      },
      handleGroupCancel() {
        this.groupVisible = false;
        //this.$refs.groupDialog.reset();
      },
      handleGroupSubmit() {
        this.$refs.groupDialog.onSubmit();
      },
      closeGroupDialog(list) {
        this.groupVisible = false;
        if (list.length > 0) {
          this.receiver = [];
          this.receiverName = [];
          for (var i in list) {
            this.receiver.push(list[i].id);
            this.receiverName.push(list[i].groupName);
          }
          //this.$refs.groupDialog.reset();
        }
      },

      /*选择公司*/
      handleCustomerShow() {
        this.customerVisible = true;
      },
      handleCustomerCancel() {
        this.customerVisible = false;
        //this.$refs.customerDialog.reset();
      },
      handleCustomerSubmit() {
        this.$refs.customerDialog.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerVisible = false;
        if (list.length > 0) {
          this.receiver = [];
          this.receiverName = [];
          for (var i in list) {
            this.receiver.push(list[i].id);
            this.receiverName.push(list[i].customerName);
          }
          //this.$refs.customerDialog.reset();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .notice-div {
    padding: 15px;
    min-width: 1280px;

    .header-img {
      width: 48px;
      height: 48px;
      float: left;
      border-radius: 3px;
      overflow: hidden;
      background-color: #409EFF;
    }

    .hoverClass:hover {
      cursor: pointer;
      color: #4A9DE9;
    }

    .el-aside {
      height: 81vh;
      padding: 10px;
      border-top: #cccccc solid 1px;
      border-right: #cccccc solid 1px;

      .notice-item {
        padding-top: 15px;
        padding-right: 10px;

        .el-card {
          .header-title {
            float: left;
            padding-left: 20px;
            padding-top: 15px;
            font-size: 16px;

            span {
              margin-right: 5px;
            }
          }

          .el-card__body .hoverClass {
            display: block;
            max-height: 34px;
            font-size: 14px;
            overflow: hidden;
          }

          .card-bottom {
            color: #999;
            margin-top: 10px;
            font-size: 12px;

            span {
              height: 24px;
              line-height: 24px;
              margin-top: 10px;
            }

            .card-function {
              float: right;
              font-size: 14px;

              .el-button {
                color: #999;
                .iconfont {
                  margin-right: 5px;
                  position: relative;
                  top: 2px;
                }
              }
              .el-button:hover {
                color: #4A9DE9;
              }

            }
          }
        }
      }
    }

    .el-main {
      border-top: #cccccc solid 1px;
      height: 81vh;
      float: left;
      padding: 0px;
      position: relative;

      .type-title {
        width: 100%;
        padding: 20px 30px 0px 30px;

        span {
          display: block;
          font-size: 16px;

          .iconfont {
            color: #409EFF;
            margin-right: 5px;
            font-weight: bold;
            font-size: 18px;
          }
        }
      }

      .create-notice {
        font-size: 14px;
        color: #606266;

        .notice-required {
          color: #f56c6c;
          margin-right: 4px;
        }
        .type-title {
          padding: 20px 30px;
        }
        .el-row {
          padding: 0px 10px;
        }
        .el-col-24 {
          margin-bottom: 10px;
        }
        .create-selector {
          padding: 10px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
        .mce-panel {
          width: 98% !important;
        }
      }
    }

    .notice-details {
      overflow: hidden;
      .right-main {
        overflow: auto;
        .right-content {
          width: 100%;
          padding: 20px 0px 0px 30px;

          .header-item {
            height: 60px;

            .header-title {
              float: left;
              padding-left: 20px;
              padding-top: 15px;
              font-size: 16px;

              span {
                margin-right: 5px;
              }
            }
          }

          .header-cont {
            width: 100%;
            font-size: 14px;
            padding: 5px 0;
            border-bottom: #cccccc solid 1px;
          }

        }

        .main-bottom {
          margin-right: 15px;
          margin-bottom: 15px;
          font-size: 14px;
          .content {
            margin-left: 30px;
            line-height: 14px;
            margin-top: 5px;
          }

          .reply-div {
            padding: 15px 0px 0px 40px;

            .header-item {
              height: 40px;

              .header-title {
                float: left;
                padding-left: 20px;
                padding-top: 10px;
                font-size: 12px;
                width: 95%;

                span {
                  margin-right: 5px;
                  float: left;
                }

                .reply-time {
                  float: right;
                  color: #888;
                  height: 28px;
                  line-height: 28px;
                  .el-button {
                    display: none;
                    color: #888;
                  }
                }
              }
              .header-title:hover .reply-time > span {
                display: none;
              }
              .header-title:hover .reply-time .el-button {
                display: inline-block;
              }

            }

            .header-cont {
              width: 100%;
              font-size: 12px;
              padding-left: 45px;
              color: #888;
              margin-bottom: 10px;
            }

            .reply-annex-item {
              cursor: pointer;
              color: #c8c9cc;
              padding-left: 45px;
              height: 29px;
              line-height: 29px;
              .reply-annex-cz {
                display: none;
                float: right;
              }
            }

            .reply-annex-item:hover .reply-annex-cz {
              display: inline-block;
            }

          }

          .annex-div {
            padding: 20px 0px 0px 40px;
            font-size: 14px;

            .el-col {
              height: 28px;
              line-height: 28px;
            }

            .annex-item {
              cursor: pointer;

              .annex-bottom {
                display: none;
                float: right;
              }
            }

            .annex-item:hover .annex-bottom {
              display: inline-block;
            }
          }

          .record-div {
            padding: 15px 0px 0px 40px;
            font-size: 14px;
            color: #c8c9cc;
          }
        }
      }
    }

    .right-footer {
      width: 100%;
      position: absolute;
      bottom: 0px;
      font-size: 14px;
      z-index: 1900;
      padding: 15px 20px 0px 20px;
      border-top: #cccccc solid 1px;
      background-color: #fff;

      .el-button {
        .iconfont {
          margin-right: 5px;
          position: relative;
          top: 2px;
        }
      }

      .one {
        float: left;
        .attachment-upload {
          display: inline-block;
        }
      }

      .two {
        float: right;
      }
    }
  }
</style>
<style lang="scss">
  .notice-div {
    .el-card {
      .el-card__header {
        padding: 15px;
        height: 80px;
      }

      .el-card__body {
        padding: 0px !important;
      }
    }

    .create-notice {
      .el-form-item__label {
        white-space: nowrap;
      }

      .el-input input.el-input__inner {
        text-align: left;
      }

      .attachment-upload {
        .el-upload {
          vertical-align: top;
        }
        .el-upload-list {
          display: inline-block;
          margin-left: 15px;
        }
      }
      .el-tag {
        margin-right: 5px;
      }
    }

    .personalDynamicsDialog {
      .el-dialog {
        margin-top: 0vh !important;
        margin-bottom: 0vh !important;
        height: 100vh !important;
        min-width: 1000px;
      }
    }
  }
</style>

