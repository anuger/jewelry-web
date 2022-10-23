<template>
  <div>
    <breadcrumb/>
    <!--    搜索条件-->
    <div class="main-panel">
      <div class="condition-panel">
        <a-form-model layout="inline">
          <a-form-model-item>
            <a-input-search v-model="designNo" @search="getDeliveryDesign" size="small" placeholder="请输入单号"
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
          <a-button type="link" :disabled="!account.userRoles.includes(3)" @click="openDelivery(record.id)">出货
          </a-button>
        </div>
      </design-table>
    </div>
    <!--    弹出窗-->
    <a-modal
        centered
        title="工厂出货"
        okText="提交"
        :visible="showModel"
        :maskClosable="false"
        width="878px"
    >
      <div style="height: 600px; overflow-y: auto">
        <a-form-model layout="horizontal" :label-col="{span: 7}" :wrapper-col="{span: 4}">
          <a-row class="delivery-label">
            金费
          </a-row>
          <a-row>
            <a-col span="8">
              <a-form-model-item label="总货重" :label-col="{span: 7}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.totalWeight"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col span="8">
              <a-form-model-item label="净金重" :label-col="{span: 8}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.netWeight"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col span="8">
              <a-form-model-item label="耗率" :label-col="{span: 7}" :wrapper-col="{span: 4}">
                <a-input-number
                    v-model="factoryDelivery.goldRatio"
                    :parser="value => value.replace('%', '')"
                    :formatter="value => `${value}%`"
                >
                </a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col span="8">
              <a-form-model-item label="金价金额" :label-col="{span: 7}" :wrapper-col="{span: 12}">
                <a-input-number disabled :value="getGoldPrice()"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col span="8">
              <a-form-model-item label="金价(au750)" :label-col="{span: 8}" :wrapper-col="{span: 7}">
                <a-input-number v-model="factoryDelivery.goldPrice"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row class="delivery-label">
            主石
          </a-row>
          <a-row>
            <a-table :columns="columns" :data-source="factoryDelivery.mainStones" :pagination="false">
              <div slot="stoneName" slot-scope="value, record">
                <a-input v-model="record.stoneName"/>
              </div>
              <div slot="stoneCount" slot-scope="value, record">
                <a-input v-model="record.stoneCount"/>
              </div>
              <div slot="stoneWeight" slot-scope="value, record">
                <a-input v-model="record.stoneWeight" />
              </div>
              <div slot="stoneUnitPrice" slot-scope="value, record">
                <a-input v-model="record.stoneUnitPrice" />
              </div>
              <div slot="stonePrice" slot-scope="value, record">
                <span>{{getPrice(record.stoneWeight, record.stoneUnitPrice)}}</span>
              </div>
              <div slot="remark" slot-scope="value, record">
                <a-input v-model="record.remark"/>
              </div>
              <a-button slot="footer" type="dashed" style="width: 100%" @click="addMainCol">
                <a-icon type="plus"/>
                添加
              </a-button>
            </a-table>
            <a-col span="8">
              <a-form-model-item label="主石镶石费: " :label-col="{span: 9}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.handInlayFee"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row class="delivery-label">
            副石
          </a-row>
          <a-row>
            <a-table :columns="columns" :data-source="factoryDelivery.viceStones" :pagination="false">
              <div slot="stoneName" slot-scope="value, record">
                <a-input v-model="record.stoneName"/>
              </div>
              <div slot="stoneCount" slot-scope="value, record">
                <a-input v-model="record.stoneCount"/>
              </div>
              <div slot="stoneWeight" slot-scope="value, record">
                <a-input v-model="record.stoneWeight" />
              </div>
              <div slot="stoneUnitPrice" slot-scope="value, record">
                <a-input v-model="record.stoneUnitPrice" />
              </div>
              <div slot="stonePrice" slot-scope="value, record">
                <span>{{getPrice(record.stoneWeight, record.stoneUnitPrice)}}</span>
              </div>
              <div slot="remark" slot-scope="value, record">
                <a-input v-model="record.remark"/>
              </div>
              <a-button slot="footer" type="dashed" style="width: 100%" @click="addViceCol">
                <a-icon type="plus"/>
                添加
              </a-button>
            </a-table>
            <a-col span="8">
              <a-form-model-item label="副石镶石费: " :label-col="{span: 9}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.microInlayFee"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="delivery-label">
            配件
          </a-row>
          <a-row>
            <a-table :columns="partColumns" :data-source="factoryDelivery.parts" :pagination="false">
              <div slot="partName" slot-scope="value, record">
                <a-input v-model="record.partName"/>
              </div>
              <div slot="partWeight" slot-scope="value, record">
                <a-input-number v-model="record.partWeight"/>
              </div>
              <div slot="partPrice" slot-scope="value, record">
                <a-input-number v-model="record.partPrice" />
              </div>
              <div slot="mark" slot-scope="value, record">
                <a-input v-model="record.mark" />
              </div>
              <a-button slot="footer" type="dashed" style="width: 100%" @click="addPartCol">
                <a-icon type="plus"/>
                添加
              </a-button>
            </a-table>
          </a-row>
          <a-row class="delivery-label">
            工费
          </a-row>
          <a-row>
            <a-col span="8">
              <a-form-model-item label="工费" :label-col="{span: 7}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.processFee"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col span="8">
              <a-form-model-item label="版费" :label-col="{span: 7}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.plateFee"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col span="8">
              <a-form-model-item label="配石费" :label-col="{span: 7}" :wrapper-col="{span: 4}">
                <a-input-number v-model="factoryDelivery.partFee"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div slot="footer" class="model-footer">
          <a-form-model-item label="总计" :label-col="{span: 8}" :wrapper-col="{span: 12}" required>
            <a-input-number disabled :value="getTotalPrice()" style="width: 120px"></a-input-number>
          </a-form-model-item>
        <div>
          <a-button type="second" @click="closeModel">取消</a-button>
          <a-button type="primary" @click="delivery">提交</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";
