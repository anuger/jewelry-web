<template>
  <div>
    <!--  订单信息-->
    <div class="main-panel">
      <div class="menu-panel">
        <div></div>
        <div>
          <a-button @click="print" type="link">打印</a-button>
          <a-button @click="openModel" type="primary" :disabled="design.designType === 2">收藏到版库</a-button>
          <a-modal
              centered
              title="收藏到版库"
              okText="提交"
              :visible="showModel"
              :maskClosable="false"
              width="340px"
              @cancel="closeModel"
              @ok="submit"
          >
            <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 20}">
              <a-form-model-item label="款号">
                <a-input v-model="templateNo" placeholder="请输入款号"></a-input>
              </a-form-model-item>
              <a-form-model-item label="类别">
                <a-select placeholder="请选择类别" @change="categorySelect">
                  <a-select-option v-for="category in templateCategories" :value="category.id"
                                   :key="category.id">
                    {{ category.categoryName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        </div>
      </div>
      <a-descriptions
          title="订单信息"
          size="small"
      >
        <a-descriptions-item label="订单编号">
          {{ design.designNo }}
        </a-descriptions-item>
        <a-descriptions-item label="工单编号">
          {{ design.produceNo === '' ? '-' : design.produceNo }}
        </a-descriptions-item>
        <a-descriptions-item label="经销商">
          {{ design.dealerName }}
        </a-descriptions-item>
        <a-descriptions-item label="工厂">
          {{ (!design.factoryName || design.factoryName === '' ? '' : design.factoryName) }}
        </a-descriptions-item>
        <a-descriptions-item label="客户名">
          {{ design.clientName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品名称">
          {{ design.designName }}
        </a-descriptions-item>
        <a-descriptions-item label="款型">
          {{ design.designClassifyText }}
        </a-descriptions-item>
        <a-descriptions-item label="材质">
          {{ design.goldClassifyText }}
        </a-descriptions-item>
        <a-descriptions-item label="件数">
          {{ design.num }}
        </a-descriptions-item>
        <a-descriptions-item label="手寸">
          {{ design.size }}
        </a-descriptions-item>
        <a-descriptions-item label="刻字">
          {{ design.lettering === '' ? '-' : design.lettering }}
        </a-descriptions-item>
        <a-descriptions-item label="刻字字体">
          {{ (!design.letteringFontText || design.letteringFontText === '') ? '-' : design.letteringFontText }}
        </a-descriptions-item>
        <a-descriptions-item label="预估价">
          {{ design.estimatePrice }}
        </a-descriptions-item>
        <a-descriptions-item label="售价">
          {{ design.salePrice === 0 ? '-' : design.salePrice }}
        </a-descriptions-item>
        <!--        填充-->
        <a-descriptions-item>
        </a-descriptions-item>
        <a-descriptions-item label="备注" span="3">
          {{ design.remark }}
        </a-descriptions-item>
        <!--        空白层-->
        <a-descriptions-item span="3">
        </a-descriptions-item>
        <a-descriptions-item span="3" label="收货信息">
          <div @click="copyAddress" title="点击复制" style="cursor: pointer">
            {{ design.receiptInfo }}
          </div>
        </a-descriptions-item>
        <!--        空白层-->
        <a-descriptions-item span="3">
        </a-descriptions-item>
        <a-descriptions-item span="3" label="款式图">
          <viewer :images="design.designImages">
            <img width="120" height="120" class="design-image" v-for="image in design.designImages" :key="image"
                 :src="image"/>
          </viewer>
        </a-descriptions-item>
        <!--        空白层-->
        <a-descriptions-item span="3">
        </a-descriptions-item>
        <a-descriptions-item span="3" label="CAD源文件">
          <a :href="design.cadFile">
            <a-button :disabled="design.cadFile === ''" type="link">下载
              <a-icon type="download"/>
            </a-button>
          </a>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <!--    进度-->
    <div class="main-panel">
      <a-timeline
          mode="left"
          style="max-width: 600px"
      >
        <a-timeline-item v-for="process in processes" :key="process.id">
          <div>{{ process.statusText }}</div>
          <div class="sub-text">{{ process.createdTime | dateFormat }}</div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <!--    成本-->
    <div class="main-panel">
      <a-descriptions
          title="成本信息"
          size="small"
      >
        <template v-if="factoryDelivery.totalFee">
          <a-descriptions-item label="总货重">
            {{
              !factoryDelivery.totalWeight || factoryDelivery.totalWeight === 0 ? '-' : factoryDelivery.totalWeight + 'g'
            }}
          </a-descriptions-item>
          <a-descriptions-item label="净金重">
            {{ !factoryDelivery.netWeight || factoryDelivery.netWeight === 0 ? '-' : factoryDelivery.netWeight + 'g' }}
          </a-descriptions-item>
          <a-descriptions-item label="耗率">
            {{ !factoryDelivery.goldRatio || factoryDelivery.goldRatio === 0 ? '-' : factoryDelivery.goldRatio + '%' }}
          </a-descriptions-item>
          <a-descriptions-item label="金价">
            {{ !factoryDelivery.goldPrice || factoryDelivery.goldPrice === 0 ? '-' : factoryDelivery.goldPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="金价金额">
            {{ !factoryDelivery.goldFee || factoryDelivery.goldFee === 0 ? '-' : factoryDelivery.goldFee }}
          </a-descriptions-item>
          <a-descriptions-item label="版费">
            {{ !factoryDelivery.plateFee || factoryDelivery.plateFee === 0 ? '-' : factoryDelivery.plateFee }}
          </a-descriptions-item>
          <a-descriptions-item label="工费">
            {{ !factoryDelivery.processFee || factoryDelivery.processFee === 0 ? '-' : factoryDelivery.processFee }}
          </a-descriptions-item>
          <a-descriptions-item label="配石费">
            {{ !factoryDelivery.partFee || factoryDelivery.partFee === 0 ? '-' : factoryDelivery.partFee }}
          </a-descriptions-item>
          <a-descriptions-item label="主石镶石费">
            {{
              !factoryDelivery.handInlayFee || factoryDelivery.handInlayFee === 0 ? '-' : factoryDelivery.handInlayFee
            }}
          </a-descriptions-item>
          <a-descriptions-item label="副石镶石费">
            {{
              !factoryDelivery.microInlayFee || factoryDelivery.microInlayFee === 0 ? '-' : factoryDelivery.microInlayFee
            }}
          </a-descriptions-item>
          <a-descriptions-item label="总金额">
            {{ factoryDelivery.totalFee === 0 ? '-' : factoryDelivery.totalFee }}
          </a-descriptions-item>
          <a-descriptions-item></a-descriptions-item>
          <a-descriptions-item label="配石" span="3">
            <a-table style="width: 60%" size="small" :columns="stoneColumns" :data-source="factoryDelivery.stones"
                     :pagination="false">
            </a-table>
          </a-descriptions-item>
          <a-descriptions-item label="配件" span="3">
            <a-table style="width: 60%" size="small" :columns="partColumns" :data-source="factoryDelivery.parts"
                     :pagination="false">
            </a-table>
          </a-descriptions-item>
        </template>
      </a-descriptions>
      <!--      商户成本-->
      <a-table
          class="m-t-8"
          :columns="costColumn"
          :data-source="costs"
          :pagination="false"
          rowKey="id"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
        </span>
        <span slot-scope="value" slot="costImages">
          <viewer :images="value">
          <img width="80" height="80" style="object-fit:scale-down; margin-right: 8px" v-for="image in value"
               :key="image" :src="image"/>
          </viewer>
        </span>
        <span slot="createdTime" slot-scope="value">
          {{ value | dateFormat }}
        </span>
      </a-table>
    </div>
    <!--    付款信息-->
    <div class="main-panel m-b-8">
      <a-descriptions
          title="付款信息"
          size="small"
      >
      </a-descriptions>
      <a-table
          class="m-t-8"
          :columns="payColumn"
          :data-source="payInfos"
          :pagination="false"
          rowKey="id"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
        </span>
        <span slot="fee" slot-scope="value">
          {{ value === 0 ? '-' : value }}
        </span>
        <span slot="payImages" slot-scope="value">
          <viewer :images="value">
            <img width="80" height="80" style="object-fit:scale-down; margin-right: 8px" v-for="image in value"
                 :key="image" :src="image"/>
          </viewer>
        </span>
        <span slot-scope="value" slot="remark">
          {{ value === '' ? '-' : value }}
        </span>
        <span slot-scope="value" slot="createdTime">
          {{ value | dateFormat }}
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    return {
      stoneColumns: [
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
          title: "重量",
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
          width: "20%",
          scopedSlots: {customRender: 'stonePrice'}
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: "25%",
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
      ],
      costColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: "8%",
          scopedSlots: {customRender: "index"}
        },
        {
          title: '成本类型',
          dataIndex: 'costTypeText',
          key: 'costTypeText',
          width: "10%"
        },
        {
          title: '金额',
          dataIndex: 'costFee',
          key: 'costFee',
          width: "10%"
        },
        {
          title: '图片',
          dataIndex: 'costImages',
          key: 'costImages',
          width: "22%",
          scopedSlots: {customRender: "costImages"}
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: "20%"
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: "30%",
          scopedSlots: {customRender: "createdTime"}
        }
      ],
      payColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: "8%",
          scopedSlots: {customRender: "index"}
        },
        {
          title: '付款类型',
          dataIndex: 'payTypeText',
          key: 'payTypeText',
          width: "10%"
        },
        {
          title: '金额',
          dataIndex: 'fee',
          key: 'fee',
          width: "10%",
          scopedSlots: {customRender: "fee"}
        },
        {
          title: '付款图',
          dataIndex: 'payImages',
          key: 'payImages',
          width: "22%",
          scopedSlots: {customRender: "payImages"}
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: "20%",
          scopedSlots: {customRender: "remark"}
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: "30%",
          scopedSlots: {customRender: "createdTime"}
        }
      ],
      designId: 0,
      design: {},
      processes: [],
      payInfos: [],
      costs: [],
      factoryDelivery: {},
      showModel: false,
      templateCategories: [],
      templateNo: '',
      categoryId: ''
    }
  },
  methods: {
    print() {
      service.getDesignSign(this.designId)
          .then(res => {
            if(res.state === 200) {
              const router = this.$router.resolve("/order/print?sign=" + res.data)
              window.open(router.href,'_blank')
            }
          })
    },
    getDesignDetails() {
      service.getDesignDetails(this.designId)
          .then(res => {
            if (res.state === 200) {
              this.design = res.data.design;
              this.processes = res.data.processes;
              this.payInfos = res.data.payInfos;
              this.costs = res.data.costs;
              // 从工厂加工中获取出货单内容
              res.data.costs.forEach(it => {
                if (it.costType === 1) {
                  this.factoryDelivery = it.costInfo;
                  this.factoryDelivery.stones = [...it.costInfo.mainStones, ...it.costInfo.viceStones];
                }
              })
            } else {
              this.$message.error(res.message);
            }
          })
    },
    openModel() {
      this.getTemplateCategory();
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
      this.templateNo = '';
      this.categoryId = ''
    },
    submit() {
      if (this.templateNo === '') {
        return this.$message.error('请填写款号');
      }
      if (this.categoryId === '') {
        return this.$message.error('请选择类别');
      }
      service.collectDesign(this.designId, this.templateNo, this.categoryId)
          .then(res => {
            if (res.state === 200) {
              this.$message.success("收藏成功");
              this.showModel = false;
            } else {
              this.$message.error(res.message);
            }
          });
    },
    categorySelect(value) {
      console.log(value)
      this.categoryId = value;
    },
    copyAddress() {
      let textarea = document.createElement('textarea');
      textarea.value = this.design.receiptInfo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("Copy");
      this.$message.success("复制成功");
      textarea.remove();
    },
    getTemplateCategory() {
      service.getCategoryList()
          .then(res => {
            if (res.state === 200) {
              this.templateCategories = res.data.categories
            } else {
              this.$message.error("获取类别列表失败");
            }
          })
    }
  },
  created() {
    this.designId = this.$route.params.designId;
    this.getDesignDetails();
  },
  name: "DesignDetail"
}
// todo 页面有报警，需要处理
</script>

<style scoped>
.design-image {
  object-fit: scale-down;
  margin-right: 12px;
}

.menu-panel {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>