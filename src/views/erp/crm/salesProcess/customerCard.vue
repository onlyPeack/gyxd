<template>
  <div class="app-container calendar-list-container customer-card-container">
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="公司名称"
                v-model="listQuery.companyName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="联系人名称"
                v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-upload class="upload" action="/api/crm/customerCard/import" :before-upload="beforeUpload"
                 :on-remove="handleRemove" :show-file-list="false"
                 :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                 style="display:inline;" :on-success="uploadCompleted" :headers="headers">
        <el-button type="text" icon="el-icon-download">
          导入
        </el-button>
      </el-upload>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="text" icon="el-icon-download" style="padding-left: 1550px">
        <a href="/api/crm/customerCard/downTemplate">下载导入模板</a>
      </el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="公司名称" prop="companyName"></el-table-column>
      <el-table-column align="center" label="联系人名称" prop="name"></el-table-column>
      <el-table-column align="center" label="职务" prop="post"></el-table-column>
      <el-table-column align="center" label="电话" prop="phone"></el-table-column>
      <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
      <el-table-column align="center" label="名片来源" prop="source"></el-table-column>
      <el-table-column align="center" label="部门" prop="department"></el-table-column>
      <el-table-column align="center" label="公司地址" prop="address"></el-table-column>
      <el-table-column align="center" label="备注" prop="note"></el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,50, 100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="ms-dialog">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="名片来源:" prop="source" class="el-form-flex">
                <el-input v-model="form.source"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="名片类型:" prop="type" class="el-form-flex">
                <el-select v-model="form.type" placeholder="请选择名片类型">
                  <el-option value="独享">独享</el-option>
                  <el-option value="公开">公开</el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="公司名称:" prop="companyName" class="el-form-flex">
                <el-input v-model="form.companyName"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="联系人名称:" prop="name" class="el-form-flex">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="电话:" prop="phone" class="el-form-flex">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="职务:" prop="post" class="el-form-flex">
                <el-input v-model="form.post"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="部门:" prop="department" class="el-form-flex">
                <el-input v-model="form.department"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="邮箱:" prop="email" class="el-form-flex">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="公司地址:" prop="address" class="el-form-flex">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" :loading="isLoading">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :loading="isLoading">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/erp/crm/customerCard';
  import {mapGetters} from 'vuex';

  export default {
    name: 'customerCard',

    data() {
      return {
        headers:null,
        isLoading:false,
        form: {
          companyName: undefined,
          name: undefined,
          department: undefined,
          post: undefined,
          phone: undefined,
          email: undefined,
          source: undefined,
          type: undefined,
          address: undefined,
          note: undefined,
        },

        rules: {
          companyName: [{required: true, message: '请输入', trigger: 'blur'}],
          name: [{required: true, message: '请输入', trigger: 'blur'}],
          post: [{required: true, message: '请输入', trigger: 'blur'}],
          phone: [{required: true, message: '请输入', trigger: 'blur'}],
          source: [{required: true, message: '请输入', trigger: 'blur'}],
          type: [{required: true, message: '请输入', trigger: 'blur'}],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          companyName: undefined,
          name: undefined,
        },
        dialogFormVisible: false,
        selectedRows: [],
        dialogStatus: '',
        textMap: {
          update: '修改名片',
          create: '添加名片'
        }
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
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
        }
        getObj(this.selectedRows[0].id)
          .then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete() {
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
            delObj(this.selectedRows[0].id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              });
          });
      },
      create(formName) {
        const set = this.$refs;
        this.isLoading = true;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.isLoading = false;
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
            this.isLoading = false;
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        this.isLoading = true;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form.id, this.form).then(() => {
              this.isLoading = false;
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
            this.isLoading = false;
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {};
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.companyName = undefined;
        this.listQuery.name = undefined;
      },

      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      //文件上传
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      beforeUpload(file) {
        console.log(file);
        const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          this.getList();
        }else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .customer-card-container {
    .ms-dialog {
      font-size: 12px;
      .topTable {
        width: 100%;
        margin-bottom: 20px;
        border: none;
        border-spacing: 0;
        border-collapse: collapse;
        color: #444;

        td {
          border: 1px solid #e0e0e0;
          height: 40px;
          padding: 0px;
          margin: 0px;
          padding-left: 10px;
        }
        .el-form-flex {
          display: flex;
          margin-bottom: 0px;
        }
        .el-input, .el-input-number {
          margin-top: 6px;
        }
        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }
        .el-textarea__inner {
          border: none;
          resize: none;
          padding: 10px 15px;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-form-item__content {
          width: 100%;
          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }
        }
        .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
          line-height: 40px;
          color: #444;
          min-width: 120px;
        }
      }
    }
  }
</style>
