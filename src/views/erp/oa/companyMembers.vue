<template>
  <div class="company-members-div">
    <div class="company-members-banner">
      <!--<span>公司总人数：3人</span>-->
      <el-input placeholder="成员姓名" style="width: 200px;" clearable
                @keyup.enter.native="handleFilter" v-model="listQuery.name">
      </el-input>
      <el-input placeholder="手机" style="width: 200px;" clearable
                @keyup.enter.native="handleFilter" v-model="listQuery.mobilePhone">
      </el-input>
      <el-input placeholder="电话" style="width: 200px;" clearable
                @keyup.enter.native="handleFilter" v-model="listQuery.telephone">
      </el-input>
      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
      </el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      <!--<el-button type="text" icon="el-icon-plus" @click="handleRecordShow">新增员工档案</el-button>-->
    </div>

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
            <div class="company-members-item" v-if="list && list.length>0" v-for="(item,idx) in list" :key="item.id">
              <div class="company-members-img">
              </div>
              <div class="company-members-content">
                <el-row>
                  <el-col :span="24">
                    <span @click="handlePersonalDynamicsShow">{{item.staffCode}}-{{item.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="content-list">部门：{{item.departmentName}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="content-list">职务：{{item.postName}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="content-list">工作手机：{{item.mobilePhone}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="content-list">电话：{{item.telephone}}</span>
                  </el-col>

                </el-row>
              </div>
            </div>

          </el-card>
        </div>

      </el-col>
    </el-row>

    <!-- 新建员工档案弹窗 -->
    <el-dialog title="新建员工档案" :visible.sync="staffRecordVisible" width="70%">
      <staff-record></staff-record>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleStaffRecordCancel">取消</el-button>
        <el-button size="medium" type="primary" @click="handlerStaffRecordCreate">确 定</el-button>
      </span>
    </el-dialog>

    <!--个人动态弹窗 -->
    <el-dialog title="个人动态" :visible.sync="personalDynamicsVisible" width="70%"
               class="personalDynamicsDialog">
      <personal-dialog></personal-dialog>
      <!-- <span slot="footer" class="dialog-footer">
         <el-button size="medium" @click="handlePersonalDynamicsCancel">取消</el-button>
         <el-button size="medium" type="primary" @click="handlerPersonalDynamicsCreate">确 定</el-button>
       </span>-->
    </el-dialog>

  </div>
</template>

<script>
  import {page} from '@/api/erp/hrm/staffRecord';
  import {getTree,} from '@/api/org/depart/index';

  export default {
    name: "companyMembers",
    data() {
      return {
        list: null,
        listQuery: {
          name: undefined,
          telephone: undefined,
          mobilePhone: undefined,
          departmentId: undefined
        },
        filterText: '',
        mainTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        staffRecordVisible: false,
        personalDynamicsVisible: false,
      }
    },
    components: {
      'staff-record': () => import('@/views/erp/hrm/staffRecord'),
      'personalDialog': () => import('./personalDynamicsDialog'),
    },
    created() {
      this.initmainTreeData();
      this.getList();
    },
    watch: {
      filterText(val) {
        this.$refs.mainTree.filter(val);
      }
    },
    methods: {
      getList() {
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
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
          name: undefined,
          telephone: undefined,
          mobilePhone: undefined,
          departmentId: undefined
        };
        this.getList();
      },
      getTreeNodeData(data) {
        this.listQuery.departmentId = data.id;
        this.getList();
      },
      handleRecordShow() {
        this.staffRecordVisible = true;
      },
      handleStaffRecordCancel() {
        this.staffRecordVisible = false;
      },
      handlerStaffRecordCreate() {
        this.staffRecordVisible = false;
      },
      handlePersonalDynamicsShow() {
        this.personalDynamicsVisible = true
      },
    }
  }
</script>

<style lang="scss" scoped>
  .company-members-div {
    min-width: 1280px;
    padding: 20px;

    .box-card{
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
          .el-col-6{
            height: 30px;
            line-height: 30px;
          }
        }

      }
    }

  }
</style>
<!--弹窗高度到最大-->
<style lang="scss">
  .company-members-div {
    .personalDynamicsDialog {
      .el-dialog {
        margin-top: 0vh !important;
        margin-bottom: 0vh !important;
        height: 100vh !important;
        min-width: 1000px;
      }

      .el-dialog__body {
        padding: 10px 20px;
      }

      .el-card {
        .el-card__header {
          padding: 15px;
          height: 80px;
        }

        .el-card__body {
          padding: 0px !important;

        }
      }
    }
  }
</style>
