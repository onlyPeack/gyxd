<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或登录名"
                v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="userManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="100" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="登录名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="上级工号">
        <template slot-scope="scope">
          <span>{{scope.row.leader}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="身份">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSuperAdmin"
                  :type="scope.row.isSuperAdmin === '0' ? 'primary' : 'warning'"
                  close-transition>
            <span v-if="scope.row.isSuperAdmin === '0'">普通身份</span>
            <span v-else-if="scope.row.isSuperAdmin === '1'">超级管理员</span>
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column width="110" align="center" label="部门">
        <template slot-scope="scope">
          <span> {{JSON.parse(scope.row.departId).name}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="300" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="最后时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="工号" :prop="dialogStatus == 'create'?'no':'no1'">
          <el-input v-if="dialogStatus == 'create'" v-model="form.no" placeholder="请输入工号"></el-input>
          <el-input v-else v-model="form.no" placeholder="请输入工号" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input v-model="form.username" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="密码" placeholder="请输入密码" :prop="dialogStatus == 'create'?'password':'password1'">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" placeholder="请输入确认密码" :prop="dialogStatus == 'create'?'confirmPwd':'confirmPwd1'">
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item label="部门" placeholder="请选择部门" prop="departName">
          <el-input readonly type="text" v-model="form.departName">
            <el-button slot="append" icon="el-icon-search" @click="openDepartDialog()"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="上级工号" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入上级工号" :readonly="dialogStatus == 'create'?false:true"></el-input>
        </el-form-item>
        <!--<el-form-item label="角色" prop="positionIds">
          <el-checkbox-group v-model="form.positionIds">
            <el-checkbox v-for="item in positionOptions" :label="item.value" :key="item.value"
                         :checked="item.checked" @change="item.checked=!item.checked">{{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item label="性别">
          <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                    v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择部门" width="30%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page, addObj, getObj, delObj, putObj, fullUserPage,updateUser
  } from '@/api/admin/user/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {getGroupList} from '@/api/admin/group/index';
  import {mapGetters} from 'vuex';

  export default {
    name: 'user',
    components: {
      'depart-selector': () => import('./components/departSelector')
    },
    watch: {
      dialogFormVisible: function (val, oldVla) {
        if (this.$refs['form'] != undefined) {
          this.$refs["form"].resetFields();
        }
      }
    },
    data() {
      const validatePosition = (rule, value, callback) => {
        if (this.form.positionIds.length == 0) {
          callback(new Error('请选择角色'));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (this.form.password !== this.form.confirmPwd&&this.form.password!=='' ) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      const validatePassword1 = (rule, value, callback) => {
        if (this.form.confirmPwd!== this.form.password ) {
          callback(new Error('两次输入不一致'));
        } else {
          callback();
        }
      };
      const validateNo = (rule, value, callback) => {
        if(this.dialogStatus !== 'update'){
          if (parseInt(this.form.no)<=90000) {
            callback(new Error('为了人事档案工号的连续性，特殊工号请从90000之后开始新增'));
          }else if(isNaN(this.form.no)){
            callback(new Error('工号必须为数字'));
          }
          else {
            callback();
          }
        }
      };
      return {
        form: {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          confirmPwd: undefined,
          description: undefined,
          departName: undefined,
          departId: undefined,
          positionIds: [],
          leader:undefined,
        },
        rules: {
          name: [{required: true, message: '请输入用户', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}],
          username: [{required: true, message: '请输入登录名', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validatePassword, trigger: 'blur'}],
          confirmPwd1: [{validator: validatePassword1, trigger: 'blur'}],
          no: [{required: true, message: '请填写工号', trigger: 'blur'}, {validator: validateNo, trigger: 'blur'}],
          leader: [{required: true, message: '请填写上级工号', trigger: 'blur'}],
          departName: [{required: true, message: '请选择部门', trigger: 'blur'}],
          positionIds: [{required: true, message: '请选择角色', trigger: 'blur'},
            {validator: validatePosition, trigger: 'blur'}]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined,
          username: undefined,
          no:undefined,
        },
        sexOptions: ['男', '女', '未知'],
        positionOptions: [],
        dialogFormVisible: false,
        dialogDepartVisible: false,
        dialogStatus: '',
        userManager_btn_edit: false,
        userManager_btn_del: false,
        userManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.userManager_btn_edit = this.elements['userManager:btn_edit'];
      this.userManager_btn_del = this.elements['userManager:btn_del'];
      this.userManager_btn_add = this.elements['userManager:btn_add'];
      /*getTypeValue('comm_sex').then(response => {
        this.sexOptions = response.data.rows;
      });

      //获取所有角色
      getGroupList({groupType: 'role'}).then(response => {
        this.positionOptions = response;
      })*/
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.username = this.listQuery.name;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      isActivePosition(val) {
        for (var i in this.positionOptions) {
          if (val && val == this.positionOptions[i].value) {
            this.positionOptions[i].checked = true;
          } else {
            this.positionOptions[i].checked = false;
          }
        }
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = JSON.parse(JSON.stringify(response.data));
            this.vueSet(this.form, 'password', '');
            this.vueSet(this.form, 'confirmPwd', '');

            if (this.form.positionIds) {
              for (var i in this.form.positionIds) {
                this.isActivePosition(this.form.positionIds[i]);
              }
            } else {
              this.form.positionIds = [];
              for (var i in this.form.positionIds) {
                this.isActivePosition();
              }
            }

            try {
              const depart = JSON.parse(response.data.departId)
              if (typeof depart == 'object' && depart) {
                this.form.departName = depart.name
                this.form.departId = depart.id
              } else {
                this.form.departId = response.data.departId
                this.form.departName = response.data.departId
              }
            } catch (e) {
              console.log('error：部门转化json失败' + e);
            }
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      },
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      create(formName) {
        this.listQuery.no=this.form.no;
        this.listQuery.page=1;
        fullUserPage(this.listQuery)
          .then(response => {
            if(response.records.length>0){

              this.vueMessage('warning','该工号'+response.records[0].no+'已存在!');
              return
            }else{
              this.listQuery.no=undefined;
              this.listQuery.username=this.form.username;
              fullUserPage(this.listQuery)
                .then(response => {
                  if(response.records.length>0){
                    this.vueMessage('warning','该用户已存在');
                    return
                  }else{
                    const set = this.$refs;
                    set[formName].validate(valid => {
                      if (valid) {
                        addObj(this.form)
                          .then(response => {
                            if (response.code == '2000') {
                              this.dialogFormVisible = false;
                              this.getList();
                              this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                              });
                            } else {
                              this.$notify({
                                title: '失败',
                                message: response.msg,
                                type: 'warning',
                                duration: 2000
                              });
                            }
                          })
                      } else {
                        return false;
                      }
                    });
                  }
                })
            }
          })
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            // this.dialogFormVisible = false;
            updateUser(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      openDepartDialog() {
        this.dialogDepartVisible = true
      },
      closeDepartDialog(depart) {
        this.form.departName = depart.label;
        this.form.departId = depart.id;
        this.dialogDepartVisible = false;
        this.$refs['form'].validateField('departName');
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined,
          departId: undefined,
          positionIds: [],
          departName: undefined
        };
        for (var i in this.positionOptions) {
          this.positionOptions[i].checked = false;
        }
      }
    }
  }
</script>
