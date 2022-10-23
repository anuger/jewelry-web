<template>
  <div>
    <!--  待处理事项-->
    <div class="index-worker">
      <!--      todo 替换成卡片组件-->
      <div
          class="data-panel"
          @click="gotoWorkPage(1)"
      >

        <a-statistic
            :style="{ cursor: 'pointer' }"
            title="待审核"
            :value="todo.templateCheckCount + todo.customCheckCount"
        />
      </div>
      <div
          class="data-panel"
          @click="gotoWorkPage(2)"
      >
        <a-statistic
            :style="{ cursor: 'pointer' }"
            title="待出图"
            :value="todo.customUploadCount"
        />
      </div>
      <div
          class="data-panel"
          @click="gotoWorkPage(3)"
      >
        <a-statistic
            :style="{ cursor: 'pointer' }"
            title="待生产"
            :value="todo.customProduceCount"
        />
      </div>
      <div class="data-panel">
        <a-statistic
            :style="{ cursor: 'pointer' }"
            title="超期"
            :value="todo.overdueCount"
        />
      </div>
    </div>
    <!--  经销商下单统计-->
    <div class="statistic-panel">
      <div class="statistic-title">经销商下单统计</div>
      <div class="m-t-8">
        <span class="m-r-4">日期:</span>
        <date-range-picker @change="onOrderDateChange">
        </date-range-picker>
      </div>
      <a-table
          rowKey="id"
          :columns="orderColumns"
          :data-source="orderData"
          :style="{ marginTop: '30px' }"
          :pagination="false"
      >
      <span slot="action" slot-scope="value, record">
        <a-button type="link" @click="showDataDetail(record)">详情</a-button>
      </span>
      </a-table>
    </div>
    <!--    渠道下单统计-->
    <div class="statistic-panel">
      <div class="statistic-title">渠道下单统计</div>
      <div class="m-t-8">
        <span class="m-r-4">日期:</span>
        <date-range-picker @change="onChannelDateChange">
        </date-range-picker>
      </div>
      <a-table
          rowKey="id"
          :columns="channelColumns"
          :data-source="channelData"
          :style="{ marginTop: '30px' }"
          :pagination="false"
      >
      <span slot="action" slot-scope="value, record">
        <a-button type="link" @click="showChannelDetail(record)">详情</a-button>
      </span>
      </a-table>
    </div>
    <!--    产品排名-->
    <div class="statistic-panel">
      <div class="statistic-title">产品排名</div>
      <div class="m-t-8">
        <span class="m-r-4">日期:</span>
        <date-range-picker @change="onRankDateChange">
        </date-range-picker>
        <span class="m-r-4 m-l-10">类别:</span>
        <a-select size="small" style="width: 100px" defaultValue="1" @change="designTypeSelect">
          <a-select-option value="1">定制</a-select-option>
          <a-select-option value="2">非定制</a-select-option>
        </a-select>
      </div>
      <a-table
          rowKey="id"
          :columns="rankColumns"
          :data-source="rankData"
          :style="{ marginTop: '30px' }"
          :pagination="false"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    return {
      orderDate: ["", ''],
      channelDate: ["", ''],
      rankDate: ["", ''],
      designType: 1,
      orderColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 94,
          customRender: (value, record, index) => index + 1
        },
        {
          title: '经销商',
          dataIndex: 'dealerName',
          key: 'dealerName',
          width: 258,
          sorter: (a, b) => a.dealerName.localeCompare(b.dealerName, 'zh-Hans-CN', {sensitivity: 'accent'})
        },
        {
          title: '下单数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 258,
          sorter: (a, b) => a.orderCount > b.orderCount
        },
        {
          title: '售价',
          dataIndex: 'totalSalePrice',
          key: 'totalSalePrice',
          width: 300,
          sorter: (a, b) => a.totalSalePrice > b.totalSalePrice
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 147,
          scopedSlots: {customRender: 'action'}
        }
      ],
      channelColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 94,
          customRender: (value, record, index) => index + 1
        },
        {
          title: '渠道名',
          dataIndex: 'channelName',
          key: 'channelName',
          width: 258,
          sorter: (a, b) => a.channelName.localeCompare(b.channelName, 'zh-Hans-CN', {sensitivity: 'accent'})
        },
        {
          title: '下单数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 258,
          sorter: (a, b) => a.orderCount > b.orderCount
        },
        {
          title: '售价',
          dataIndex: 'totalSalePrice',
          key: 'totalSalePrice',
          width: 300,
          sorter: (a, b) => a.totalSalePrice > b.totalSalePrice
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 147,
          scopedSlots: {customRender: 'action'}
        }
      ],
      rankColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 94,
          customRender: (value, record, index) => index + 1
        },
        {
          title: '名称',
          dataIndex: 'designName',
          key: 'designName',
          width: 258
        },
        {
          title: '下单数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 258
        },
        {
          title: '预估价',
          dataIndex: 'totalSalePrice',
          key: 'totalSalePrice',
          width: 300
        }
      ],
      todo: {
        templateCheckCount: '',
        customCheckCount: '',
        customUploadCount: '',
        customProduceCount: '',
        overdueCount: ''
      },
      orderData: [],
      channelData: [],
      rankData: []
    }
  },
  methods: {
    onOrderDateChange(value) {
      this.orderDate = value;
      this.getDealerOrder();
    },
    onChannelDateChange(value) {
      this.channelDate = value;
      this.getChannelOrder();
    },
    onRankDateChange(value) {
      this.rankDate = value;
      this.getSaleRank();
    },
    showDataDetail(record) {
      this.$router.push("/order/query?beginDate=" + this.orderDate[0] + "&endDate=" + this.orderDate[1] + "&dealerId=" + record.dealerId)
    },
    showChannelDetail(record) {
      this.$router.push("/order/query?beginDate=" + this.channelDate[0] + "&endDate=" + this.channelDate[1] + "&channelId=" + record.channelId)
    },
    gotoWorkPage(type) {
      this.$router.push('/order/custom/work?type=' + type)
    },
    designTypeSelect(value) {
      this.designType = value;
      this.getSaleRank();
    },
    getTodo() {
      service.getTodo()
          .then(res => {
            if (res.state === 200) {
              this.todo = res.data;
            } else {
              this.$message.error(res.message)
            }
          })
    },
    getDealerOrder() {
      service.getDealerOrder(this.orderDate[0], this.orderDate[1])
          .then(res => {
            if (res.state === 200) {
              this.orderData = res.data.statistics;
            } else {
              this.$message.error(res.message);
            }
          })
    },
    getChannelOrder() {
      service.getChannelOrder(this.channelDate[0], this.channelDate[1])
          .then(res => {
            if (res.state === 200) {
              this.channelData = res.data.statistics;
            } else {
              this.$message.error(res.message);
            }
          })
    },
    getSaleRank() {
      service.getSaleRank(this.designType, this.rankDate[0], this.rankDate[1])
          .then(res => {
            if (res.state === 200) {
              this.rankData = res.data.statistics;
            } else {
              this.$message.error(res.message);
            }
          })
    }
  },
  created() {
    this.getTodo();
    this.getDealerOrder();
    this.getChannelOrder();
    this.getSaleRank();
  },
  name: "Index"
}
</script>

<style scoped>
.index-worker {
  height: 100px;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 8px;
}

.data-panel {
  width: 230px;
  height: 80px;
  border: 1px solid #D7D7D7;
  padding: 0 0 0 14px;
  font-size: 12px;
  margin-left: 10px;
}

.data-panel div {
  font-size: 24px;
  font-weight: 400;
  margin-top: 7px;
}

.statistic-panel {
  background-color: white;
  padding: 24px;
  margin-top: 16px;
}

.statistic-title {
  font-size: 14px;
  font-weight: 600;
}
</style>