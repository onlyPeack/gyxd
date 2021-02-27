<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增单据流程</span>
        <span v-if="dataForm.id">编辑单据流程</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="流程ID:" prop="processId" class="el-form-flex">
                <el-input v-model="dataForm.processId" placeholder="自动生成" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据名称:" prop="billPrefix" class="el-form-flex">
                <el-select v-model="dataForm.billPrefix" @change="handleChangeBillPrefix">
                  <el-option
                    v-for="item in billOptions"
                    :key="item.value"
                    :label="item.labelDefault"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <div style="line-height: 30px;color: #F56C6C;">常规流程第一步必须配 业务员审批 否则将影响流程驳回再流转！</div>
    </div>

    <el-table :data="logicList" border highlight-current-row width="100%" :height="clientHeight" class="tb-edit">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="step" label="流程阶段" width="100" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.step"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)" class="stepName"></el-input>
          <span>{{scope.row.step}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="流程备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logicKey" label="流程说明">
        <template slot-scope="scope">
          <el-select v-model="scope.row.logicKey" @change="handleSelectChange($event,scope.$index,scope.row.logicKey)"
                     :ref="'tableElInput'+(scope.$index*tableElInputNum+2)">
            <el-option
              v-for="item in taskAuditOptions"
              :key="item.value"
              :label="item.labelDefault"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.logicKey}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="流转用户">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.user"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
                    :readonly="scope.row.logicKey=='other'?false:true"></el-input>
          <span>{{scope.row.user}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="step" label="页面路径">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.url"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)" readonly="readonly"></el-input>
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <!-- 新增维修申请弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" v-if="!dataForm.id" @click="handleSubmit">提 交</el-button>
      <el-button type="primary" v-if="dataForm.id" @click="handleUpdate">更 新</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addObj, getObj, putObj} from '@/api/erp/oa/task/taskBill';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "taskBillForm",
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        dataForm: {
          id: undefined,
          processId: undefined,
          billPrefix: undefined,
          logicList: []
        },
        logicList: [],
        billOptions: [],
        taskAuditOptions: [],
        rules: {
          billPrefix: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.billPrefix)
            }, message: '请输入', trigger: 'blur'
          }]
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 3,
        viewUrl: undefined
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      getTypeValue('root_bill').then(response => {
        this.billOptions = response.data.rows;
      });
      getTypeValue('task_audit').then(response => {
        this.taskAuditOptions = response.data.rows;
      });
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入"))
        } else {
          callback();
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 72;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getObj(this.id)
            .then(response => {
              this.dataForm = response.data;
              if (response.data.logicList == undefined) {
                this.handleValueAdd();
              } else {
                this.logicList = response.data.logicList;
                this.viewUrl = this.logicList[0].url;
              }
            });
        } else {
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleChangeBillPrefix(val) {
        for (var i in this.billOptions) {
          if (this.billOptions[i].value == val) {
            this.viewUrl = this.billOptions[i].labelEnUs;
          }
        }
        for (var j in this.logicList) {
          this.logicList[j].url = this.viewUrl;
        }
      },
      handleValueAdd() {
        const d = {
          url: this.viewUrl,
          step: this.logicList.length + 1,
        };
        this.logicList.push(d);
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.logicList.length;
        if (ValueIndex === 1) {
          return
        }
        this.logicList.splice(index, 1);
        for (var i in this.logicList) {
          this.logicList[i].step = i * 1 + 1;
        }
      },
      handleSelectChange(val, index, zhi) {
        if (val == 'other') {
          const _this = this;
          window.setTimeout(function () {
            _this.$refs['tableElInput' + (index * _this.tableElInputNum + 3)].$el.querySelector('input').focus();
            _this.$refs['tableElInput' + (index * _this.tableElInputNum + 3)].$el.querySelector('input').select();
          }, 1);
        } else {
          this.logicList[index].user = val;
        }
        for (let i in  this.taskAuditOptions) {
          console.log(this.taskAuditOptions[i]);
          if (this.taskAuditOptions[i].value == zhi) {
            const str = JSON.parse(JSON.stringify(this.taskAuditOptions[i]));
            this.vueSet(this.logicList[index], 'note', str.labelDefault);
          }
        }
      },

      handleCancel() {
        this.$emit('handleCancelForm');
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.logicList = this.logicList;
            addObj(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            return false;
          }
        })
      },
      handleUpdate() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.logicList = this.logicList;
            putObj(this.id, this.dataForm).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            return false;
          }
        })
      },
      checkItemFuc() {
        for (var i in this.logicList) {
          if (!this.logicList[0].step || this.logicList[0].step === '') {
            this.$message.error('第一行的页面路径为必填项，请填写了再提交');
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
            return;
          }
          if (!this.logicList[i].step || this.logicList[i].step == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的流程阶段为必填项，请填写了再提交');
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
            return;
          }
          if (this.logicList[i].step && this.logicList[i].step * 1 != (i * 1 + 1)) {
            this.$message.error('第' + (i * 1 + 1) + '行的流程阶段必须与当前行的序号一致，请重新填写');
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
            return;
          }
          if (!this.logicList[i].logicKey || this.logicList[i].logicKey == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的流程说明必填项，请填写了再提交');
            this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
            return;
          }
          if (!this.logicList[i].user || this.logicList[i].user == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的流程用户为必填项，请填写了再提交');
            this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus();
            this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select();
            return;
          }

        }
        return true;
      },
    }
  }
</script>
<style lang="scss">
  .stepName {
    .el-input__inner {
      text-align: center;
    }
  }
</style>
