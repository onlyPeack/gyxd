<template>
  <div class="full-purchase bill-container">

    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" v-model="listQuery.userId" placeholder="客户编号"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
      </el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-delete" @click="handleDelete(0,true)" id="delete_bill">删除</el-button>
    </div>
    <!--列表-->
    <el-table :data="list" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading"
              element-loading-text="正在查询中。。。" ref="dataTable" :height="clientHeight" key="dataTable">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="userId" label="客户编号">
      </el-table-column>
      <el-table-column prop="userName" label="登录名">
      </el-table-column>
      <el-table-column align="center" property="img" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="40"/>
        </template>
      </el-table-column>
      <el-table-column prop="module" label="模块">
      </el-table-column>
      <el-table-column prop="status" label="是否显示">
        <template slot-scope="scope">{{scope.row.status==0?'是':'否'}}</template>
      </el-table-column>
      <el-table-column prop="updTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row,false)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="70%"
               style="height: 58vh;overflow: hidden;margin-top: 20vh" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose">
      <span slot="title" class="con-title">
        <span v-if="isEdit">新增会员菜单</span>
        <span v-if="!isEdit">编辑会员菜单</span>
      </span>
      <cell-phone-from :isEdit="isEdit" :id="id" @submitSuccess="submitSuccess"
                       @handleClose="handleClose"></cell-phone-from>
    </el-dialog>

  </div>
</template>

<script>
  import {list, deletes} from '@/api/mall/page/index';
  import CellPhoneFrom from './cellPoneFrom';

  export default {
    name: "cellPhone",
    components: {CellPhoneFrom},
    data() {
      return {
        clientHeight: 300,
        list: [],
        multipleSelection: [],
        isLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          userId: undefined,
        },
        total: 0,
        id: undefined,
        isEdit: true,
        dialogFormVisible: false,
        multipleSelection: [],
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submitSuccess() {

      },
      handleClose() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleCurrentChange(val) {

      },
      handleUpdate(val) {
        this.dialogFormVisible = true;
        this.isEdit = false;
        this.id = val.id;
      },
      handleDelete(val, isShow) {
        let ids = [];

        if (isShow) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
        } else {
          ids.push(val.id);
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletes(ids).then(res => {
            if (res.code == '2000' || res.code == '200') {
              this.vueMessage('success', '删除成功');
            } else {
              this.vueMessage('warning', res.msg);
            }
            this.getList();
          })
        });

      },
      handleSizeChange(val) {

      },
      handleCheckboxChange(val) {

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
        console.log(this.clientHeight);
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.dialogFormVisible = true;
        this.isEdit = true;
      },
      handleReset() {
        this.listQuery.userId = undefined;
      },
      getList() {
        this.isLoading = true;
        list(this.listQuery).then(res => {
            if (res.code == '200' || res.code === '2000') {
              this.list = res.data.records;
              this.total = res.data.total;
              this.isLoading = false;
            } else {
              this.list = [];
              this.total = 0;
              this.isLoading = false;
            }
          }
        )
      }
    }
  }
</script>
