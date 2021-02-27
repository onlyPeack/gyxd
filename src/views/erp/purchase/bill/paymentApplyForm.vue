<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增付款申请单</span>
        <span v-if="dataForm.id">编辑付款申请单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款形式:" prop="paymentForm" class="el-form-flex">
                <el-select v-model="dataForm.paymentForm" style="width: 100%;">
                  <el-option v-for="item in paymentFormOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="申请人:" prop="applicantName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in applicantUserArr" :key="tag.id" :closable="false"
                          @close="handleApplicantUserDel">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="部门:" prop="departName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in applicantUserArr" :key="tag.id" :closable="false"
                          @close="handleApplicantUserDel">
                    {{tag.departName==null?JSON.parse(tag.departId).name:tag.departName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id" closable
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="结算方式:" prop="paymentsMeans" class="el-form-flex">
                <el-select v-model="dataForm.paymentsMeans" style="width: 100%;">
                  <el-option v-for="item in paymentsMeansOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
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
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                <el-input v-model="dataForm.bankName" placeholder="请输入开户银行"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="银行账户:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账户"></el-input>
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
      <el-table-column prop="sourceBillNo" label="关联单据" width="180">
        <template slot-scope="scope">
          <div @click.stop="handlePurchaseContractSelector" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.sourceBillNo"></el-input>
          </div>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillDate" label="单据日期">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sourceBillDate" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.sourceBillDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌名称">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列名称">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" class="readonly-el-input left-el-input"
                    readonly></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseAmount" label="采购金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchaseAmount" class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.purchaseAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.applyAmount" class="right-el-input"
                    @change="handleEdit('applyAmount',$event,scope.$index,scope.row)"
                   ></el-input>
          <span>{{scope.row.applyAmount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 申请人列表弹窗-->
    <el-dialog title="请选择申请人" :visible.sync="applicantUserVisible" append-to-body>
      <purchase-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                              ref="applicantUser"></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelApplicantUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitApplicantUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增付款申请单弹窗底部 -->
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
    <purchase-document-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                                @submitSelectorSuccess="submitSelectorSuccess" :supplierCode="dataForm.supplierCode"
                                @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </purchase-document-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/paymentApply';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "paymentApplyForm",
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'purchase-document-selector': () => import('../components/purchaseDocumentSelector')
    },
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          departId: undefined,
          departName: undefined,
          applicantId: undefined,
          applicantName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          applyAmount: undefined,
          currencyId: '1',
          bankName: undefined,
          bankAccount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        applicantUserArr: [],
        supplierArr: [],
        sourceBillNoArr: [],
        applicantUserVisible: false,
        supplierVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          paymentForm: [
            {
              required: true,
              message: '请选择付款形式',
              trigger: 'blur'
            }
          ],
          applicantName: [
            {
              required: true,
              message: '请选择申请人',
              trigger: 'blur'
            }
          ],
          departName: [
            {
              required: true,
              message: '部门信息不能为空',
              trigger: 'blur'
            }
          ],
          supplierName: [
            {
              required: true,
              message: '请选择供应商',
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
      handleValueAdd() {
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
          deliverDate: deliverDate
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
        var count = 0
        for (var i in this.items) {
          if (this.items[i].sourceBillId) {
            count++
          }
        }
        if (count == 0) {
          this.dataForm.sourceBillNo = undefined
          this.sourceBillNoArr = []
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 334;
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
              this.applicantUserArr = response.data.applicantUserArr;
              this.supplierArr = response.data.supplierArr;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',');
              }
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
                console.log('items');
                console.log(this.items);
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
          this.dataForm.applicantId = this.$store.state.user.id;
          this.dataForm.applicantName = this.$store.state.user.name;
          getObj(this.$store.state.user.id).then(response => {
            if (response.data.departId.indexOf('{') != -1) {
              this.dataForm.departId = JSON.parse(response.data.departId).id;
              this.dataForm.departName = JSON.parse(response.data.departId).name;
              this.applicantUserArr.push({
                "id": this.$store.state.user.id,
                "name": this.$store.state.user.name,
                "departId": JSON.parse(response.data.departId).id,
                "departName": JSON.parse(response.data.departId).name
              });
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
          sourceBillDate: undefined,
          sourceBillNo: undefined
        };
        this.items.push(d);
      },
      handleEdit(type, val, index, row) {
        if (type == 'applyAmountSum') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4);
            this.dataForm.applyAmount = val;
          }
        } else {
          if (val * 1 > (row.amount * 1)) {
            this.$message.error('申请金额不能大于金额');
            this.vueSet(this.items[index], 'applyAmount', Number(row.amount * 1).toFixed(4));
            return false
          } else {
            if (val != undefined && val != '') {
              val = Number(val).toFixed(4);
              this.vueSet(this.items[index], 'applyAmount', val);
            } else {
              this.vueSet(this.items[index], 'applyAmount', '0.00');
            }
          }
        }

      },

      // 申请人选择
      handleApplicantUserSelector() {
        this.applicantUserVisible = true;
      },
      handleCancelApplicantUser() {
        this.$refs.applicantUser.reset();
        this.applicantUserVisible = false;
      },
      handleApplicantUserDel(index) {
        this.applicantUserArr.splice(index, 1);
        this.dataForm.applicantId = undefined;
        this.dataForm.applicantName = undefined;
        this.dataForm.departId = undefined;
        this.dataForm.departName = undefined;
        this.$refs.applicantUser.reset();
      },
      handleSubmitApplicantUser() {
        this.$refs.applicantUser.onSubmit();
      },
      closeUserDialog(list) {
        this.applicantUserArr = list;
        this.dataForm.departId = JSON.parse(list[0].departId).id;
        this.dataForm.departName = JSON.parse(list[0].departId).name;
        this.applicantUserVisible = false;
        if (list.length > 0) {
          this.dataForm.applicantName = list[0].name;
          this.dataForm.applicantId = list[0].id;
          this.dataForm.departId = JSON.parse(list[0].departId).id;
          this.dataForm.departName = JSON.parse(list[0].departId).name;
        }
      },

      // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true;
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset();
        this.supplierVisible = false;
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1);
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
        this.dataForm.supplierCode = undefined;
        this.dataForm.bankName = undefined;
        this.dataForm.bankAccount = undefined;
        this.dataForm.paymentsMeans = undefined;
        this.dataForm.applyAmount = undefined;
        this.items = [];
        this.handleSourceBillNoDel().close();
        this.$refs.supplier.reset();
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      closeSupplierDialog(list) {
        this.supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName;
          this.dataForm.supplierId = list[0].id;
          this.dataForm.supplierCode = list[0].supplierCode;
          this.dataForm.bankName = list[0].bankName;
          this.dataForm.bankAccount = list[0].bankAccount;
          this.dataForm.paymentsMeans = list[0].paymentsMeans;
        }
      },

      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.amount));
          } else if (column.property === 'applyAmount') {
            values = data.map(item => Number(item.applyAmount));
          } else if (column.property === 'amount') {
            values = data.map(item => Number(item.amount));
          } else if (column.property === 'paymentApplyReturnAmount') {
            values = data.map(item => Number(item.paymentApplyReturnAmount));
          } else if (column.property === 'purchaseAmount') {
            values = data.map(item => Number(item.purchaseAmount));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'applyAmount' || column.property === 'amount' || column.property === 'amount' || column.property === 'paymentApplyReturnAmount' || column.property === 'purchaseAmount' || column.property === 'qty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'applyAmount') {
                  this.dataForm.applyAmount = getFloat((prev + curr), 2)
                }
                // if (column.property === 'amount') {
                //   this.dataForm.amount = getFloat((prev + curr), 4)
                // }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(2);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleCancel() {
        this.$emit('handleCancelForm');
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        if (this.dataForm.supplierName == undefined || this.dataForm.supplierName == '') {
          this.$message.warning('请先选择供应商');
          return;
        }
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
        // this.dataForm.sourceObjectKey = obj.sourceObject.key;
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
          itemObj.sourceBillDate = item.mainDTO.billDate;
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          itemObj.amount = (item.taxAmount - item.paymentApplyReturnAmount).toFixed(4);
          itemObj.applyAmount =  (item.taxAmount - item.paymentApplyReturnAmount).toFixed(4);
          itemObj.qty = item.qty;
          itemObj.purchaseAmount = item.taxAmount.toFixed(4);
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          itemObj.skuName = item.skuName;
          itemObj.specifications = item.specifications;
          itemObj.itemNo = item.itemNo;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;

          _this.items.push(itemObj);
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
            if (!this.items[i].applyAmount || this.items[i].applyAmount == ''
              || this.items[i].applyAmount == '0.00' || this.items[i].applyAmount == 'NaN') {
              this.$message.error('第' + (i * 1 + 1) + '行的申请金额为大于0的数字，请填写了再提交');
              return;
            }
          }
        }
        return true;
      }
    }
  }
</script>
<style scoped>
  .tb-edit {
    height:80%!important
  }
</style>
