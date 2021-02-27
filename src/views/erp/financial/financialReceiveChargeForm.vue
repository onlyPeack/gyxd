<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增收发费用划拨单</span>
        <span v-if="dataForm.id">编辑收发费用划拨单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-upload class="upload"  v-if="dataForm.type != 2" action="/api/financial/financial-receive-charge-transfer/import" :before-upload="beforeUpload"
                   :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                   style="display:inline;" :on-success="uploadCompleted">
          <el-button type="text" icon="el-icon-download">
            导入(最多导入500条)
          </el-button>
        </el-upload>
        <el-button type="text" icon="el-icon-download" v-if="dataForm.type != 2" >
          <a target="_blank" href="/api/financial/financial-receive-charge-transfer/downTemplate">下载导入模板</a>
        </el-button>
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
               <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
               <el-input v-model="dataForm.billNo" readonly placeholder="单据编号为自动生成"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="报销日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" readonly placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
              <td colspan="2">
                  <el-form-item label="划入工号:" prop="transferNo" class="el-form-flex">
                    <div @click.stop="handleUserSelector"
                        style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                      <span>
                        <svg-icon icon-class="add"></svg-icon>
                      </span>
                      <el-tag v-if="dataForm.transferNo" v-model="dataForm.transferNo">
                        {{dataForm.transferNo}}
                      </el-tag>
                    </div>
                  </el-form-item>
              </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
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
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="业务单据" width="180">
        <template slot-scope="scope">
          <div @click.stop="handlePurchaseContractSelector(scope.$index)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.sourceBillNo" disabled></el-input>
          </div>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expressName" label="快递名称" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expressName" @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
          disabled
           :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.expressName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expressNumber" label="快递单号" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expressNumber" @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
          disabled
           :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.expressNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fee" label="手续费" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fee"  @change="handleEdit(scope.$index, scope.row , 'fee', $event)"  @input="handleInputFun($event, scope.row, 'fee')" 
           @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
          :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.fee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="freight" label="运费" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.freight"   @change="handleEdit(scope.$index, scope.row , 'freight', $event)" @input="handleInputFun($event, scope.row, 'freight')" :ref="'tableElInput'+(scope.$index*tableElInputNum+5)"  @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+5)"
          ></el-input>
          <span>{{scope.row.freight}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="实际重量(kg)" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight"  @input="handleInputFun($event, scope.row, 'weight')"
          @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
           :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"></el-input>
          <span>{{scope.row.weight}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountFreight" label="对账运费" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.accountFreight"  @input="handleInputFun($event, scope.row, 'accountFreight')"  @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)" :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"
          ></el-input>
          <span>{{scope.row.accountFreight}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferMoney" label="划拨总额" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.transferMoney"  @input="handleInputFun($event, scope.row, 'transferMoney')" readonly class="readonly-el-input"></el-input>
          <span>{{scope.row.transferMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="划拨说明">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note" ></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.salesman" class="readonly-el-input" readonly></el-input>
          <span>{{scope.row.salesman}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesmanNo" label="业务员工号" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.salesmanNo" class="readonly-el-input" readonly></el-input>
          <span>{{scope.row.salesmanNo}}</span>
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
    <!-- 选择员工 -->
    <el-dialog title="请选择账户" width="45%" :visible.sync="userVisible" append-to-body
               @before-close="closeUserDialog">
      <take-account-selector @closeAccountDialog="closeUserDialog" ref="userSelector"></take-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handleCancelUser">取 消</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitUser" type="primary"
                   icon="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联单据 -->
    <sales-invoice-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                           @submitSelectorSuccess="submitSelectorSuccess"
                           @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </sales-invoice-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financialReceiveCharge';
  import {getObj} from '@/api/admin/user/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';


  export default {
    name: "costReimbursementForm",
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'take-account-selector': () => import('./components/chargeAccountSelector'),
      'sales-invoice-selector': () => import('./components/chargeInvoiceSelector'),
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        tableElInputNum: 1,
        accountVisible: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          depositName: undefined,
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          payDate: undefined,
          payBankAccount: undefined,
          payUserName: undefined,
          depositBank: undefined,
          bankAccount: undefined,
          amount: 0,
          originalFlushingAmount: undefined,
          actualAfrAmount: undefined,
          currencyId: '1',
          userId: undefined,
          userName: undefined,
          customerId: undefined,
          customerName: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        fileList: undefined,
        userVisible: false,
        accountIndex: '',
        items: [],
        sourceBillNoArr: [],
        billOptions:undefined,
        userArr: [],
        departArr: [],
        customerArr: [],
        departVisible: false,
        customerVisible: false,
        slectedIndex:0,
        rules: {
          // transferNo: [
          //   {
          //     required: true,
          //     message: '请输入划入工号',
          //     trigger: 'change'
          //   }
          // ],
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
      getTypeValue('root_gxcl_bxtype').then(response => {
        this.billOptions = response.data.rows;
      });
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          // this.$notify({
          //   title: '成功',
          //   message: response.msg,
          //   type: 'success',
          //   duration: 2000
          // });
           this.$alert(response.msg, '提示', {
            confirmButtonText: '确定',
          });
          if(response.data.length>0){
            this.selectedProducts = response.data.slice(0,500);
            const _this = this;
            // const dataMap = _this.data2Map(_this.items);

            // 删除最后一个空行
            _this.items.splice(_this.items.length - 1, 1);

            // 遍历当前选中项
            for (var index in this.selectedProducts) {
              var item = this.selectedProducts[index];
              var itemObj = {};
              itemObj.accountFreight = item.accountFreight;
              itemObj.fee = item.fee;
              itemObj.expressName = item.expressName;
              itemObj.expressNumber = item.expressNumber;
              itemObj.salesman = item.salesman;
              itemObj.salesmanNo = item.salesmanNo;
              itemObj.sourceBillNo = item.sourceBillNo;
              itemObj.sourceBillId = item.sourceBillId;
              itemObj.note = item.note;
              itemObj.freight = item.freight;
              itemObj.transferMoney = item.transferMoney;
              itemObj.weight = item.weight;
              _this.items.push(itemObj);

            }
            // 添加一个空行
            // _this.items.push([]);
            // _this.handleValueAdd();

            for (var j in this.items) {
              this.vueSet(this.items, j, this.items[j]);
            }

            this.productVisible = false;
            this.selectedProducts = [];
          }
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
      // 员工选择
      handleUserSelector(type, index) {
        this.userType = type;
        this.userIndex = index;
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.userSelector.reset();
        this.userVisible = false;
        this.userType = undefined;
        this.userIndex = undefined;
      },
      closeUserDialog(list) {
        this.dataForm.transferNo = list[0].accountCode;
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.userSelector.onSubmit();
      },
      takeAccountTap(index) {
        this.accountIndex = index;
        this.accountVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 416;
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
              this.customerArr = response.data.customerArr;
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
          this.dataForm.billDate = date;
          this.dataForm.payDate = date;
          var userName = this.$store.state.user.name;
          var userId = this.$store.state.user.id;
          var userCode = this.$store.state.user.code;
          this.dataForm.payUserName = userName;
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
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number)

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number)

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number)

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number)

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number)

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum

        if (type == 'enter' && number + 1 <= total) {
          number++
        } else if (type == 'left' && number - 1 > 0) {
          number--
        } else if (type == 'right' && number + 1 <= total) {
          number++
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus()
        this.$refs['tableElInput' + number].$el.querySelector('input').select()

      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var date = new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          startDate: date,
          endDate: date,
          type: undefined
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
      handleEdit(index, row, type, val) {
        if (row.fee &&  row.freight) {
          this.vueSet(this.items[index], 'transferMoney', (Number(row.fee) + Number(row.freight)).toFixed(4))
        }
        this.vueSet(this.items, index, this.items[index])
      },

      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerId = list[0].id;
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
      handleCancelAccount() {
        this.accountVisible = false;
      },
      handleSubmitAccount() {
        this.$refs.account.onSubmit();
      },
      handleSubmitDepart() {
        this.$refs.depart.onSubmit();
      },
      closeAccountDialog(account) {
        this.vueSet(this.items[this.accountIndex], 'accountName', account[0].accountName);
        this.vueSet(this.items[this.accountIndex], 'accountCode', account[0].accountCode);
        this.vueSet(this.items[this.accountIndex], 'accountId', account[0].accountId);
        this.accountVisible = false;
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.dataForm.payOrgName = depart.label;
          this.dataForm.payOrgId = depart.id;
          this.departArr = [{name: depart.label, id: depart.id}];
        }
        this.departVisible = false;
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
          if (column.property === 'fee') {
            values = data.map(item => Number(item.fee));
          } else if (column.property === 'freight') {
            values = data.map(item => Number(item.freight));
          } else if (column.property === 'weight') {
            values = data.map(item => Number(item.weight));
          } else if (column.property === 'accountFreight') {
            values = data.map(item => Number(item.accountFreight));
          } else if (column.property === 'transferMoney') {
            values = data.map(item => Number(item.transferMoney));
          }

          if (column.property === 'fee' || column.property === 'freight' || column.property === 'weight' || column.property === 'accountFreight' || column.property === 'transferMoney') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
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
      handlePurchaseContractSelector(index) {
        this.slectedIndex = index;
        if(!this.dataForm.transferNo) {
          this.$message.warning('请先选择划入工号')
        } else {
          this.dialogSelectorVisible = true;
        }
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
       data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
      },
      submitSelectorSuccess(obj) {
        // if (obj.list.length == 0) {
        //   this.dialogSelectorVisible = false;
        //   return;
        // }

        if (obj.isClearAll) {
          this.items = [];
        }
        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj) {
          var item = obj[index];
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }

          _this.sourceBillNoArr.push(item.billNo);
          var itemObj = {};
          if(item.expressName) {
            itemObj.expressName = item.expressName;
          }
          if(item.expressNumber) {
            itemObj.expressNumber = item.expressNumber;
          }
          // itemObj.billNo = item.billNo;
          itemObj.salesman = item.crtUserName;
          itemObj.salesmanNo = item.crtUserNo;
          itemObj.sourceBillId = item.id;
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceObjectKey = item.sourceObjectKey;
          itemObj.sourceObjectName = item.sourceObjectName;
          itemObj.crtUserNo = item.crtUserNo;
          itemObj.crtUserName = item.crtUserName;
          // if(_this.items[index].transferMoney == undefined) {
          //   itemObj.transferMoney = 0;
          // }
          if(_this.items[_this.slectedIndex + Number(index)]) {
            Object.assign(_this.items[_this.slectedIndex + Number(index)],itemObj)
          } else {
            _this.items.push(itemObj)
          }
        }
        // this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
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
            _this.dataForm.items = _this.items;

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
                this.$alert(response.msg, '提示', {
                  confirmButtonText: '确定',
                });
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
        if(!this.dataForm.transferNo) {
          this.$message.warning('请先选择划入工号')
          return
        }
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
          // console.log(isNaN(this.items[i].fee));
          console.log(this.items[i].fee === '');
            if (this.items[i].fee === '' ) {
              this.$message.error('第' + (i * 1 + 1) + '行的手续费为必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select()

              return
            }
            if (this.items[i].freight === '') {
              this.$message.error('第' + (i * 1 + 1) + '行的运费为必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 5)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 5)].$el.querySelector('input').select()

              return
            }
            if (this.items[i].weight === '') {
              this.$message.error('第' + (i * 1 + 1) + '行的实际重量为必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 4)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 4)].$el.querySelector('input').select()

              return
            }
            
            if ( this.items[i].accountFreight === '') {
              this.$message.error('第' + (i * 1 + 1) + '行的对账运费为必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 6)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 6)].$el.querySelector('input').select()

              return
            }
        }
        return true;
      }
    }
  }
</script>
