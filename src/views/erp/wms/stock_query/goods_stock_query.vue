<template>
  <div style="margin: 10px;" class="goods-stock-query-container bill-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="库存明细查询" name="third">
        <el-row>
          <el-col style="padding-left:10px;">
            <!-- 查询和其他操作 -->
            <div class="filter-container goods-stock-filter-container3">
              <div>
                <el-input v-model="listQuery.brandName" placeholder="全部品牌" clearable style="width: 200px"
                          class="filter-item" v-if="brandList" filterable></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品名称"
                          @keyup.enter.native="handleFilter" v-model="listQuery.skuName"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="标准系列"
                          @keyup.enter.native="handleFilter" v-model="listQuery.seriesName"></el-input>

                <el-input clearable class="filter-item" style="width: 190px;" placeholder="返点系列"
                          @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries"></el-input>

                <el-input clearable class="filter-item" style="width: 190px;" placeholder="规格型号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.specifications"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="订货号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.itemNo"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="仓库"
                          @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName"></el-input>
                <div></div>
                <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓位"
                          @keyup.enter.native="handleFilter" v-model="listQuery.positionName"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="批次号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.batchNumber"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="锁库单号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.lockingOrderNo"></el-input>
                <el-select v-model="listQuery.source" placeholder="库存来源" clearable style="width: 190px"
                           class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
                  <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="入库类型"
                          @keyup.enter.native="handleFilter" v-model="listQuery.stockType"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="库存归属人工号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.ownerCode"></el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="库存归属人部门"
                          @keyup.enter.native="handleFilter" v-model="listQuery.ownerDepartName"></el-input>
                <div></div>
                <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购"
                          @keyup.enter.native="handleFilter" v-model="listQuery.purchaserName"></el-input>

                <el-input clearable class="filter-item" style="width: 190px;" placeholder="供应商编号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.supplierCode"></el-input>
                <el-date-picker style="position: relative;top:-3px;width: 385px;"
                                v-model="billDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="入库时间"
                                end-placeholder="入库时间"
                                value-format="yyyy-MM-dd"
                                @change="handleBillDateSelect"
                                :picker-options="pickerOptions">
                </el-date-picker>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                <el-button class="filter-item" type="danger" @click="handleReset" icon="el-icon-delete">重置</el-button>
