<template>
  <div class="customerForm">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="110px" size="medium">
      <table class="publicTable">
        <tr>
          <td>
            <el-form-item label="客户全称:" prop="customerName">
              <div style="text-indent: 10px;display: inline-block">
              <el-input v-model="dataForm.customerName" :readonly="id != ''">
              </el-input>
              </div>
              <span @click="handleManagerChange" style="position: absolute;left: 0;cursor:pointer" v-if="id==''">
                  <svg-icon icon-class="add" ></svg-icon>
              </span>
            </el-form-item>
          </td>
          <td>
            <el-form-item label="客户简称:" prop="abbrName" label-width="120px">
              <el-input v-model="dataForm.abbrName" placeholder="请输入客户简称"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <el-form-item label="客户负责人:" prop="managerId" label-width="120px">
              <span @click="handleManagerShow">
                <svg-icon icon-class="add"></svg-icon>
              </span>
              <el-tag v-for="tag in customerManagerArr" :key="tag.name" closable
                      @close="handleManagerDel" size="medium">
                {{tag.name}}
              </el-tag>
            </el-form-item>
          </td>
          <td>
          </td>
<!--          <td>-->
<!--            <el-form-item label="可查看用户:">-->
<!--             <span>-->
<!--               <svg-icon icon-class="add"></svg-icon>-->
<!--             </span>-->
<!--            </el-form-item>-->
<!--          </td>-->
        </tr>
        <tr>
          <td colspan="2">
            <el-form-item label="客户类别:" prop="type">
              <el-select class="filter-item" v-model="dataForm.customerCategory" style="width: 100%">
                <el-option v-for="item in customerCategoryOptions" :key="item.value"
                           :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>

      </table>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息:" name="first">
          <table class="publicTable">
            <tr>
              <td style="width: 50%">
                <el-form-item label="客户类型:" prop="customerType">
                  <el-select class="filter-item" v-model="dataForm.customerType" style="width: 100%"
                             placeholder="请选择客户类型">
                    <el-option v-for="item in customerTypeOptions" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="客户属性:" prop="customerAttribute">
                  <el-select class="filter-item" v-model="dataForm.customerAttribute" style="width: 100%;"
                             placeholder="请选择客户属性">
                    <el-option v-for="item in customerAttributeOptions" :key="item.id" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="客户行业 :" prop="customerIndustry">
                  <el-select class="filter-item" v-model="dataForm.customerIndustry" style="width: 100%"
                             placeholder="请选择客户行业">
                    <el-option v-for="item in customerIndustryOptions" :key="item.id" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="客户等级:" prop="customerGrade">
                  <el-select class="filter-item" v-model="dataForm.customerGrade" style="width: 100%"
                             placeholder="请选择客户等级">
                    <el-option v-for="item in customerGradeOptions" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="省份城市:" prop="regionCodes">
                  <el-cascader
                    :options="options"
                    v-model="dataForm.regionCodes"
                    style="width: 100%"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="传真:" prop="fax">
                  <el-input v-model="dataForm.fax" placeholder="请输入传真"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="详细地址:" prop="address" class="el-form-flex">
                  <el-input v-model="dataForm.address" :rows="2" placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="备注:" prop="note">
                  <el-input v-model="dataForm.note" placeholder="请输入备注"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>

        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="second">
          <el-table :data="linkManTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="linkManTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column width="65">
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-plus" @click="addValueRow"></el-button>
                <el-button type="text" size="mini" icon="el-icon-minus"
                           @click="handleValueDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="linkMan" label='客户联系人(*):'>
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkMan" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkMan}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkPosition" label="联系人职务:">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkPosition" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkPosition}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkPhone" label="联系人电话(*):">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkPhone" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkEmail" label="联系人邮箱:">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkEmail" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkEmail}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkIsMain" label="是否主要联系人:">
              <template slot-scope="scope">
                <el-checkbox size="mini" v-model="scope.row.linkIsMain"
                             @change="handleLinkManChange(scope.$index, scope.row)"></el-checkbox>
                <span>{{({true:"是",false:"否"})[scope.row.linkIsMain]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="third">
          <table class="publicTable">
            <tr>
              <td>
                <el-form-item label="开户银行:" prop="bankName" label-width="140px">
                  <el-input v-model="dataForm.bankName" placeholder="请输入开户银行"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="银行账号:" prop="bankAccount" label-width="140px">
                  <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账号"
                            maxlength="23" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="开票地址:" prop="kpAddress" label-width="140px">
                  <el-input v-model="dataForm.kpAddress" placeholder="请输入开票地址"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="开票电话:" prop="kpTel" label-width="140px">
                  <el-input v-model="dataForm.kpTel" placeholder="请输入开票电话"
                            maxlength="19" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="纳税人识别号:" prop="taxpayerNumber" label-width="140px">
                  <el-input v-model="dataForm.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="信用期限:" prop="creditPeriod" label-width="140px">
                  <el-input-number v-model="dataForm.creditPeriod" :controls="false" style="width: 50px;"
                                   :min="1" :max="365" label="信用期限"></el-input-number>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="收票人:" prop="spMan" label-width="140px">
                  <el-input v-model="dataForm.spMan" placeholder="请输入收票人"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="收票电话:" prop="spTel" label-width="140px">
                  <el-input v-model="dataForm.spTel" placeholder="请输入收票电话"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="省份城市:" prop="financeDetailAddress" label-width="140px">
                  <el-cascader
                    :options="options"
                    v-model="dataForm.financeDetailAddress"
                    style="width: 100%"
                    @change="handleFinanceChange">
                  </el-cascader>
                </el-form-item>
              </td>
              <td colspan="2">
                <el-form-item label="详细地址:" prop="spAddress" label-width="140px">
                  <el-input v-model="dataForm.spAddress" placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="结算方式:" prop="paymentsMeans" label-width="140px">
                  <el-select class="filter-item" v-model="dataForm.paymentsMeans" style="width: 100%"
                             placeholder="请输入结算方式">
                    <el-option v-for="item in paymentsMeansOptions" :key="item.labelDefault" :label="item.label"
                               :value="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="收款条件:" prop="collectionTerms" label-width="140px">
                  <el-select class="filter-item" v-model="dataForm.collectionTerms" style="width: 100%"
                             placeholder="请输入收款条件">
                    <el-option v-for="item in collectionTermsOptions" :key="item.labelDefault" :label="item.labelDefault"
                               :value="item.labelDefault"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 客户负责人列表弹窗-->
    <el-dialog title="请选择人员" :visible.sync="managerVisible" append-to-body>
      <customer-manager @closeUserDialog="closeUserDialog" :isSingle="true"
                        ref="customerManagerDialog"></customer-manager>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleManagerConfirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- 客户名称查重弹窗-->
    <el-dialog title="客户名称查重" :visible.sync="dialogCheckCustomerNameVisible" append-to-body>
      <div class="app-container calendar-list-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                    @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row>
          <el-table-column label="客户名称" prop="customerName">
          </el-table-column>
          <el-table-column label="负责人" prop="managerName">
          </el-table-column>
          <el-table-column label="创建日期" prop="crtTime">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background :current-page="listQuery.page"
                         :page-sizes="[10,20]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>


      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="dialogCheckCustomerNameVisible = false">关 闭</el-button>
      </span>

    </el-dialog>


  </div>
</template>

<script>
  import {addObj, getObj, page, putObj} from '@/api/erp/crm/customer/index';
  import {regionData, CodeToText} from 'element-china-area-data';
  import {isvalidatemobile} from '@/utils/validate';
  import {getSimpleTree} from '@/api/erp/mall/cms/area';

  export default {
    name: 'customerForm',
    props: ['id', 'customerTypeOptions', 'customerGradeOptions', 'customerIndustryOptions', 'customerAttributeOptions', 'collectionTermsOptions', 'paymentsMeansOptions'],
    components: {
      'customer-manager': () => import('@/components/ERP/User/user'),
      'customer-type': () => import('@/components/ERP/Customer/customerTypeSelector'),
      'customer-grade': () => import('@/components/ERP/Customer/customerGradeSelector')
    },
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          customerName: ''
        },
        dataForm: {
          id: '',
          customerCode: '',
          customerName: '',
          abbrName: '',
          customerCategory: '',
          managerId: '',
          managerName: '',
          cusFollowOrg: '',
          cusFollowGroup: '',
          customerType: '',
          customerGrade: '',
          customerAttribute: '',
          customerIndustry: '',
          fax: '',
          regionCodes: [],
          financeDetailAddress:[],
          location: '',
          country: '',
          province: '',
          city: '',
          county: '',
          address: '',
          taxpayerNumber: '',
          bankName: '',
          bankAccount: '',
          paymentsMeans: '',
          collectionTerms: '',
          creditPeriod: '',
          spMan: '',
          spTel: '',
          spAddress: '',
          note: '',
          dataOrg: '',
          linkManTableData: [],
          isDefaultAdd: [],
          customerAddress: '',
          kpTel:'',
          kpAddress:'',
        },
        isDefaultAdd: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '2',
            label: '否'
          }
        ],
        options: [],
        CodeToText,
        activeName: 'first',
        linkManTableData: [],
        customerManagerArr: [],
        managerVisible: false,
        dialogCheckCustomerNameVisible: false,
        customerTypeVisible: false,
        customerGradeVisible: false,
        customerCategoryOptions: [{
          value: '0',
          label: '普通客户'
        }, {
          value: '1',
          label: '商超客户'
        }],
        rules: {
          customerType: [
            {
              required: true,
              message: '请输入客户类型',
              trigger: 'blur'
            },
          ],
          customerAttribute: [
            {
              required: true,
              message: '请输入客户属性',
              trigger: 'blur'
            },
          ],
          customerIndustry: [
            {
              required: true,
              message: '请输入客户行业',
              trigger: 'blur'
            },
          ],
          customerGrade: [
            {
              required: true,
              message: '请输入客户等级',
              trigger: 'blur'
            },
          ],
          regionCodes: [
            {
              required: true,
              message: '请选择省份城市',
              trigger: 'blur'
            },
          ],
          financeDetailAddress: [
            {
              required: true,
              message: '请选择省份城市',
              trigger: 'blur'
            },
          ],
          address: [
            {
              required: true,
              message: '请输入详细地址',
              trigger: 'blur'
            },
          ],
          customerName: [
            {
              required: true,
              message: '请输入客户全称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          managerId: [
            {
              required: true,
              message: '请选择负责人',
              trigger: 'blur'
            }
          ],
          bankName: [
            {
              required: true,
              message: '请输入开户银行',
              trigger: 'blur'
            }
          ],
          bankAccount: [
            {
              required: true,
              message: '请输入银行账号',
              trigger: 'blur'
            }
          ],
          kpAddress: [
            {
              required: true,
              message: '请输入开票地址',
              trigger: 'blur'
            }
          ],
          kpTel: [
            {
              required: true,
              message: '请输入开票电话',
              trigger: 'blur'
            }
          ],
          taxpayerNumber: [
            {
              required: true,
              message: '请输入纳税人识别号',
              trigger: 'blur'
            }
          ],
          spMan: [
            {
              required: true,
              message: '请输入收票人',
              trigger: 'blur'
            }
          ],
          spTel: [
            {
              required: true,
              message: '请输入收票电话',
              trigger: 'blur'
            }
          ],
          spAddress: [
            {
              required: true,
              message: '请输入详细地址',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    mounted() {
      getSimpleTree().then(res => {
        this.options = this.getCategoryList(res[0].children);
      });
      this.customerManagerArr.push({id: this.$store.state.user.id, name: this.$store.state.user.name});
      this.dataForm.managerId = this.$store.state.user.id;
      this.dataForm.managerName = this.$store.state.user.name;
      this.init();
    },
    methods: {
      handleManagerChange() {
        //console.log(this.id);
        //console.log(this.$store.getters.groupNames.indexOf('总经理'));
        // if(this.$store.getters.groupNames.indexOf('总经理') > -1 && this.id != '') {
        //   this.dialogCheckCustomerNameVisible = true
        // } else {
        //   this.$message.warning('抱歉,您没有权限修改客户全称!')
        // }
        if(this.id == '') {
           this.dialogCheckCustomerNameVisible = true
        }
      },
      getCategoryList(data) {
        //将最底层中的 children 设为undefined
        // 循环遍历json数据
        for (var i = 0; i < data.length; i++) {
          if (!data[i].children || data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getCategoryList(data[i].children);
          }
        }
        return data;
      },
      init() {
        this.activeName = 'first';
        if (this.id != '') {
          getObj(this.id)
            .then(response => {
              console.log(this.paymentsMeansOptions);
              this.dataForm = response.data;
              this.dataForm.financeDetailAddress = [response.data.spProvince,response.data.spCity,response.data.spCounty]
              this.customerManagerArr = response.data.customerManagerArr;
              this.linkManTableData = response.data.linkManTableData;
              if (this.linkManTableData == undefined) {
                this.linkManTableData = [];
                this.addValueRow();
              }
            });
        } else {
          this.addValueRow();
        }
      },
      handleChange(value) {
        this.dataForm.province = value[0];
        this.dataForm.city = value[1];
        this.dataForm.county = value[2];
        this.dataForm.location = value[0] + '/' + value[1] + '/' + value[2];
      },
      handleFinanceChange(value) {
        this.dataForm.spProvince = value[0];
        this.dataForm.spCity = value[1];
        this.dataForm.spCounty = value[2];
      },
      onSubmit() {
        this.dataForm.linkManTableData = this.linkManTableData;
        if (!this.checkBasicData()) {
          this.$emit('submitWaring');
          return;
        }
        if (!this.checkLinkManTableData()) {
          this.$emit('submitWaring');
          return;
        }
        if (!this.checkFinanceData()) {
          this.$emit('submitWaring');
          return;
        }
        if (this.dataForm.taxpayerNumber && this.dataForm.taxpayerNumber != '') {
          const val = this.dataForm.taxpayerNumber;
          if (val.length != 15 && val.length != 17 && val.length != 18 && val.length != 20) {
            this.$notify({
              message: '纳税人识别号由15位、17位、18或者20位字符组成',
              type: 'warning'
            });
            this.$emit('submitWaring');
            return;
          }
        }

        if (this.id == '') {
          this.$refs.dataForm.validate(valid => {
            if (valid) {
              addObj(this.dataForm).then(response => {
                if (response.code == '2000') {
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
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
                  this.$emit('submitWaring');
                }
              })
            } else {
              this.$emit('submitWaring');
              return false;
            }
          })
        } else {
          this.$refs.dataForm.validate(valid => {
            if (valid) {
              putObj(this.dataForm.id, this.dataForm).then(response => {
                if (response.code == '2000') {
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('submitSuccess');
                } else {
                  console.log('进来了11')
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                  console.log('进来了')
                  this.$emit('submitWaring');
                }
              });
            } else {
              this.$emit('submitWaring');
              return false;
            }
          });
        }
      },
      handleManagerShow() {
        if(this.$store.getters.groupNames.indexOf('总经理') > -1) {
          this.managerVisible = true;
        } else {
          this.$message.warning('抱歉,您没有修改客户负责人的资格')
        }
      },
      handleManagerDel(index) {
        this.customerManagerArr.splice(index, 1);
        this.$refs.customerManagerDialog.reset();
      },
      handleManagerConfirm() {
        this.$refs.customerManagerDialog.onSubmit();
      },
      closeUserDialog(list) {
        this.customerManagerArr = list;
        this.managerVisible = false;
        if (list.length > 0) {
          this.dataForm.managerName = list[0].name;
          this.dataForm.managerId = list[0].id;
        }
      },
      addValueRow() {
        let flag = true
        for(let i in this.linkManTableData){
          if(this.linkManTableData[i].linkIsMain){
            flag = false
          }
        }
        const d = {
          linkMan: '',
          linkPosition: '',
          linkPhone: '',
          linkEmail: '',
          linkIsMain: flag
        };
        this.linkManTableData.push(d);
        setTimeout(() => {
          this.$refs.linkManTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleValueCurrentChange(val) {
        this.currentRow = val;
      },
      handleValueDelete(index, r) {
        const ValueIndex = this.linkManTableData.length;
        if (ValueIndex === 1) {
          return
        }
        this.linkManTableData.splice(index, 1)
      },
      // checkbox 当change触发的事件
      handleLinkManChange(index, r) {
        for(let i in this.linkManTableData){
          if(r.linkIsMain){
            this.linkManTableData[i].linkIsMain = false
            if(parseInt(index)===parseInt(i)){
              this.linkManTableData[i].linkIsMain = true
            }
          }
        }
        if (r.linkMan == '' && r.linkPhone == '') {
          return;
        }
        if (r.linkMan == '') {
          this.$notify({
            message: '联系人姓名不能为空',
            type: 'warning'
          });
          r.linkIsMain = false;
          return;
        }
        if (r.linkPhone == '') {
          this.$notify({
            message: '联系人电话不能为空',
            type: 'warning'
          });
          r.linkIsMain = false;
          return;
        }
        if (this.linkManTableData.length > 1 && r.linkIsMain == true) { // 设置其它联系人为非主要联系人
          const newlinkManTableData = [];
          let linkIsMain = false;
          this.linkManTableData.forEach(row => {
            if (row.linkMan === r.linkMan && row.linkPhone === r.linkPhone && r.linkIsMain == true) {
              linkIsMain = true;
            } else {
              linkIsMain = false
            }
            const d = {
              linkMan: row.linkMan,
              linkPosition: row.linkPosition,
              linkPhone: row.linkPhone,
              linkEmail: row.linkEmail,
              linkIsMain
            };
            newlinkManTableData.push(d);
          });
          this.linkManTableData = newlinkManTableData;
        }
      },
      checkBasicData() {
        // financeDetailAddress
        let flag = true;
        if(
          (!this.dataForm.customerType || this.dataForm.customerType.length<=0) || (!this.dataForm.customerAttribute || this.dataForm.customerAttribute.length<=0) ||
          (!this.dataForm.customerIndustry || this.dataForm.customerIndustry.length<=0) || (!this.dataForm.customerGrade || this.dataForm.customerGrade.length<=0) ||
          (!this.dataForm.regionCodes || this.dataForm.regionCodes.length<=0) || (!this.dataForm.address || this.dataForm.address.length<=0)){
          this.$notify({
            message: '基本信息不完整',
            type: 'warning'
          });
          flag = false;
        }
        if (flag == false) {
          this.activeName = 'first';
        }
        return flag;
      },
      checkLinkManTableData() {
        let flag = true;
        if (this.linkManTableData != undefined && this.linkManTableData.length > 0) {
          this.linkManTableData.forEach(row => {
            if (row.linkMan == '' && row.linkPhone == '') {
              flag = false;
            } else if (row.linkMan == '' || row.linkPhone == '') {
              this.$notify({
                message: '联系人信息不完整',
                type: 'warning'
              });
              flag = false;
            } else if (row.linkPhone != '') {
              if (isvalidatemobile(row.linkPhone)[0]) {
                this.$notify({
                  message: isvalidatemobile(row.linkPhone)[1],
                  type: 'warning'
                });
                flag = false;
              }
            }
          });
          if (flag == false) {
            this.activeName = 'second';
          }
        }
        return flag;
      },
      checkFinanceData(){
        let flag = true;
        if(
          (!this.dataForm.bankName || this.dataForm.bankName.length<=0) || (!this.dataForm.bankAccount || this.dataForm.bankAccount.length<=0) ||
          (!this.dataForm.kpAddress || this.dataForm.kpAddress.length<=0) || (!this.dataForm.taxpayerNumber || this.dataForm.taxpayerNumber.length<=0) ||
          (!this.dataForm.kpTel || this.dataForm.kpTel.length<=0) || (!this.dataForm.spMan || this.dataForm.spMan.length<=0) ||
          (!this.dataForm.kpAddress || this.dataForm.kpAddress.length<=0) ||  (!this.dataForm.spAddress || this.dataForm.kpAddress.spAddress<=0) ||
          (!this.dataForm.financeDetailAddress || this.dataForm.financeDetailAddress.length<=0) || (!this.dataForm.address || this.dataForm.address.length<=0)){
          this.$notify({
            message: '财务信息不完整',
            type: 'warning'
          });
          flag = false;
        }
        if (flag == false) {
          this.activeName = 'third';
        }
        return flag;
      },
      linkManHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex == 2 || columnIndex == 4) {
          return 'color:red'
        }
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },


    }
  }
</script>

<style lang="scss">
  .customerForm {
    .el-form-flex {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .publicTable {
      width: 100%;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;
      margin-bottom: 20px;

      .el-form-item {
        margin-bottom: 0px;
      }

      .el-input-group__append, .el-input-group__prepend {
        border: none;
        background-color: white;
        font-size: 14px;
        color: #4F90E2;
      }

      .el-form-item__label {
        padding-right: 10px;
        font-weight: 100;
        color: black!important;
        text-align: left;
        padding-left: 20px;
      }
      td {
        border: 1px solid #e0e0e0;
        height: 45px;
        margin: 0;
        padding: 0px;
      }

      .el-cascader__label {
        padding: 0
      }

      .el-input input.el-input__inner {
        border: none;
        padding: 0px;
      }
    }

    /* 可编辑表格 */

    .el-tb-edit .el-input,
    .el-tb-edit .el-input-number,
    .el-tb-edit .el-select {
      display: none;
      width: 100%;
    }

    .el-tb-edit .current-row .el-input,
    .el-tb-edit .current-row .el-input-number,
    .el-tb-edit .current-row .el-select {
      display: inherit;
    }

    .el-tb-edit .current-row .el-input + span,
    .el-tb-edit .current-row .el-input-number + span,
    .el-tb-edit .current-row .el-select + span {
      display: none;
    }
  }
</style>
