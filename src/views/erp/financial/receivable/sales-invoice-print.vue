<template>
  <div class="salesInvoicePrint">
    <!-- 顺丰 -->
    <div v-if="$route.query.deliverType == 1">
      <div v-html="sfHtml"></div>
      <div @click="handlePrint" class="printIcon">
        <div class="btn">
          打印
        </div>
      </div>
    </div>
    <!-- 德邦 -->
    <div v-if="$route.query.deliverType == 2" >
      <div v-html="dbHtml"></div>
      <div @click="handlePrint" class="printIcon">
        <div class="btn">
          打印
        </div>
      </div>
    </div>
    <!-- 韵达 -->
    <div v-if="$route.query.deliverType == 3">
      <el-button type="primary" v-print="'#printTest'" style="margin: 20px 10px"
        >打印</el-button
      >
      <div id="printTest" v-html="htmlText"></div>
    </div>
  </div>
</template>

<script>
import {
  getPrintDataOld,
  getPrintData,
} from "@/api/erp/financial/financialSalesInvoice";
import JsBarcode from "jsbarcode";

export default {
  name: "db-electronic-sheet-print",
  props: ["id"],
  data() {
    return {
      htmlText: "",
      sfHtml:"",
      dbHtml:"",
      orderModel: {
        cargoDetails: {},
        contactInfoList: {},
        rlsInfoDtoList: [],
        cargoInfoDtoList: [],
      },
      printTime: undefined,
      containerWidth: "474px",
      loading: false,
      styleText:
        '<style type="text/css" media="print">\n' +
        "  @page { size: portrait; }\n" +
        "</style>",
    };
  },
  created() {
    this.printTime = new Date()
      .toLocaleString()
      .replace("上午", "")
      .replace("下午", "")
      .replace(/\//g, "-");
    this.electronicSurfaceSingle();
  },
  methods: {
    handlePrint() {
      window.print()
    },
    electronicSurfaceSingle() {
      this.loading = true;
      if (this.$route.query.deliverType == 1) {
        getPrintData(this.$route.query.deliverType, this.$route.query.billNo)
          .then((res) => {
            if (res.code = '2000') {
              this.sfHtml = res.data.html;
              localStorage.setItem('mainBillNo',res.data.mainBillNo)
            } else {
              this.vueMessage("warning", res.data);
              localStorage.removeItem('mainBillNo')
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.$route.query.deliverType == 2) {
        getPrintData(this.$route.query.deliverType, this.$route.query.billNo)
          .then((res) => {
            if (res.code = '2000') {
              this.dbHtml = res.data.html;
              localStorage.setItem('mainBillNo',res.data.mainBillNo)
            } else {
              this.vueMessage("warning", res.data);
              localStorage.removeItem('mainBillNo')
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        getPrintDataOld(
          this.$route.query.deliverType,
          this.$route.query.billNo
        ).then((response) => {
          if(response.code = '2000') {
            this.htmlText = response;
          } else {
            this.vueMessage("warning", response.msg);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.salesInvoicePrint {
  .printIcon {
    width: 472px;
    text-align: center;
    .btn {
      width: 150px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin: 0 auto;
      margin-top: 5px;
      background-color: #35aa47;
      color: #ffffff;
      font-size: 14px;
      border: none;
      cursor: pointer;
    }
  }

}
</style>