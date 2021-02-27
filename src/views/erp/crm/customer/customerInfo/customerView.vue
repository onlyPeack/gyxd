<template>
  <div v-model="data" ref="data" class="customerView">
    <table class="publicTable">
      <tr>
        <td width="50%">
          <div class="flex">
            <label>客户全称：</label>
            <span>{{data.customerName}}</span>
          </div>
        <td>
          <div class="flex">
            <label>客户简称：</label>
            <span>{{data.abbrName}}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="flex">
            <label>客户负责人：</label>
            <span>{{data.managerName}}</span>
          </div>
        </td>
        <td>
          <div class="flex">
            <label>可查看用户：</label>
            <span>{{data.managerName}}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="flex">
            <label>客户类别：</label>
            <span v-for="item in customerCategoryOptions">
                <span v-if="data.customerCategory ===item.value">{{item.label}}</span>
              </span>
          </div>
        </td>
        <td></td>
      </tr>
    </table>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户地址" name="first">
        <el-row>
          <el-col>
            <el-button class="select-item" type="text" icon="el-icon-plus" @click="handleCustomerAddressCreate">新增
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
            <el-button class="select-item" type="text" icon="el-icon-delete" @click="addressDelete">删除</el-button>
            <el-upload class="upload" action="/api/crm/receiveAddress/import" :before-upload="beforeUpload"
                       :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                       style="display:inline;" :on-success="uploadCompleted" :headers="headers">
              <el-button type="text" icon="el-icon-download">
                导入
              </el-button>
            </el-upload>
            <el-button type="text" icon="el-icon-download" >
              <a href="/api/crm/receiveAddress/downTemplate">下载导入模板</a>
            </el-button>
            <el-input clearable class="filter-item" style="width: 180px;" placeholder="收货人"
                      v-model="addressListQuery.name"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 180px;" placeholder="收货人电话"
                      v-model="addressListQuery.phoneNumber"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 180px;" placeholder="省份/直辖市"
                      v-model="addressListQuery.province"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 180px;" placeholder="详细地址"
                      v-model="addressListQuery.detailAddress"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleFilter()">查询</el-button>
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="handleResetSearch()">重置</el-button>
          </el-col>
        </el-row>
        <el-table :data="addressTableData" border style="width: 100%"
                  @row-click="handleRowClick" @selection-change="handleChangeFun" ref="addressTableData">
          <el-table-column align="left" type="index" width="80">
          </el-table-column>
          <el-table-column type="selection" width="55" fixed="left">
          </el-table-column>
          <el-table-column prop="name" label='收货人'>
          </el-table-column>
          <el-table-column prop="phoneNumber" label="收货人电话">
          </el-table-column>
          <el-table-column prop="province" label="省份/直辖市">
          </el-table-column>
          <el-table-column prop="city" label="市">
          </el-table-column>
          <el-table-column prop="region" label="区">
          </el-table-column>
          <el-table-column prop="detailAddress" label="详细地址">
          </el-table-column>
          <el-table-column prop="defaultStatus" label="是否默认收货地址">
            <template slot-scope="scope">
              <div v-for="item in isDefaultAdd">
                <span v-if="scope.row.defaultStatus==item.value">{{item.label}}</span>
              </div>
            </template>

          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="addressListQuery.page"
                         :page-sizes="[10,20,30,50]" :page-size="addressListQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="second">
        <table class="publicTable">
          <tr>
            <td>
              <div class="flex">
                <label>客户类型：</label>
                <span v-for="item in customerTypeOptions" v-if="data.customerType ===item.id">{{item.name}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>客户属性：</label>
                    <span  v-for="item in customerAttributeOptions" v-if="data.customerAttribute ===item.name">{{item.name}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="flex">
                <label>客户行业：</label>
                <span v-for="item in customerIndustryOptions">
                    <span v-if="data.customerIndustry ===item.name">{{item.name}}</span>
                  </span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>客户等级：</label>
                <span v-for="item in customerGradeOptions">
                    <span v-if="data.customerGrade ===item.id">{{item.name}}</span>
                  </span>
              </div>
            </td>

          </tr>
          <tr>
            <td>
              <div class="flex">
                <label>省份城市：</label>
                <span>{{data.location}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>传真：</label>
                <span>{{data.fax}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="flex">
                <label>详细地址：</label>
                <span>{{data.address}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="flex">
                <label>备注：</label>
                <span>{{data.note}}</span>
              </div>
            </td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="联系人信息" name="third">
        <el-table :data="linkManTableData" size="mini" highlight-current-row border
                  class="el-tb-edit"
                  ref="linkManTable">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="linkMan" label='客户联系人(*)：'>
          </el-table-column>
          <el-table-column prop="linkPosition" label="联系人职务：">
          </el-table-column>
          <el-table-column prop="linkPhone" label="联系人电话(*)：">
          </el-table-column>
          <el-table-column prop="linkEmail" label="联系人邮箱：">
          </el-table-column>
          <el-table-column prop="linkIsMain" label="是否主要联系人：">
            <template slot-scope="scope">
                <span v-for="item in linkIsMainOptions">
                  <span v-if="scope.row.linkIsMain === item.value">{{item.label}}</span>
                </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="财务信息" name="fourth">
        <table class="publicTable">
          <tr>
            <td>
              <div class="flex">
                <label>开户银行：</label>
                <span>{{data.bankName}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>银行账号：</label>
                <span>{{data.bankAccount}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="flex">
                <label>开票地址：</label>
                <span>{{data.kpAddress}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>开票电话：</label>
                <span>{{data.kpTel}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="flex">
                <label>纳税人识别号：</label>
                <span>{{data.taxpayerNumber}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>信用期限：</label>
                <span>{{data.creditPeriod}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="flex">
                <label>收票人：</label>
                <span>{{data.spMan}}</span>
              </div>
            </td>
            <td>
              <div class="flex">
                <label>收票电话：</label>
                <span>{{data.spTel}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
                <label>省份城市：</label>
                <span>{{data.province + data.city + data.county}}</span>
            </td>
            <td>
              <div>
                <label>详细地址：</label>
                <span>{{data.spAddress}}</span>
              </div>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <label>县区：</label>
              <span>{{data.county}}</span>
            </td>
            <td>
              <div>
                <label>详细地址：</label>
                <span>{{data.spAddress}}</span>
              </div>
            </td>
          </tr> -->
          <tr>
            <td>
              <div class="flex" style="display: flex;flex-direction: row;justify-content: flex-start;">
                <label>结算方式：</label>
                    <span v-for="item in paymentsMeansOptions" v-if="item.label==data.paymentsMeans">{{item.label}}</span>
              </div>
            </td>
            <td>
              <div class="flex" style="display: flex;flex-direction: row;justify-content: flex-start;">
                <label>收款条件：</label>
                  <span>{{data.collectionTerms}}</span>
              </div>
            </td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="营业执照" name="fifth">
        <div style="display: flex;flex-direction: row;justify-content: flex-start;">
          <span>营业执照:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-upload class="el-upload-img"
            action="/api/goods/storage/create"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-success="handlePictureCardSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible"  append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增客户地址弹窗 -->
    <el-dialog title="新增客户地址" :visible.sync="customerAddressVisible" append-to-body width="60%">
      <el-form :model="addressDataForm" ref="addressDataForm" :rules="addressRules" label-width="85px" size="medium">
        <table class="publicTable">
          <tr>
            <td width="50%">
              <el-form-item label="收货人:" prop="name" class="el-form-flex">
                <el-input v-model="addressDataForm.name" placeholder="请输入收货人"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收货人电话:" prop="phoneNumber" class="el-form-flex">
                <el-input v-model="addressDataForm.phoneNumber" placeholder="请输入收货人电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="所在区域" prop="regionCodes">
                <el-cascader
                  :options="options"
                  v-model="addressDataForm.regionCodes"
                  style="width: 100%"
                  placeholder="请选择所在区域"
                  :props="{ checkStrictly: false,value:'label' }"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="详细地址:" prop="detailAddress" class="el-form-flex">
                <el-input v-model="addressDataForm.detailAddress" placeholder="请输入地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="邮政编码:" prop="postCode" class="el-form-flex">
                <el-input v-model="addressDataForm.postCode" placeholder="请输入邮政编码"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="是默认地址" prop="defaultStatus">
                <el-select v-model="addressDataForm.defaultStatus" placeholder="请选择是否为默认地址" style="width: 100%;">
                  <el-option
                    v-for="item in isDefaultAdd"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="cancelCreateAddress">取 消</el-button>
          <el-button size="medium" type="primary" @click="createAddress('addressDataForm')">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑客户弹窗-->
    <el-dialog title="编辑客户" :visible.sync="customerEditVisible" append-to-body width="70%">
      <customer-form :id="otherCustomerId" ref="customerEditDialog" v-if="customerEditVisible"
                     :customerTypeOptions="customerTypeOptions"
                     :paymentsMeansOptions="paymentsMeansOptions"
                     :collectionTermsOptions="collectionTermsOptions"
                     :customerAttributeOptions="customerAttributeOptions"
                     :customerIndustryOptions="customerIndustryOptions"></customer-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="handleCustomerEditCancel">取消</el-button>
          <el-button size="medium" type="primary" @click="handlerCustomerEditOnSubmit">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 查看其他客户弹窗 -->
    <el-dialog title="查看其他客户" :visible.sync="customerSelectorVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog"
                         :isSingle="true" ref="customerSelector"></customer-selector>
      <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="handleCustomerSelectorCancel">取消</el-button>
          <el-button size="medium" type="primary" @click="handleCustomerSelectorSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
  import {getObj, page, getAddressPage, addAddressObj, delAddress, putAddressObj,getMemberInfo,updateMemberInfo} from '@/api/erp/crm/customer/index';
  import {isvalidePhone} from '@/utils/validate';
  import {regionData, CodeToText, TextToCode} from 'element-china-area-data';
  import {getSimpleTree} from '@/api/erp/mall/cms/area';
  import {getToken} from '@/utils/auth';


  export default {
    name: 'customerView',
    props: ['id', 'customerTypeOptions', 'customerGradeOptions', 'customerIndustryOptions', 'customerAttributeOptions', 'collectionTermsOptions', 'paymentsMeansOptions'],
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'customer-form': () => import('./customerForm')
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidePhone(value)[0]) {
          callback(new Error(isvalidePhone(value)[1]));
        } else {
          callback();
        }
      };
      return {
        fileList: [],
        total: 0,
        selectedRows: [],
        options: [],
        addressTableData: [],
        fileList: undefined,
        headers:null,
        dialogImageUrl: '',
        dialogVisible: false,
        addressDataForm: {
          name: '',
          phoneNumber: '',
          defaultStatus: '',
          memberId: '',
          detailAddress: '',
          regionCodes: [],
          province: '',
          city: '',
          region: '',
          location: '',
          postCode: ''
        },
        data: {
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
          customerAttribute: '',
          customerIndustry: '',
          fax: '',
          regionCodes: [],
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
          note: '',
          dataOrg: '',
          linkManTableData: [],
          customerAddress: ''
        },
        linkManTableData: [],
        activeName: 'first',
        isInsert: false,
        customerManagerArr: [],
        customerAddressVisible: false,
        customerSelectorVisible: false,
        customerMoreInfoVisible: false,
        customerEditVisible: false,
        value: '',
        customerCategoryOptions: [
          {
            value: '0',
            label: '普通客户'
          },
          {
            value: '1',
            label: '商超客户'
          }
        ],
        linkIsMainOptions: [
          {
            value: 'false',
            label: '否'
          },
          {
            value: 'true',
            label: '是'
          }
        ],
        isDefaultAdd: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          }
        ],
        isOtherCustomer: false,
        otherCustomerId: '',
        addressListQuery: {
          page: 1,
          limit: 10,
          memberId: undefined,
          name: undefined,
          phoneNumber: undefined,
          province: undefined,
          detailAddress: undefined,
        },
        addressRules: {
          name: [{
            required: true, message: '请输入', trigger: 'blur'
          }],
          regionCodes: [{
            required: true, message: '请选择', trigger: 'blur'
          }],
          phoneNumber: [{
            required: true, message: '请输入', trigger: 'blur'
          }],
          detailAddress: [{
            required: true, message: '请输入', trigger: 'blur'
          }],
          defaultStatus: [{
            required: true, message: '请选择', trigger: 'blur'
          }]
        },
      }
    },
    created() {
      this.headers={
        Authorization : getToken()
      }
      this.init()

    },
    watch: {
      id(val) {
        this.isOtherCustomer = false;
        this.init()
      },
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
      handlePictureCardSuccess(response, file, fileList){
        console.log(fileList);
        this.fileList= [{url:response.data.url}];
        updateMemberInfo({
          customer: this.data.customerCode,
          qualification: response.data.url
        }).then(res=>{
           console.log(res)
          if(res.code == '2000'){
             this.vueMessage('success','操作成功!');
          }else{
             this.vueMessage('warning',res.msg);
          }
        })
      },
      handleResetSearch(){
        this.addressListQuery = {
          page: 1,
            limit: 10,
            memberId: undefined,
            name: undefined,
            phoneNumber: undefined,
            province: undefined,
            detailAddress: undefined,
        };
      },
      handleFilter() {
        this.getAddressList();
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          this.getAddressList();
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
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
      handleSizeChange(val) {
        this.addressListQuery.limit = val;
        this.getAddressList()
      },
      handleCurrentChange(val) {
        this.addressListQuery.page = val;
        this.getAddressList();
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        } else {
          this.customerAddressVisible = true;
          this.addressDataForm = JSON.parse(JSON.stringify(this.selectedRows[0]))
          this.addressDataForm.regionCodes = [this.addressDataForm.province,this.addressDataForm.city, this.addressDataForm.region];
          getSimpleTree().then(res => {
            this.options = this.getCategoryList(res[0].children);
          });
        }
      },
      handleChange(value) {
        this.addressDataForm.province = value[0];
        this.addressDataForm.city = value[1];
        this.addressDataForm.region = value[2];
        this.addressDataForm.location = value[0] + '/' + value[1] + '/' + value[2];
      },
      init() {
        this.addressListQuery = {
          page: 1,
          limit: 10,
          memberId: undefined,
          name: undefined,
          phoneNumber: undefined,
          province: undefined,
          detailAddress: undefined,
        };
        let id = null;
        if (this.isOtherCustomer) {
          id = this.otherCustomerId
        } else {
          id = this.id
        }
        getObj(id)
          .then(response => {
            this.data = response.data;
            this.linkManTableData = response.data.linkManTableData;
            if (this.linkManTableData === undefined) {
              this.linkManTableData = response.data;
            }
            getMemberInfo(this.data.customerCode).then(res=>{
              this.dialogImageUrl = res.qualification;
              this.fileList= [{url:res.qualification}];
            })
            this.getAddressList();
            this.getSimpleTrees();
          });
      },
      getSimpleTrees(){
        getSimpleTree().then(res => {
          if(this.data && this.data.regionCodes != undefined){
            for(let i in res[0].children){
              if(this.data.regionCodes[0] == res[0].children[i].value){
                this.data.province =  res[0].children[i].label;
                for(let j in res[0].children[i].children){
                  if(this.data.regionCodes[1] == res[0].children[i].children[j].value){
                    this.data.city = res[0].children[i].children[j].label;
                    for(let k in  res[0].children[i].children[j].children){
                      if(this.data.regionCodes[2] ==  res[0].children[i].children[j].children[k].value){
                        this.data.county = res[0].children[i].children[j].children[k].label;
                      }
                    }
                  }
                }
              }
            }
          }

          // this.options = this.getCategoryList(res[0].children);
        });
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error('请输入'))
        } else {
          callback();
        }
      },
      getAddressList() {
        this.addressListQuery.memberId = this.data.customerCode;
        getAddressPage(this.addressListQuery)
          .then(response => {
            this.addressTableData = response.records;
            this.total = response.total
          })
      },
      handleCustomerAddressCreate() {
        this.addressDataForm.memberId = this.data.customerCode;
        this.customerAddressVisible = true;
        this.isInsert = true;
        getSimpleTree().then(res => {
          this.options = this.getCategoryList(res[0].children);
        });
      },
      handleCustomerChoose() {
        this.customerSelectorVisible = true
      },
      closeCustomerDialog(list) {
        this.isOtherCustomer = true;
        this.otherCustomerId = list[0].id;
        this.init();
      },
      handleCustomerSelectorCancel() {
        this.$refs.customerSelector.reset();
        this.customerSelectorVisible = false
      },
      handleCustomerSelectorSubmit() {
        this.$refs.customerSelector.onSubmit();
        this.customerSelectorVisible = false
      },
      handleCustomerMoreInfoShow() {
        this.customerMoreInfoVisible = true
      },
      handleCustomerMoreInfoClose() {
        this.customerMoreInfoVisible = false
      },
      handleCustomerInfoUpdate() {
        if (!this.isOtherCustomer) {
          this.otherCustomerId = this.id;
        }
        this.customerEditVisible = true
      },
      handleCustomerEditCancel() {
        this.customerEditVisible = false
      },
      handlerCustomerEditOnSubmit() {
        this.$refs.customerEditDialog.onSubmit();
        this.customerEditVisible = false;
        this.init()
      },
      resetCreatAddress() {
        this.addressDataForm = {
          name: '',
          phoneNumber: '',
          defaultStatus: '',
          memberId: '',
          detailAddress: '',
          regionCodes: [],
          province: '',
          city: '',
          region: '',
          location: '',
          postCode: ''
        }
      },
      cancelCreateAddress() {
        this.customerAddressVisible = false;
        this.resetCreatAddress();
      },
      createAddress(formName) {
        this.addressDataForm.customerId = this.data.id;
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            const addressData = JSON.parse(JSON.stringify(this.addressDataForm));
            delete addressData.regionCodes;
            delete addressData.location;
            if (this.isInsert) {
              addAddressObj(addressData)
                .then(() => {
                  this.cancelCreateAddress();
                  this.getAddressList();
                  this.isInsert = false;
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                })
            } else {
              putAddressObj(this.selectedRows[0].id, addressData)
                .then(() => {
                  this.cancelCreateAddress();
                  this.getAddressList();
                  this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  });
                })
            }

          } else {
            return false;
          }
        });
      },
      // 行选择
      handleRowClick(row, event, column) {
        this.$refs.addressTableData.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      addressDelete() {
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
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delAddress(this.selectedRows[0].id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                this.getAddressList();
              });
          });
      }
    }
  }
</script>

<style lang="scss">
  .el-upload-img{
    .el-icon-delete{
      display: none !important;
    }
  }
  .el-col {
    margin-bottom: 15px;
  }

  .titleRow {
    height: 25px;

  }

  .otherSpan {
    color: #4F90E2;
  }

  .underline {
    margin-bottom: 25px;
  }

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

    .crtTimeSpan {
      margin-left: 20px;

      span {
        margin-left: 5px;
      }
    }

    .el-form-item {
      margin-bottom: 0px;

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
    }

    .el-col {
      margin: 0px;
    }

    .el-input__inner {
      padding: 0px;
    }

    label {
      flex: 0 0 auto;
      font-weight: 100;
      min-width: 35px;
    }

    .el-input {
      input {
        border: none;
      }
    }

  }
</style>
