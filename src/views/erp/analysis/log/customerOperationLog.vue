<template>
  <div class="bill-container stock-change-record-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-change-record-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="账号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="IP地址"
                  @keyup.enter.native="handleFilter" v-model="listQuery.ip">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="城市"
                  @keyup.enter.native="handleFilter" v-model="listQuery.address">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请求接口"
                  @keyup.enter.native="handleFilter" v-model="listQuery.method">
        </el-input>
        <el-date-picker
          v-model="billDate"
          type="datetimerange"
          @change="handleFilter"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" @sort-change="handleSortChange">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="账号" prop="userCode" width="264"></el-table-column>
      <el-table-column label="用户名" prop="userName" width="264"></el-table-column>
      <el-table-column label="城市" prop="address" width="264"></el-table-column>
      <el-table-column label="IP地址" prop="ip" width="264"></el-table-column>
      <el-table-column label="请求接口" prop="method" width="264"></el-table-column>
      <el-table-column label="操作" prop="operation" width="264"></el-table-column>
      <el-table-column label="耗时" prop="time" width="264" sortable></el-table-column>
      <el-table-column label="日期" prop="createTime" width="264" ></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,100,500,1000,5000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { page } from '@/api/erp/analysis/log/customerOperationLog'
  import { getTypeValue } from '@/api/dict/dictValue/index'

  export default {
    name: 'stock-change-record',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        downloadLoading: false,
        queryVisible: false,
        billDate: [],
        listQuery: {
          specifications: undefined,
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          modelType: undefined,
          stockAccuracy: undefined,
          page: 1,
          limit: 10
        },
        source: [{
          value: 1,
          label: '严重缺货'
        }, {
          value: 2,
          label: '缺货'
        }, {
          value: 3,
          label: '多货'
        }, {
          value: 4,
          label: '最佳备货'
        }],
        date: undefined,
        brandList: [],
        categoryList: [],
        modelTypeOptions: []
      }
    },
    created() {
      this.init()
      const _this = this
      getTypeValue('model_type').then(response => {
        this.modelTypeOptions = response.data.rows
      })
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleSortChange(column,prop,order) {
        console.log(column);
        if(column.order == 'descending') {
          this.listQuery.sort = 1
        } else if (column.order == 'ascending') {
          this.listQuery.sort = 2
        } else {
          this.listQuery.sort = ''
        }
        this.handleFilter()
      },
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '账号',
            '用户名',
            '城市',
            'IP地址',
            '请求接口',
            '耗时',
            '日期',
          ]
          const filterVal = [
            'userCode',
            'userName',
            'address',
            'ip',
            'method',
            'time',
            'createTime',
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list,
            filterVal,
            '客户操作日志'
          )
          this.downloadLoading = false
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('stock-change-record-filter-container')[0]) {
          var height = document.getElementsByClassName('stock-change-record-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (130 + height)) * 0.95
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function() {
          _this.changeDivHeight()
        }, 1)
      },
      init() {
        // listCatAndBrand().then(response => {
        //   this.categoryList = response.data.categoryList;
        //   this.brandList = response.data.brandList;
        // });
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          console.log('列表',this.list);
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
        }
        this.billDate = []
        this.getList()
      }
    },
    watch: {
      billDate(val) {
        if(val.length > 0) {
          this.listQuery.startDate =  this.$moment(val[0]).format("YYYY-MM-DD HH:mm:ss")
          this.listQuery.endDate = this.$moment(val[1]).format("YYYY-MM-DD HH:mm:ss")
        } else {
          this.listQuery.startDate =  ''
          this.listQuery.endDate = ''
        }
        console.log(this.listQuery.startDate);
        console.log(this.listQuery.endDate);
        this.handleFilter()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .stock-change-record-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
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
      right: 50px;
      display: none;
    }
  }
</style>
