<template>
  <div>
    <design-table :data="designList" :page="page">
      <div slot="action" slot-scope="record">
        <a-button type="link" :disabled="!account.userRoles.includes(1)" @click="openModel(record.id, record.estimatePrice, record.specifyDeliveryTime)">审核</a-button>
      </div>
    </design-table>
    <!--          审核弹出窗-->
    <a-modal
        centered
        title="审核订单"
        okText="通过"
        @ok="check"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
    >
      <a-form-model
          :labelCol="{span: 5}"
          :wrapperCol="{span: 10}"
      >
        <a-form-model-item label="预估价">
          <a-input-number v-model="salePrice" aria-placeholder="请输入预估价"></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="出货时间">
          <a-date-picker v-model="deliveryTime" />
        </a-form-model-item>
        <a-form-model-item label="是否起版">
          <a-radio-group v-model="isNeedCad">
            <a-radio :value="1">起版</a-radio>
            <a-radio :value="0">不起版</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";
import moment from "moment";
export default {
  props: {
    designList: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      showModel: false,
      checkDesignId: 0,
      salePrice: 0,
      deliveryTime: '',
      isNeedCad: 1,
      account: JSON.parse(localStorage.getItem("user"))
    }
  },
  watch: {
    $route: function () {
      this.account = JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    openModel(id, estimatePrice,specifyDeliveryTime) {
      // 处理审核
      this.checkDesignId = id;
      this.salePrice = estimatePrice;
      this.deliveryTime = moment(specifyDeliveryTime);
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
    },
    check() {
      if (this.checkDesignId === 0) {
        return this.$message.error("发生错误");
      }
      service.checkCustom(this.checkDesignId, this.salePrice, this.deliveryTime.format("YYYY-MM-DD"), this.isNeedCad)
          .then(res => {
            this.showModel = false;
            if (res.state === 200) {
              this.$emit("getData")
              this.$message.success("审核成功");
            } else {
              this.$message.error(res.message);
            }
          })
    }
  },
  name: "checkWork"
}
</script>

<style scoped>

</style>