<!--                <el-button-->
<!--                  v-if="$store.getters.groupNames.indexOf('仓库管理员') > -1||$store.getters.groupNames.indexOf('仓管专员') >-1 || username == '00000'||$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--                  class="filter-item"-->
<!--                  type="primary" :loading="downloadLoading"-->
<!--                  icon="el-icon-download" @click="handleDownload3">导出-->
<!--                </el-button>-->
                <a :href="stockAllExportUrl" download="库存明细查询"
                   v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
                  <el-button class="filter-item" type="primary"
                             :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
                  </el-button>
                </a>
                <a :href="stockExportUrl" download="库存明细"
                   v-if="$store.getters.groupNames.indexOf('仓库管理员') > -1||$store.getters.groupNames.indexOf('仓管专员') > -1">
                  <el-button class="filter-item" type="primary" style="margin-left: 10px;" :loading="downloadLoading"
                             icon="el-icon-download">库存明细盘点
                  </el-button>
                </a>
                <!--                <el-button class="filter-item" type="primary" icon="el-icon-sort" @click="lockSort" style="margin-left: 10px;">按锁库数量排序</el-button>-->
              </div>
            </div>

            <!-- 查询结果 -->
            <el-table size="small" :data="list3" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row :height="clientHeight3" show-summary :summary-method="getSummaries"
                      @sort-change="lockSort"
                      :default-sort="{prop: 'qty', order: 'descending'}">
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column label="品牌" prop="brandName" width="100" sortable></el-table-column>
              <el-table-column label="标准系列" prop="seriesName" width="110" ></el-table-column>
              <el-table-column label="返点系列" prop="rebateSeries" width="110" ></el-table-column>
              <el-table-column label="商品名称" prop="skuName" width="140" sortable></el-table-column>
              <el-table-column label="规格型号" prop="specifications" sortable width="140"></el-table-column>
              <el-table-column label="订货号" prop="itemNo" width="120" sortable></el-table-column>
              <el-table-column label="仓库" prop="warehouseName" width="100" sortable></el-table-column>
              <el-table-column label="仓位" prop="positionName" width="90"></el-table-column>
              <el-table-column label="供应商编号" prop="supplierCode" width="90"></el-table-column>
              <el-table-column label="库存数量" prop="qty" align="right" width="100" sortable></el-table-column>
              <el-table-column label="锁定数量" prop="lockedQty" align="right" width="100" sortable v-slot="{row}">
                <span @click="showLockedQtyRoute(row)" style="cursor: pointer;display: block">{{row.lockedQty}}</span>
              </el-table-column>
              <el-table-column label="可售数量" prop="vendibility" align="right" width="100" sortable>
                <template slot-scope="scope">{{ scope.row.qty - scope.row.lockedQty }}</template>
              </el-table-column>
              <el-table-column label="面价" prop="retailPrice" align="right" class-name="col-required" width="100">
                <template slot-scope="scope">{{Number(scope.row.retailPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="调拨价" prop="allocationPrice" align="right" class-name="col-required" width="100"
                               sortable>
                <template slot-scope="scope">{{Number(scope.row.allocationPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="调拨金额" prop="allocationAmount" align="right" class-name="col-required" width="120"
                               sortable>
                <template slot-scope="scope">{{Number(scope.row.allocationPrice * scope.row.qty).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="采购价"
                               v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1"
                               prop="purchasePrice" align="right" class-name="col-required" width="100" sortable>
                <template slot-scope="scope">{{Number(scope.row.purchasePrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="调拨折扣" prop="discount" align="right" class-name="col-required" sortable
                               width="100">
                <template slot-scope="scope">{{ (scope.row.allocationPrice / scope.row.retailPrice).toFixed(4) }}
                </template>
              </el-table-column>
              <el-table-column label="库存金额" prop="amount" align="right" class-name="col-required" width="100">
                <!-- <template slot-scope="scope">
                  <span
                    v-if="$store.getters.groupNames.indexOf('总经理') > -1"
                  >{{(scope.row.purchasePrice * scope.row.qty).toFixed(4)}}</span>
                  <span v-else>{{(scope.row.allocationPrice * scope.row.qty).toFixed(4)}}</span>
                </template> -->
              </el-table-column>
              <el-table-column label="库存来源" prop="source" width="90">
                <template slot-scope="scope">
                  <div v-for="item in sourceOption">
                    <span v-if="item.value==scope.row.source">{{item.label}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="型号类型" prop="modelType" width="100"></el-table-column>
              <el-table-column label="入库类型" prop="stockType" width="100"></el-table-column>
              <el-table-column label="批次号" prop="batchNumber" width="170"></el-table-column>
              <el-table-column label="锁库单号" prop="lockingOrderNo" width="160"></el-table-column>
              <el-table-column label="库存归属人工号" prop="ownerCode" width="120"></el-table-column>
              <el-table-column label="归属人部门" prop="ownerDepartName" width="100"></el-table-column>
              <el-table-column label="采购" prop="purchaserName" width="100"></el-table-column>
              <el-table-column label="入库时间" prop="crtTime" width="150"></el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10,50,500,1000]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total3"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="库存汇总查询" name="first">
        <el-row>
          <!-- <el-col :span="4">
            <el-card class="box-card" :style="{height:clientHeight+'px'}">
              <el-row>
                <el-col :span="16">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText1"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button
                    type="text"
                    icon="plus"
                    @click="handleOpenTree1"
                    style="margin-left: 15px;font-size: 14px;"
                  >
                    <span v-if="isOpenTree1">
                      收起
                      <i class="el-icon-arrow-up"></i>
                    </span>
                    <span v-if="!isOpenTree1">
                      展开
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </el-button>
                </el-col>
              </el-row>
              <el-tree
                class="filter-tree"
                :data="categoryList"
                node-key="value"
                highlight-current
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode1"
                ref="categoryTree1"
                @node-click="getNodeData1"
                default-expand-all
                style="margin-top:10px;"
              ></el-tree>
            </el-card>
          </el-col> -->
          <el-col :span="24" style="padding-left:10px;">
            <!-- 查询和其他操作 -->
            <div class="filter-container goods-stock-filter-container1">
              <div>
                <el-select
                  v-model="listQuery.brandId"
                  placeholder="全部品牌"
                  clearable
                  style="width: 190px"
                  class="filter-item"
                  v-if="brandList"
                  @change="handleFilter"
                  filterable
                >
                  <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="商品名称"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.skuName"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="标准系列"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.seriesName"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="返点系列"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.rebateSeries"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="规格型号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.specifications"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="供应商编号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.supplierCode"
                ></el-input>
                <div></div>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="订货号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.itemNo"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="仓库"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.warehouseName"
                ></el-input>
                <el-select
                  v-model="listQuery.source"
                  placeholder="库存来源"
                  clearable
                  style="width: 190px"
                  class="filter-item"
                  v-if="sourceOption"
                  @change="handleFilter"
                  filterable
                >
                  <el-option
                    v-for="item in sourceOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleFilter"
                >查询
                </el-button>
                <el-button class="filter-item" type="danger" @click="handleReset" icon="el-icon-delete">重置</el-button>
<!--                <el-button-->
<!--                  v-if=" username == '00000'||$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--                  class="filter-item"-->
<!--                  type="primary"-->
<!--                  :loading="downloadLoading"-->
<!--                  icon="el-icon-download"-->
<!--                  @click="handleDownload1"-->
<!--                >导出-->
<!--                </el-button>-->
                <el-button
                  class="filter-item"
                  type="danger"
                  icon="el-icon-refresh"
                  v-if="loginNo=='00000'"
                  @click="filterClick(0)"
                >初始化库存
                </el-button>
                <a :href="stockCollectExportUrl" download="库存汇总查询"
                   v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
                  <el-button class="filter-item" type="primary"
                             :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
                  </el-button>
                </a>
              </div>
            </div>

            <!-- 查询结果 -->
            <el-table
              size="small"
              :data="list1"
              v-loading="listLoading"
              element-loading-text="正在查询中。。。"
              border
              fit
              highlight-current-row
              :height="clientHeight1"
              show-summary
              :summary-method="getSummaries"
              :default-sort="{prop: 'qty', order: 'descending'}"
            >
              <el-table-column align="center" type="index" width="50"></el-table-column>
              <el-table-column label="品牌" prop="brandName"></el-table-column>
              <el-table-column label="商品名称" prop="skuName" width="180"></el-table-column>
              <el-table-column label="标准系列" prop="seriesName" width="120"></el-table-column>
              <el-table-column label="返点系列" prop="rebateSeries" width="120"></el-table-column>
              <el-table-column label="规格型号" prop="specifications" width="200">
                <template slot-scope="scope">
                  <div
                    style="color: #4F90E2;"
                    @click="handleStockOpen(scope.row)"
                  >{{scope.row.specifications}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="订货号" prop="itemNo" width="160"></el-table-column>
              <el-table-column label="型号类型" prop="modelType"></el-table-column>
              <el-table-column label="仓库" prop="warehouseName">
                <template slot-scope="scope">
                  <span
                    style="color: #4F90E2"
                    @click="handleWarehousePositionOpen(scope.row)"
                  >{{scope.row.warehouseName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="供应商编号" prop="supplierCode" align="right"></el-table-column>
              <el-table-column label="库存数量" width="100" prop="qty" align="right" sortable></el-table-column>
              <el-table-column label="锁定数量" width="100" prop="lockedQty" align="right" sortable></el-table-column>
              <el-table-column label="可售数量" width="100" prop="vendibility" align="right" sortable>
              </el-table-column>
              <el-table-column
                width="80"
                label="面价"
                prop="retailPrice"
                align="right"
                class-name="col-required"
              >
                <template slot-scope="scope">{{Number(scope.row.retailPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column
                width="90"
                label="调拨价"
                prop="costPrice"
                align="right"
                class-name="col-required"
                sortable
              >
                <template slot-scope="scope">{{Number(scope.row.costPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="调拨折扣" width="80" prop="discount" align="right" class-name="col-required">
              </el-table-column>
              <el-table-column label="库存金额" width="100" prop="amount" align="right" class-name="col-required">
                <!-- <template slot-scope="scope">
                  {{ (scope.row.source=='0'?scope.row.purchasePrice * scope.row.qty:scope.row.costPrice *
                  scope.row.qty).toFixed(4) }}
                </template> -->
              </el-table-column>
              <el-table-column label="库存来源" width="80" prop="source">
                <template slot-scope="scope">
                  <div v-for="(item,idnex) in sourceOption" :key="idnex">
                    <span v-if="item.value==scope.row.source">{{item.label}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10,50,500,1000]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="供货信息查询" name="fifth">
        <el-row>
          <el-col style="padding-left:10px;">
            <!-- 查询和其他操作 -->
            <div class="filter-container goods-stock-filter-container3">
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="单据编号"
                        v-model="listQuery.billNo" @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="到货仓库"
                        v-model="listQuery.warehouseName"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="制单人工号"
                        v-model="listQuery.crtUserNo" @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="制单人"
                        v-model="listQuery.crtUserName" @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品编码" v-model="listQuery.skuNo"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品名称"
                        v-model="listQuery.skuName"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="品牌"
                        v-model="listQuery.brandName"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="标准系列"
                        v-model="listQuery.seriesName"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="返点系列"
                        v-model="listQuery.rebateSeries"
                        @keyup.enter.native="handleFilter"></el-input>
              <div></div>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="规格型号"
                        v-model="listQuery.specifications"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="订货号" v-model="listQuery.itemNo"
                        @keyup.enter.native="handleFilter"></el-input>
              <el-input clearable class="filter-item" style="width: 190px;" placeholder="供应商编号" v-model="listQuery.supplierCode"
                        @keyup.enter.native="handleFilter"></el-input>

              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
              </el-button>
              <el-button class="filter-item" type="danger" @click="handleReset" icon="el-icon-delete">重置</el-button>
<!--              <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" v-if=" username == '00000'||$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--                         @click="handleDownload5">导出-->
<!--              </el-button>-->
              <a :href="stockMessageExportUrl" download="供货信息查询"
                 v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
                <el-button class="filter-item" type="primary"
                           :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
                </el-button>
              </a>
            </div>

            <!-- 查询结果 -->
            <el-table size="small" :data="list5" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row :height="clientHeight3" show-summary :summary-method="getSummaries">
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column prop="skuName" label="商品名称" width="170"></el-table-column>
              <el-table-column prop="brandName" label="品牌" width="110"></el-table-column>
              <el-table-column prop="seriesName" label="标准系列" width="140"></el-table-column>
              <el-table-column prop="rebateSeries" label="返点系列" width="140"></el-table-column>
              <el-table-column prop="specifications" label="规格型号" width="180"></el-table-column>
              <el-table-column prop="itemNo" label="订货号" width="130" show-overflow-tooltip></el-table-column>
              <el-table-column prop="mainDTO.supplierCode" label="供应商编号" width="130"></el-table-column>
              <el-table-column prop="qty" label="发布数量" align="right" width="100" class-name="col-required"
                               sortable></el-table-column>
              <el-table-column prop="purchasedQty" label="已申请数量" align="right" width="110" class-name="col-required"
                               sortable></el-table-column>
              <el-table-column prop="canUseQty" label="可用数量" align="right" width="100" class-name="col-required"
                               sortable>
              </el-table-column>
              <el-table-column prop="retailPrice" label="面价" align="right" width="100" class-name="col-required"
                               sortable></el-table-column>
              <el-table-column prop="price" label="发布单价" align="right" width="100" class-name="col-required"
                               sortable></el-table-column>
              <el-table-column prop="discount" label="发布折扣" align="right" width="100" class-name="col-required"
                               sortable></el-table-column>
              <el-table-column prop="deliveryDate" label="货期" width="80" class-name="col-required" align="center"
                               sortable></el-table-column>
              <el-table-column prop="amountPrice" label="发布总额" width="120" class-name="col-required" align="right"
                               sortable></el-table-column>
              <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="110" sortable></el-table-column>
              <el-table-column prop="publishType" label="发布类型" width="90" align="center">
                <template slot-scope="scope">
                  <span v-for="item in typeOptions">
                    <span
                      v-if="scope.row.mainDTO && scope.row.mainDTO.publishType ===item.value"
                    >{{item.label}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="100" align="center"></el-table-column>
              <el-table-column prop="crtUserNo" label="制单人工号" width="90" align="center"></el-table-column>
              <el-table-column prop="crtUserName" label="制单人" width="60" align="center"></el-table-column>
              <el-table-column prop="channelType" label="渠道类型" width="90" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="item in channelTypeOptions">
                    <span
                      v-if="scope.row.mainDTO && scope.row.mainDTO.channelType  ===item.value"
                    >{{item.label}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="mainDTO.publishScope" label="发布范围" width="100" align="center"></el-table-column>
              <el-table-column prop="validityPeriod" label="信息有效期" width="140" align="center"></el-table-column>
              <el-table-column prop="mainDTO.billNo" label="单据编号" width="180" sortable align="center"></el-table-column>
              <el-table-column prop="mainDTO.note" label="备注" width="150"></el-table-column>
              <el-table-column prop="crtTime" label="创建时间" width="170" sortable></el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10,50,500,1000]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total5"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="在途库存查询" name="sixth"
                   v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">
        <el-row>
          <el-col style="padding-left:10px;">
            <!-- 查询和其他操作 -->
            <div class="filter-container goods-stock-filter-container3">
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                        v-model="listQuery.billNo"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                        v-model="listQuery.supplierCode"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                        v-model="listQuery.supplierName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                        v-model="listQuery.crtUserNo"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                        v-model="listQuery.purchaserName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                        v-model="listQuery.departName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                        v-model="listQuery.skuNo"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                        v-model="listQuery.skuName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                        v-model="listQuery.brandName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                        v-model="listQuery.seriesName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                        v-model="listQuery.rebateSeries"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                        v-model="listQuery.specifications"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                        v-model="listQuery.itemNo"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="收货仓库"
                        v-model="listQuery.warehouseName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button class="filter-item" type="danger" @click="handleReset" icon="el-icon-delete">重置</el-button>
              <!-- <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download"
                         @click="handleDownloadzaitu">导出
              </el-button> -->
<!--              <el-button class="filter-item" type="primary"-->
<!--                         v-if="$store.getters.groupNames.indexOf('总经理') > -1 || $store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--                         :loading="!!downloadLoading" icon="el-icon-download"-->
<!--                         @click="handleExport5">导出-->
<!--              </el-button>-->
              <a :href="stockOnLoadExportUrl" download="在途库存查询"
                 v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
                <el-button class="filter-item" type="primary"
                           :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
                </el-button>
              </a>
            </div>

            <!-- 查询结果 -->
            <el-table
              class="zaituTable"
              size="small"
              :data="list6"
              v-loading="listLoading"
              element-loading-text="正在查询中。。。"
              border
              fit
              highlight-current-row
              :height="clientHeight3"
              show-summary
              :summary-method="getSummaries2"
            >

              <el-table-column type="index" align="center">
              </el-table-column>
              <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" min-width="180" sortable>
                <template slot-scope="scope">
                  <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                    {{scope.row.mainDTO.billNo}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mainDTO.billDate" align="center" label="单据日期" width="100" sortable>
              </el-table-column>
              <el-table-column prop="mainDTO.supplierCode" align="center" label="供应商编号" width="100">
              </el-table-column>
              <!-- <el-table-column prop="mainDTO.supplierName"
                               v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1"
                               label="供应商名称" width="200" :show-overflow-tooltip="true">
              </el-table-column> -->
              <el-table-column prop="mainDTO.purchaserCode" align="center" label="采购员工号" width="90">
              </el-table-column>
              <el-table-column prop="mainDTO.purchaserName" align="center" label="采购员姓名" width="90">
              </el-table-column>
              <el-table-column prop="departName" align="center" label="采购部门" width="110">
              </el-table-column>
              <el-table-column prop="skuName" label="商品名称" width="160" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="brandName" align="center" label="品牌" width="150">
              </el-table-column>
              <el-table-column prop="seriesName" align="center" label="标准系列" width="140">
              </el-table-column>
              <el-table-column prop="rebateSeries" align="center" label="返点系列" width="140" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="specifications" label="型号" width="180">
              </el-table-column>
              <el-table-column prop="itemNo" label="订货号" align="center" min-width="160">
              </el-table-column>
              <el-table-column prop="noticeWarehouseName" label="收货仓库" align="center" min-width="160">
              </el-table-column>
              <el-table-column prop="warehouseName" label="订单仓库" align="center" min-width="160">
              </el-table-column>
              <el-table-column prop="qty" label="订单数量" align="right" width="80" class-name="col-required">
              </el-table-column>
              <el-table-column prop="noticeQty" label="收货通知数量" align="center" min-width="140">
              </el-table-column>
              <el-table-column prop="noticeStockInQty" label="已入库数量" align="center" min-width="120">
              </el-table-column>
              <!-- <el-table-column prop="applyQty" label="未处理数量" align="right" width="120">
              </el-table-column>
              <el-table-column prop="qty" label="处理数量" align="right" width="80" class-name="col-required">
              </el-table-column>
              <el-table-column prop="canGoodsQty" label="可做收货数量" align="right" width="120" class-name="col-required">
              </el-table-column> -->
              <el-table-column prop="retailPrice" label="面价" align="right" width="90" class-name="col-required">
                <template slot-scope="scope">
                  {{Number(scope.row.retailPrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column prop="releasePrice" label="发布单价" align="right" width="90" class-name="col-required">
                <template slot-scope="scope">
                  {{Number(scope.row.releasePrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column prop="discount" label="处理折扣" align="right" width="70" class-name="col-required">
              </el-table-column>
              <el-table-column prop="taxPrice"
                               v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1"
                               label="付款单价" align="right" width="80" class-name="col-required">
                <template slot-scope="scope">
                  {{Number(scope.row.taxPrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column prop="taxAmount" label="价税合计" align="right" width="100" class-name="col-required">
                <template slot-scope="scope">
                  {{Number(scope.row.taxAmount).toFixed(4)}}
                </template>
              </el-table-column>
<!--              <el-table-column prop="stockInPurchaseQty" label="入库数量" align="right" width="80"-->
<!--                               class-name="col-required">-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="notStockInPurchaseQty" label="未入库数量" align="right" width="90"-->
<!--                               class-name="col-required">-->
<!--              </el-table-column>-->

              <!-- <el-table-column prop="returnGoodsQty" label="退货数量" align="right" width="100" class-name="col-required">
              </el-table-column> -->
              <el-table-column prop="stockInPurchaseAmount" label="入库金额" align="right" width="100">
                <template slot-scope="scope">
                  {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column prop="notStockInPurchaseAmount" label="未入库金额" align="right" width="100">
                <template slot-scope="scope">
                  {{Number(scope.row.notStockInPurchaseAmount).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column prop="mainDTO.deliverDate" label="交货日期" align="center" width="100" sortable>
              </el-table-column>

              <el-table-column prop="note" label="备注" width="104">
              </el-table-column>
              <el-table-column prop="skuNo" label="商品编码" align="center" min-width="250">
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10,50,500,1000]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total5"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="调拨库存查询" name="fourth">
        <el-row>
          <el-col style="padding-left:10px;">
            <!-- 查询和其他操作 -->
            <div class="filter-container goods-stock-filter-container3">
              <div>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="品名"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.name"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="品牌"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.brandName"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="标准系列"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.seriesName"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="返点系列"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.rebateSeries"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="规格型号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.specModel"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="供应商编号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.supplierCode"
                ></el-input>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="采购员工号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.purchaseCode"
                ></el-input>
                <!-- <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="采购员姓名"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.purchaseName"
                ></el-input> -->
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="订货号"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.itemNo"
                ></el-input>
                <div></div>
                <el-input
                  clearable
                  class="filter-item"
                  style="width: 190px;"
                  placeholder="供货地址"
                  @keyup.enter.native="handleFilter"
                  v-model="listQuery.warehouseAdress"
                ></el-input>
                <el-date-picker
                  style="position: relative;top: -4px;width: 384px"
                  v-model="listQuery.validateTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="有效期"
                  end-placeholder="有效期"
                  @change="handleTwoDateSelect"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-date-picker
                  style="position: relative;top: -4px;width: 384px"
                  v-model="listQuery.updTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="更新日期"
                  end-placeholder="更新日期"
                  @change="handleOneDateSelect"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
                <span @click="queryVisibleChange('queryVisible3')" class="query-visible"></span>
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleFilter"
                >查询
                </el-button>
                <el-button class="filter-item" type="danger" @click="handleReset" icon="el-icon-delete">重置</el-button>
                <!-- <el-button
                  class="filter-item"
                  type="primary"
                  :loading="downloadLoading"
                  icon="el-icon-download"
                  @click="handleDownload4"
                >导出
                </el-button> -->
<!--                <el-button class="filter-item" type="primary"-->
<!--                           v-if="$store.getters.groupNames.indexOf('总经理') > -1 || $store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--                           :loading="!!downloadLoading" icon="el-icon-download"-->
<!--                           @click="handleExportAllot">导出-->
<!--                </el-button>-->
                <a :href="stockTranslateExportUrl" download="调拨库存查询"
                   v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
                  <el-button class="filter-item" type="primary"
                             :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
                  </el-button>
                </a>
              </div>
            </div>

            <!-- 查询结果 -->
            <el-table size="small" class="zaituTable" :data="list4" v-loading="listLoading"
                      element-loading-text="正在查询中。。。" border fit
                      highlight-current-row :height="clientHeight3" show-summary :summary-method="getSummaries1">
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <!-- <el-table-column label="审核状态" prop="billStatus" align="center" width="120"></el-table-column> -->
              <el-table-column label="品名" prop="name" width="150"></el-table-column>
              <el-table-column label="品牌" prop="brandName" width="180"></el-table-column>
              <el-table-column prop="seriesName" align="center" label="标准系列" width="140">
              </el-table-column>
              <el-table-column prop="rebateSeries" align="center" label="返点系列" width="140">
              </el-table-column>
              <el-table-column label="规格型号" prop="specModel" width="230" align="center"></el-table-column>
              <el-table-column label="订货号" prop="itemNo" width="120" align="center"></el-table-column>
              <el-table-column label="计量单位" prop="unit" width="80" align="center"></el-table-column>
              <el-table-column label="产品面价" prop="retailPrice" sortable width="100">
                <template slot-scope="scope">{{Number(scope.row.retailPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="调拨价" prop="allocationPrice" align="right" sortable width="110"
                               class-name="title-red">
                <template slot-scope="scope">{{Number(scope.row.allocationPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="供货价" prop="supplyPrice" align="right" sortable width="120" class-name="title-red"
                               v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">
                <template slot-scope="scope">{{Number(scope.row.supplyPrice).toFixed(4)}}</template>
              </el-table-column>
              <el-table-column label="供货金额" prop="supplyAmount" align="right" sortable width="120"
                               class-name="title-red">
                <!-- <template slot-scope="scope">
                  {{accMulti(scope.row.supplyPrice, scope.row.qty).toFixed(4)}}
                </template> -->
              </el-table-column>
              <el-table-column label="供应商编号" prop="supplierCode" align="right" sortable width="120"></el-table-column>
              <!-- <el-table-column label="供应商" prop="supplierName" width="150">
                <template slot-scope="scope">
                  <span v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">{{scope.row.supplierName}}</span>
                  <span v-else>*****</span>
                </template>
              </el-table-column> -->
              <el-table-column label="调拨折扣" prop="discount" width="100" align="right" sortable>
                <template slot-scope="scope">{{ (scope.row.allocationPrice / scope.row.retailPrice).toFixed(4) }}
                </template>
              </el-table-column>
              <el-table-column label="供货折扣" prop="discount" width="100" align="right" sortable>
                <template slot-scope="scope">{{ (scope.row.supplyPrice / scope.row.retailPrice).toFixed(4) }}
                </template>
              </el-table-column>
              <el-table-column label="发布数量" prop="qty" align="right" sortable width="100" class-name="col-required"></el-table-column>
              <el-table-column label="锁定数量" prop="lockedQty" align="right" class-name="col-required" sortable
                               width="100"></el-table-column>
              <el-table-column label="可销售数量" prop="salableQty" align="right" class-name="col-required" sortable
                               width="120"></el-table-column>
              <el-table-column label="起订量" prop="minPack" align="right" class-name="col-required" sortable
                               width="100"></el-table-column>
              <el-table-column label="供货仓库" prop="warehouseName" align="center" class-name="col-required"
                               width="200"></el-table-column>
              <el-table-column label="供货地址" prop="warehouseAdress" align="center" class-name="col-required"
                               width="200"></el-table-column>
              <el-table-column label="采购员姓名" prop="purchaseName" width="100"></el-table-column>
              <el-table-column label="采购员工号" prop="purchaseCode" width="100"></el-table-column>
              <el-table-column label="有效期" prop="validateTime" width="100"></el-table-column>
              <el-table-column label="更新时间" prop="updTime" width="150"></el-table-column>
              <!-- <el-table-column label="上架状态" prop="putawayStatus"></el-table-column> -->
              <!--              <el-table-column label="型号类型" prop="modelType" width="100"></el-table-column>-->
              <!--              <el-table-column label="入库类型" prop="stockType" width="100"></el-table-column>-->
              <!--              <el-table-column label="批次号" prop="batchNumber" width="170"></el-table-column>-->
              <!--              <el-table-column label="锁库单号" prop="lockingOrderNo" width="160"></el-table-column>-->
              <!--              <el-table-column label="库存归属人工号" prop="ownerCode" width="120"></el-table-column>-->

              <!--              <el-table-column label="商品编码" prop="skuNo" width="150"></el-table-column>-->
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10,50,500,1000]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total4"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="闲置库存查询" name="second">
        <div class="pagination-container">
          <el-form :inline="true">
            <el-form-item>
              <el-select v-model="listQuery.billStatus" style="width: 190px">
                <!-- <el-option value="1" label="暂存"></el-option>
                <el-option value="2" label="待审核"></el-option>
                <el-option value="3" label="作废"></el-option> -->
                <el-option value="4" label="正常"></el-option>
                <!-- <el-option value="5" label="回退"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="品名" v-model="listQuery.name" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="品牌" v-model="listQuery.brandName" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="系列" v-model="listQuery.seriesName" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="规格型号" v-model="listQuery.specModel" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="订货号" v-model="listQuery.itemNo" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="供应商编号" v-model="listQuery.supplierCode" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="listQuery.validTime"
                type="datetimerange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="有效期"
                end-placeholder="有效期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="listQuery.updTime"
                type="datetimerange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="更新日期"
                end-placeholder="更新日期">
              </el-date-picker>
            </el-form-item>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询
            </el-button>
<!--            <el-button-->
<!--              class="filter-item"-->
<!--              type="primary"-->
<!--              :loading="downloadLoading"-->
<!--              icon="el-icon-download"-->
<!--              v-if=" username == '00000'||$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1"-->
<!--              @click="excelTable"-->
<!--            >导出-->
<!--            </el-button>-->
            <a :href="stockIdleExportUrl" download="闲置库存查询"
               v-if="$store.getters.groupNames.indexOf('总经理') > -1||$store.getters.groupNames.indexOf('供应链总监') > -1">
              <el-button class="filter-item" type="primary"
                         :loading="downloadLoading" icon="el-icon-download" style="margin-left: 10px;">全部导出
              </el-button>
            </a>
          </el-form>
          <el-table size="small" :data="xzList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                    ref="xzTable"
                    highlight-current-row style="min-height: 680px" show-summary :summary-method="getSummaries">
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <!-- <el-table-column prop="billStatus" label="状态" align="center" v-slot="{row}" width="150">
              <span v-if="row.billStatus*1===1">暂存</span>
              <span v-if="row.billStatus*1===2">待审核</span>
              <span v-if="row.billStatus*1===3">作废</span>
              <span v-if="row.billStatus*1===4">正常</span>
              <span v-if="row.billStatus*1===5">回退</span>
            </el-table-column> -->
            <el-table-column prop="categoryName" label="商品类别" align="center" width="120"></el-table-column>
            <el-table-column prop="name" label="品名" align="center" width="150"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center" width="150"></el-table-column>
            <el-table-column prop="seriesName" label="系列" align="center" width="150"></el-table-column>
            <el-table-column prop="specModel" label="规格型号" align="center" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="itemNo" label="订货号" align="center" width="150"></el-table-column>
            <el-table-column prop="unit" label="计量单位" align="center" width="80"></el-table-column>
            <el-table-column label="供应商编号" prop="supplierCode" width="120"></el-table-column>
            <el-table-column prop="retailPrice" label="产品面价" align="right" class-name="title-red"
                             width="100"></el-table-column>
            <el-table-column prop="releasePrice" label="调拨价" align="right" class-name="title-red" width="100">
              <template slot-scope="scope">
                {{scope.row.releasePrice.toFixed(4)}}
              </template>
            </el-table-column>
            <el-table-column prop="supplyPrice" label="进价" align="right" class-name="title-red" width="100"
                             v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1"></el-table-column>
            <el-table-column prop="dbDiscount" label="调拨折扣" align="right" class-name="title-red" width="100"
                             v-slot="{row}">
              <span>{{division(row.releasePrice,row.retailPrice).toFixed(4)}}</span>
            </el-table-column>
            <el-table-column prop="discount" label="进货折扣" align="right" class-name="title-red" width="100"
                             v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">

            </el-table-column>
            <el-table-column prop="qty" label="现发布数量" align="right" width="100"></el-table-column>
            <el-table-column prop="trueAmount" label="库存金额" align="right" class-name="title-red" width="100">
              <template slot-scope="scope">
                <span>{{accMulti(scope.row.supplyPrice,scope.row.qty).toFixed(4)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lockedQty" label="锁定数量" align="right" width="100"></el-table-column>
            <el-table-column prop="salableQty" label="可售数量" align="right" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.qty-scope.row.lockedQty}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="minPack" label="起订量" align="center" width="100"></el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" align="center" width="120"></el-table-column>
            <el-table-column prop="warehouseAdress" label="仓库地址" align="center" width="150"></el-table-column>
            <el-table-column prop="validateTime" label="有效期" align="center" width="100"></el-table-column>
            <el-table-column prop="updTime" label="更新日期" align="center" width="150"></el-table-column>

          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-sizes="[10,50,500,1000]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="xzTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 商品出入库详情弹窗 -->
    <goods-stock-view
      :dialogFormVisible="dialogStockVisible"
      v-if="dialogStockVisible"
      :skuNo="dataDTO.skuNo"
      :skuName="dataDTO.skuName"
      :specifications="dataDTO.specifications"
      :warehouseName="dataDTO.warehouseName"
      :warehouseId="dataDTO.warehouseId"
      @handleStockClose="handleStockClose"
    ></goods-stock-view>

    <!-- 仓位详情列表弹窗 -->
    <warehouse-position-view
      :dialogFormVisible="dialogWarehousePositionVisible"
      v-if="dialogWarehousePositionVisible"
      :skuNo="dataDTO.skuNo"
      :warehouseId="dataDTO.warehouseId"
      @handleWarehousePositionClose="handleWarehousePositionClose"
    ></warehouse-position-view>

    <!-- 单品明细列表弹窗 -->
    <single-product-view
      :dialogFormVisible="dialogSingleProductVisible"
      v-if="dialogSingleProductVisible"
      @handleSingleProductClose="handleSingleProductClose"
    ></single-product-view>

    <locked-router v-if="isShowLockedRouter" :dialogVisible="isShowLockedRouter" @handleClose="handleClosePublic"
                   @handleSubmit="handleSubmitPublic" :id="nowRow.id"></locked-router>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import request from '@/utils/request'
  import {getFloat} from '@/utils/util'
  import {listCatAndBrand} from '@/api/erp/goods/goods'
  import {
    pageBySingleProduct,
    pageByProduct,
    pageByProductPosition,
    selectDetailItem,
    page,
    selectPageByItem as idlePage
  } from '@/api/erp/wms/stock_query/index'
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseGoodsRelease'
  import {newSelectPageByItem as purchaseOrderSelectPageByItem} from '@/api/erp/purchase/bill/purchaseOrder'

  export default {
    components: {
      'goods-stock-view': () => import('./goods-stock-view'),
      'warehouse-position-view': () => import('./warehouse-position-view'),
      'single-product-view': () => import('./single-product-view'),
      'lockedRouter': () => import('./components/lockedRouter'),
    },
    data() {
      return {
        isShowLockedRouter: false,
        clientHeight: 300,
        clientHeight1: 300,
        clientHeight2: 300,
        clientHeight3: 300,
        clientHeight4: 300,
        clientHeight5: 300,
        clientHeight280: 280,
        nowRow: {},
        zaituAll: [],
        allotAll: [],
        list1: [],
        list2: [],
        list3: [],
        list4: [], //调拨库存明细数据源
        list5: [], //期货库存明细数据源
        list6: [],
        xzList: [],//闲置库存明细数据源
        total1: 0,
        total2: 0,
        total3: 0,
        total4: 0, //调拨库存明细分页页码
        total5: 0, //期货库存明细分页页码
        xzTotal: 0,//闲置库存页面条数
        listLoading: false,
        billDate: undefined,
        listQuery: {
          page: 1,
          limit: 10,
          categoryId: '',
          brandId: '',
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          warehouseName: '',
          positionName: '',
          startTime: undefined,
          endTime: undefined,
          publishType: this.activeName == 'fifth' ? '0' : undefined,
          selectType: this.activeName == 'fifth' || this.activeName == 'fourth' ? '1' : undefined
        },
        channelTypeOptions: [
          {
            value: '01',
            label: '厂家'
          },
          {
            value: '02',
            label: '厂家库存单'
          },
          {
            value: '03',
            label: '厂家促销'
          },
          {
            value: '04',
            label: '厂家促销第一季度'
          },
          {
            value: '05',
            label: '厂家促销第二季度'
          },
          {
            value: '06',
            label: '厂家促销第三季度'
          },
          {
            value: '07',
            label: '厂家促销第四季度'
          }
        ],
        dataDTO: {
          skuNo: '',
          skuName: '',
          specifications: '',
          warehouseId: '',
          warehouseName: ''
        },
        activeName: 'third',
        brandList: [],
        categoryList: [],
        isOpenTree1: true,
        isOpenTree2: true,
        isOpenTree3: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText1: '',
        filterText2: '',
        filterText3: '',
        queryVisible1: false,
        queryVisible2: false,
        queryVisible3: false,
        queryVisible4: false,
        queryVisible5: false,
        dialogStockVisible: false,
        dialogWarehousePositionVisible: false,
        dialogSingleProductVisible: false,
        downloadLoading: false,
        fileList: undefined,
        loginNo: undefined,
        typeOptions: [
          {
            value: '0',
            label: 'GH'
          },
          {
            value: '1',
            label: 'VMI'
          }
        ],
        sourceOption: [
          {
            value: '0',
            label: '线上库存'
          },
          {
            value: '1',
            label: '线下库存'
          },
          {
            value: '2',
            label: '调拨'
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['groupNames', 'username']),
      stockExportUrl: function () {
        let url = '/api/wms/stock-detail/exportDetailItem?userId=' + this.$store.getters.id + '&'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockAllExportUrl: function () {
        let url = '/api/wms/stock-detail/selectStockItemList?'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockCollectExportUrl: function () {
        let url = '/api/wms/stock-detail/exportBySingleProduct?'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockMessageExportUrl: function () {
        let url = '/api/purchase/purchase-goods-release/export?'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockOnLoadExportUrl: function () {
        let url = '/api/purchase/purchase-order/export?'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockTranslateExportUrl: function () {
        let url = '/api/srm/srm-stock-detail/export?'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
      stockIdleExportUrl: function () {
        let url = '/api/srm/srm-idle-release/export?selectType=2&&billStatus=4&'
        this.listQuery=this.filterObjSpace(this.listQuery)
        for (let item in this.listQuery) {
          if (this.listQuery[item]) {
            url += `${item}=${this.listQuery[item]}&`
          }

        }
        return url
      },
    },
    watch: {
      filterText1(val) {
        this.$refs.categoryTree1.filter(val)
      },
      filterText2(val) {
        this.$refs.categoryTree2.filter(val)
      },
      filterText3(val) {
        this.$refs.categoryTree3.filter(val)
      },
      activeName: {
        handler() {
          this.listQuery.page = 1
          if (this.activeName == 'first') {
            this.getList1()
          } else if (this.activeName == 'second') {
            this.getXzList()
          } else if (this.activeName == 'third') {
            this.getList3()
          } else if (this.activeName == 'fourth') {
            this.getList4()
          } else if (this.activeName == 'fifth') {
            this.getList5()
          } else {
            this.getList6()
          }
        }
      }
    },
    created() {
      this.loginNo = this.$store.getters.code
      this.init()
      this.getList3()
      const _this = this
      console.log(this.$store.getters.groupNames,'777')
      window.onresize = function () {
        _this.changeDivHeight('goods-stock-filter-container1', 'queryVisible1')
        _this.changeDivHeight('goods-stock-filter-container2', 'queryVisible2')
        _this.changeDivHeight('goods-stock-filter-container3', 'queryVisible3')
      }
    },
    updated() {
      this.changeDivHeight('goods-stock-filter-container1', 'queryVisible1')
      this.changeDivHeight('goods-stock-filter-container2', 'queryVisible2')
      this.changeDivHeight('goods-stock-filter-container3', 'queryVisible3')
    },
    methods: {
      filterClick(val) {
        let sum = parseInt(val)
        let sumUrl =
          sum === 0
            ? '/api/wms/stock-detail/initERPStock'
            : '/api/wms/stock-detail/exportFile'
        request({
          url: sumUrl,
          method: 'get'
        }).then(res => {
        })
      },
      initGXStock() {
        let initGXStockUrl = '/api/wms/stock-detail/initGXStock'
        request({
          url: initGXStockUrl,
          method: 'get'
        }).then(res => {
        })
      },
      getSummaries(param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          let values = []
          if (column.property === 'vendibility') {
            values = data.map(item => Number(item.qty * 1 - item.lockedQty * 1))
          } else if (column.property === 'amount') {
            if (this.activeName == 'first') {
              values = data.map(item =>
                Number(
                  (
                    (item.source == '0'
                      ? item.costPrice * 1
                      : item.purchasePrice * 1) * item.qty
                  ).toFixed(4)
                )
              )
            }
            if (this.activeName == 'third') {
              values = data.map(item =>
                Number(
                  (
                    (this.$store.getters.groupNames.indexOf('总经理') < 0
                      ? item.allocationPrice * 1
                      : item.purchasePrice * 1) * item.qty
                  ).toFixed(4)
                )
              )
            }
          } else {
            values = data.map(item => Number(item[column.property]))
          }
          if (!values.every(value => isNaN(value))) {
            if (
              column.property == 'onWayQty' ||
              column.property == 'stockInPurchaseAmount' ||
              column.property == 'notStockInPurchaseAmount' ||
              column.property == 'amountPrice' ||
              column.property == 'taxAmount' ||
              column.property == 'amount' ||
              column.property == 'allocationAmount' ||
              column.property == 'vendibility' ||
              column.property == 'supplyAmount'
            ) {
              sums[index] = values
                .reduce((prev, curr) => {
                  const value = Number(curr)
                  if (!isNaN(value)) {
                    return getFloat(prev + curr, 4)
                  } else {
                    return getFloat(prev, 4)
                  }
                }, 0)
                .toFixed(4)
              sums[index] += ' '
            }
            if (
              column.property == 'stockInPurchaseQty' ||
              column.property == 'notStockInPurchaseQty' ||
              column.property == 'returnGoodsQty' ||
              column.property == 'applyQty' ||
              column.property == 'qty' ||
              column.property == 'canGoodsQty' ||
              column.property == 'lockedQty' ||
              column.property == 'salableQty' ||
              column.property == 'purchasedQty' ||
              column.property == 'canUseQty'
            ) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 0)
                } else {
                  return getFloat(prev, 0)
                }
              }, 0)
              sums[index] += ' '
            }
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      getSummaries1(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.label === '库存数量' || column.label === '锁定数量' || column.label === '发布数量' || column.label === '可销售数量' || column.property === 'profit') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return getFloat(prev, 4);
              }
            }, 0);
            sums[index] += ' ';
          } else if (column.property === 'jlrl') {
            let sum1 = 0
            let sum2 = 0
            for (let i = 0; i < data.length; i++) {
              sum1 = this.accAdd(sum1, data[i].profit)
              sum2 = this.accAdd(sum2, data[i].outAmount)
            }
            sums[index] = this.toPercent(this.division(sum1, sum2))
          } else if (column.property === 'jlr') {
            let sum = 0
            for (let i = 0; i < data.length; i++) {
              sum = this.accAdd(this.accAdd(data[i].profit, -data[i].warehouseAmount), sum)
            }
            sums[index] = sum
          } else if (column.label === '供货金额') {
            let sum = 0
            for (let i = 0; i < data.length; i++) {
              sum = this.accAdd(this.accMulti(data[i].supplyPrice, data[i].qty), sum)
            }
            sums[index] = sum
          } else if (column.property === 'profitRate') {
            let sum1 = 0
            let sum2 = 0
            for (let i = 0; i < data.length; i++) {
              sum1 = this.accAdd(sum1, data[i].profit)
              sum2 = this.accAdd(sum2, data[i].outAmount)
            }
            sums[index] = this.toPercent(this.division(sum1, sum2))
          } else {
            sums[index] = ' ';
          }
        });

        //sums[6] = this.toPercent(Number(this.division(sums[2], sums[5])).toFixed(4))
        return sums;
      },

      //在途库存合计
      getSummaries2(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.label === '价税合计' || column.label === '入库金额' || column.label === '未入库金额' ) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return getFloat(prev, 4);
              }
            }, 0).toFixed(4);
            sums[index] += ' ';
          }else if(column.label === '收货通知数量'||column.label === '已入库数量'){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return getFloat(prev, 4);
              }
            }, 0);
            sums[index] += ' ';
          }
        });
        return sums;
      },


      handleBillDateSelect(val) {
        this.listQuery.startTime = val[0];
        this.listQuery.endTime = val[1];
      },
      queryVisibleChange(type) {
        const _this = this
        if (type == 'queryVisible1') {
          this.queryVisible1 = !this.queryVisible1
          setTimeout(function () {
            _this.changeDivHeight('goods-stock-filter-container1', type)
          }, 1)
        } else if (type == 'queryVisible2') {
          this.queryVisible2 = !this.queryVisible2
          setTimeout(function () {
            _this.changeDivHeight('goods-stock-filter-container2', type)
          }, 1)
        } else if (type == 'queryVisible3') {
          this.queryVisible3 = !this.queryVisible3
          setTimeout(function () {
            _this.changeDivHeight('goods-stock-filter-container3', type)
          }, 1)
        }
      },
      changeDivHeight(className, type) {
        if (document.getElementsByClassName(className)[0]) {
          var height = document.getElementsByClassName(className)[0].clientHeight
        } else {
          height = 38
        }

        this.clientHeight = (document.body.clientHeight - 210) * 1
        if (type == 'queryVisible1') {
          this.clientHeight1 = (document.body.clientHeight - (250 + height)) * 1
        } else if (type == 'queryVisible2') {
          this.clientHeight2 = (document.body.clientHeight - (250 + height)) * 1
        } else if (type == 'queryVisible3') {
          this.clientHeight3 = (document.body.clientHeight - (250 + height)) * 1
        } else if (type == 'queryVisible5') {
          this.clientHeight5 = (document.body.clientHeight - (250 + height)) * 1
        }
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList
          this.brandList = response.data.brandList
        })
      },
      getList1() {
        this.listLoading = true
        pageBySingleProduct(this.listQuery)
          .then(response => {
            this.list1 = response.data.records
            this.list1.forEach(item => {
              if (item.source == '0') {
                item.amount = (item.purchasePrice * item.qty).toFixed(4)
              } else {
                item.amount = (item.costPrice * item.qty).toFixed(4)
              }
              item.vendibility = item.qty - item.lockedQty;
              item.discount = (item.costPrice / item.retailPrice).toFixed(4);
            })
            this.total1 = response.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list1 = []
            this.total1 = 0
            this.listLoading = false
          })
      },
      getList2() {
        this.listLoading = true
        pageByProduct(this.listQuery)
          .then(response => {
            this.list2 = response.data.records
            this.total2 = response.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list2 = []
            this.total2 = 0
            this.listLoading = false
          })
      },
      getList3(params) {
        this.listLoading = true
        selectDetailItem(Object.assign({}, this.listQuery, params))
          .then(response => {
            this.list3 = response.data.records
            this.total3 = response.data.total
            this.list3.forEach(item => {
              if (this.$store.getters.groupNames.indexOf('总经理') > -1) {
                item.amount = (item.purchasePrice * item.qty).toFixed(4)
              } else {
                item.amount = (item.allocationPrice * item.qty).toFixed(4)
              }
              item.allocationAmount = (item.allocationPrice * item.qty).toFixed(4)
            })
            this.listLoading = false
          })
          .catch(() => {
            this.list3 = []
            this.total3 = 0
            this.listLoading = false
          })
      },
      /**
       * 调拨库存明细获取数据源
       */
      getList4() {
        this.listLoading = true
        page(this.listQuery).then(
          res => {
            for (let i = 0; i < res.data.records.length; i++) {
              //解析发布审核状态
              if (res.data.records[i].billStatus === 0) {
                res.data.records[i].billStatus = '正常'
              } else if (res.data.records[i].billStatus === 1) {
                res.data.records[i].billStatus = '发布审核中'
              } else if (res.data.records[i].billStatus === 2) {
                res.data.records[i].billStatus = '发布驳回'
              } else if (res.data.records[i].billStatus === 3) {
                res.data.records[i].billStatus = '修改审核中'
              } else if (res.data.records[i].billStatus === 4) {
                res.data.records[i].billStatus = '修改驳回'
              }
              if (res.data.records[i].putawayStatus === 1) {
                res.data.records[i].putawayStatus = '下架'
              } else {
                res.data.records[i].putawayStatus = '上架'
              }
            }
            this.list4 = res.data.records
            this.list4.forEach(item => {
              item.supplyAmount = this.accMulti(item.supplyPrice, item.qty).toFixed(4)
            })
            this.total4 = res.data.total
            this.listLoading = false
          },
          error => {
            this.$message.error('查询失败' + error.msg)
            this.listLoading = false
          }
        )
      },
      getList5() {
        this.listLoading = true
        selectPageByItem(this.listQuery)
          .then(response => {
            this.list5 = response.data.records
            this.list5.forEach(item => {
              item.canUseQty = Number(item.qty) - Number(item.purchasedQty)
            })
            this.total5 = response.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list5 = []
            this.total5 = 0
            this.listLoading = false
          })
      },
      getList6() {
        this.listLoading = true
        purchaseOrderSelectPageByItem(this.listQuery)
          .then(response => {
            this.list6 = response.data.records
            this.list6.forEach(item => {
              item.notStockInPurchaseAmount = (item.notStockInPurchaseQty * item.taxPrice).toFixed(4)
            })
            this.$forceUpdate()
            this.total5 = response.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.list6 = []
            this.total5 = 0
            this.listLoading = false
          })
      },

      getXzList() {
        this.listLoading = true
        this.listQuery.billStatus = '4'
        let params = Object.assign({}, this.listQuery)
        params.selectType = 2
        if (params.validTime && params.validTime.length > 0) {
          params.startValidateTime = params.validTime[0]
          params.endValidateTime = params.validTime[1]
          delete params.validTime
        }
        if (params.updTime && params.updTime.length > 0) {
          params.startUpdTime = params.updTime[0]
          params.endUpdTime = params.updTime[1]
          delete params.updTime
        }

        idlePage(params).then(res => {
          const data = res.data;
          this.xzTotal = data.total;
          this.xzList = data.records;
          this.listLoading = false
        }, error => this.$message.error('获取闲置库存失败!' + error))
      },
      handleTabClick() {
        this.listQuery = {
          page: 1,
          limit: 10,
          categoryId: '',
          brandId: '',
          skuNo: '',
          skuName: '',
          specifications: '',
          warehouseName: '',
          positionName: '',
          publishType: this.activeName == 'fifth' ? '0' : undefined
        }
        if (this.activeName == 'fifth' || this.activeName == 'fourth') {
          this.listQuery.selectType = '1'
        } else if (this.activeName == 'sixth') {
          this.listQuery.selectType = '7'
        } else {
          this.listQuery.selectType = undefined
        }
      },
      handleReset() {
        this.listQuery = {};
        this.billDate = undefined;
        this.handleFilter()
      },
      handleFilter() {
        this.listQuery.page = 1
        if (this.activeName == 'first') {
          this.getList1()
        } else if (this.activeName == 'second') {
          this.getXzList()
        } else if (this.activeName == 'third') {
          this.getList3()
        } else if (this.activeName == 'fourth') {
          this.getList4()
        } else if (this.activeName == 'fifth') {
          this.getList5()
        } else {
          //在途库存查询
          this.getList6()
        }
      },
      handleOpenTree1() {
        this.isOpenTree1 = !this.isOpenTree1
        for (var i in this.$refs.categoryTree1.store.nodesMap) {
          this.$refs.categoryTree1.store.nodesMap[i].expanded = this.isOpenTree1
        }
      },
      handleOpenTree2() {
        this.isOpenTree2 = !this.isOpenTree2
        for (var i in this.$refs.categoryTree2.store.nodesMap) {
          this.$refs.categoryTree2.store.nodesMap[i].expanded = this.isOpenTree2
        }
      },
      handleOpenTree3() {
        this.isOpenTree3 = !this.isOpenTree3
        for (var i in this.$refs.categoryTree3.store.nodesMap) {
          this.$refs.categoryTree3.store.nodesMap[i].expanded = this.isOpenTree3
        }
      },
      filterNode1(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      filterNode2(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      filterNode3(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData1(data) {
        this.listQuery.categoryId = data.value
        this.handleFilter()
      },
      getNodeData2(data) {
        this.listQuery.categoryId = data.value
        this.handleFilter()
      },
      getNodeData3(data) {
        this.listQuery.categoryId = data.value
        this.handleFilter()
      },
      handleStockOpen(row) {
        this.dataDTO.skuNo = row.skuNo
        this.dataDTO.skuName = row.skuName
        this.dataDTO.specifications = row.specifications
        this.dataDTO.warehouseId = row.warehouseId
        this.dataDTO.warehouseName = row.warehouseName
        this.dialogStockVisible = true
      },
      handleStockClose(row) {
        this.dialogStockVisible = false
      },
      handleWarehousePositionOpen(row) {
        this.dataDTO.skuNo = row.skuNo
        this.dataDTO.warehouseId = row.warehouseId
        this.dialogWarehousePositionVisible = true
      },
      handleWarehousePositionClose() {
        this.dialogWarehousePositionVisible = false
      },
      handleSingleProductOpen() {
        this.dialogSingleProductVisible = true
      },
      handleSingleProductClose() {
        this.dialogSingleProductVisible = false
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        if (this.activeName == 'first') {
          this.getList1()
        } else if (this.activeName == 'second') {
          this.getXzList()
        } else if (this.activeName == 'third') {
          this.getList3()
        } else if (this.activeName == 'fourth') {
          this.getList4()
        } else if (this.activeName == 'fifth') {
          this.getList5()
        } else {
          this.getList6()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if (this.activeName == 'first') {
          this.getList1()
        } else if (this.activeName == 'second') {
          this.getXzList()
        } else if (this.activeName == 'third') {
          this.getList3()
        } else if (this.activeName == 'fourth') {
          this.getList4()
        } else if (this.activeName == 'fifth') {
          this.getList5()
        } else {
          this.getList6()
        }
      },
      handleDownload1() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        for (var i in this.list1) {
          this.list1[i].usableQty =
            this.list1[i].qty * 1 - this.list1[i].lockedQty * 1
          var amount =
            (this.list1[i].qty * 1 - this.list1[i].lockedQty * 1) *
            this.list1[i].retailPrice
          this.list1[i].amount = getFloat(amount, 2)
        }
        for (var i in this.list1) {
          Object.assign(this.list1[i], this.list1[i].mainDTO);
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '品牌',
            '商品编码',
            '商品名称',
            '规格型号',
            '订货号',
            '仓库',
            '供应商编号',
            '计量单位',
            '库存数量',
            '锁定数量',
            '可售数量',
            '面价',
            '调拨价',
            '调拨折扣',
            '库存金额'
          ]
          const filterVal = [
            'brandName',
            'skuNo',
            'skuName',
            'specifications',
            'itemNo',
            'warehouseName',
            'supplierCode',
            'unit',
            'qty',
            'lockedQty',
            'vendibility',
            'retailPrice',
            'costPrice',
            'discount',
            'amount'
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list1,
            filterVal,
            '单品库存信息'
          )
          this.downloadLoading = false
        })
      },
      handleDownload2() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        for (var i in this.list2) {
          this.list2[i].usableQty =
            this.list2[i].qty * 1 - this.list2[i].lockedQty * 1
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '商品名称',
            '仓库',
            '计量单位',
            '可用数量',
            '库存数量'
          ]
          const filterVal = [
            'skuName',
            'warehouseName',
            'unit',
            'usableQty',
            'qty'
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list2,
            filterVal,
            '商品库存信息'
          )
          this.downloadLoading = false
        })
      },
      handleDownload3() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        for (var i in this.list3) {
          this.list3[i].usableQty =
            this.list3[i].qty * 1 - this.list3[i].lockedQty * 1
          var amount =
            (this.list3[i].qty * 1 - this.list3[i].lockedQty * 1) *
            this.list3[i].retailPrice
          this.list3[i].amount = getFloat(amount, 2)
        }
        // groupNames.indexOf('仓库') > -1
        let tHeader = [];
        let filterVal = [];
        if (this.username == '00000' || this.$store.getters.groupNames.indexOf('总经理') > -1 || this.$store.getters.groupNames.indexOf('供应链总监') > -1) {
          tHeader = [
            '品牌',
            '商品编码',
            '商品名称',
            '规格型号',
            '订货号',
            '仓库',
            '仓位',
            '供应商编号',
            '计量单位',
            '可用数量',
            '库存数量',
            '锁定数量',
            '可售数量',
            '面价',
            '调拨价',
            '调拨折扣',
            '库存金额'
          ]
          filterVal = [
            'brandName',
            'skuNo',
            'skuName',
            'specifications',
            'itemNo',
            'warehouseName',
            'positionName',
            'supplierCode',
            'unit',
            'canUseQty',
            'qty',
            'lockedQty',
            'vendibility',
            'retailPrice',
            'costPrice',
            'discount',
            'amount'
          ]
        } else {
          tHeader = [
            '品牌',
            '商品编码',
            '商品名称',
            '规格型号',
            '订货号',
            '仓库',
            '仓位',
            '计量单位',
            '可用数量',
            '库存数量',
            '锁定数量',
            '可售数量',
          ]
          filterVal = [
            'brandName',
            'skuNo',
            'skuName',
            'specifications',
            'itemNo',
            'warehouseName',
            'positionName',
            'unit',
            'canUseQty',
            'qty',
            'lockedQty',
            'vendibility',
          ]

        }
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel2(
            tHeader,
            this.list3,
            filterVal,
            '单品仓位库存信息'
          )
          this.downloadLoading = false
        })
      },
      /**
       * 调拨库存明细查询
       */
      handleDownload4() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '审核状态',
            '品名',
            '品牌',
            '规格型号',
            '订货号',
            '计量单位',
            '产品面价',
            '调拨价',
            '供货价',
            '供应商编号',
            '折扣',
            '库存数量',
            '锁定数量',
            '可销售数量',
            '起订量',
            '供货仓库',
            '供货地址',
            '有效期',
            '更新时间',
            '上架状态',
            '型号类型',
            '入库类型',
            '批次号',
            '锁库单号',
            '库存归属人工号',
            '采购',
            '商品编码',
          ]
          const filterVal = [
            'billStatus',
            'name',
            'brandName',
            'specModel',
            'itemNo',
            'unit',
            'retailPrice',
            'allocationPrice',
            'supplyPrice',
            'supplierCode',
            'discount',
            'qty',
            'lockedQty',
            'salableQty',
            'minPack',
            'warehouseName',
            'warehouseAdress',
            'validateTime',
            'updTime',
            'putawayStatus',
            'modelType',
            'stockType',
            'batchNumber',
            'lockingOrderNo',
            'ownerCode',
            'purchaserName',
            'skuNo',
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list4,
            filterVal,
            '调拨库存明细'
          )
          this.downloadLoading = false
        })
      },
      // 供货信息查询
      handleDownload5() {
        this.downloadLoading = true
        for (var i in this.list5) {
          Object.assign(this.list5[i], this.list5[i].mainDTO);
          // delete this.list5[i].mainDTO;
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '商品名称',
            '品牌',
            '标准系列',
            '返点系列',
            '规格型号',
            '订货号',
            '供应商编号',
            '发布数量',
            '已申请数量',
            '可用数量',
            '面价',
            '发布单价',
            '发布折扣',
            '货期',
            '发布总额',
            '最小起订量',
            '发布类型',
            '到货仓库',
            '制单人工号',
            '制单人',
            '渠道类型',
            '发布范围',
            '信息有效期',
            '单据编号',
            '备注',
            '创建时间',
            '商品编码',
          ]
          const filterVal = [
            'skuName',
            'brandName',
            'seriesName',
            'rebateSeries',
            'specifications',
            'itemNo',
            'supplierCode',
            'qty',
            'purchasedQty',
            'canUseQty',
            'retailPrice',
            'price',
            'discount',
            'deliveryDate',
            'amountPrice',
            'moqMinOrder',
            'publishType',
            'warehouseName',
            'crtUserNo',
            'crtUserName',
            'channelType',
            'publishScope',
            'validityPeriod',
            'billNo',
            'note',
            'crtTime',
            'skuNo',
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list5,
            filterVal,
            '供货信息明细'
          )
          this.downloadLoading = false
        })
      },
      // 在途库存导出所有
      handleExport5() {
        this.downloadLoading = true
        purchaseOrderSelectPageByItem({
          page: 1,
          limit: 2000,
          selectType: 7
        })
          .then(response => {
            this.zaituAll = response.data.records
            this.zaituAll.forEach(item => {
              item.notStockInPurchaseAmount = (item.notStockInPurchaseQty * item.taxPrice).toFixed(4)
            })
            for (var i in this.zaituAll) {
              Object.assign(this.zaituAll[i], this.zaituAll[i].mainDTO);
            }
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = [
                '单据编号',
                '单据日期',
                '供应商编号',
                '采购员工号',
                '采购员姓名',
                '采购部门',
                '商品名称',
                '品牌',
                '标准系列',
                '返点系列',
                '型号',
                '订货号',
                '收货仓库',
                '未处理数量',
                '处理数量',
                '可做收货数量',
                '面价',
                '发布单价',
                '处理折扣',
                '价税合计',
                '入库数量',
                '未入库数量',
                '退货数量',
                '入库金额',
                '未入库金额',
                '交货日期',
                '备注',
                '商品编码',
              ]
              const filterVal = [
                'billNo',
                'updTime',
                'supplierCode',
                'purchaserCode',
                'purchaserName',
                'departName',
                'skuName',
                'brandName',
                'seriesName',
                'rebateSeries',
                'specifications',
                'itemNo',
                'warehouseName',
                'applyQty',
                'qty',
                'canGoodsQty',
                'retailPrice',
                'releasePrice',
                'discount',
                'taxAmount',
                'stockInPurchaseQty',
                'notStockInPurchaseQty',
                'returnGoodsQty',
                'stockInPurchaseAmount',
                'notStockInPurchaseAmount',
                'deliverDate',
                'note',
                'skuNo',

              ]
              excel.export_json_to_excel2(
                tHeader,
                this.zaituAll,
                filterVal,
                '在途库存明细'
              )
              this.downloadLoading = false
            })
          })
          .catch(() => {
            this.zaituAll = []
          })
      },
      // 在途库存导出
      handleDownloadzaitu() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '单据编号',
            '供应商编号',
            '采购员工号',
            '采购员姓名',
            '采购部门',
            '商品名称',
            '品牌',
            '系列',
            '型号',
            '订货号',
            '收货仓库',
            '未处理数量',
            '处理数量',
            '可做收货数量',
            '面价',
            '发布单价',
            '处理折扣',
            '价税合计',
            '入库数量',
            '未入库数量',
            '退货数量',
            '入库金额',
            '未入库金额',
            '交货日期',
            '单据日期',
            '备注',
            '商品编码',
          ]
          const filterVal = [
            'billNo',
            'supplierCode',
            'purchaserCode',
            'purchaserName',
            'departName',
            'skuName',
            'brandName',
            'seriesName',
            'specifications',
            'itemNo',
            'warehouseName',
            'applyQty',
            'qty',
            'canGoodsQty',
            'retailPrice',
            'releasePrice',
            'discount',
            'taxAmount',
            'stockInPurchaseQty',
            'notStockInPurchaseQty',
            'returnGoodsQty',
            'stockInPurchaseAmount',
            'notStockInPurchaseAmount',
            'deliverDate',
            'billDate',
            'skuNo',

          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list5,
            filterVal,
            '在途库存明细'
          )
          this.downloadLoading = false
        })
      },
      // 调拨库存导出所有
      handleExportAllot() {
        this.listLoading = true
        page({
          page: 1,
          limit: 2000,
          selectType: 1
        }).then(
          res => {
            for (let i = 0; i < res.data.records.length; i++) {
              //解析发布审核状态
              if (res.data.records[i].billStatus === 0) {
                res.data.records[i].billStatus = '正常'
              } else if (res.data.records[i].billStatus === 1) {
                res.data.records[i].billStatus = '发布审核中'
              } else if (res.data.records[i].billStatus === 2) {
                res.data.records[i].billStatus = '发布驳回'
              } else if (res.data.records[i].billStatus === 3) {
                res.data.records[i].billStatus = '修改审核中'
              } else if (res.data.records[i].billStatus === 4) {
                res.data.records[i].billStatus = '修改驳回'
              }
              if (res.data.records[i].putawayStatus === 1) {
                res.data.records[i].putawayStatus = '下架'
              } else {
                res.data.records[i].putawayStatus = '上架'
              }
            }
            this.allotAll = res.data.records
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = [
                '审核状态',
                '品名',
                '品牌',
                '标准系列',
                '返点系列',
                '规格型号',
                '订货号',
                '计量单位',
                '产品面价',
                '调拨价',
                '供货价',
                '供应商编号',
                '折扣',
                '发布数量',
                '锁定数量',
                '可销售数量',
                '起订量',
                '供货仓库',
                '供货地址',
                '有效期',
                '更新时间',
                '上架状态',
                '型号类型',
                '入库类型',
                '批次号',
                '锁库单号',
                '库存归属人工号',
                '采购',
                '商品编码',
              ]
              const filterVal = [
                'billStatus',
                'name',
                'brandName',
                'seriesName',
                'rebateSeries',
                'specModel',
                'itemNo',
                'unit',
                'retailPrice',
                'allocationPrice',
                'supplyPrice',
                'supplierCode',
                'discount',
                'qty',
                'lockedQty',
                'salableQty',
                'minPack',
                'warehouseName',
                'warehouseAdress',
                'validateTime',
                'updTime',
                'putawayStatus',
                'modelType',
                'stockType',
                'batchNumber',
                'lockingOrderNo',
                'ownerCode',
                'purchaserName',
                'skuNo',
              ]
              excel.export_json_to_excel2(
                tHeader,
                this.allotAll,
                filterVal,
                '调拨库存明细'
              )
              this.listLoading = false
            })
          },
          error => {
            this.$message.error('查询失败' + error.msg)
            this.listLoading = false
          }
        )
      },
      /**
       * 表格导出
       */
      excelTable() {
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = [...this.xzList]
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            list[i].trueAmount = this.accAdd(list[i].supplyPrice, list[i].qty).toFixed(4)
            list[i].salableQty = list[i].qty - list[i].lockedQty
            list[i].dbDiscount = this.division(list[i].releasePrice, list[i].retailPrice)
            list[i].billStatus = Number(list[i].billStatus)
            switch (list[i].billStatus) {
              case 1:
                list[i].billStatus = '暂存'
                break;
              case 2:
                list[i].billStatus = '待审核'
                break;
              case 3:
                list[i].billStatus = '作废'
                break;
              case 4:
                list[i].billStatus = '正常'
                break;
              case 5:
                list[i].billStatus = '驳回'
                break;
            }
          }
          for (let i = 0; i < this.$refs['xzTable'].columns.length; i++) {
            tHeader.push(this.$refs['xzTable'].columns[i].label)
            if (i === 0) {
              filterVal.push('index')
            } else {
              filterVal.push(this.$refs['xzTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '闲置库存明细');
        })
      },
      //文件上传
      handleRemove(file, fileList) {
      },
      beforeUpload(file) {
        const isXLS =
          file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0
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
          this.$message.warning(
            `当前限制选择 1个文件，本次选择了 ${
              files.length
            } 个文件，共选择了 ${files.length + fileList.length} 个文件`
          )
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      /**
       *更新时间选择事件
       */
      handleOneDateSelect(val) {
        this.listQuery.startUpdTime = val[0] + ' 00:00:00'
        this.listQuery.endUpdTime = val[1] + ' 23:59:59'
      },
      /**
       * 创建时间选择事件
       */
      handleTwoDateSelect(val) {
        this.listQuery.startValidateTime = val[0] + ' 00:00:00'
        this.listQuery.endValidateTime = val[1] + ' 23:59:59'
      },

      /**
       * 查询锁库记录
       */
      showLockedQtyRoute(row) {
        //this.$message.warning(row.id)
        this.nowRow = Object.assign({}, row)
        this.isShowLockedRouter = true
      },

      handleClosePublic() {
        this.isShowLockedRouter = false
      },

      lockSort(event) {
        //console.log(event,'777')
        if (event.prop === 'lockedQty') {
          if (event.order === 'descending') {
            this.listQuery.sortType = 0
          } else if (event.order === 'ascending') {
            this.listQuery.sortType = 1
          }
        } else if (event.prop === null) {
          delete this.listQuery.sortType
        }
        this.getList3()

      }
    }
  }
</script>

<style lang="scss">
  .col-required .cell {
    color: rgb(79, 144, 226);
  }

  .goods-stock-query-container {
    .filter-container {
      padding-bottom: 0px;

      .query-visible {
        color: #409eff;
        margin-left: 10px;
        cursor: pointer;
        font-size: 14px;
        position: relative;
        top: -5px;
      }

      .query-container {
        font-size: 14px;
        color: #444;

        .block {
          margin-bottom: 10px;

          span {
            padding-right: 10px;
            color: #999;
          }
        }

        .el-checkbox-group {
          display: inline-block;
        }
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__body {
      padding-top: 10px;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }

    .box-card {
      overflow: auto;
    }

    .pagination-container {
      margin-top: 10px;
    }

    .zaituTable {
      height: 650px !important;
    }
  }

  .title-red {
    color: red;
  }
</style>
                                                      
