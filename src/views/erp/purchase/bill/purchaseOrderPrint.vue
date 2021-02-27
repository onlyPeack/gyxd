<template>
  <div class="contractPrintContainer" :style="{width:containerWidth}">
    <div class="print-box" id="printBox">
      <div class="print-container">
        <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
        <div class="print-title">产品销购合同</div>
        <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
        <div class="print-hr"></div>
        <div class="head">
          <div class="owner">
            <span>甲方：江苏工享创联网络科技有限公司</span>
            <span>合同编号:{{dataForm.billNo}}</span>
          </div>
          <div class="owner">
            <span>乙方：{{dataForm.supplierName}}</span>
            <span class="position">签订地点:苏州</span>
          </div>
        </div>
        <div>一、经双方协定，现甲方向乙方购买以下货物，具体配置、数量、价格和有关条款如下：</div>
        <table border class="topTable" v-if="dataForm.items.length <= 3">
          <tr>
            <td>序号</td>
            <td>品牌</td>
            <td>订货号</td>
            <td>规格型号</td>
            <td>单位</td>
            <td>数量</td>
            <td>单价</td>
            <td>金额</td>
            <td>交货日期</td>
          </tr>
          <tr v-for="(item,index) in dataForm.items" :key="index">
            <td>
              {{index + 1}}
            </td>
            <td>
              {{item.brandName}}
            </td>
            <td>
              {{item.skuNo}}
            </td>
            <td>
              {{item.specifications}}
            </td>
            <td>
              {{item.unit}}
            </td>
            <td>
              {{item.qty}}
            </td>
            <td>
              {{item.taxPrice}}
            </td>
            <td>
              {{item.taxAmount}}
            </td>
            <td>
              {{item.deliverDate}}
            </td>
          </tr>
          <tr>
            <td colspan="7">
              合计
            </td>
            <td colspan="1">
              {{dataForm.taxAmountTotal}}
            </td>
            <td colspan="1">

            </td>
          </tr>
          <tr>
            <td colspan="9">
              合计人民币金额（大写） （包含13%税）: {{dataForm.taxAmountTotalBig}}
            </td>
          </tr>
        </table>
        <div v-else class="tips">
           <table border class="topTable">
          <tr>
            <td>序号</td>
            <td>品牌</td>
            <td>订货号</td>
            <td>规格型号</td>
            <td>单位</td>
            <td>数量</td>
            <td>单价</td>
            <td>金额</td>
            <td>交货日期</td>
          </tr>
          <tr>

          <td>
            1
          </td>
          <td colspan="8" style="text-align:center">详见清单</td>
          </tr>
          <tr>
            <td colspan="7">
              合计
            </td>
            <td colspan="1">
              {{dataForm.taxAmountTotal}}
            </td>
            <td colspan="1">

            </td>
          </tr>
          <tr>
            <td colspan="9">
              合计人民币金额（大写） （包含13%税）: {{dataForm.taxAmountTotalBig}}
            </td>
          </tr>
           </table>
        </div>
        <div class="agreementContent">
          <p>一、仓库地址: 上海市嘉定江桥金园六路319号B栋 收件人: 张晓磊 电话 :17717610618</p>
          <p>二、交货、包装与验收：必须按本合同的交货地址和收件人送货，运费由乙方支付，否则所有货物损失由乙方承担
          ；乙方将货物一次运至交货地点。并于到货前24小时将到货名称、型号、数量、外形尺寸、单重及注意事项等，以书
          面形式通知甲方。产品包装应符合国家标准，以保证产品在运输过程中不受损伤，由于包装不当造成产品在运输过程
          中有任何损坏或丢失，由乙方负责。
          </p>
          <p>三、质量要求技术标准：按照生产厂家出厂标准及承诺，或国家相关标准执行，乙方必须提供产品合格证和相关质量
          保证书等资料。如在收到货之日起 7 天内发生质量问题，乙方无条件换货；如收到货为旧货，乙方应无条件换货；如
          收到货为假货，甲方可按采购额的十倍向乙方进行索赔，最低索赔为人民币壹万元整。</p>
          <p>四、所购工矿器件产品：必须是原装正品。</p>
          <p>五、结算与开具税票：乙方提供正式13%增值税发票。
          </p>
          <p>六、售后服务及保修承诺：在正常使用条件下，产品如有质量问题，免费保修 壹 年。保修期自甲方收到货后起算，质
          量异议期限自收货之日起一年内。
          </p>
          <p>七、违约责任：</p>
          <p>1.乙方不能按期交货，除不可抗拒因素外，乙方应向甲方支付延期交货违约金，每延期一日乙方按合同总金额的5%支
          付甲方；
          </p>
          <p>2.出现违约或经济纠纷，双方协商解决，协商未果则交苏州仲裁委员会仲裁。
          </p>
          <p>
            八、开具税票：乙方应在甲方付全款后一个月将发票开至甲方，如没有及时开出每延期1天按照合同金额的5%进行赔
            偿甲方。
          </p>
          <p>
            九、本合同一式二份具有同等法律效力，经双方签字盖章后（传真件）有效，如果有附件，附件也是本合同不可缺少
            组成部分，具有同等法律效力。本合同履约地为苏州，若双方不能协商达成协议，可依据《中华人民共和国民事诉讼
            法》和《中华人民共和国合同法》的有关规定，向苏州仲裁机构申请仲裁或提起诉讼，诉讼所产生的律师费及相关的
            诉讼费用由违约方承担。
          </p>
        </div>
        <table class="bottomTable">
          <tr>
            <td>甲方</td>
            <td>江苏工享创联网络科技有限公司</td>
            <td>乙方</td>
            <td>{{dataForm.supplierName}}</td>
          </tr>
          <tr>
            <td>
              开户银行
            </td>
            <td>
              中国工商银行股份有限公司吴江经济开发 区支行
            </td>
            <td>
              开户银行
            </td>
            <td>
              {{dataForm.bankName}}
            </td>
          </tr>
          <tr>
            <td>账号</td>
            <td>1102220209200556579 </td>
            <td>账号</td>
            <td>{{dataForm.bankAccount}}</td>
          </tr>
          <tr>
            <td>
              税号
            </td>
            <td>
              91320509MA1YKG9E47
            </td>
            <td>
              税号
            </td>
            <td>
              {{dataForm.taxpayerNumber}}
            </td>
          </tr>
          <tr>
            <td>地址</td>
            <td>吴江经济技术开发区运东大道997号东方海
            悦花园4幢8层807室
            </td>
            <td>
              地址
            </td>
            <td>
              {{dataForm.warehouseAdress}}
            </td>
          </tr>
          <tr>
            <td>电话</td>
            <td>13880651093</td>
            <td>电话</td>
            <td>{{dataForm.linkPhone}}</td>
          </tr>
          <tr>
            <td>传真</td>
            <td></td>
            <td>传真</td>
            <td></td>
          </tr>
          <tr>
            <td>联系人</td>
            <td>{{dataForm.updUserName}}</td>
            <td>联系人</td>
            <td>{{dataForm.linkMan}}</td>
          </tr>
          <tr>
             <td>邮编</td>
            <td></td>
            <td>邮编</td>
            <td></td>
          </tr>
        </table>
        <div style="margin-top:10px">
          有效期:{{dataForm.currentDay}}到{{dataForm.validityDay}}
        </div>
        <div style="margin-top:10px">
          合同日期:{{dataForm.currentDay}}
        </div>
      </div>
      <div v-html="styleText"></div>
    </div>

    <div class="footer-container">
      <!-- <el-button v-print="'#printBox'" type="primary" class="printBtn">打印</el-button> -->
      <div class="printBtn" @click="handlePrint">打印</div>
      <!-- <el-button @click="exportWord" size="small" type="primary" class="printBtn">导出word</el-button> -->
    </div>
    <!-- 清单 -->
    <div v-if="dataForm.items.length > 3" style="margin-top:140px">
      <div class="printList">产品销购清单</div>
       <div class="head">
          <div class="owner">
            <span>甲方：江苏工享创联网络科技有限公司</span>
            <span>合同编号:{{dataForm.billNo}}</span>
          </div>
          <div class="owner">
            <span>乙方：{{dataForm.supplierName}}</span>
            <span>签订地点:苏州</span>
          </div>
        </div>
      <table border class="topTable">
          <tr>
            <td>序号</td>
            <td>品牌</td>
            <td>订货号</td>
            <td>规格型号</td>
            <td>单位</td>
            <td>数量</td>
            <td>单价</td>
            <td>金额</td>
            <td>交货日期</td>
          </tr>
          <tr v-for="(item,index) in dataForm.items" :key="index">
            <td>
              {{index + 1}}
            </td>
            <td>
              {{item.brandName}}
            </td>
            <td>
              {{item.skuNo}}
            </td>
            <td>
              {{item.specifications}}
            </td>
            <td>
              {{item.unit}}
            </td>
            <td>
              {{item.qty}}
            </td>
            <td>
              {{item.taxPrice}}
            </td>
            <td>
              {{item.taxAmount}}
            </td>
            <td>
              {{item.deliverDate}}
            </td>
          </tr>
          <tr>
            <td colspan="7">
              合计
            </td>
            <td colspan="1">
              {{dataForm.taxAmountTotal}}
            </td>
            <td colspan="1">

            </td>
          </tr>
          <tr>
            <td colspan="9">
              合计人民币金额（大写） （包含13%税）: {{dataForm.taxAmountTotalBig}}
            </td>
          </tr>
        </table>
    </div>
  </div>

