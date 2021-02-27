<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入科目编码"
                    v-model="listQuery.number" @keyup.enter.native="handleFilter"></el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入科目名称"
                    v-model="listQuery.name" @keyup.enter.native="handleFilter"></el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table key="tableKey" :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="科目编码" prop="number"></el-table-column>
          <el-table-column align="center" label="科目名称" prop="name"></el-table-column>
          <el-table-column align="center" label="科目属性" prop="attribute">
            <template slot-scope="scope">
              <div v-for="item in attributeList">
                <span v-if="scope.row.attribute ===item.value">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="科目类别" prop="groupKey">
            <template slot-scope="scope">
              <div v-for="item in groupKeyList">
                <span v-if="scope.row.groupKey ===item.value">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        已选账户：
        <el-tag v-show="chooseSubject.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseSubject" :key="index" @close="handleTagClose(index)"
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
  import {page} from '@/api/erp/financial/account';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle', 'isSelect'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        chooseSubject: [],
        currentSubject: [],
        listQuery: {
          page: 1,
          limit: 20,
          number: undefined,
          name: undefined
        },
        groupKeyList: [
          {
            value: '1',
            label: '流动资产'
          }, {
            value: '2',
            label: '非流动资产'
          }, {
            value: '3',
            label: '流动负债'
          }, {
            value: '4',
            label: '非流动负债'
          }, {
            value: '5',
            label: '所有者权益'
          }, {
            value: '6',
            label: '成本'
          }, {
            value: '7',
            label: '营业收入'
          }, {
            value: '8',
            label: '营业成本及税金'
          }, {
            value: '9',
            label: '期间费用'
          }, {
            value: '10',
            label: '其他收益'
          }, {
            value: '11',
            label: '其他损失'
          }, {
            value: '12',
            label: '以前年度损益调整'
          }, {
            value: '13',
            label: '所得税'
          }
        ],
        attributeList: [
          {
            value: '0',
            label: '无'
          }, {
            value: '1',
            label: '银行科目'
          }, {
            value: '2',
            label: '现金科目'
          }, {
            value: '3',
            label: '现金等价物'
          }],
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
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
            this.chooseSubject = [val.name];
            this.currentSubject = [val];
          } else {
            for (var i in this.chooseSubject) {
              if (this.chooseSubject[i] == val.name) {
                return;
              }
            }
            this.chooseSubject.push(val.name);
            this.currentSubject.push(val);
          }
        }
      },
      onSubmit() {
        this.$emit('closeSubjectDialog', this.currentSubject)
      },
      handleTagClose(index) {
        this.chooseSubject.splice(index, 1);
        this.currentSubject.splice(index, 1);
      },
      reset() {
        this.chooseSubject = [];
        this.currentSubject = [];
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
