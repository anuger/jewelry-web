<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="main-panel">
      <a-tabs
          default-active-key="check"
          :animated="false"
      >
        <a-tab-pane key="check" tab="待审核">
          <design-table :data="designList" :page="page">
            <div slot="action" slot-scope="record">
              <a-button type="link" @click="openCheck(record.id, record.estimatePrice, record.specifyDeliveryTime)">审核</a-button>
            </div>
          </design-table>
          <!--          审核弹出窗-->
          <a-modal
              centered
              title="审核订单"
              okText="通过"
              @ok="check()"
              @cancel="checkModel = false"
              :visible="checkModel"
              :maskClosable="false"
          >
            <a-form-model
                :labelCol="{span: 5}"
                :wrapperCol="{span: 10}"
            >
              <a-form-model-item label="售价">
                <a-input-number v-model="salePrice" aria-placeholder="请输入售价"></a-input-number>
              </a-form-model-item>
              <a-form-model-item label="出货时间">
                <a-date-picker v-model="deliveryTime" />
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";
import moment from "moment";
export default {
  data() {
    return {
      checkModel: false,
      designList: [],
      page: {},
      designOrderId: 0,
      salePrice: 0,
      deliveryTime: ''
    }
  },
  methods: {
    getDesignList() {
      service.getTemplateWork()
          .then(res => {
            if (res.state === 200) {
              this.designList = res.data.designs;
              this.page = res.data.page;
            }
          })
    },
    openCheck(id, estimatePrice, specifyDeliveryTime) {
      // 处理审核
      this.salePrice = estimatePrice;
      this.deliveryTime = moment(specifyDeliveryTime);
      this.designOrderId = id;
      this.checkModel = true;
    },
    check() {
      if (this.designOrderId === 0) {
        return this.$message.error("发生错误")
      } else {
        service.checkTemplate(this.designOrderId, this.salePrice, this.deliveryTime.format("YYYY-MM-DD"))
            .then(res => {
              this.checkModel = false;
              if (res.state === 200) {
                this.$message.success("审核成功");
                this.getDesignList();
              } else {
                this.$message.error(res.message)
              }
            })
      }
    }
  },
  created() {
    this.getDesignList();
  },
  name: "BatchWork"
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
  background-color: #6286e8;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>