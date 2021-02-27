<template>
  <div class="bill-container warehouse-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.name">
      </el-input>
      <el-select v-model="listQuery.warehouseType" style="position: relative;top:-4px;width: 200px;" class="input-width" placeholder="仓库类型" clearable>
        <el-option v-for="item in warehouseTypeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>

      <el-table-column align="center" label="仓库名称" prop="name"></el-table-column>
      <el-table-column align="center" label="仓库类型">
        <template slot-scope="scope">
          <span v-for="item in warehouseTypeOptions">
            <span v-if="scope.row.warehouseType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省/州" prop="province"></el-table-column>
      <el-table-column align="center" label="城市" prop="city"></el-table-column>
      <el-table-column align="center" label="县区" prop="county"></el-table-column>
      <el-table-column align="center" label="详细地址" prop="address"></el-table-column>
      <el-table-column align="center" label="一级覆盖区域" prop="firstRegion"></el-table-column>
      <el-table-column align="center" label="核算类型" prop="accountingType"></el-table-column>
      <el-table-column align="center" label="状态" prop="status"
                       :filters="[{ text: '待初始化', value: '0' }, { text: '初始化中', value: '1' },
                                  { text: '启用', value: '2' }, { text: '禁用', value: '3' },{ text: '已初始化', value: '4' }]"
                       :filter-method="filterStatus">
        <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="info" v-if="scope.row.status ==0" size="mini"
                     @click="handleUpdate(scope.row,4)">初始化
          </el-button>
          <el-button type="info" v-if="scope.row.status ==2" size="mini"
                     @click="handleUpdateStatus(scope.row.id,'3')">禁用
          </el-button>
          <el-button type="info" v-if="scope.row.status ==3" size="mini"
                     @click="handleUpdateStatus(scope.row.id,'2')">启用
          </el-button>

          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" class="warehouseDialog">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="110px">
        <table class="publicTable">
          <tr>
            <td width="50%">
              <el-form-item label="仓库名称" prop="name">
                <el-input v-model="dataForm.name" clearable></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="仓库类型" prop="warehouseType">
                <el-select class="filter-item" v-model="dataForm.warehouseType" @change="handleSelectChange"
                           placeholder="请选择仓库类型" style="width: 100%">
                  <el-option
                    v-for="item in warehouseTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="关联部门" prop="conDeptName">
                <el-input v-model="dataForm.conDeptName" :disabled="conDeptDisabled" readonly="readonly">
                  <template slot="prepend">
                    <span @click="openDepartDialog()" v-if="conDeptVisible">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联门店" prop="storeName">
                <el-input v-model="dataForm.storeName" :disabled="storeDisabled">
                  <template slot="prepend">
                    <span @click="" v-if="storeVisible">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="仓库状态" prop="status">
                <el-select class="filter-item" v-model="dataForm.status" disabled
                           style="width: 100%">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="所在国家" prop="country">
                <el-select v-model="dataForm.country" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联供应商" prop="supplierName">
                <el-input v-model="dataForm.supplierName" :disabled="supplierDisabled">
                  <template slot="prepend" v-if="supplierVisible">
                    <span @click="openSupplierDialog()">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="所在区域" prop="regionCodes">
                <el-cascader
                  :options="options"
                  v-model="dataForm.regionCodes"
                  style="width: 100%"
                  placeholder="请选择所在区域"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="dataForm.address" clearable></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收货人" prop="contacts">
                <el-input v-model="dataForm.contacts" clearable></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收货电话" prop="phone">
                <el-input v-model="dataForm.phone" clearable></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="一级覆盖地区">
                <div @click="openAreaDialog('1')" style="cursor: pointer;" :title="dataForm.firstRegion">
                  <el-input v-model="dataForm.firstRegion" readonly="readonly"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="二级覆盖地区">
                <div @click="openAreaDialog('0')" style="cursor: pointer;" :title="dataForm.secondRegion">
                  <el-input v-model="dataForm.secondRegion" readonly="readonly"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="关联快递">
                <el-checkbox-group v-model="dataForm.associatedCourier">
                  <el-checkbox v-for="item in logisticsList" :label="item.name" :key="item.id"
                               :value="item.id" :checked="item.checked"
                               @change="item.checked=!item.checked"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="仓库管理员" prop="managerName">
                <el-input v-model="dataForm.managerName" readonly="readonly">
                  <template slot="prepend">
                    <span @click="openWarehouseDialog(1)">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="仓库检测员" prop="managerName">
                <el-input v-model="dataForm.checkerName" readonly="readonly">
                  <template slot="prepend">
                    <span @click="openWarehouseDialog(2)">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="异常数据处理员" prop="unusualName">
                <el-input v-model="dataForm.unusualName" readonly="readonly">
                  <template slot="prepend">
                    <span @click="openWarehouseDialog(3)">
                      <svg-icon icon-class="add"></svg-icon>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="核算类型" prop="accountingType">
                <el-radio v-model="dataForm.accountingType" label="0">数量核算</el-radio>
                <el-radio v-model="dataForm.accountingType" label="1">数量金额核算</el-radio>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="负库存控制" prop="qtyCtrlType">
                <el-radio v-model="dataForm.qtyCtrlType" label="0">不控制</el-radio>
                <el-radio v-model="dataForm.qtyCtrlType" label="1">预警提示</el-radio>
                <el-radio v-model="dataForm.qtyCtrlType" label="2">不允许负库存</el-radio>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="仓位管理" prop="isOpenPosition">
                <el-select class="filter-item" v-model="dataForm.isOpenPosition" style="width: 100%">
                  <el-option
                    v-for="item in isOpenPositionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="参与MRP计算" prop="isAttendMrp">
                <el-radio v-model="dataForm.isAttendMrp" label="0">是</el-radio>
                <el-radio v-model="dataForm.isAttendMrp" label="1">否</el-radio>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="isLoading">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!--选择仓库管理员-->
    <el-dialog :title="wareHouseType == 1?'选择仓库管理员':wareHouseType == 2 ?'选择仓库检测员':'选择异常数据处理员'" width="56%" :visible.sync="dialogWarehouseVisible" class="billSelectorDialog">
      <warehouse-admin @closeUserDialog="closeUserDialog" ref="warehouseAdmin" :isSingle="true"></warehouse-admin>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handlerResetWarehouse">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddWarehouse" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!--选择供应商-->
    <el-dialog title="选择供应商" width="56%" :visible.sync="dialogSupplierVisible">
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" ref="supplierSelector"
                         :isSingle="true"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handlerResetSupplier">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddSupplier" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择地区" width="45%" v-if="dialogAreaVisible" :visible.sync="dialogAreaVisible" class="areaDialog">
      <area-selector @closeAreaDialog="closeAreaDialog" ref="areaSelector" :secondRegion="dataForm.secondRegion"
                     :firstRegion="dataForm.firstRegion"
                     :ids="areaGrade=='1'?dataForm.coverfristRegionIds:dataForm.coversecoundRegionIds"
                     :grade="areaGrade" :parentID="parentID"></area-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handlerResetArea">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerSubmitArea" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="初始化"
      :visible.sync="centerDialogVisible"
      width="30%"
      style="padding-top:20vh;height: auto    !important;"
      center class="dialog_chushihua">
      <span slot="footer" class="dialog-footer">

    <el-button @click="daoruClick"><a href="/api/wms/stock-detail/exportFile">导出初始化模板</a></el-button>
        <el-upload class="upload" action="/api/wms/stock-detail/import" :before-upload="beforeUpload"
                   :on-remove="handleRemove" :show-file-list="false"
                   :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="list"
                   style="display:inline;" :headers="headers">
                    <el-button class="filter-item" type="primary" @click="daoruClick(1)" style="margin-left: 10px;">
                      导入初始化库存
                    </el-button>
                  </el-upload>
  </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .warehouse-container {
    .warehouseDialog {
      .el-dialog {
        .publicTable {
          width: 100%;
          border: none;
          border-spacing: 0;
          border-collapse: collapse;
          margin-bottom: 20px;

          td {
            border: 1px solid #e0e0e0;
            height: 40px;
            padding-left: 10px;
            margin: 0;
          }

          .supplierSpan {
            display: block;
            width: 100%;
          }

          .el-form-item {
            margin-bottom: 0px;
          }

          .el-input-group__append, .el-input-group__prepend {
            background-color: white;
            border: none;
            padding: 0px;
          }

          .el-input__inner {
            border: none
          }

          .el-input input.el-input__inner {
            border: none !important;
            padding: 0px 10px;
          }

          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }

        }
      }
    }

    .areaDialog {
      .el-dialog__body {
        height: 88vh !important;
      }
    }

    .dialog_chushihua {
      margin-top: 22vh !important;

      .el-dialog__header {
        height: 8.5vh;
      }

      .el-dialog {
        height: auto !important;
      }

      height: 8vh;

      .el-dialog__body {
        height: auto !important;
      }
    }

  }
