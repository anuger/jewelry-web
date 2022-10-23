<template>
  <div>
    <breadcrumb/>
    <div class="main-panel">
      <div class="merchant-edit-panel">
        <div style="width: 600px">
          <a-form-model
              :label-col="{span: 3}"
              :wrapper-col="{span: 12}"
              :model="merchant"
          >
            <a-form-model-item label="商户名">
              <a-input placeholder="请输入商户名" v-model="merchant.merchantName"/>
            </a-form-model-item>
          </a-form-model>
          <a-button class="m-l-8" type="primary" @click="modifyMerchant">保存</a-button>
          <div style="margin-top: 40px; margin-left: 16px; font-size: 14px">
            推广二维码:
          </div>
          <img width="260" src="https://tool.oschina.net/action/qrcode/generate?size=4" />
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
      merchant: {
        merchantName: ''
      }
    }
  },
  methods: {
    modifyMerchant() {
      if (!this.merchant.merchantName) {
        return this.$message.error("商户名不能为空");
      }
      service.modifyMerchantName(this.merchant.merchantName)
      .then(res => {
        if (res.state === 200) {
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  created() {
    service.getMerchant()
    .then(res => {
      if (res.state === 200) {
        this.merchant = res.data.merchant;
      } else {
        this.$message.error(res.message);
      }
    })
  },
  name: "MerchantSetting"
}
</script>

<style scoped>
.merchant-edit-panel {
  margin: 170px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>