export default {
  data() {
    return {
      designList: [],
      channelList: [],
      dealerList: [],
      page: {},
      designNo: '',
      channelId: 0,
      dealerId: 0,
      beginDate: '',
      endDate: '',
      showModel: false,
      factoryDelivery: {
        id: 0,
        mainStones: [],
        viceStones: [],
        parts: []
      },
      account: JSON.parse(localStorage.getItem("user")),
      columns: [
        {
          title: "名称",
          dataIndex: "stoneName",
          width: "15%",
          scopedSlots: {customRender: 'stoneName'}
        },
        {
          title: "颗数",
          dataIndex: "stoneCount",
          width: "10%",
          scopedSlots: {customRender: 'stoneCount'}
        },
        {
          title: "重量(ct)",
          dataIndex: "stoneWeight",
          width: "10%",
          scopedSlots: {customRender: 'stoneWeight'}
        },
        {
          title: "单价",
          dataIndex: "stoneUnitPrice",
          width: "10%",
          scopedSlots: {customRender: 'stoneUnitPrice'}
        },
        {
          title: "价格",
          dataIndex: "stonePrice",
          width: "15%",
          scopedSlots: {customRender: 'stonePrice'}
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: "20%",
          scopedSlots: {customRender: 'remark'}
        }
      ],
      partColumns: [
        {
          title: "名称",
          dataIndex: "partName",
          width: "15%",
          scopedSlots: {customRender: 'partName'}
        },
        {
          title: "重量",
          dataIndex: "partWeight",
          width: "10%",
          scopedSlots: {customRender: 'partWeight'}
        },
        {
          title: "价格",
          dataIndex: "partPrice",
          width: "10%",
          scopedSlots: {customRender: 'partPrice'}
        },
        {
          title: "备注",
          dataIndex: "mark",
          width: "25%",
          scopedSlots: {customRender: 'mark'}
        }
      ]
    }
  },
  watch: {
    $route: function () {
      this.account = JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    getPrice(n1, n2) {
      if (!(n1 && n2)) {
        return 0;
      }
      let price = (n1*n2).toFixed(2);
      return isNaN(price) ? 0 : price;
    },
    getGoldPrice() {
      let price = (this.factoryDelivery.netWeight * (1 + (this.factoryDelivery.goldRatio/100)) * this.factoryDelivery.goldPrice).toFixed(2)
      if (isNaN(price)) {
        return 0;
      } else {
        this.factoryDelivery.goldFee = price;
        return price
      }
    },
    getTotalPrice() {
      let goldPrice = this.getGoldPrice();
      let mainStonePrice = 0;
      this.factoryDelivery.mainStones.forEach(it => {
        let p = Number(this.getPrice(it.stoneWeight, it.stoneUnitPrice));
        it.stonePrice = p;
        mainStonePrice += p
      })
      let vicePrice = 0;
      this.factoryDelivery.viceStones.forEach(it => {
        let p = Number(this.getPrice(it.stoneWeight, it.stoneUnitPrice));
        it.stonePrice = p;
        vicePrice += p;
      })
      let partPrice = 0;
      this.factoryDelivery.parts.forEach(it => {
        if (it.partPrice !== "") {
          partPrice += Number(it.partPrice)
        }
      })
      let handInlayFee = !this.factoryDelivery.handInlayFee ? 0 : this.factoryDelivery.handInlayFee;
      let microInlayFee = !this.factoryDelivery.microInlayFee ? 0 : this.factoryDelivery.microInlayFee;
      let processFee = !this.factoryDelivery.processFee ? 0 : this.factoryDelivery.processFee;
      let plateFee = !this.factoryDelivery.plateFee ? 0 : this.factoryDelivery.plateFee;
      let partFee = !this.factoryDelivery.partFee ? 0 : this.factoryDelivery.partFee;
      let totalPrice = Number(goldPrice) + Number(mainStonePrice) + Number(vicePrice) + Number(partPrice) + Number(handInlayFee) + Number(microInlayFee) + Number(processFee) + Number(plateFee) + Number(partFee)
      return totalPrice.toFixed(2)
    },
    channelSelect(value) {
      this.channelId = value;
      this.getDeliveryDesign();
    },
    dealerSelect(value) {
      this.dealerId = value;
      this.getDeliveryDesign();
    },
    dateChange(dateArray) {
      this.beginDate = dateArray[0];
      this.endDate = dateArray[1];
      this.getDeliveryDesign();
    },
    getDeliveryDesign() {
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
      service.getDeliveryDesign(query)
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
    // 出货相关
    closeModel() {
      this.showModel = false;
    },
    delivery() {
      this.factoryDelivery.totalFee = this.getTotalPrice();
      if (!this.factoryDelivery.totalFee || this.factoryDelivery.totalFee === '') {
        return this.$message.error('请填写总金额');
      }
      if (this.factoryDelivery.id === 0) {
        return this.$message.error("页面错误");
      }
      service.designDelivery(this.factoryDelivery.id, this.factoryDelivery)
          .then(res => {
            this.showModel = false;
            if (res.state === 200) {
              this.getDeliveryDesign();
              this.$message.success("出货成功");
            } else {
              this.$message.error(res.message)
            }
          })
    },
    openDelivery(id) {
      this.factoryDelivery = {
        id: id,
        mainStones: [],
        viceStones: [],
        parts: []
      }
      this.showModel = true;
    },
    addMainCol() {
      const newMain = {
        stoneName: '',
        stoneCount: '',
        stonePrice: '',
        remark: '',
      }
      this.factoryDelivery.mainStones = [...this.factoryDelivery.mainStones, newMain];
    },
    addViceCol() {
      const newVice = {
        stoneName: '',
        stoneCount: '',
        stonePrice: '',
        remark: '',
      }
      this.factoryDelivery.viceStones = [...this.factoryDelivery.viceStones, newVice];
    },
    addPartCol() {
      const part = {
        partName: '',
        partWeight: '',
        partPrice: '',
        remark: '',
      }
      this.factoryDelivery.parts = [...this.factoryDelivery.parts, part];
    },
  },
  created() {
    this.getDeliveryDesign();
  },
  name: "FactoryDelivery"
}
</script>

<style scoped>
.delivery-label {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #999999;
}

.model-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>