</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseOrder';
  import {getObj} from '@/api/erp/purchase/supplier/index'
  import "@/styles/print.scss";

  export default {
    name: "purchaseOrderPrint",
    data() {
      return {
        containerWidth: '70%',
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          deliverDate: undefined,
          linkPerson: undefined,
          linkPhone: undefined,
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          currencyId: '1',
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: [],
          taxAmountTotalBig:'',
          currentDay: this.$moment().add(0, 'days').format("YYYY-MM-DD"),
          validityDay:this.$moment().add(1, 'years').format("YYYY-MM-DD"),
        },
        items: [],
        qtyTotal: 0,
        amountTotal: 0,
        taxTotal: 0,
        taxAmountTotal: 0,
        isPortrait: '1',
        hideHeader: false,
        styleText: '<style type="text/css" media="print">\n' + '  @page { size: portrait; }\n' + '</style>'
      };
    },
    created() {
      this.init();
    },
    methods: {
      handlePrint() {
        window.print()
      },
      init() {
        getObj(this.$route.query.supplierId).then(res => {
          this.$set(this.dataForm,'bankName',res.data.bankName)
          this.$set(this.dataForm,'bankAccount',res.data.bankAccount)
          this.$set(this.dataForm,'taxpayerNumber',res.data.taxpayerNumber)
          this.$set(this.dataForm,'warehouseAdress',res.data.warehouseAdress)
          this.$set(this.dataForm,'linkPhone',res.data.linkPhone)
          this.$set(this.dataForm,'linkMan',res.data.linkMan)
        })
        getBill(this.$route.query.id)
          .then(response => {
            this.dataForm = Object.assign(this.dataForm,response.data);
            this.items = response.data.items;
            this.getTotal();
          });
      },
      // 点击导出word
      exportWord: function() {
        let _this = this;
        // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent("input.docx", function(error, content) {
          // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
          // 抛出异常
          if (error) {
            throw error;
          }
          
          // 创建一个JSZip实例，内容为模板的内容
          let zip = new JSZip(content);
          // 创建并加载docxtemplater实例对象
          let doc = new window.docxtemplater().loadZip(zip);
          // 设置模板变量的值
          doc.setData({
            ..._this.dataForm,
            table: _this.tableData
          });
          console.log('doc');
          console.log(doc);
          try {
            // 用模板变量的值替换所有模板变量
            doc.render();
          } catch (error) {
            // 抛出异常
            let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            };
            console.log(JSON.stringify({ error: e }));
            throw error;
          }
          
          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          let out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          });
          // 将目标文件对象保存为目标类型的文件，并命名
          saveAs(out, "报价单.docx");
        });
      },
      getTotal() {
        var qtyTotal = 0;
        var amountTotal = 0;
        var taxTotal = 0;
        var taxAmountTotal = 0;
        for (var i in this.items) {
          if (!isNaN(this.items[i].amount)) {
            amountTotal = this.items[i].amount * 1 + amountTotal;
          }
          if (!isNaN(this.items[i].qty)) {
            qtyTotal = this.items[i].qty * 1 + qtyTotal;
          }
          if (!isNaN(this.items[i].tax)) {
            taxTotal = this.items[i].tax * 1 + taxTotal;
          }
          if (!isNaN(this.items[i].taxAmount)) {
            taxAmountTotal = this.items[i].taxAmount * 1 + taxAmountTotal;
          }
        }
        this.qtyTotal = getFloat(qtyTotal, 2);
        this.amountTotal = getFloat(amountTotal, 2);
        this.taxTotal = getFloat(taxTotal, 2);
        this.dataForm.taxAmountTotal = getFloat(taxAmountTotal, 2);
        // 大写
        this.dataForm.taxAmountTotalBig = this.convertCurrency(this.dataForm.taxAmountTotal)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .contractPrintContainer {
    font-size: 16px;
    margin: 0 auto;
    width: 800px!important;
    .printList {
      text-align: center;
      font-weight: bold;
      margin: 20px 0;
    }
    .tips {
      font-size: 24px;
      font-weight: bold;
      margin-left: 28px;
      margin-top: 12px;
    }
    .footer-container {
      text-align: center;
      margin-top: 0;
    }
    .printBtn {
      width: 150px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      margin: 0 auto;
      margin-top: 5px;
      background-color: #1890ff;
      color: #ffffff;
      font-size: 14px;
      border: none;
    }
    table {
      margin-top: -1px;
      font: 12px "Microsoft YaHei", Verdana, arial, sans-serif;
      border-collapse: collapse;
    }

    table.container {
      width: 11.2cm;
    }

    table td {
      border: 1px solid #000;
    }

    table.nob {
      width: 100%;
    }

    table.nob td {
      border: 0;
    }

    table td.center {
      text-align: center;
    }

    table td.right {
      text-align: right;
    }

    table td.pl {
      padding-left: 5px;
    }
    table td img {
      margin-left: 5px;
      margin-right: 5px;
    }
    .head {
      .owner {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        .position {
          position: relative;
          right: 102px;
        }
      }
    }
    .topTable {
      width: 100%;
      margin: 10px 0;
    }
    .bottomTable {
      margin-top: 10px;
    }
  }
</style>