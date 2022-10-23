<template>
  <div>
    <breadcrumb/>
    <!--    搜索条件-->
    <div class="main-panel">
      <div class="condition-panel">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-search size="small" @search="getCostList" v-model="designNo" placeholder="请输入单号"
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
          <a-form-model-item label="客户名">
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
          <a-button type="link" @click="openCost(record.id)">编辑成本</a-button>
        </div>
      </design-table>
    </div>
    <a-modal
        centered
        title="编辑成本"
        okText="提交"
        @ok="submit"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
        width="787px"
    >
      <a-table :columns="columns" :data-source="costs" :pagination="false">
        <!--        类型-->
        <div slot="costTypeText" slot-scope="value, record, index">
          <span v-if="!record.editable">{{ value }}</span>
          <a-select v-else :defaultValue="record.costTypeText" @change="costTypeSelect($event, index)"
                    style="width: 100px" placeholder="请选择">
            <a-select-option value="2">配石</a-select-option>
            <a-select-option value="3">配件</a-select-option>
            <a-select-option value="4">包装</a-select-option>
            <a-select-option value="5">运费</a-select-option>
          </a-select>
        </div>
        <!--        名称-->
        <div key="costName" slot="costName" slot-scope="value, record">
          <span v-if="!record.editable">{{ value === '' ? '-' : value }}</span>
          <a-input v-else v-model="record.costName"></a-input>
        </div>
        <!--        价格-->
        <div slot="costFee" slot-scope="value, record">
          <span v-if="!record.editable">{{ value }}</span>
          <a-input-number v-else v-model="record.costFee"></a-input-number>
        </div>
        <!--        备注-->
        <div slot="remark" slot-scope="value, record">
          <span v-if="!record.editable">{{ value === '' ? '-' : value }}</span>
          <a-input v-else v-model="record.remark"></a-input>
        </div>
        <!--        操作-->
        <div slot="action" slot-scope="value, record, index">
          <template v-if="record.editable">
            <a-button size="small" type="link" @click="saveCost(index)">保存</a-button>
            <a-button size="small" type="link" @click="handlerCancel(index)">取消</a-button>
          </template>
          <template v-else>
            <a-button size="small" type="link" @click="handlerEdit(record.id)">编辑</a-button>
            <a-button size="small" type="link" @click="removeCost(index)">删除</a-button>
          </template>
        </div>
        <a-button slot="footer" type="dashed" style="width: 100%" @click="addCostCol">
          <a-icon type="plus"/>
          添加
        </a-button>
      </a-table>
    </a-modal>
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
      beginDate: '',
      endDate: '',
      designList: [],
      page: {},
      channelList: [],
      dealerList: [],
      showModel: false,
      costs: [],
      cacheCosts: {},
      columns: [
        {
          title: "类型",
          dataIndex: "costTypeText",
          width: "10%",
          scopedSlots: {customRender: "costTypeText"}
        },
        {
          title: "名称",
          dataIndex: "costName",
          width: "15%",
          scopedSlots: {customRender: 'costName'}
        },
        {
          title: "价格",
          dataIndex: "costFee",
          width: "15%",
          scopedSlots: {customRender: 'costFee'}
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: "25%",
          scopedSlots: {customRender: 'remark'}
        },
        {
          title: "操作",
          dateIndex: "action",
          width: "20%",
          scopedSlots: {customRender: 'action'}
        }
      ],
      costDesignId: 0
    }
  },
  methods: {
    channelSelect(value) {
      this.channelId = value;
      this.getCostList();
    },
    dealerSelect(value) {
      this.dealerId = value;
      this.getCostList();
    },
    dateChange(dateArray) {
      this.beginDate = dateArray[0];
      this.endDate = dateArray[1];
      this.getCostList();
    },
    getCostList() {
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
      service.getCostList(query)
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
    // 成本
    closeModel() {
      this.showModel = false;
    },
    openCost(id) {
      this.costDesignId = id;
      service.getCosts(id)
          .then(res => {
            if (res.state === 200) {
              this.costs = res.data.costs;
              this.showModel = true;
            } else {
              this.$message.error(res.message)
            }
          })
    },
    costTypeSelect(value, index) {
      this.costs[index].costType = value;
      value == 2 &&   (this.costs[index].costTypeText = '配石' )
      value == 3 &&   (this.costs[index].costTypeText = '配件' )
      value == 4 &&   (this.costs[index].costTypeText = '包装' )
      value == 5 &&   (this.costs[index].costTypeText = '运费' )
    },
    handlerEdit(id) {
      const newCost = [...this.costs];
      newCost.forEach(it => {
        if (it.id === id) {
          this.cacheCosts[id] = {...it};
          it.editable = true;
        }
      });
      this.costs = newCost;
    },
    handlerCancel(index) {
      if (this.costs[index].id === 0) {
        this.costs.splice(index, 1);
      } else {
        const newCosts = [...this.costs];
        newCosts[index] = {...this.cacheCosts[this.costs[index].id]};
        newCosts[index].editable = false;
        this.costs = newCosts;
      }
    },
    addCostCol() {
      const newCost = {
        id: 0,
        costTypeText: '',
        costType: 0,
        costFee: '',
        remark: '',
        editable: true
      }
      this.costs = [...this.costs, newCost];
    },
    submit() {
      this.showModel = false;
    },
    saveCost(index) {
      const cost = this.costs[index]
      if (this.costDesignId === 0) {
        return this.$message.error("页面错误");
      }
      if (cost.costType === 0) {
        return this.$message.error("请选择付款类型");
      }
      if (cost.costFee === '') {
        return this.$message.error("请填写付款金额");
      }
      let data = {...cost};
      if (data.id === 0) {
        service.addCost(data, this.costDesignId)
            .then(res => {
              if (res.state === 200) {
                data.id = res.data.costId;
                data.editable = false;
                const newCosts = [...this.costs];
                newCosts[index] = data;
                this.costs = newCosts;
              } else {
                this.$message.error(res.message);
              }
            })
      } else {
        service.modifyCost(data.id, data)
            .then(res => {
              if (res.state === 200) {
                data.editable = false;
                const newCosts = [...this.costs];
                newCosts[index] = data;
                this.costs = newCosts;
              } else {
                this.$message.error(res.message)
              }
            })
      }
    },
    removeCost(index) {
      const costId = this.costs[index].id;
      service.removeCost(costId)
          .then(res => {
            if (res.state === 200) {
              this.costs.splice(index, 1);
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  created() {
    this.getCostList();
  },
  name: "Cost"
}
</script>

<style scoped>

</style>