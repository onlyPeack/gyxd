<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="支付方式"
                    v-model="listQuery.label">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" style="margin-left: 10px;">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  @current-change="getRowData" @row-dblclick="onSubmit" ref="singleTable" style="width: 100%">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column align="center" label="中文名称">
            <template slot-scope="scope">
              <span>{{scope.row.label}}</span>
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

      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col :span="24" style="line-height: 36px;padding-left: 20px;">
            已选方式：
            <br/>
            <el-tag v-show="choosePayment.length>0" :key="tag" v-for="(tag,index) in choosePayment" closable
                    :disable-transitions="true"
                    @close="handleTagClose(index)" style="margin-right: 15px;">
              {{tag}}
            </el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import {page} from '@/api/erp/financial/financialPaymentsMethods';
  import {mapGetters} from 'vuex';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.label = this.listQuery.label;
        page(this.listQuery)
        .then(response => {
          console.log(response);
            this.list = response.data.records;
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
      getRowData(val) {
        //console.log(val);
        if(val){
          if (this.isSingle) {
            this.choosePayment = [val.label];
            this.currentPayment = [val];
          } else {
            for (var i in this.choosePayment) {
              if (this.choosePayment[i] == val.label) {
                return;
              }
            }
            this.choosePayment.push(val.label);
            this.currentPayment.push(val);
          }
        }
        if(this.isXin){
          this.choosePayment = [];
          this.currentPayment = [];
        }
      },
      onSubmit() {
        this.choosePayment = [];
        this.$emit('closePaymentDialog', this.currentPayment)
      },
      reset() {
        this.choosePayment = [];
        this.currentPayment = [];
        this.$refs.singleTable.setCurrentRow();
      },
      handleTagClose(index) {
        //console.log(index);
        this.choosePayment.splice(index, 1);
        this.currentPayment.splice(index, 1);
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters(['elements'])
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          label: undefined,
        },
        tableKey: 0,
        choosePayment: [],
        currentPayment: []
      };
    }
  };
</script>
