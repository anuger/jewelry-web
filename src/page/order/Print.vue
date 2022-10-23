<template>
<div class="print-body">
  <div class="no-print">
    <a-button @click="print">打印</a-button>
  </div>
  <div class="print">
      <div class="print-title">商户名称生产单</div>
    <div class="print-sub-title sub-title-text">
      <div>
        <span>工单编号：</span>
        <span></span>
      </div>
      <div>
        <a-checkbox>加急</a-checkbox>
      </div>
    </div>
    <table border="1" cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td width="32%">
          <span class="td-label">商户名称:</span>
          <span>{{order.merchantName}}</span>
        </td>
        <td width="20%">
          <span class="td-label">款型:</span>
          <span>{{order.designClassifyText}}</span>
        </td>
        <td width="25%">
          <span class="td-label">订单编号:</span>
          <span>{{order.designNo}}</span>
        </td>
        <td width="23%">
          <span class="td-label">下单数量:</span>
          <span>{{order.num}}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="td-label">客户名称:</span>
          <span>{{order.clientName}}</span>
        </td>
        <td>
          <span class="td-label">手寸:</span>
          <span>{{order.size}}</span>
        </td>
        <td>
          <span class="td-label">限金重:</span>
          <span></span>
        </td>
        <td>
          <span class="td-label">发单日期:</span>
          <span>{{order.orderTime | dateFormat2}}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="td-label">产品名称:</span>
          <span>{{order.designName}}</span>
        </td>
        <td>
          <span class="td-label">成色:</span>
          <span>{{order.goldClassifyText}}</span>
        </td>
        <td>
          <span class="td-label">客/柜资料:</span>
          <span></span>
        </td>
        <td>
          <span class="td-label">发货日期:</span>
          <span>{{order.specifyDeliveryTime | dateFormat2}}</span>
        </td>
      </tr>
      <tr>
        <td rowspan="2" class="print-main-image">
          <template v-if="order.designImages && order.designImages.length > 0">
            <img class="main-image" :src="order.designImages[0]" />
          </template>
        </td>
        <td style="vertical-align: top; padding-top: 5px">
          <span class="td-label">字印:</span>
          <div>{{order.letteringFontText}}</div>
          <div>{{order.lettering}}</div>
        </td>
        <td colspan="2" style="vertical-align: top; padding-top: 5px">
          <span class="td-label">主石:</span>
          <div>{{order.stoneClassifyText}}</div>
          <div>{{order.stoneSize}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="vertical-align: top; padding-top: 5px">
          <span class="td-label">备注:</span>
          <div>{{order.remark}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="print-desc td-label">其他描述: </td>
      </tr>
    </table>
    <table border="1" cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td colspan="2" class="print-images">
          <div class="image-panel">
            <template v-for="(image, index) in getImage">
            <img :key="index" v-if="index <= 5" :src="image" :style="{maxWidth: getMaxWidth, maxHeight: getMaxWidth}" />
            </template>
          </div>
        </td>
      </tr>
      <tr>
        <td width="10%" class="text-center td-label">备注：</td>
        <td></td>
      </tr>
    </table>
    <div class="print-sub-title" style="margin-top: 12px">
      <div style="display: flex">
        <span>发单:</span>
        <div class="print-input"></div>
      </div>
      <div style="display: flex">
        <span>收货确认:</span>
        <div class="print-input" style="width: 180px"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import service from "@/api/service";
export default {
  data() {
    return {
      order: {
        designImages:[]
      }
    }
  },
  methods: {
    print() {
      window.print()
    },
    getData(designSign) {
      service.getDesignPrintData(designSign)
      .then(res => {
        if (res.state === 200) {
          this.order = res.data.design;
          this.order.merchantName = res.data.merchantName
        } else {
          this.$message.error("订单不存在")
        }
      })
    }
  },
  computed: {
    getImage() {
      let images = [...this.order.designImages];
      return images.reverse();
    },
    getMaxWidth() {
      let size = this.order.designImages.length;
      if (size === 1) {
        return '480px';
      } else if (size <= 6) {
        return '240px';
      }
      return 0;
    }
  },
  created() {
    let designSign = this.$route.query.sign;
    this.getData(designSign)
  },
  name: "Print"
}
</script>

<style scoped>
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  @page {
    size: A4;
    margin: 0;
  }
  .no-print {
    display: none !important;
  }
}
.print-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no-print {
  width: 766px;
  display: flex;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
}

.print {
  width: 766px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.print-title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 500;
}

.print-sub-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.sub-title-text {
  font-weight: 500;
  font-size: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

td {
  text-indent: 4px;
  height: 30px;
  padding: 0 5px;
  text-align: justify;
}

.td-label {
  margin-right: 8px;
  color: #333333;
  font-weight: 500;
}

.print-images{
  height: 500px;
}

.print-main-image {
  height: 245px;
}

.print-desc {
  height: 60px;
}

.text-center {
  text-align: center;
}

.print-input {
  width: 120px;
  border-bottom: 1px black solid;
}

.main-image {
  max-width: 240px;
  max-height: 240px;
}

.image-panel {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: space-around;
}

.image-1 {
  max-width: 250px;
  max-height: 250px;
}

.image-last {
  max-width: 450px;
  max-height: 450px;
}
</style>