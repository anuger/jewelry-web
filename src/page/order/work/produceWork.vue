<template>
  <div>
    <design-table :data="designList" :page="page">
      <div slot="action" slot-scope="record">
        <a-button type="link" @click="openModel(record.id)">选工厂</a-button>
      </div>
    </design-table>
    <!--          选工厂弹出窗-->
    <a-modal
        centered
        title="选工厂"
        okText="生产"
        @ok="produce"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
    >
      <a-form-model :style="{ marginBottom: '50px' }">
        <a-form-model-item label="下单工厂">
          <a-select
              placeholder="请选择工厂"
              @change="handlerChange"
          >
            <a-select-option v-for="option in factoryOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  props: {
    designList: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      showModel: false,
      produceDesignId: 0,
      factoryOptions: [],
      factoryId: 0
    }
  },
  methods: {
    openModel(id) {
      this.produceDesignId = id;
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
    },
    handlerChange(value) {
      this.factoryId = value;
    },
    produce() {
      if (this.produceDesignId === 0) {
        return this.$message.error("页面错误");
      }
      if (this.factoryId === 0) {
        return this.$message.error("请选择工厂");
      }
      service.produce(this.produceDesignId, this.factoryId)
          .then(res => {
            this.showModel = false;
            if (res.state === 200) {
              this.$emit("getData");
              this.$message.success("下单到工厂成功");
            } else {
              this.$message.error(res.message);
            }
          })
    },
    getOptionFactory() {
      service.getFactoryOptions()
          .then(res => {
            if (res.state === 200) {
              this.factoryOptions = res.data.options;
            } else {
              this.$message.error("获取工厂列表失败");
            }
          })
    },
  },
  created() {
    this.getOptionFactory();
  },
  name: "produceWork"
}
</script>

<style scoped>

</style>