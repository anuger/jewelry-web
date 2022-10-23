<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="main-panel">
      <a-tabs
          default-active-key="check"
          :animated="false"
          @change="changeTab"
      >
        <a-tab-pane key="check">
          <span slot="tab">
            待审核
            <a-badge :count="notify.customCheckCount" :offset="[-5,-14]"></a-badge>
          </span>
          <check-work :designList="designList" :page="page" @getData="getDesignList(1)"/>
        </a-tab-pane>
        <a-tab-pane key="upload">
          <span slot="tab">
            待出图
            <a-badge :count="notify.customUploadCount" :offset="[-5,-14]"></a-badge>
          </span>
          <upload-work :designList="designList" :page="page" @getData="getDesignList(2)"/>
        </a-tab-pane>
        <a-tab-pane key="produce">
          <span slot="tab">
            待生产
            <a-badge :count="notify.customProduceCount" :offset="[-5,-14]"></a-badge>
          </span>
          <produce-work :designList="designList" :page="page" @getData="getDesignList(4)"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";
import CheckWork from "@/page/order/work/checkWork";
import UploadWork from "@/page/order/work/uploadWork";
import ProduceWork from "@/page/order/work/produceWork";

export default {
  components: {ProduceWork, UploadWork, CheckWork},
  data() {
    return {
      notify: {},
      designList: [],
      page: {}
    }
  },
  methods: {
    getWorkNotify() {
      service.getWorkNotify()
          .then(res => {
            if (res.state === 200) {
              this.notify = res.data;
            } else {
              this.$message.error("获取数据失败");
            }
          })
    },
    getDesignList(status) {
      this.designList = [];
      service.getCustomWork(status)
          .then(res => {
            if (res.state === 200) {
              this.designList = res.data.designs;
              this.page = res.data.page;
              this.getWorkNotify();
            }
          })
    },
    changeTab(key) {
      let status = 1;
      if (key === 'upload') {
        status = 2;
      } else if (key === 'produce') {
        status = 4;
      }
      this.getDesignList(status);
    }
  },
  created() {
    this.getDesignList(1);
  },
  name: "CustomWork"
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