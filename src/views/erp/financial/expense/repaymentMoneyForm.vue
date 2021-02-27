<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增还款单</span>
        <span v-if="dataForm.id">编辑还款单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="还款人:" prop="userName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in userArr" :key="tag.id" :closable="false">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="还款部门:" prop="payOrgName" class="el-form-flex">
                <div @click="handleDepartSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in departArr" :key="tag.id" closable
                          @close="handleDepartDel">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="还款日期:" prop="repayMoneyDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.repayMoneyDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>

            <td>
              <el-form-item label="冲抵借款单:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag"
                          @close="handleSourceBillNoDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;">
                  <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="还款金额:" prop="amount" class="el-form-flex">
                <el-input v-model="dataForm.amount" placeholder="0.00"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          :readyonly="dataForm.sourceBillNo && dataForm.sourceBillNo!='' ? true : false"
                          @change="handleEdit('amount',$event)"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="还款事由:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="冲抵借款单">
        <template slot-scope="scope">
          <el-input readonly="readonly" class="readonly-el-input" v-model="scope.row.sourceBillNo"></el-input>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unpaidAmount" label="未还金额" align="right" >
        <template slot-scope="scope">
          <el-input readonly="readonly" class="right-el-input readonly-el-input"
                    v-model="scope.row.unpaidAmount"></el-input>
          <span>{{scope.row.unpaidAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="thisRepayment" label="本次还款" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.thisRepayment" class="right-el-input"
                    @change="handleEdit('thisRepayment',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.thisRepayment}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="departVisible" append-to-body>
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="depart"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handleResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitDepart" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

    <!-- 关联单据 -->
    <borrow-money-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                           @submitSelectorSuccess="submitSelectorSuccess"
                           @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </borrow-money-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financialRepaymentMoney';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "repaymentMoneyForm",
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'borrow-money-selector': () => import('../components/borrowMoneySelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      const validatePayAmount = (rule, value, callback) => {
        if (!value || value == '' || value == '0.00' || value == 'NaN') {
          callback(new Error("还款金额为大于0的数字"));
        } else {
          callback();
        }
      };
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          repayMoneyDate: undefined,
          amount: undefined,
          currencyId: '1',
          userId: undefined,
          userName: undefined,
          userCode: undefined,
          payOrgId: undefined,
          payOrgName: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        sourceBillNoArr: [],
        userArr: [],
        departArr: [],
        departVisible: false,
        rules: {
          userName: [
            {
              required: true,
              message: '请选择还款人',
              trigger: 'blur'
            }
          ],
          repayMoneyDate: [
            {
              required: true,
              message: '请选择还款日期',
              trigger: 'blur'
            }
          ],
          payOrgName: [
            {
              required: true,
              message: '请选择还款部门',
              trigger: 'blur'
            }
          ],
          currencyId: [
            {
              required: true,
              message: '请选择币别',
              trigger: 'blur'
            }
          ],
          amount: [
            {
              required: true,
              validator: validatePayAmount,
              trigger: 'blur'
            }
          ],
          sourceBillNo: [
            {
              required: true,
              message: '请选择冲抵借款单',
              trigger: 'blur'
            }
          ]
        },
        dialogSelectorVisible: false
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 211;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.userArr = response.data.userArr;
              this.departArr = response.data.departArr;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',');
              }
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.repayMoneyDate = date;
          var userName = this.$store.state.user.name;
          var userId = this.$store.state.user.id;
          var userCode = this.$store.state.user.no;
          this.userArr = [{name: userName, id: userId, code: userCode}];
          this.dataForm.userName = userName;
          this.dataForm.userId = userId;
          this.dataForm.userCode = userCode;
          getObj(userId).then(response => {
            if (response.data.departId.indexOf('{') != -1) {
              this.dataForm.payOrgId = JSON.parse(response.data.departId).id;
              this.dataForm.payOrgName = JSON.parse(response.data.departId).name;
              this.departArr = [{
                name: JSON.parse(response.data.departId).name,
                id: JSON.parse(response.data.departId).id
              }]
            }
          });
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          unpaidAmount: undefined,
          thisRepayment: undefined,
          note: undefined
        };
        this.items.push(d);
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length;
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(type, val, index, row) {
        if (type == 'amount') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4);
            this.dataForm.amount = val;
          }
        } else {
          if (val * 1 > row.unpaidAmount * 1) {
            this.$message.error('还款金额不能大于未还金额');
            this.vueSet(this.items[index], 'thisRepayment', Number(row.unpaidAmount).toFixed(4));
          } else {
            if (val != undefined && val != '') {
              val = Number(val).toFixed(4);
              this.vueSet(this.items[index], 'thisRepayment', val);
            } else {
              this.vueSet(this.items[index], 'thisRepayment', '0.00');
            }
          }
        }

      },

      //部门选择
      handleDepartSelector() {
        this.departVisible = true;
      },
      handleResetDepart() {
        this.$refs.depart.reset();
      },
      handleDepartDel(index) {
        this.departArr.splice(index, 1);
        this.dataForm.payOrgName = undefined;
        this.dataForm.payOrgId = undefined;
        if (this.$refs.depart) {
          this.$refs.depart.reset();
        }
      },
      handleSubmitDepart() {
        this.$refs.depart.onSubmit();
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.dataForm.payOrgName = depart.label;
          this.dataForm.payOrgId = depart.id;
          this.departArr = [{name: depart.label, id: depart.id}];
        }
        this.departVisible = false;
      },

      data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'thisRepayment') {
            values = data.map(item => Number(item.thisRepayment));
          } else if (column.property === 'unpaidAmount') {
            values = data.map(item => Number(item.unpaidAmount));
          }

          if (column.property === 'unpaidAmount' || column.property === 'thisRepayment') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'thisRepayment') {
                  this.dataForm.amount = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(4);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }

        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }
          _this.sourceBillNoArr.push(item.billNo);
          var itemObj = {};
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          item.repaymentAmount = item.repaymentAmount ? item.repaymentAmount : 0;
          item.afrAmount = item.afrAmount ? item.afrAmount : 0;
          itemObj.unpaidAmount = Number(item.amount - item.repaymentAmount - item.afrAmount).toFixed(4);
          itemObj.thisRepayment = item.amount;
          itemObj.node = item.node;
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.dialogSelectorVisible = false;
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true;
            } else {
              _this.isFormLoading = true;
            }

            var list = [];
            for (var i in _this.items) {
              if (_this.items[i].sourceBillId && _this.items[i].sourceBillId != '') {
                list.push(_this.items[i]);
              }
            }
            _this.dataForm.items = list;

            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }

              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                _this.$emit(subFunSuccessName);
              } else {
                _this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }
            })
          } else {
            return false;
          }
        })
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].sourceBillId && this.items[i].sourceBillId != '') {
            if (!this.items[i].thisRepayment || this.items[i].thisRepayment == ''
              || this.items[i].thisRepayment == '0.00' || this.items[i].thisRepayment == 'NaN') {
              this.$message.error('第' + (i * 1 + 1) + '行的还款金额为大于0的数字，请填写了再提交');
              return;
            }
          }
        }
        return true;
      }
    }
  }
</script>
