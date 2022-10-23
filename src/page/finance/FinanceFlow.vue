<template>
  <div>
      <!--      总览-->
      <div class="index-worker">
        <!--      todo 替换成卡片组件-->
        <div class="data-panel">
          <a-statistic
              :style="{ cursor: 'pointer' }"
              title="未付款"
              :value="statistic.unPayFee"
          />
        </div>
        <div class="data-panel">
          <a-statistic
              :style="{ cursor: 'pointer' }"
              title="未付定金"
              :value="statistic.unPayDepositFee"
          />
        </div>
        <div class="data-panel">
          <a-statistic
              :style="{ cursor: 'pointer' }"
              title="未付款寄货数"
              :value="statistic.unPaySendCount"
          />
        </div>
      </div>
      <!--    渠道待付款-->
      <div class="statistic-panel">
        <div class="statistic-title">渠道待付款</div>
        <div class="m-t-8">
          <span class="m-r-4">日期:</span>
          <date-range-picker :vaule="[channelBeginDate, channelEndDate]" @change="onChannelPayableChange">
          </date-range-picker>
        </div>
        <a-table
            rowKey="id"
            :columns="channelPayableColumn"
            :data-source="channelPayableData"
            :style="{ marginTop: '30px' }"
            :pagination="false"
        >
        </a-table>
      </div>
      <!--      客户待付款-->
      <div class="statistic-panel">
        <div class="statistic-title">经销商待付款</div>
        <div class="m-t-8">
          <span class="m-r-4">日期:</span>
          <date-range-picker :vaule="[dealerBeginDate, dealerEndDate]" @change="onClientPayableChange">
          </date-range-picker>
        </div>
        <a-table
            rowKey="id"
            :columns="clientPayableColumn"
            :data-source="dealerPayableData"
            :style="{ marginTop: '30px' }"
            :pagination="false"
        >
        </a-table>
      </div>
      <!--  流水 -->
<!--      <div class="statistic-panel">-->
<!--        <div class="statistic-title">流水</div>-->
<!--        <a-table-->
<!--            rowKey="id"-->
<!--            :columns="payListColumn"-->
<!--            :data-source="payList"-->
<!--            :style="{ marginTop: '30px' }"-->
<!--            :pagination="false"-->
<!--        >-->
<!--        </a-table>-->
<!--      </div>-->
    </div>
</template>

<script>
import service from "@/api/service";
export default {
  data() {
    return {
      channelPayableColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 100,
          customRender: (value, record, index) =>{ return index + 1 }
        },
        {
          title: '渠道',
          dataIndex: 'channelName',
          key: 'channelName',
          width: 150
        },
        {
          title: '待付单数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 150
        },
        {
          title: '待付款',
          dataIndex: 'unPayFee',
          key: 'unPayFee',
          width: 150
        }
      ],
      clientPayableColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 100,
          customRender: (value, record, index) => index + 1
        },
        {
          title: '经销商',
          dataIndex: 'dealerName',
          key: 'dealerName',
          width: 150
        },
        {
          title: '待付单数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 150
        },
        {
          title: '待付款',
          dataIndex: 'unPayFee',
          key: 'unPayFee',
          width: 150
        }
      ],
      // payListColumn: [
      //   {
      //     title: '序号',
      //     dataIndex: 'index',
      //     key: 'index',
      //     width: 100
      //   },
      //   {
      //     title: '工单编号',
      //     dataIndex: 'designNo',
      //     key: 'designNo',
      //     width: 150
      //   },
      //   {
      //     title: '类型',
      //     dataIndex: 'payType',
      //     key: 'payType',
      //     width: 100
      //   },
      //   {
      //     title: '客户',
      //     dataIndex: 'clientName',
      //     key: 'clientName',
      //     width: 150
      //   },
      //   {
      //     title: '金额',
      //     dataIndex: 'fee',
      //     key: 'fee',
      //     width: 150
      //   },
      //   {
      //     title: '备注',
      //     dataIndex: 'remark',
      //     key: 'remark',
      //     width: 250
      //   },
      //   {
      //     title: '添加时间',
      //     dataIndex: 'addTime',
      //     key: 'addTime',
      //     width: 200
      //   }
      // ],
      channelPayableData: [],
      dealerPayableData: [],
      // payList: [
      //   {
      //     index: 1,
      //     id: 1,
      //     payType: '定金',
      //     designNo: 'st2342',
      //     clientName: '张三',
      //     fee: 123.23,
      //     remark: '没有备注',
      //     addTime: '2020-12-12 12:00'
      //   }
      // ],
      statistic: {},
      dealerBeginDate: '',
      dealerEndDate: '',
      channelBeginDate: '',
      channelEndDate: ''
    }
  },
  methods: {
    onChannelPayableChange(dateArray) {
      this.channelBeginDate = dateArray[0];
      this.channelEndDate = dateArray[1];
      this.getChannelStatistics();
    },
    onClientPayableChange(dateArray) {
      this.dealerBeginDate = dateArray[0];
      this.dealerEndDate = dateArray[1];
      this.getDealerStatistics();
    },
    getFinanceStatistics() {
      service.getFinanceStatistics()
      .then(res => {
        if (res.state === 200) {
          this.statistic = res.data
        } else {
          this.$message.error(res.message);
        }
      })
    },
    getDealerStatistics() {
      service.getDealerStatistics(this.dealerBeginDate, this.dealerEndDate)
      .then(res => {
        if (res.state === 200) {
          this.dealerPayableData = res.data.statistics;
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getChannelStatistics() {
      service.getChannelStatistics(this.channelBeginDate, this.channelEndDate)
          .then(res => {
            if (res.state === 200) {
              this.channelPayableData = res.data.statistics;
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  created() {
    this.getFinanceStatistics();
    this.getDealerStatistics();
    this.getChannelStatistics();
  },
  name: "FinanceFlow"
}
</script>

<style scoped>
.index-worker {
  height: 100px;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 16px;
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