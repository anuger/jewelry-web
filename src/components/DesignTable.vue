<template>
  <a-table
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :scroll="{ x: '100%' }"
      :pagination="page"
      @change="change"
  >
    <span slot="designImages" slot-scope="value">
      <viewer :images="value">
      <img style="object-fit:scale-down" width="80" height="80" v-for="(image,index) in value" v-show="index === 0"
           :key="image" :src="image"/>

      </viewer>
    </span>
    <span slot="designNo" slot-scope="value, record">
      <a @click="showDetail(record.id)">{{ value }}</a>
    </span>
    <span slot="workDate" slot-scope="value, record">
      <span class="work-date"
           v-if="record.status === 7">
        {{ getWorkDate(record) }}
      </span>
      <span class="work-date"
            v-else
            :style="{backgroundColor: getWorkDate(record) >= 15 && record.status !== 7 ? 'red' : '#01C9CF'}">
        {{ getWorkDate(record) }}
      </span>
    </span>
    <span slot="statusText" slot-scope="value, record">
      <span v-if="record.status === 22">
        <a-tooltip :title="record.rejectReason" trigger="click">
          <a-button size="small" type="link">
            <span style="color: red">{{ value }}</span>
          <a-icon type="question-circle" style="margin-left: 2px; color: red"/>
          </a-button>
        </a-tooltip>
      </span>
      <span v-else>
        {{ value }}
      </span>
    </span>
    <span slot="orderTime" slot-scope="value">
      {{ value | dateFormat }}
    </span>
    <span slot="deliveryTime" slot-scope="value, record">
      {{ record.status === 7 ? record.actualDeliveryTime : value | dateFormat }}
    </span>
    <span slot-scope="value" slot="remark">
      {{ value === '' ? '-' : value }}
    </span>
    <span slot="action" slot-scope="value, record">
      <slot name="action" v-bind="record"></slot>
    </span>
  </a-table>
</template>

<script>
import moment from "moment";

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {
        return {
          current: 2,
          total: 20,
          pageSize: 12
        }
      }
    }
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      columns: [
        {
          title: '款式图',
          dataIndex: 'designImages',
          key: 'designImages',
          width: 100,
          fixed: 'left',
          scopedSlots: {customRender: 'designImages'}
        },
        {
          title: '单号',
          dataIndex: 'designNo',
          key: 'designNo',
          fixed: 'left',
          width: 120,
          scopedSlots: {customRender: "designNo"}
        },
        {
          title: '渠道',
          dataIndex: 'channelName',
          key: 'channelName',
          fixed: 'left',
          width: 120
        },
        {
          title: '经销商',
          dataIndex: 'dealerName',
          key: 'dealerName',
          fixed: 'left',
          width: 100
        },
        {
          title: '收货人',
          dataIndex: 'clientName',
          key: 'clientName',
          width: 100
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width: 107
        },
        {
          title: '售价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: 107
        },
        {
          title: '工期',
          dataIndex: 'workDate',
          key: 'workDate',
          width: 107,
          scopedSlots: {customRender: 'workDate'}
        },
        {
          title: '状态',
          dataIndex: 'statusText',
          key: 'statusText',
          width: 120,
          scopedSlots: {customRender: 'statusText'}
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
          key: 'orderTime',
          width: 200,
          scopedSlots: {customRender: 'orderTime'}

        },
        {
          title: '寄货时间',
          dataIndex: 'specifyDeliveryTime',
          key: 'specifyDeliveryTime',
          width: 200,
          scopedSlots: {customRender: 'deliveryTime'}

        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 237,
          scopedSlots: {customRender: 'remark'}
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: {customRender: 'action'}
        }
      ]
    }
  },
  methods: {
    showDetail(designId) {
      const router = this.$router.resolve("/design/detail/" + designId)
      window.open(router.href, '_blank')
    },
    change(page) {
      this.$emit("pageChange", page)
    },
    getWorkDate(designOrder) {
      let orderTime = moment(designOrder.orderTime);
      let endTime = moment();
      if (designOrder.status === 7) {
        endTime = moment(designOrder.actualDeliveryTime);
      }
      console.log(designOrder)
      console.log(orderTime.format(this.dateFormat) + "------" + endTime.format(this.dateFormat))
      let result = endTime.diff(orderTime, 'days')
      return result === 0 ? 1 : result;
    }
  },
  name: "DesignTable"
}
</script>

<style scoped>
.work-date {
  width: 40px;
  height: 40px;
  display: flex;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: green;
}
</style>