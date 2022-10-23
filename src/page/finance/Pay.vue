<template>
  <div>
    <breadcrumb/>
    <!--    搜索条件-->
    <div class="main-panel">
      <div class="condition-panel">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-search @search="getPayList" size="small" placeholder="请输入单号" v-model="designNo"
                            style="width: 200px"/>
          </a-form-model-item>
          <a-form-model-item label="渠道">
            <a-select size="small" style="width: 100px" placeholder="全部" @change="channelSelect">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option v-for="channel in channelList" :key="channel.id" :value="channel.id">
                {{channel.channelName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="经销商">
            <a-select size="small" style="width: 150px" placeholder="全部" @change="dealerSelect">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option v-for="dealer in dealerList" :key="dealer.id" :value="dealer.id">
                {{dealer.username}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="下单时间">
            <date-range-picker @change="dateChange"></date-range-picker>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!--    内容-->
      <design-table :data="designList" :page="page" style="margin-top: 40px">
        <div slot="action" slot-scope="record">
          <a-button type="link" :disabled="!account.userRoles.includes(4)" @click="openPayFinal(record.id)">付尾款</a-button>
        </div>
      </design-table>
    </div>
    <a-modal
        centered
        title="付尾款"
        okText="提交"
        @ok="payFinalFee"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
    >
      <a-form-model>
        <a-form-model-item required label="付款截图">
          <a-upload
              list-type="picture-card"
              :customRequest="uploadImage"
              @preview="handlePreview"
              :fileList="fileList"
              @change="fileChange"
          >
            <div v-if="fileList.length < 2">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img :src="previewImage" alt="付款截图"/>
          </a-modal>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="remark" placeholder="请输入备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  data() {
    return {
      designNo: '',
      channelId: 0,
      dealerId: 0,
      beginDate: '',
      endDate: '',
      channelList: [],
      dealerList: [],
      designList: [],
      page: {},
      showModel: false,
      previewVisible: false,
      previewImage: '',
      payDesignId: 0,
      fileList: [],
      remark: '',
      account: JSON.parse(localStorage.getItem("user"))
    }
  },
  watch: {
    $route: function () {
      this.account = JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    showPayLastFee(id) {
      console.log(id)
    },
    channelSelect(value) {
      this.channelId = value;
      this.getPayList();
    },
    dealerSelect(value) {
      this.dealerId = value;
      this.getPayList();
    },
    dateChange(dateArray) {
      this.beginDate = dateArray[0];
      this.endDate = dateArray[1];
      this.getPayList();
    },
    getPayList() {
      let query = {};
      if (this.designNo !== '') {
        query.designNo = this.designNo;
      }
      if (this.channelId != 0) {
        query.channelId = this.channelId;
      }
      if (this.dealerId != 0) {
        query.dealerId = this.dealerId;
      }
      if (this.beginDate !== '') {
        query.beginDate = this.beginDate;
        query.endDate = this.endDate;
      }
      service.getPayList(query)
          .then(res => {
            if (res.state === 200) {
              this.designList = res.data.designs;
              this.page = res.data.page;
              this.channelList = res.data.channels;
              this.dealerList = res.data.dealers;
            } else {
              this.$message.error(res.message);
            }
          })
    },
    // 付尾款相关
    closeModel() {
      this.showModel = false;
    },
    payFinalFee() {
      if (this.payDesignId === 0) {
        return this.$message.error("页面错误");
      }
      if (this.fileList.length === 0) {
        return this.$message.error("请上传付款截图");
      }
      let payImages = this.fileList.map(it => {
        return it.response.imageUrl;
      })
      service.addFinalFee(this.payDesignId, payImages, this.remark)
      .then(res => {
        this.showModel = false;
        if (res.state === 200) {
          this.getPayList();
          this.$message.success("提交成功");
        } else {
          this.$message.error("提交失败");
        }
      });
    },
    openPayFinal(id) {
      this.payDesignId = id;
      this.fileList = [];
      this.remark = '';
      this.showModel = true;
    },
    uploadImage(data) {
      let formData = new FormData();
      formData.append('file', data.file)
      service.uploadImage(formData)
          .then(res => {
            if (res.state === 200) {
              data.onSuccess(res.data)
            } else {
              data.onError();
            }
          })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.imageUrl) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.imageUrl || file.preview;
      this.previewVisible = true;
    },
    fileChange({fileList}) {
      this.fileList = fileList;
    },
  },
  created() {
    this.getPayList();
  },
  name: "Pay"
}
</script>

<style scoped>

</style>