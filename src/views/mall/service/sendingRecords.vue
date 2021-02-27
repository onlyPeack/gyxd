<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="padding-bottom: 0px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="手机号码：">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="状态码：">
            <el-input v-model="listQuery.code" class="input-width" placeholder="状态码"></el-input>
          </el-form-item>
          <!--<el-form-item label="模板类型：">
            <el-select v-model="listQuery.templateType" clearable>
              <el-option v-for="item in templateTypeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="发送状态：">
            <el-select v-model="listQuery.deliveryStatus" clearable>
              <el-option v-for="item in deliveryStatusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>记录列表</span>
      <span class="index-explanation"><i class="el-icon-question"></i>状态码说明</span>
      <div class="explain-content">
        0：提交成功<br>
        101：帐号或者密码错误<br>
        102：敏感短信（短信内容包含屏字或敏感词）<br>
        103：发送号码异常(号码为空或提交号码数过多)<br>
        104：发送内容为空<br>
        105：请求参数错误（必填、格式）<br>
        106：帐号余额不足<br>
        107：帐号暂无发送权限<br>
        108：该帐号没有分配发送通道<br>
        109：签名不合法<br>
        110：IP鉴权失败（IP地址不在系统登记白名单中）<br>
        111：系统错误（网关异常，无法处理提交短信）<br>
        112：发送内容过长,超过300字<br>
        113：定时时间格式错误，格式：YYYY-MM-DD HH:mm:ss<br>
        114：发送内容未带签名<br>
        117：帐号已被冻结<br>
      </div>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="手机号码" width="150" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="时间" align="center" prop="crtTime">
        </el-table-column>
        <!--<el-table-column label="模板类型" align="center" prop="templateType">
          <template slot-scope="scope">
            <div v-for="item in templateTypeOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.templateType">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column label="短信内容" align="center" prop="content">
        </el-table-column>
        <el-table-column label="发送状态" align="center" prop="deliveryStatus">
          <template slot-scope="scope">
            <div v-for="item in deliveryStatusOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.deliveryStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态码" align="center" prop="code">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {recordList, deleteRecord} from '@/api/mall/SMSmessage/index';

  const defaultListQuery = {
    page: 1,
    limit: 5,
    code: null,
    phone: null,
    templateType: null,
    deliveryStatus: null,
  };

  export default {
    name: 'sendingRecords',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        isEdit: false,
        deliveryStatusOptions: [{
          value: 0,
          label: '未发送'
        }, {
          value: 1,
          label: '已发送'
        }],
        templateTypeOptions: [{
          value: 0,
          label: '验证码'
        }, {
          value: 1,
          label: '短信通知'
        }]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        recordList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        }).catch(res => {
          this.listLoading = false;
        })
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", row.id);
          deleteRecord(params).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .index-explanation {
    color: #5890E1;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
  }

  .index-explanation:hover + .explain-content {
    display: block;
  }

  .explain-content {
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    line-height: 20px;
    position: absolute;
    z-index: 2000;
    padding: 15px;
    font-size: 12px;
    left: 140px;
    display: none;
  }
</style>


