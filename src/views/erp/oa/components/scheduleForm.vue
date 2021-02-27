<template>
  <div class="task-create-div">
    <el-container>
      <el-main>
        <!--创建-->
        <div class="create-task" v-if="!detailsOrCreateVisible">
          <div class="type-title">
                <span>
                  <i class="iconfont icon-queren"></i>发起任务
                </span>
          </div>
          <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="80px" size="medium">
            <div class="right-top">
              <table class="task-table">
                <tr>
                  <td colspan="2">
                    <el-form-item class="span-item" prop="content">
                      <el-input v-model="dataForm.content" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label="开始日期:" prop="beginDate">
                      <el-date-picker v-model="dataForm.beginDate" type="datetime"
                                      placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"
                                      format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item label="结束日期:" prop="endDate">
                      <el-date-picker v-model="dataForm.endDate" type="datetime"
                                      placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                      format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <el-form-item label="执行人:" prop="executorName">
                            <span @click="handleUserShow">
                              <svg-icon icon-class="add"></svg-icon>
                            </span>
                      <el-tag v-for="(tag,tagIndex) in executorName" :key="6666-tagIndex" closable size="medium"
                              @close="handleUserDel(tagIndex)">
                        {{tag}}
                      </el-tag>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <el-form-item label="优先级:" required>
                      <el-select v-model="dataForm.level" style="width: 100%;">
                        <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <el-form-item label="提醒:" required>
                      <el-select v-model="dataForm.remind" style="width: 100%;">
                        <el-option v-for="item in remindOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <el-form-item label="提醒方式:" required>
                      <el-select v-model="dataForm.remindType" style="width: 100%;">
                        <el-option v-for="item in remindTypeOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                </tr>
                <!--<tr>
                  <td colspan="2">
                    <el-form-item label="工期(天):">
                      <el-input placeholder="请输入工期"></el-input>
                    </el-form-item>
                  </td>
                </tr>-->
                <tr>
                  <td colspan="2">
                    <el-form-item label="附件:">
                      <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                                 :on-success="handleFileSuccess"
                                 :on-remove="handleFileRemove"
                                 :file-list="attachmentList">
                        <svg-icon icon-class="add"></svg-icon>
                      </el-upload>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
            <div class="right-footer">
                <span class="one">
                  <!--<el-upload :action="uploadPath" :show-file-list="true" :on-success="uploadPicUrl"
                             :on-remove="handleFileRemove" :file-list="attachmentList">
                    <el-button slot="trigger" type="text"><i class="iconfont icon-fujian2"></i>附件</el-button>
                  </el-upload>-->
                </span>
              <span class="two">
                  <el-button @click="handleCreateCancel">取消</el-button>
                  <el-button type="primary" @click="handleSubmit" :loading = "isLoading">发送</el-button>
                </span>
            </div>
          </el-form>
        </div>
        <!--详情-->
        <div class="task-details" v-if="detailsOrCreateVisible && detailData">
          <div class="right-main" :style="{height: clientHeight +'px'}">
            <div class="type-title">
                <span>
                  <i class="iconfont icon-queren"></i>
                  任务
                </span>
            </div>
            <div class="right-content">
              <div class="header-item">
                <div class="header-img"></div>
                <div class="header-title">
                  <span class="hoverClass" @click="handlePersonalShow">{{detailData.crtUserName}}</span>
                  <span>{{detailData.crtTime}}</span>
                  <span>发起</span>
                </div>
              </div>
              <div class="header-cont">
                {{detailData.content}}
              </div>
            </div>
            <div class="main-bottom">
              <ul>
                <li>任务时间：{{detailData.beginDate}} {{detailData.endDate ? ' 至 '+detailData.endDate:''}}</li>
                <li>执行人：{{detailData.executorName}}</li>
                <li>任务优先级：{{detailData.level==1?'低':detailData.level==2?'中':'高'}}</li>
                <li>任务状态： {{detailData.state==0?'未完成':detailData.state==1?'已完成':'重启'}}</li>
                <li v-if="detailData.score">
                  评分：
                  <i class="iconfont icon-pingfenxingxing icon-pingfenxingxing-active"
                     v-for="i in parseInt(detailData.score/2)" :key="99999-i"></i>
                  <i v-if="parseInt(detailData.score/2)!=5">
                    <i class="iconfont icon-bankexing icon-pingfenxingxing-active"
                       v-if="detailData.score%2!=0"></i>
                    <i class="iconfont icon-pingfenxingxing"
                       v-if="detailData.score%2!=0"
                       v-for="i in 4-parseInt(detailData.score/2)" :key="10000-i"></i>
                    <i class="iconfont icon-pingfenxingxing"
                       v-if="detailData.score%2==0"
                       v-for="i in 5-parseInt(detailData.score/2)" :key="10000-i"></i>
                  </i>
                  {{detailData.score}}分
                </li>
                <li v-if="detailData.score">评价：{{detailData.scoreWord?detailData.scoreWord:'无评价'}}</li>
              </ul>

              <div class="read-status" v-if="detailData.status">
                   <span v-if="detailData.status === 1">
                     <svg-icon icon-class="readState" color="gray"></svg-icon>
                     <span>未阅</span>
                   </span>
                <span v-if="detailData.status === 2">
                    <el-row>
                      <el-col :span="12">
                        <svg-icon icon-class="readState" color="#409EFF"></svg-icon>
                      <span>已阅</span>
                      </el-col>
                    </el-row>
                   </span>
              </div>
              <!--附件-->
              <div class="annex-div" v-if="detailData.attachment && detailData.attachment.length>0">
                <el-row>
                  <el-col :span="22">附件</el-col>
                  <el-col :span="2">
                    <el-button type="text" class="text-right">全部下载</el-button>
                  </el-col>
                </el-row>

                <el-row v-for="atta in detailData.attachment" :key="atta.uid" class="annex-item">
                  <el-col :span="16">
                    <i class="el-icon-document"></i>
                    <span style="margin-left: 20px">{{atta.name}}</span>
                  </el-col>
                  <el-col :span="8">
                      <span class="annex-bottom">
                         <!--<a :href="atta.url" :download="atta.name" mce_href="#">下载</a>-->
                         <el-button type="text" @click="handleAttachmentDownLoad(atta.url)"><svg-icon
                           icon-class="import1"></svg-icon>下载</el-button>
                         <el-button type="text"><svg-icon icon-class="export"></svg-icon>归档</el-button>
                      </span>
                  </el-col>
                </el-row>
              </div>
              <!--评论-->
              <div class="reply-div" v-if="detailData.comments && detailData.comments.length>0"
                   v-for="(comment,commentIdx) in detailData.comments" :key="commentIdx">
                <div class="header-item">
                  <div class="notice-img"></div>
                  <div class="header-title">
                    <span><a href="javascript:void(0)" @click="handlePersonalShow">{{comment.fromUserName}}</a></span>
                    <span v-if="comment.toUser"> 回复 <a href="javascript:void(0)" @click="handlePersonalShow">{{comment.toUserName}}</a> </span>
                    <span class="reply-time">
                        <span>{{comment.crtTime}}</span>
                        <el-button type="text"
                                   @click="handleReplyShow(detailData.id,comment.id,comment.crtUserId,comment.fromUserName)">
                          回复
                        </el-button>
                      </span>

                  </div>
                </div>
                <div class="header-cont">
                  {{comment.content}}
                </div>
                <!--评论中的附件-->
                <el-row v-if="comment.attachment && comment.attachment.length>0" v-for="atta in comment.attachment"
                        :key="atta.uid" class="reply-annex-item">
                  <el-col :span="16">
                    <i class="el-icon-document"></i>
                    <span style="margin-left: 20px">{{atta.name}}</span>
                  </el-col>
                  <el-col :span="8">
                      <span class="reply-annex-cz">
                         <el-button type="text" @click="handleAttachmentDownLoad(atta.url)"><svg-icon
                           icon-class="import1"></svg-icon>下载</el-button>
                         <el-button type="text"><svg-icon icon-class="export"></svg-icon>归档</el-button>
                      </span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="right-footer" v-if="!replyVisible">
              <span class="one">
                <el-button type="text" @click="handleEditState(detailData,1)" v-if="detailData.state==0"><i
                  class="iconfont icon-gou"></i>完成</el-button>
                <!--<el-button type="text" @click=""><i class="iconfont icon-queren2"></i>确认</el-button>-->
                <el-button type="text" @click="handleUpdateShow(detailData.id)"><i class="iconfont icon-tianxie"></i>编辑</el-button>
                <el-button type="text" @click="handleEditState(detailData,0)" v-if="detailData.state==1"><i
                  class="iconfont icon-shuaxin1"></i>重启</el-button>
                <el-button type="text" @click="openTaskRecordDialog(detailData.id)" v-if="detailData.state==1"><i
                  class="iconfont icon--pingfen"></i>评分</el-button>

                <el-dropdown trigger="click">
                  <el-button type="text"><i class="iconfont icon-gengduo1"></i>更多</el-button>
                  <el-dropdown-menu slot="dropdown" class="more-dropdown">
                    <el-dropdown-item>
                      <el-button type="text" @click="handleDel(detailData.id)"><i
                        class="iconfont icon-weibiaoti6"></i>删除
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" @click.stop="openTaskForwardDialog(detailData.id)"><i
                        class="iconfont icon-zhuanfa"></i>转发
                      </el-button>
                    </el-dropdown-item>
                    <!--<el-dropdown-item>
                      <el-button type="text" @click.stop=""><i class="iconfont icon-fuzhi"></i>复制
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" @click.stop=""><i class="iconfont icon-zirenwu"></i>子任务
                      </el-button>
                    </el-dropdown-item>-->
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            <span class="two">
                <el-button type="text" @click="handleReplyShow(detailData.id)"><i
                  class="iconfont icon-icon_huifu-xian"></i>回复</el-button>
              </span>
          </div>
          <!--回复框-->
          <div class="right-footer" v-if="replyVisible">
            <el-input type="textarea" :autosize="{ minRows: 2}"
                      style="width: 100%; margin-bottom: 10px" v-model="comment.content"
                      :placeholder="commentToUser ? '回复'+commentToUser+'：':'回复：'">
            </el-input>
            <span class="one">
                <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                           :on-success="handleFileSuccess"
                           :on-remove="handleFileRemove"
                           :file-list="attachmentList">
                  <el-button slot="trigger" type="text"><i class="iconfont icon-fujian2"></i>附件</el-button>
                </el-upload>
              </span>
            <span class="two">
                <el-button @click="handleReplyCancel">取消</el-button>
                <el-button type="primary" @click="handleReplySubmit">发送</el-button>
              </span>
          </div>
        </div>
      </el-main>
    </el-container>

    <!-- 个人动态弹窗 -->
    <el-dialog title="个人动态" :visible.sync="personalDialogVisible" width="70%" class="personalDynamicsDialog"
               :before-close="handlePersonalCancel">
      <personal-dynamics-dialog></personal-dynamics-dialog>
    </el-dialog>

    <!--执行人-->
    <el-dialog title="请选择人员" :visible.sync="userVisible" append-to-body>
      <user-dialog @closeUserDialog="closeUserDialog" :isSingle="false"
                   ref="userDialog"></user-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUserCancel">取 消</el-button>
        <el-button type="primary" @click="handleUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--评分-->
    <schedule-record :dialogVisible="taskRecordDialogVisible" @taskRecordSubmitSuccess="taskRecordSubmitSuccess"
                     @closeTaskRecordDialog="closeTaskRecordDialog" :id="taskId"
                     v-if="taskRecordDialogVisible"></schedule-record>

    <!--转发-->
    <schedule-forward :dialogVisible="taskForwardDialogVisible" @taskForwardSubmitSuccess="taskForwardSubmitSuccess"
                      @closeTaskForwardDialog="closeTaskForwardDialog" :id="taskId"
                      v-if="taskForwardDialogVisible"></schedule-forward>

  </div>