</style>

<script>
  import { page, addObj, getObj, delObj, putObj, updateStatus } from '@/api/erp/wms/config/warehouse'
  import { getTypeValue } from '@/api/dict/dictValue/index'
  import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
  import { page as logisticsPage } from '@/api/erp/wms/config/Logistics'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Warehouse',
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'area-selector': () => import('@/components/ERP/Area/area'),
      'warehouse-admin': () => import('@/components/ERP/User/user'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector')
    },
    data() {
      return {
        wareHouseType: 1,
        headers: null,
        isLoading: false,
        centerDialogVisible: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          selectType: 0,
          warehouseType:'',
        },
        dataForm: {
          id: undefined,
          checkerId:'',
          checkerName:'',
          unusualId:'',
          unusualName: '',
          name: '',
          warehouseType: 0,
          status: '',
          country: '',
          supplierId: '',
          supplierName: '',
          province: '',
          contacts: '',
          phone: '',
          city: '',
          county: '',
          location: '',
          regionCodes: [],
          address: '',
          conDeptId: '',
          conDeptName: '',
          storeId: '',
          storeName: '',
          companyId: '',
          managerId: '',
          managerName: '',
          accountingType: '0',
          qtyCtrlType: '0',
          coverRegion: '',
          associatedCourier: [],
          isOpenPosition: '0',
          isAttendMrp: '0',
          firstRegion: undefined,
          secondRegion: undefined,
          coverRegionNames: undefined,
          coverRegionIds: undefined,
          coverfristRegionIds: undefined,
          coversecoundRegionIds: undefined
        },
        options: regionData,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        CodeToText,
        dialogFormVisible: false,
        dialogStatus: '',
        conDeptDisabled: false,
        storeDisabled: true,
        supplierDisabled: true,
        conDeptVisible: true,
        storeVisible: false,
        supplierVisible: false,
        logisticsList: [],
        countryOptions: [{
          value: '0',
          label: '中国'
        }, {
          value: '1',
          label: '德国'
        }, {
          value: '2',
          label: '法国'
        }, {
          value: '3',
          label: '英国'
        }, {
          value: '4',
          label: '美国'
        }, {
          value: '5',
          label: '日本'
        }],
        statusOptions: [{
          value: '0',
          label: '待初始化'
        }, {
          value: '1',
          label: '初始化中'
        }, {
          value: '2',
          label: '启用'
        }, {
          value: '3',
          label: '禁用'
        }, {
          value: '4',
          label: '已初始化'
        }],
        warehouseTypeOptions: [{
          value: '0',
          label: '普通仓库'
        }, {
          value: '1',
          label: '门店仓库'
        }, {
          value: '2',
          label: '供应商仓库'
        }],
        isOpenPositionOptions: [{
          value: '0',
          label: '不启用'
        }, {
          value: '1',
          label: '启用'
        }],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
          warehouseType: [{ required: true, message: '仓库类型不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '仓库状态不能为空', trigger: 'blur' }],
          country: [{ required: true, message: '所在国家不能为空', trigger: 'blur' }],
          regionCodes: [{ required: true, message: '所在区域不能为空', trigger: 'blur' }],
          address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
          contacts: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
          phone: [{ required: true, message: '收货电话不能为空', trigger: 'blur' }],
        },
        dialogDepartVisible: false,
        dialogWarehouseVisible: false,
        dialogSupplierVisible: false,
        dialogAreaVisible: false,
        firstRegion: undefined,
        secondRegion: undefined,
        coverRegionNames: undefined,
        coverRegionIds: undefined,
        coverfristRegionIds: undefined,
        coversecoundRegionIds: undefined,
        parentID: undefined,
        areaGrade: undefined
      }
    },
    created() {
      this.headers = {
        Authorization: getToken()
      }
      this.getLogisticsList()
      this.getList()
    },
    methods: {
      paradIdClidk(val) {
        this.parentID = val
      },
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!')
        }
        if (!isLt10M) {
          this.$message.error('上传的文件大小不能超过 10MB!')
        }
        return isXLS && isLt10M
      },
      handleExceed(files, fileList) {
        if (files.length > 1) {
          this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleRemove(file, fileList) {
      },
      daoruClick(val) {
        this.centerDialogVisible = false
        if (val === 1) {
          this.dataForm.status = 4
          putObj(this.ids, this.dataForm).then(response => {
            if (response.code == '2000') {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      },
      getLogisticsList() {
        logisticsPage({ status: '0' }).then(response => {
          for (var i in response.data.records) {
            response.data.records[i].checked = false
          }
          this.logisticsList = response.data.records
        }).catch(() => {
        })
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
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
      resetForm() {
        this.dataForm = {
          ids: undefined,
          id: undefined,
          name: '',
          warehouseType: '0',
          status: '0',
          country: '0',
          supplierId: '',
          supplierName: '',
          province: '',
          city: '',
          county: '',
          location: '',
          regionCodes: [],
          address: '',
          conDeptId: '',
          conDeptName: '',
          storeId: '',
          storeName: '',
          companyId: '',
          managerId: '',
          managerName: '',
          accountingType: '0',
          qtyCtrlType: '0',
          coverRegion: '',
          associatedCourier: [],
          isOpenPosition: '0',
          isAttendMrp: '0'
        }
        this.coverRegionIds = undefined
        this.coverRegionNames = undefined
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.coverRegionNames = ''
        this.dataForm.coverRegionIds = ''
        this.dataForm.firstRegion = ''
        this.dataForm.coverfristRegionIds = ''
        this.dataForm.secondRegion = ''
        this.dataForm.coversecoundRegionIds = ''
      },
      createData() {
        this.isLoading = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              this.isLoading = false
              if (response.code == '2000') {
                this.list.unshift(response.data)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            this.isLoading = false
            return false
          }
        })
      },
      handleUpdate(row, val) {
        this.coverRegionNames = ''
        this.dataForm.firstRegion = ''
        this.dataForm.secondRegion = ''
        getObj(row.id)
          .then(response => {
            this.dataForm = response.data
            this.firstRegion = TextToCode[response.data.city]

            let coverfristRegionIds = []
            let cityArr = this.dataForm.firstRegion ? this.dataForm.firstRegion.split(',') : []
            for (var i in cityArr) {
              for (var j in regionData) {
                if (regionData[j].label == cityArr[i]) {
                  coverfristRegionIds.push(regionData[j].value)
                }
                for (var x in regionData[j].children) {
                  if (regionData[j].children[x].label == cityArr[i]) {
                    coverfristRegionIds.push(regionData[j].children[x].value)
                  }
                }
              }
            }
            this.dataForm.coverfristRegionIds = coverfristRegionIds
            console.log(this.dataForm)

            if (val === 4) {
              this.centerDialogVisible = true
              this.ids = row.id
              return
            }
            this.dataForm.associatedCourier = this.dataForm.associatedCourier ? this.dataForm.associatedCourier : []
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            var coverRegionNames = []
            var coverRegionIds = []
            if (response.data.coverRegion && response.data.coverRegion.length > 0) {
              for (var i in response.data.coverRegion) {
                coverRegionIds.push(response.data.coverRegion[i].id)
                coverRegionNames.push(response.data.coverRegion[i].label)
              }
            }
            this.coverRegionIds = coverRegionIds
            this.coverRegionNames = coverRegionNames.join(',')
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm.id, this.dataForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            return false
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        })
      },
      handleChange() {
        this.dataForm.province = CodeToText[this.dataForm.regionCodes[0]]
        this.dataForm.city = CodeToText[this.dataForm.regionCodes[1]]
        this.dataForm.county = CodeToText[this.dataForm.regionCodes[2]]
        this.dataForm.location = CodeToText[this.dataForm.regionCodes[0]] + '/' + CodeToText[this.dataForm.regionCodes[1]] + '/' + CodeToText[this.dataForm.regionCodes[2]]
      },
      handleSelectChange() {
        let value = this.dataForm.warehouseType
        if (value == 0) {
          this.dataForm.storeId = ''
          this.dataForm.storeName = ''
          this.dataForm.supplierId = ''
          this.dataForm.supplierName = ''

          this.conDeptDisabled = false
          this.storeDisabled = true
          this.supplierDisabled = true

          //增加图标是否显示
          this.conDeptVisible = true
          this.storeVisible = false
          this.supplierVisible = false

        } else if (value == 1) {
          this.dataForm.conDeptId = ''
          this.dataForm.conDeptName = ''
          this.dataForm.supplierId = ''
          this.dataForm.supplierName = ''

          this.storeDisabled = false
          this.conDeptDisabled = true
          this.supplierDisabled = true

          this.storeVisible = true
          this.conDeptVisible = false
          this.supplierVisible = false

        } else if (value == 2) {
          this.dataForm.conDeptId = ''
          this.dataForm.conDeptName = ''
          this.dataForm.storeId = ''
          this.dataForm.storeName = ''
          this.supplierDisabled = false
          this.conDeptDisabled = true
          this.storeDisabled = true

          this.supplierVisible = true
          this.conDeptVisible = false
          this.storeVisible = false
        }
      },
      handleUpdateStatus(id, status) {
        updateStatus(id, status)
          .then(response => {
            if (response.code == '2000') {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
      },
      filterStatus: function(value, row) {
        return row.status === value
      },
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      handlerResetDepart() {
        this.$refs.departSelector.reset()
      },
      openDepartDialog() {
        this.dialogDepartVisible = true
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.dataForm.conDeptName = depart.label
          this.dataForm.conDeptId = depart.id
        }
        this.dialogDepartVisible = false
      },
      handlerAddWarehouse() {
        this.$refs.warehouseAdmin.onSubmit()
      },
      handlerResetWarehouse() {
        this.$refs.warehouseAdmin.reset()
      },
      openWarehouseDialog(val) {
        this.wareHouseType = val;
        this.dialogWarehouseVisible = true
      },
      closeUserDialog(list) {
        if (list.length > 0) {
          if(this.wareHouseType == 1){
            this.dataForm.managerName = list[0].name
            this.dataForm.managerId = list[0].id
          }else if(this.wareHouseType == 2){
            this.dataForm.checkerName = list[0].name
            this.dataForm.checkerId = list[0].id
          }else{
            this.dataForm.unusualName = list[0].name
            this.dataForm.unusualId = list[0].id
          }
        }
        this.dialogWarehouseVisible = false
      },
      closeSupplierDialog(list) {
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName
          this.dataForm.supplierId = list[0].id
        }
        this.dialogSupplierVisible = false
      },
      handlerResetSupplier() {
        this.$refs.supplierSelector.reset()
      },
      handlerAddSupplier() {
        this.$refs.supplierSelector.onSubmit()
      },
      openSupplierDialog() {
        this.dialogSupplierVisible = true
      },

      //选择地区
      openAreaDialog(grade) {
        this.areaGrade = grade
        console.log(this.areaGrade)
        console.log(this.dataForm.coversecoundRegionIds)
        this.dialogAreaVisible = true
      },
      handlerResetArea() {
        this.$refs.areaSelector.reset()
      },
      handlerSubmitArea() {
        this.$refs.areaSelector.onSubmit()
      },
      closeAreaDialog(list) {
        this.dataForm.coverRegion = list
        var coverRegionNames = []
        var coverRegionIds = []
        var coverfristRegionIds = []
        var coversecoundRegionIds = []
        for (var i in list) {
          coverRegionNames.push(list[i].label)
          if (this.areaGrade === '1') {
            coverfristRegionIds.push(list[i].id)
          } else {
            coversecoundRegionIds.push(list[i].id)
          }
          coverRegionIds.push(list[i].id)
        }

        if (this.areaGrade === '1') {
          this.dataForm.firstRegion = coverRegionNames.join(',')
          this.dialogAreaVisible = false
          this.dataForm.coverfristRegionIds = coverfristRegionIds
          this.dataForm.secondRegion = ''
          this.dataForm.coversecoundRegionIds = ''
        } else {
          this.dataForm.secondRegion = coverRegionNames.join(',')
          this.dialogAreaVisible = false
          this.dataForm.coversecoundRegionIds = coversecoundRegionIds
        }
      }
    }
  }
</script>
