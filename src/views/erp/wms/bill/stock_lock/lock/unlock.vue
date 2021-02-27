<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增解锁</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <el-form :model="dataForm" :rules="rules" ref="dataForm">
    </el-form>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="锁库单号" min-width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.billNo" readonly="readonly" class="left-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" label="锁库仓库" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.warehouseName" readonly="readonly"
                    class="left-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="positionName" label="锁库仓位" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.positionName" readonly="readonly"
                    class="left-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.skuName" readonly="readonly" class="left-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" readonly="readonly" class="center-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="lockedQty" label="当前锁库" width="150" align="right">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lockedQty" readonly="readonly"
                    class="right-el-input readonly-el-input"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unlockQty" label="解锁数量(*)" width="150" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unlockQty" class="right-el-input"
                    onkeypress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.unlockQty}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增解锁单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {unlock} from '@/api/erp/wms/config/stockLock';

  export default {
    name: "stockUnlockForm",
    props: ['id', 'dialogFormVisible', 'selectedRows'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          items: []
        },
        rules: {},
        items: [],
        tableElInputNum: 1
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        var height = 0;
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number);

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number);

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number);

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number);

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number);

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum;

        if (type == 'enter' && number + 1 <= total) {
          number++;
        } else if (type == 'left' && number - 1 > 0) {
          number--;
        } else if (type == 'right' && number + 1 <= total) {
          number++;
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum;
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum;
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus();
        this.$refs['tableElInput' + number].$el.querySelector('input').select();

      },
      init() {
        var list = [];
        for (var i in this.selectedRows) {
          var item = this.selectedRows[i];
          item.warehouseId = item.mainDTO.warehouseId;
          item.warehouseName = item.mainDTO.warehouseName;
          list.push(item);
        }
        this.items = list;
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'unlockQty') {
            values = data.map(item => Number(item.unlockQty));
          } else if (column.property === 'lockedQty') {
            values = data.map(item => Number(item.lockedQty));
          }

          if (column.property === 'unlockQty' || column.property === 'lockedQty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, unlock, 'submitSuccess');
      },
      checkItemFuc() {
        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].unlockQty || this.items[i].unlockQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的解锁数量必填项，请填写了再提交');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
              return;
            }

            if (this.items[i].unlockQty && Number(this.items[i].unlockQty) > Number(this.items[i].lockedQty)) {
              this.$message.error('第' + (i * 1 + 1) + '行的解锁数量大于锁库数量，请重新填写');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
              return;
            }

          }
        }
        return true;
      },
    }
  }
</script>
