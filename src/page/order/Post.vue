<template>
  <div>
    <breadcrumb/>
    <!--    搜索条件-->
    <div class="main-panel">
      <div class="condition-panel">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-search size="small" v-model="designNo" @search="getSendDesign" placeholder="请输入单号"
                            style="width: 200px"/>
          </a-form-model-item>
          <a-form-model-item label="渠道">
            <a-select size="small" style="width: 100px" placeholder="全部" @change="channelSelect">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option v-for="channel in channelList" :key="channel.id" :value="channel.id">
                {{ channel.channelName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="经销商">
            <a-select size="small" style="width: 150px" placeholder="全部" @change="dealerSelect">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option v-for="dealer in dealerList" :key="dealer.id" :value="dealer.id">
                {{ dealer.username }}
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
          <a-button type="link" @click="openSend(record.id, record)">寄货</a-button>
        </div>
      </design-table>
    </div>
    <!--          寄货弹出窗-->
    <a-modal
        centered
        title="寄货"
        okText="提交"
        @ok="send"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
    >
      <a-form-model>
        <a-row>
          <a-col span="12">
            <a-form-model-item required label="售价">
              <a-input-number v-model="sendSalePrice"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="运费">
              <a-input-number v-model="fare"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="包装">
              <a-input-number v-model="packageFee"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="证书">
              <a-input-number v-model="cert"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";
export default {
  data() {

    return {
      designList: [],
      page: {},
      channelList: [],
      dealerList: [],
      designNo: '',
      channelId: 0,
      dealerId: 0,
      beginDate: '',
      endDate: '',
      showModel: false,
      sendDesignId: 0,
      sendSalePrice: 0,
      fare: '',
      packageFee: '',
      cert: ''
    }
  },
  methods: {
    showPost(id) {
      console.log(id)
    },
    channelSelect(value) {
      this.channelId = value;
      this.getSendDesign();
    },
    dealerSelect(value) {
      this.dealerId = value;
      this.getSendDesign();
    },
    dateChange(dateArray) {
      this.beginDate = dateArray[0];
      this.endDate = dateArray[1];
      this.getSendDesign();
    },
    getSendDesign() {
      let query = {}
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
      service.getSendDesign(query)
          .then(res => {
            if (res.state === 200) {
              this.designList = res.data.designs;
              this.channelList = res.data.channels;
              this.dealerList = res.data.dealers;
              this.page = res.data.page
            } else {
              this.$message.error(res.message);
            }
          })
    },
    // 寄货
    closeModel() {
      this.showModel = false;
    },
    openSend(id, design) {
      this.sendDesignId = id;
      this.sendSalePrice = design.salePrice;
      this.showModel = true;
    },
    send() {
      if (this.sendDesignId === 0) {
        return this.$message.error("页面错误");
      }
      if (!this.sendSalePrice) {
        return this.$message.error("请填写售价");
      }
      service.send(this.sendDesignId, this.fare, this.sendSalePrice, this.packageFee, this.cert)
          .then(res => {
            this.showModel = false;
            if (res.state === 200) {
              this.getSendDesign();
              this.$message.success("寄货成功");
            } else {
              this.$message.error(res.message);
            }
          })
    },
  },
  created() {
    this.beginDate ='';
    this.endDate = '';
    this.getSendDesign();
  },
  name: "Post"
}
</script>

<style scoped>

</style>