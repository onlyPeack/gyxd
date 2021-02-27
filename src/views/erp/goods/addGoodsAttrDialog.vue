<template>
  <div>
    <el-dialog :visible.sync="visible" @close="handleClose" class="specDialog" :modal="false">

      <el-steps slot="title" :active="active" :space="200" finish-status="success" process-status="finish" simple>
        <el-step title="添加商品规格"></el-step>
        <el-step title="添加商品规格值"></el-step>
      </el-steps>

      <div class="specDialogMainOne">

        <el-transfer v-if="active === 1" v-model="selectedGoodsAttrs" :data="data"
                     :titles="[ '待选规格','已选规格']" @change="handleSpecificationChange"
        :props="{key: 'id',label: 'name'} "
        ></el-transfer>

        <div v-if="active === 2">

          <el-card class="box-card" v-for="(dataItem, dataItemIndex) in data"  :key="dataItem.id" v-if="dataItem.selected">
            <div slot="header" ref="goodsChecked">
              <el-checkbox :indeterminate="dataItem.isIndeterminate"
                           v-model="dataItem.checkAll"
                           @change="handleGoodsAttrAllSelected(dataItemIndex, $event)">{{dataItem.name}}
              </el-checkbox>
            </div>
            <div>
              <ul class="attr-value">
                <li v-for="(item, itemIndex) in dataItem.stringList">
                  <el-checkbox v-model="item.selected" :key="item.label" :label="item.label"
                               :checked="item.selected"
                               @change="handleCheckedGoodsAttrChange(dataItemIndex, itemIndex, $event)"
                  >{{item.label}}
                  </el-checkbox>
                </li>
              </ul>
            </div>

          </el-card>
        </div>

      </div>

      <div slot="footer" v-if="active === 1">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSpecificationNext">下一步</el-button>
      </div>
      <div slot="footer" v-if="active === 2">
        <el-button @click="handleSpecificationBack">上一步</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>

  import {getSpecificationBaseAll} from '@/api/erp/goods/goods'
  export default {
    name: "addGoodsAttrDialog",
    props: {
      show: {
        type: Boolean,
        default: false,
        required: false
      },
      form: {
        type: Array,
        default: function () {
          return []
        },
        required: false
      },
    },
    data() {
      return {
        visible: false,
        data:[],
        active: 1,
        selectedGoodsAttrs: []
      }
    },
    watch: {
      show(val) {
        this.visible = val
        if (this.form.length > 0) {
          this.data = this.form
        }
      },
    },
    computed: {
      dataSelectedCount() {
        return this.data.filter(item => {
          return item.selected
        }).length
      },
      data2Map() {
        let map = {}
        this.data.forEach(function (item, index, arr) {
          item.index = index
          map[item.id] = item
        })
        return map
      },

    },
    created() {
       this.init()
    },
    methods: {
      init(){
        // getSpecificationBaseAll().then(response => {
        //   let data = []
        //   response.forEach(function(item){
        //     item.disabled = false
        //     item.selected = false
        //     item.checkAll = false
        //     item.isIndeterminate = false
        //     let tempList = []
        //     item.stringList.forEach(function (label,index,array) {
        //       tempList.push({
        //         id: new Date().getTime() + index,
        //         label: label,
        //         selected: false
        //       })
        //     })
        //     item.stringList = tempList
        //     data.push(item)
        //   })
        //   this.data = data
        // });
      },
      handleClose() {
        this.active = 1
        this.$emit('show', false)
      },
      handleSpecificationBack() {
        this.active--
      },
      handleSpecificationNext() {
        if (this.selectedGoodsAttrs.length === 0) {
          this.$message('请选择商品规格')
          return
        }
        const map = this.data2Map
        const _this = this
        this.selectedGoodsAttrs.forEach(function (id) {
          const dataItem = map[id]
          // 设置当前属性为选中
          _this.data[dataItem.index].selected = true
        })

        this.active += 1
      },
      handleSpecificationAdd() {
        if (this.dataSelectedCount === 0) {
          this.$message('请选择商品规格值')
          return
        }

        const _this = this
        for (let i in _this.data) {
          if (_this.data[i].selected) {
            const count = _this.data[i].stringList.filter(item => {
              return item.selected
            }).length
            if (count === 0) {
              this.$message('请选择商品规格值')
              return
            }
          }
        }

        this.active = 1

        this.$emit('form', this.data)
        this.$emit('show', false)
      },
      handleGoodsAttrAllSelected(index, checkAll) {
        this.data[index].isIndeterminate = false;
        this.data[index].checkAll = checkAll
        let tempList = []
        this.data[index].stringList.forEach(function (item) {
          item.selected = checkAll
          tempList.push(item)
        })
        this.data[index].stringList = tempList

      },
      handleCheckedGoodsAttrChange(dataItemIndex, itemIndex, val) {
        let checkedCount = this.data[dataItemIndex].stringList.filter(item => {
          return item.selected
        }).length
        this.data[dataItemIndex].isIndeterminate = checkedCount > 0 && checkedCount < this.data[dataItemIndex].stringList.length
        this.data[dataItemIndex].checkAll = checkedCount === this.data[dataItemIndex].stringList.length
      },
      handleSpecificationChange(val){

      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .attr-value {
    list-style: none;
    width: 100%;
    margin: 0;
    padding: 0;

    li {
      width: 100%;
      float: left;
    }
  }
</style>