</template>

<script>
  import PersonalDynamicsDialog from "../personalDynamicsDialog";
  import scheduleRecord from "../components/scheduleRecord";
  import scheduleForward from "../components/scheduleForward";
  import userDialog from '@/components/ERP/User/user';
  import {page, addObj, getObj, putObj, delObj, addComment, readStatus} from '@/api/erp/oa/schedule';
  import {uploadPath,downloadPath} from '@/api/erp/goods/storage'

  export default {
    name: "scheduleForm",
    props:['scheduleId'],
    components: {
      PersonalDynamicsDialog,
      userDialog,
      scheduleRecord,
      scheduleForward,
    },
    data() {
      const validateExecutorName = (rule, value, callback) => {
        if (this.executorName.length==0) {
          callback(new Error('请选择执行人'))
        } else {
          callback()
        }
      };
      return {
        isLoading:false,
        listQuery: {
          type: undefined,
          receiveName: undefined,
          copyName: undefined,
          content: undefined,
          beginDate: undefined,
          endDate: undefined
        },
        typeOptions: [
          {
            value: 1,
            label: '日志',
          }, {
            value: 2,
            label: '周计划',
          }, {
            value: 3,
            label: '月计划',
          }
        ],
        detailsOrCreateVisible: true,
        replyVisible: false,
        userVisible: false,
        personalDialogVisible: false,
        taskRecordDialogVisible: false,
        taskForwardDialogVisible: false,
        clientHeight: 300,
        remindOptions: [
          {
            value: 0,
            label: '不提醒',
          }, {
            value: 1,
            label: '开始时',
          }, {
            value: 2,
            label: '开始前两小时',
          }, {
            value: 3,
            label: '开始前一天',
          }, {
            value: 4,
            label: '结束时',
          }, {
            value: 5,
            label: '结束前两小时',
          }, {
            value: 6,
            label: '结束前一天',
          }
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
        remindTypeOptions: [
          {
            value: 0,
            label: '不提醒',
          }, {
            value: 1,
            label: '邮件',
          }, {
            value: 2,
            label: '短信',
          }
        ],
        executor: [],
        executorName: [],
        dataForm: {
          beginDate: undefined,
          endDate: undefined,
          type: 1,
          content: undefined,
          receive: undefined,
          receiveName: undefined,
          copy: undefined,
          copyName: undefined,
          executor: undefined,
          executorName: undefined,
          attachment: undefined,
          remind: 0,
          remindType: 0,
          state: 0,
          level: 2
        },
        rules: {
          content: [
            {
              required: true,
              message: '请填写正文',
              trigger: 'blur'
            }
          ],
          beginDate: [
            {
              required: true,
              message: '请选择开始日期',
              trigger: 'blur'
            }
          ],
          endDate: [
            {
              required: true,
              message: '请选择结束日期',
              trigger: 'blur'
            }
          ],
          executorName: [
            {
              required: true,
              validator: validateExecutorName
            }
          ]
        },
        detailData: undefined,
        list: [],
        comment: {
          sourceId: undefined,
          parentId: undefined,
          fromUser: this.$store.state.user.id,
          fromUserName: this.$store.state.user.name,
          toUser: undefined,
          toUserName: undefined,
          content: undefined,
          attachment: undefined
        },
        disableTabs: false,
        commentToUser: '',
        uploadPath,
        attachmentList: undefined,
        commentAttachmentList: undefined,
        taskId: undefined
      }
    },
    component: {
      'personalDialog': () => import('@/views/erp/oa/personalDynamicsDialog'),
    },
    mounted() {
      this.changeDivHeight();
      if(this.scheduleId && this.scheduleId!=''){
        this.handleDetailsShow(this.scheduleId);
      }else{
        this.handleCreateShow();
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
        this.clientHeight = (document.body.clientHeight - 130) * 0.98;
      },
      /*创建*/
      resetDataForm() {
        this.dataForm = {
          beginDate: undefined,
          endDate: undefined,
          type: 1,
          content: undefined,
          receive: undefined,
          receiveName: undefined,
          copy: undefined,
          copyName: undefined,
          executor: undefined,
          executorName: undefined,
          attachment: undefined,
          remind: 0,
          remindType: 0,
          state: 0,
          level: 2
        };
        this.attachmentList = [];
        this.executor = [];
        this.executorName = [];
      },
      handleCreateShow() {
        this.detailsOrCreateVisible = false;
        this.replyVisible = false;
        this.disableTabs = false;
        this.resetDataForm();
      },
      handleCreateCancel() {
        this.$emit('handleScheduleClose',false);
      },
      handleSubmit() {
        this.isLoading = true;
        this.$refs.dataForm.validate(valid => {
          if (valid) {

            this.dataForm.executor = this.executor.join(',');
            this.dataForm.executorName = this.executorName.join(',');

            if (this.attachmentList && this.attachmentList.length > 0) {
              this.dataForm.attachment = this.attachmentList;
            } else {
              this.dataForm.attachment = undefined;
            }

            if (this.dataForm.id) {
              this.handleUpdate();
            } else {
              this.handleCreate();
            }

          } else {
            this.isLoading = false;
            return false
          }
        })

      },
      handleCreate() {
        addObj(this.dataForm).then(response => {
          this.isLoading = false;
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.resetDataForm();
            this.$emit('handleScheduleClose',true);
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

          this.executor = response.data.executor ? response.data.executor.split(',') : [];
          this.executorName = response.data.executorName ? response.data.executorName.split(',') : [];
        });
      },
      handleUpdate() {
        putObj(this.dataForm.id, this.dataForm).then(response => {
          this.isLoading = false;
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('handleScheduleClose',true);
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
      handleEditState(data, state) {
        data.state = state;
        putObj(data.id, data).then(response => {
          if (response.code == '2000') {
            var msg = state == 1 ? '任务已完成' : '任务已重启';
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success',
              duration: 2000
            });
            this.$emit('handleScheduleClose',true);
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
              this.$emit('handleScheduleClose',true);
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
          this.detailData.comments = comments;

          //点击 回复 的则不用隐藏回复框
          if (isReply) {
            this.resetComment();
            this.replyVisible = true;
          } else {
            this.replyVisible = false;
          }

          //改变阅读状态
          if (this.detailData.status == 1) {
            this.changeReadStatus(this.detailData.id);
          }

        });
      },
      /*改变阅读状态已读状态*/
      changeReadStatus(id) {
        readStatus(id, this.$store.state.user.id).then(response => {
          this.detailData.status = 2;
        });
      },

      /*附件*/
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },
      handleAttachmentDownLoad(url) {
        const ele = document.createElement('a');
        ele.setAttribute('href', downloadPath(url)); //设置下载文件的url地址
        ele.click();
      },

      /*个人动态*/
      handlePersonalShow() {
        // this.personalDialogVisible = true;
      },
      handlePersonalCancel() {
        this.personalDialogVisible = false;
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
          this.executor = [];
          this.executorName = [];
          for (var i in list) {
            this.executor.push(list[i].id);
            this.executorName.push(list[i].name);
          }
          //this.$refs.userDialog.reset();
        }
      },
      handleUserDel(index) {
        this.executor.splice(index, 1);
        this.executorName.splice(index, 1);
        this.$refs.userDialog.handleTagClose(index);
      },

      /*回复框*/
      resetComment() {
        this.comment = {
          sourceId: undefined,
          parentId: undefined,
          fromUser: this.$store.state.user.id,
          fromUserName: this.$store.state.user.name,
          toUser: undefined,
          toUserName: undefined,
          content: undefined,
          attachment: undefined
        };
        this.commentToUser = '';
        this.attachmentList = [];
      },
      handleReplyShow(sourceId, parentId, toUser, toUserName) {
        if (!this.detailData.id || sourceId != this.detailData.id) {
          this.handleDetailsShow(sourceId, true);
        }
        this.detailsOrCreateVisible = true;
        this.replyVisible = true;
        this.comment.sourceId = sourceId;
        this.comment.parentId = parentId;
        this.comment.toUser = toUser;
        this.comment.toUserName = toUserName;
        this.commentToUser = toUserName;
      },
      handleReplySubmit() {
        if (this.attachmentList && this.attachmentList.length > 0) {
          this.comment.attachment = this.attachmentList;
        }

        addComment(this.comment).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.replyVisible = false;
            this.resetComment();
            this.handleDetailsShow(this.detailData.id);
          }
        });
      },
      handleReplyCancel() {
        this.replyVisible = false;
        this.resetComment();
      },

      /*评分*/
      taskRecordSubmitSuccess(id) {
        this.handleDetailsShow(id);
        this.taskId = undefined;
        this.taskRecordDialogVisible = false;
      },
      openTaskRecordDialog(id) {
        this.taskId = id;
        this.taskRecordDialogVisible = true;
      },
      closeTaskRecordDialog() {
        this.taskId = undefined;
        this.taskRecordDialogVisible = false;
      },

      /*转发*/
      taskForwardSubmitSuccess(id) {
        this.handleDetailsShow(id);
        this.taskId = undefined;
        this.taskForwardDialogVisible = false;
      },
      openTaskForwardDialog(id) {
        this.taskId = id;
        this.taskForwardDialogVisible = true;
      },
      closeTaskForwardDialog() {
        this.taskId = undefined;
        this.taskForwardDialogVisible = false;
      },
    }
  }
