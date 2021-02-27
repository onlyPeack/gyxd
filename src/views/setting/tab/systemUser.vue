<template>
  <div class="company-members-div">

    <el-row>
      <el-col :span="5">
        <div class="company-members-aside">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>组织架构</span>
            </div>
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree" node-key="id" :data="mainTreeData" :props="defaultProps" default-expand-all
                       :expand-on-click-node="false"
                       :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData" highlight-current>
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="company-members-main">
          <el-card class="box-card">
            <div class="filter-container">
              <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="工号"
                        v-model="listQuery.no">
              </el-input>
              <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="登录名"
                        v-model="listQuery.username">
              </el-input>
              <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户姓名"
                        v-model="listQuery.name">
              </el-input>
              <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门"
                        v-model="listQuery.departName">
              </el-input>
              <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
              <el-button class="filter-item" type="warning" icon="reset" @click="handleReset">重置</el-button>
              <el-button class="filter-item" type="success" icon="edit" @click="handleCreate">添加</el-button>
            </div>
            <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%">
              <el-table-column width="100" align="center" label="工号">
                <template slot-scope="scope">
                  <span>{{scope.row.no}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" label="姓名">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" label="性别">
                <template slot-scope="scope">
                  <span>{{scope.row.sex}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" label="登录名">
                <template slot-scope="scope">
                  <span>{{scope.row.username}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" label="上级工号">
                <template slot-scope="scope">
                  <span>{{scope.row.leader}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" align="left" label="部门">
                <template slot-scope="scope">
                  <span>{{scope.row.departName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="角色">
                <template slot-scope="scope">
                  <span>{{scope.row.groupNames}}</span>
                </template>
              </el-table-column>
              <el-table-column  label="备注">
                <template slot-scope="scope">
                  <span>{{scope.row.description}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
                  </el-button>
                  <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
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
          </el-card>
        </div>

      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="工号" :prop="dialogStatus == 'create'?'no':'no1'">
          <el-input v-if="dialogStatus == 'create'" v-model="form.no" placeholder="请输入工号"></el-input>
          <el-input v-else v-model="form.no" placeholder="请输入工号" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input v-model="form.username" :readonly="dialogStatus == 'update'&&form.no<=90000" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="密码" placeholder="请输入密码" :prop="dialogStatus == 'create'?'password':'password1'">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" placeholder="请输入确认密码" :prop="dialogStatus == 'create'?'confirmPwd':'confirmPwd1'">
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item label="上级工号" prop="leader">
          <el-input  type="text" v-model="form.leader" :readonly="dialogStatus == 'update'&&form.no<=90000">
            <el-button slot="append" icon="el-icon-search"  @click="noClick"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="部门" placeholder="请选择部门" prop="departName">
          <el-input  type="text" v-model="form.departName" :readonly="dialogStatus == 'update'&&form.no<=90000">
            <el-button slot="append" icon="el-icon-search" @click="openDepartDialog()"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                    v-model="form.description"></el-input>
        </el-form-item>
        <span style="color:red;margin-left: 100px;">提示：非特殊工号请去人事部门修改登录名、上级工号以及部门</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择部门" width="30%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请选择用户" v-if="userVisible" :visible.sync="userVisible" append-to-body>
      <user-selector  :isSingle="true"
                     ref="userSelector" :id="id" @closeUserDialog="closeUserDialog"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page, addObj, getObj, delObj, putObj, fullUserPage,updateUser
  } from '@/api/admin/user/index';
  import {getTree,} from '@/api/org/depart/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {getGroupList} from '@/api/admin/group/index';


  export default {
    name: "systemUser",
    components: {
      'depart-selector': () => import('@/views/admin/user/components/departSelector'),
      'user-selector': () => import('@/components/ERP/User/user')
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
      const validatePassword1 = (rule, value, callback) => {
        if (this.form.confirmPwd!== this.form.password ) {
          callback(new Error('两次输入不一致'));
        } else {
          callback();
        }

        console.log( this.form)
      };
      const validatePassword = (rule, value, callback) => {
        if (this.form.password !== this.form.confirmPwd&&this.form.password!=='' ) {
          callback(new Error('两次输入密码不一致'));
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
        id:1,
        userVisible: false,
        list: null,
        total: null,
        listQuery: {
          page: 1,
          limit: 10,
          no: undefined,
          name: undefined,
          username: undefined,
          departName: undefined,
          departId: undefined,
          no:undefined,
        },
        form: {
          no: undefined,
          leader: undefined,
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          confirmPwd: undefined,
          description: undefined,
          departName: undefined,
          departId: undefined,
          positionIds: []
        },
        rules: {
          no: [{required: true, message: '请填写工号', trigger: 'blur'}, {validator: validateNo, trigger: 'blur'}],
          name: [{required: true, message: '请输入用户姓名', trigger: 'blur'}],
          username: [{required: true, message: '请输入登录名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validatePassword, trigger: 'blur'}],
          confirmPwd1: [{validator: validatePassword1, trigger: 'blur'}],
          departName: [{required: true, message: '请选择部门', trigger: 'blur'}]
        },
        filterText: '',
        mainTreeData: [],
        sexOptions: ['男', '女', '未知'],
        positionOptions: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        dialogDepartVisible: false,
        dialogStatus: '',
        listLoading: true,
        tableKey: 0,
        textMap: {
          update: '编辑',
          create: '创建'
        },
      }
    },
    created() {
      this.initmainTreeData();
      this.getList();
      /*getTypeValue('comm_sex').then(response => {
        this.sexOptions = response.data.rows;
      });

      //获取所有角色
      getGroupList({groupType: 'role'}).then(response => {
        this.positionOptions = response;
      })*/
    },
    watch: {
      filterText(val) {
        this.$refs.mainTree.filter(val);
      }
    },
    methods: {
        noClick(){
          if(this.dialogStatus == 'update'&&this.form.no<=90000){
            return
          }
          this.userVisible=true;
        },
        handleCancelUser() {
        this.$refs.userSelector.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.userSelector.onSubmit();
      },
      closeUserDialog(list) {
        this.userVisible = false;

        if (list.length > 0) {
          this.form.leader = list[0].no
          this.$refs.userSelector.reset();
        }

      },
      getList() {
        fullUserPage(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
            this.listLoading = false;
          })
      },
      initmainTreeData() {
        getTree().then(data => {
          this.mainTreeData = data;
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery = {
          no: undefined,
          name: undefined,
          username: undefined,
          departName: undefined,
          departId: undefined
        };
        this.getList();
      },
      getTreeNodeData(data) {
        this.listQuery.departId = data.id;
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
              const depart = JSON.parse(response.data.departId);
              if (typeof depart == 'object' && depart) {
                this.form.departName = depart.name;
                this.form.departId = depart.id
              } else {
                this.form.departId = response.data.departId;
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
      create(formName) {
        this.listQuery.no=this.form.no;
        this.listQuery.page=1;
        this.listQuery.no=this.form.no;
        this.listQuery.page=1;
        fullUserPage(this.listQuery)
          .then(response => {
            console.log(response.records)
            if(response.records.length>0){

              this.vueMessage('warning','该工号'+response.records[0].no+'已存在!');
              return
            }else{
              this.listQuery.no=undefined;
              this.listQuery.username=this.form.username;
              fullUserPage(this.listQuery)
                .then(response => {
                  console.log(response.records)
                  if(response.records.length>0){
                    this.vueMessage('warning','该用户已存在');
                    return
                  }else{
                    const set = this.$refs;
                    set[formName].validate(valid => {
                      if (valid) {
                        addObj(this.form)
                          .then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                              title: '成功',
                              message: '创建成功',
                              type: 'success',
                              duration: 2000
                            });
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
        console.log(this.form)
        console.log(set[formName].validate())
        set[formName].validate(valid =>{
          if (valid) {
            this.dialogFormVisible = false;
            updateUser(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      openDepartDialog() {
        if(this.dialogStatus == 'update'&&this.form.no<=90000){
          return
        }
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
          departName: undefined,
          positionIds: []
        };
        for (var i in this.positionOptions) {
          this.positionOptions[i].checked = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .company-members-div {
    min-width: 1280px;
    padding: 20px;

    .box-card {
      height: 100%;
      overflow: auto;
    }

    .company-members-banner {
      margin-bottom: 10px;

      span {
        position: relative;
        top: -2px;
      }
    }

    .company-members-aside {
      height: 82vh;
      overflow: auto;
      padding-right: 10px;
    }

    .company-members-main {
      height: 82vh;
      overflow: auto;

      .company-members-item {
        position: relative;
        border-bottom: 1px solid #cccccc;
        padding: 15px;
        height: 85px;

        .company-members-img {
          width: 48px;
          height: 48px;
          position: absolute;
          border-radius: 3px;
          overflow: hidden;
          background-color: #409EFF;
        }

        .company-members-content {
          position: relative;
          left: 65px;
          top: 0px;
          right: 0;
          width: 92%;
          float: left;
          font-size: 16px;
          color: #409EFF;

          .content-list {
            font-size: 14px;
            color: #888888;
          }

          .el-col {
            height: 25px;
            line-height: 25px;
          }

          .el-col-6 {
            height: 30px;
            line-height: 30px;
          }
        }

      }
    }

  }
</style>
