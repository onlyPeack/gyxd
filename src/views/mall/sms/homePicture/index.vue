<template>
  <div class="full-purchase sms-home-picture">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="名称"
                  v-model="listQuery.name"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="status" label="类型">
        <template slot-scope="scope">
          <div v-for="item in typeOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.status">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pic" label="内容">
        <template slot-scope="scope">
          <img v-if="scope.row.status==0" :src="scope.row.pic" alt="" style="height: 40px;margin-top: 10px;">
          <span v-else>{{scope.row.pic}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增弹窗 -->
    <home-picture-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible"
                       @submitSuccess="submitSuccess" @handleClose="handleClose"
                       :typeOptions="typeOptions" :row="row">
    </home-picture-form>

  </div>
</template>

<script>
  import {list} from '@/api/mall/sms/homePicture';
  import homePictureForm from "./form";

  export default {
    name: "homePictureList",
    components: {
      homePictureForm
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        typeOptions: [{
          value: 0,
          label: '图片'
        }, {
          value: 1,
          label: '文字'
        }],
        row: null
      };
    },
    created() {
      const _this = this;
      this.changeDivHeight();
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        list(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
      },
      handleReset() {
        this.listQuery.name = undefined;
      },
      handleCreate() {
        this.row = null;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.row = null;
        this.dialogFormVisible = false;
      },
      submitSuccess() {
        this.row = null;
        this.dialogFormVisible = false;
        this.getList();
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'warning',
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
        this.row = JSON.parse(JSON.stringify(this.selectedRows[0]));
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sms-home-picture {
    margin: 10px 20px;
    .pagination-container {
      margin-top: 10px;
    }
  }
</style>
