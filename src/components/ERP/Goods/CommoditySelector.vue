<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="商品标签" v-model="listQuery.name"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column lang="序号"
            type="index" align="center"
            width="200">
          </el-table-column>
          <el-table-column align="center" label="商品标签">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        已选商品标签：
        <el-tag v-show="chooseCompany.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseCompany" :key="index" @close="handleTagClose(index)"
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
  import {page} from '@/api/erp/goods/goodsTag';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle','selectCommodity'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseCompany: [],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
      };
    },
    created() {
      this.chooseCompany = this.selectCommodity;
      this.getList();
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        console.log(val)
        if (val) {
          if (this.isSingle) {
            this.chooseCompany = [val.name];
          } else {
            console.log(this.chooseCompany);
            console.log(2);
            for (var i in this.chooseCompany) {
              if (this.chooseCompany[i] == val.name) {
                return;
              }
            }
            if(this.chooseCompany.length==3){
              this.vueMessage('warning','最多只能选择三个!');
              return
            }
            console.log(this.chooseCompany);
            this.chooseCompany.push(val.name);
          }
        }
      },
      onSubmit(row) {
        console.log(this.chooseCompany);
        this.$emit('closeCommodityDialog', this.chooseCompany)
      },
      handleTagClose(index) {
        this.chooseCompany.splice(index, 1);
      },
      reset() {
        this.chooseCompany= [];
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