</script>

<style scoped lang="scss">
  .task-create-div {
    .header-img {
      width: 48px;
      height: 48px;
      float: left;
      border-radius: 3px;
      overflow: hidden;
      background-color: #409EFF;
    }

    .el-main {
      height: 92vh;
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

      .create-task {
        //padding-left: 10px;

        .right-top {
          margin-top: 20px;
          padding-left: 10px;

          .task-table {
            width: 100%;
            border: none;
            border-spacing: 0;
            border-collapse: collapse;
            color: #c8c9cc;

            td {
              border: 1px solid #e0e0e0;
              line-height: 35px;

              .el-form-item {
                padding-left: 12px;
                margin-bottom: 0px;
              }
              .svg-icon {
                cursor: pointer;
              }
            }

          }

        }
      }

      .task-details {
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
              padding: 20px 0;
              border-bottom: #cccccc solid 1px;
            }

          }

          .main-bottom {
            margin-right: 15px;
            margin-bottom: 15px;
            font-size: 14px;

            ul {
              list-style: none;
              padding-left: 40px;

              li {
                line-height: 30px;
                padding: 4px 0;
                .icon-pingfenxingxing {
                  color: #e0e0e0;
                }
                .icon-pingfenxingxing-active {
                  color: orangered;
                }
                .icon-bankexing {
                  font-size: 18px;
                  margin: 0px -4px;
                }
              }
            }

            .notice-img {
              width: 28px;
              height: 28px;
              float: left;
              border-radius: 3px;
              overflow: hidden;
              background-color: #409EFF;
            }

            .text-right {
              float: right;
            }

            .read-status {
              line-height: 25px;
              height: 25px;
              padding-left: 40px;
              font-size: 12px;

              .svg-icon {
                width: 25px;
                height: 25px;
                float: left;
                margin-right: 5px;
              }

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
  .more-dropdown {
    overflow: hidden;
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

  .task-create-div {
    .create-task {
      .span-item .el-form-item__content {
        margin-left: 0px !important;

        .el-textarea__inner {
          border: none;
        }

        .el-input__inner {
          border: none;
        }
      }
      .el-form-item__label {
        white-space: nowrap;
      }
      .el-form-item__error {
        position: absolute;
        display: inline-block;
        top: 0px;
        right: 15px;
        text-align: right;
      }

      .el-input input.el-input__inner {
        border: none;
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

