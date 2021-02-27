
<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="单据编号" v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="单据编号">
            <template slot-scope="scope">
              <span>{{scope.row.billNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="汇票编号">
            <template slot-scope="scope">
              <span>{{scope.row.draftNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出票金额">
            <template slot-scope="scope">
              <span>{{scope.row.amt}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        已选承兑代码：
        <el-tag v-show="chooseAccount.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseAccount" :key="index" @close="handleTagClose(index)"
                style="margin-right: 15px;">
          {{tag}}
        </el-tag>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {findAllPage} from '@/api/erp/financial/acceptanceRegister';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle','isSelect'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseAccount: [],
        currentAccount: [],
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        findAllPage(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
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
      getRowData(val) {
        if (val) {
          if (this.isSingle) {
            this.chooseAccount = [val.draftNo];
            this.currentAccount = [val];
          } else {
            for (var i in this.chooseAccount) {
              if (this.chooseAccount[i] == val.draftNo) {
                return;
              }
            }
            this.chooseAccount.push(val.draftNo);
            this.currentAccount.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeAcceptDialog', this.currentAccount)
      },
      handleTagClose(index) {
        this.chooseAccount.splice(index, 1);
        this.currentAccount.splice(index, 1);
      },
      reset() {
        this.chooseAccount = [];
        this.currentAccount = [];
        this.$refs.dataTable.setCurrentRow();
      },
      handleFilter() {
        this.getList();
      }
    }

  }
</script>

<style scoped>

</style>
