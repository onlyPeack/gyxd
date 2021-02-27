<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
    <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增发布企业</span>
        <span v-if="dataForm.id">编辑发布企业</span>
        <span class="cont-title-billNo" v-if="dataForm.id">No.{{dataForm.id}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item prop="companyName" label="企业:" class="el-form-flex">
                <!--<el-input v-model="dataForm.companyName"></el-input>-->
                <div @click="customerVisible = true" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <span>{{dataForm.companyName}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="contact" label="联系人:" class="el-form-flex">
                <el-input v-model="dataForm.contact"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="telephone" label="联系电话:" class="el-form-flex">
                <el-input v-model="dataForm.telephone"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="mobile" label="手机:" class="el-form-flex">
                <el-input v-model="dataForm.mobile"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="email" label="邮箱:" class="el-form-flex">
                <el-input v-model="dataForm.email"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="qq" label="QQ:" class="el-form-flex">
                <el-input v-model="dataForm.qq"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="wx" label="微信:" class="el-form-flex">
                <el-input v-model="dataForm.wx"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="city" label="城市:" class="el-form-flex">
                <el-input v-model="dataForm.city"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="fax" label="传真:" class="el-form-flex">
                <el-input v-model="dataForm.fax"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="note" label="备注:" class="el-form-flex">
                <el-input v-model="dataForm.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <!-- 客户列表弹窗-->`
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {addCompany, updateCompany} from '@/api/erp/mall/scs/company';
  import {validEmail, isvalidePhone, isvalidatemobile} from '@/utils/validate';

  export default {
    name: "companyForm",
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector')
    },
    props: ['dialogFormVisible'],
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      const validateTelPhone = (rule, value, callback) => {
        var res = isvalidePhone(value);
        if (res[0]) {
          callback(new Error(res[1]));
        } else {
          callback();
        }
      };
      const validateMobile = (rule, value, callback) => {
        if (value && value != '') {
          var res = isvalidatemobile(value);
          if (res[0]) {
            callback(new Error(res[1]));
          }
        } else {
          callback();
        }
      };
      const validateEmail = (rule, value, callback) => {
        var res = validEmail(value);
        if (value && !res) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      };
      return {
        isFormLoading: false,
        dataForm: {
          id: undefined,
          userCode: undefined,
          companyName: undefined,
          telephone: undefined,
          contact: undefined,
          mobile: undefined,
          email: undefined,
          qq: undefined,
          wx: undefined,
          city: undefined,
          fax: undefined,
          note: undefined
        },
        rules: {
          companyName: [
            {
              required: true,
              message: '请选择客户',
              trigger: 'blur'
            }
          ],
          contact: [
            {
              required: true,
              message: '请输入联系人姓名',
              trigger: 'blur'
            }, {
              required: true,
              min: 2,
              max: 100,
              message: '姓名长度为2-100个字符',
              trigger: 'blur'
            }
          ],
          telephone: [
            {
              required: true,
              message: '请输入联系电话',
              trigger: 'blur'
            }, {
              required: true,
              validator: validateTelPhone,
              message: '联系电话格式不正确',
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: false,
              message: '请输入手机号码',
              trigger: 'blur'
            }, {
              required: false,
              validator: validateMobile,
              message: '手机号码格式不正确',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: false,
              message: '请输入联系电话',
              trigger: 'blur'
            }, {
              required: false,
              validator: validateEmail,
              message: '邮箱格式不正确',
              trigger: 'blur'
            }
          ],
          qq: [
            {
              required: false,
              message: '请输入QQ号码',
              trigger: 'blur'
            }, {
              required: false,
              min: 6,
              max: 12,
              message: 'QQ号码长度为6-12个字符',
              trigger: 'blur'
            }
          ],
          wx: [
            {
              required: false,
              message: '请输入微信账号',
              trigger: 'blur'
            }, {
              required: false,
              min: 6,
              max: 50,
              message: '微信账号长度为6-50个字符',
              trigger: 'blur'
            }
          ],
          city: [
            {
              required: false,
              message: '请输入城市',
              trigger: 'blur'
            }, {
              required: false,
              min: 2,
              max: 50,
              message: '城市长度为2-50个字符',
              trigger: 'blur'
            }
          ],
          fax: [
            {
              required: false,
              message: '请输入传真号码',
              trigger: 'blur'
            }, {
              required: false,
              min: 6,
              max: 20,
              message: '传真号码长度为6-00个字符',
              trigger: 'blur'
            }
          ],
          note: [
            {
              required: false,
              message: '请输入备注',
              trigger: 'blur'
            }, {
              required: false,
              min: 1,
              max: 255,
              message: '备注长度为1-255个字符',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        customerVisible: false,
        customerArr: [],
      };
    },
    created() {
    },
    methods: {
      handleClose() {
        this.$emit('handleClose', false);
      },
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isFormLoading = true;
            if (this.dataForm.id == null) {
              //添加操作
              addCompany(this.dataForm).then(response => {
                this.isFormLoading = false;
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  });
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
                this.$emit('submitSuccess');
              }).catch(() => {
                this.isFormLoading = false;
              });
            } else {
              //编辑操作
              updateCompany(this.dataForm).then(response => {
                this.isFormLoading = false;
                this.dataForm.id = null;
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              }).catch(() => {
                this.isFormLoading = false;
              });
            }
          }
        });
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.companyName = list[0].customerName;
          this.dataForm.userCode = list[0].customerCode;
          this.dataForm.contact = list[0].contact;
          this.dataForm.telephone = list[0].telephone;
          this.$refs['dataForm'].validateField('companyName');
        }
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
    },
    watch: {}
  }
</script>
