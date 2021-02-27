<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="meetingRoomForm"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="state=='create'">新增会议室预定</span>
        <span v-if="state=='edit'">编辑会议室预定</span>
        <span v-if="state=='detail'">会议室预定详情</span>
      </span>

    <div class="create-conference">
      <!--创建-->
      <div>
        <el-form ref="dataForm" :model="dataForm" label-width="100px" size="medium" v-if="!isDetail" :rules="rules">
          <table class="conference-table">
            <tr>
              <td>
                <el-form-item label="会议室名称:" prop="name">
                  <!--<el-input v-model="dataForm.name"></el-input>-->
                  <el-select v-model="dataForm.name" style="width: 100%;">
                    <el-option v-for="item in meetingRoomOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="主讲人:">
                  <el-input v-model="dataForm.leader"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item class="span-item" label="会议内容:" prop="content">
                  <el-input v-model="dataForm.content" type="textarea" :rows="3"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="开始时间:" prop="beginDate">
                  <el-date-picker v-model="dataForm.beginDate" type="datetime"
                                  placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="结束日期:" prop="endDate">
                  <el-date-picker v-model="dataForm.endDate" type="datetime"
                                  placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </td>
            </tr>
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
        </el-form>
      </div>

      <!--详情-->
      <div v-if="isDetail">
        <el-form label-width="90px" size="medium">
          <table class="conference-table">
            <tr>
              <td>
                <el-form-item label="会议室名称:">
                  <el-select v-model="dataForm.name" style="width: 100%;">
                    <el-option v-for="item in meetingRoomOptions" v-if="dataForm.name==item.value" :key="item.value"
                               :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="主讲人:">
                  <el-input v-model="dataForm.leader" ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item class="span-item" label="会议内容:">
                  <el-input v-model="dataForm.content" type="textarea" :rows="3" ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="开始时间:">
                  <el-date-picker v-model="dataForm.beginDate" type="datetime"
                                  placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="结束日期:">
                  <el-date-picker v-model="dataForm.endDate" type="datetime"
                                  placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr class="single-person">
              <td colspan="2">
                <span style="float: left;">
                  制单人:
                  <span>{{dataForm.crtUserName}}</span>
                </span>
                <span style="float: right">
                  制单时间:
                  <span>{{dataForm.crtTime}}</span>
                </span>
              </td>
            </tr>
          </table>
        </el-form>
        <div class="annex-box" v-if="dataForm.attachment">
          <div class="annex-title">附件</div>
          <el-row v-for="atta in dataForm.attachment" :key="atta.uid" class="annex-item">
            <el-col :span="16">
              <i class="el-icon-document"></i>
              <span style="margin-left: 20px">{{atta.name}}</span>
            </el-col>
            <el-col :span="8">
            <span class="annex-right">
               <el-button type="text" @click="handleAttachmentDownLoad(atta.url)"><svg-icon
                 icon-class="import1"></svg-icon>下载</el-button>
            </span>
            </el-col>
          </el-row>
        </div>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" v-if="state=='detail'" @click="edit">编辑</el-button>
        <el-button type="primary" v-if="state=='create' || state=='edit'" @click="handleSubmit" :loading="isLoading">发送</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script>
  import {page, addObj, getObj, putObj, delObj} from '@/api/erp/oa/meetingRoom';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage';

  export default {
    name: "meetingRoomForm",
    props: ['dialogFormVisible', 'id'],
    data() {
      return {
        isLoading:false,
        dataForm: {
          name: undefined,
          leader: undefined,
          content: undefined,
          attachment: undefined,
          beginDate: undefined,
          endDate: undefined,
        },
        rules: {
          name: [
            {
              required: true,
              message: '请填写会议室名称',
              trigger: 'blur'
            }
          ],
          content: [
            {
              required: true,
              message: '请填写会议内容',
              trigger: 'blur'
            }
          ],
          beginDate: [
            {
              required: true,
              message: '请选择开始时间',
              trigger: 'blur'
            }
          ],
          endDate: [
            {
              required: true,
              message: '请选择结束时间',
              trigger: 'blur'
            }
          ]
        },
        meetingRoomOptions: [
          {
            value: '1',
            label: '会议室1',
          },
          {
            value: '2',
            label: '会议室2',
          },
          {
            value: '3',
            label: '会议室3',
          }
        ],
        state: 'create',
        isDetail: false,
        uploadPath,
        attachmentList: [],
      }
    },
    created() {
      if (this.id && this.id != '') {
        this.isDetail = true;
        this.state = 'detail';
        this.getDetail();
      } else {
        this.state = 'create';
        this.isDetail = false;
      }
    },
    methods: {
      handleClose() {
        this.$emit('handleFormClose');
      },
      edit() {
        this.state = 'edit';
        this.isDetail = false;
      },
      checkdTimeRepeat() {
        page({
          name: this.dataForm.name,
          beginDate: this.dataForm.beginDate,
          endDate: this.dataForm.endDate
        }).then(response => {

          if (response.records.length > 0) {
            this.isLoading = false;
            this.$message.warning('您选择的时间中部分时间段已被预定，请重新选择');
          } else {
            if (this.attachmentList && this.attachmentList.length > 0) {
              this.dataForm.attachment = this.attachmentList;
            } else {
              this.dataForm.attachment = undefined;
            }

            if (this.state == 'edit') {
              this.handleEdit();
            } else {
              this.handleCreate();
            }
          }
        });
      },
      handleSubmit() {
        this.isLoading = true;
        this.$refs.dataForm.validate(valid => {
          if (valid) {

            this.checkdTimeRepeat();

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
            this.$emit('submitFormSuccess');
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
      handleEdit() {
        putObj(this.dataForm.id, this.dataForm).then(response => {
          this.isLoading = false;
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('submitFormSuccess');
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
      getDetail() {
        getObj(this.id).then(response => {
          this.dataForm = response.data;
          if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
            this.dataForm.attachment = JSON.parse(response.data.attachment);
            this.attachmentList = this.dataForm.attachment;
          } else {
            this.dataForm.attachment = undefined;
            this.attachmentList = [];
          }

        });
      },
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
    }
  }
</script>

<style lang="scss" scoped>
  .meetingRoomForm {
    .con-title {
      font-size: 16px;
      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }
    }
    .create-conference {

      .conference-table {
        margin-top: 20px;
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
        .single-person td {
          padding: 0px 12px;
        }

      }

      .annex-box {
        .annex-title {
          margin-top: 10px;
          height: 28px;
          line-height: 28px;
        }
        .annex-item {
          padding-left: 20px;
          cursor: pointer;
          .el-col {
            height: 28px;
            line-height: 28px;
          }
          .annex-right {
            display: none;
            float: right;
          }
        }
        .annex-item:hover .annex-right {
          display: inline-block;
        }
      }
    }
  }
</style>
