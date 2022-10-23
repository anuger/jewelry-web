<template>
  <div>
    <!--    搜索条件-->
    <div class="main-panel">
      <div class="condition-panel">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-search size="small" placeholder="请输入单号" style="width: 200px" v-model="designNo" @search="queryDesign" />
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
            <a-select size="small" style="width: 150px" @change="dealerSelect" placeholder="全部">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option v-for="dealer in dealerList" :key="dealer.id" :value="dealer.id">
                {{dealer.username}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="状态">
            <a-select size="small" style="width: 100px" placeholder="全部" @change="statusSelect">
              <a-select-option value="0">
                全部
              </a-select-option>
              <a-select-option value="1">
                待审核
              </a-select-option>
              <a-select-option value="2">
                待出图
              </a-select-option>
              <a-select-option value="3">
                待审图
              </a-select-option>
              <a-select-option value="4">
                待生产
              </a-select-option>
              <a-select-option value="5">
                待出货
              </a-select-option>
              <a-select-option value="6">
                待寄货
              </a-select-option>
              <a-select-option value="7">
                已完成
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="下单时间">
            <date-range-picker @change="dateChange"></date-range-picker>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!--    内容-->
      <design-table
          :data="designList"
          :page="page"
          @pageChange="pageChange"
          style="margin-top: 40px"
      >
        <div slot="action" slot-scope=" record">
          <a-button v-if="record.isBack === 0" @click="designBack(record.id)" type="link">退货</a-button>
          <a-button v-else disabled type="link">已退货</a-button>
          <a-button type="link" @click="showDetail(record.id)">详情</a-button>
        </div>
      </design-table>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";
export default {
  data() {
    return {
      designNo: '',
      channelId: 0,
      dealerId: 0,
      status: 0,
      page:{},
      beginDate: '',
      endDate: '',
      designList: [],
      channelList: [],
      dealerList: []
    }
  },
  methods: {
    showDetailPage(id) {
      console.log('open detail page ' + id)
      this.$router.push('/order/design/detail')
    },
    designBack(id) {
      service.backDesign(id)
      .then(res => {
        if (res.state === 200) {
          this.$message.success("退货成功");
          this.designList.forEach(it => {
            if (it.id === id) {
              it.isBack = 1
            }
          })
        }
      })
    },
    channelSelect(value) {
      this.channelId = value;
      this.queryDesign();
    },
    dealerSelect(value) {
      this.dealerId = value;
      this.queryDesign();
    },
    statusSelect(value) {
      this.status = value;
      this.queryDesign();
    },
    dateChange(dateArray) {
      this.beginDate = dateArray[0];
      this.endDate = dateArray[1];
      this.queryDesign();

    },
    queryDesign() {
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
      if (this.status != 0) {
        query.status = this.status;
      }
      if (this.beginDate !== '') {
        query.beginDate = this.beginDate;
        query.endDate = this.endDate;
      }
      if (this.page) {
        query.currentPage = this.page.current
      }
      service.queryDesign(query)
          .then(res => {
            if (res.state === 200) {
              this.designList = res.data.designs;
              this.channelList = res.data.channels;
              this.dealerList = res.data.dealers;
              this.page = res.data.page
            } else {
              this.$message.error(res.message);
            }
          });
    },
    showDetail(designId) {
      const router = this.$router.resolve("/design/detail/" + designId)
      window.open(router.href,'_blank')
    },
    pageChange(page) {
      this.page.current = page.current;
      this.queryDesign();
    }
  },
  created() {
    let beginDate = this.$route.query.beginDate;
    let endDate = this.$route.query.endDate;
    let channelId = this.$route.query.channelId;
    let dealerId = this.$route.query.dealerId;
    console.log(beginDate)
    beginDate!== undefined && (this.beginDate = beginDate);
    endDate !== undefined && (this.endDate = endDate);
    channelId !== undefined && (this.channelId = channelId);
    dealerId !== undefined && (this.dealerId = dealerId);
    this.queryDesign();
  },
  name: "DesignQuery",
}
</script>

<style scoped>
.condition-panel {
  display: flex;
}
</style>