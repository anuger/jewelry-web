<template>
  <div>
    <div class="top-panel">
      <a-form-model style="width: 200px; height: 32px">
        <a-form-model-item>
          <a-input-search placeholder="请输入产品名称或款号" @search="getTemplateList" v-model="name"></a-input-search>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="gotoAdd">
          <a-icon type="plus"></a-icon>
          添加
        </a-button>
        <a-button type="primary" class="m-l-6" @click="gotoImport">
          <a-icon type="plus"></a-icon>
          批量添加
        </a-button>
      </div>
    </div>
    <!--    列表-->
    <div class="card-panel">
      <a-popover placement="right" trigger="click" v-for="(template,index) in templateList" :key="template.id">
        <a-card hoverable style="font-size: 14px">
          <img slot="cover" class="card-img"
               v-if="template.designImages.length > 0" :src="template.designImages[0]"/>
          <a-empty v-else description="暂无图片" style="height: 188px; margin: 0; display: flex; justify-content: center; align-items: center" :image="emptyImage"/>
          <a-card-meta>
            <template slot="description">
              <div class="m-b-10">
                <span>类别： </span>
                <span>{{ template.categoryName }}</span>
              </div>
              <div>
                <span>品名： </span>
                <span>{{ template.designName }}</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
        <template slot="content">
          <div style="display: flex; flex-direction: column; width: 160px">
            <a-button size="small" type="link" @click="gotoEdit(template.id)">编辑</a-button>
            <div style="height: 1px; background-color: #dddddd; margin: 8px 0"></div>
            <a-button size="small" type="link" @click="removeTemplate(template.id, index)">删除</a-button>
          </div>
        </template>
      </a-popover>
      <template v-if="templateList.length < 4">
        <div v-for="a in (4-templateList.length)" :key="'a' + a">
          <div style="width: 200px"></div>
        </div>
      </template>
    </div>
    <div style="float: right" v-if="templateList.length !== 0">
      <a-pagination :current="currentPage" :pageSize="12" :total="page.total" @change="pageChange">
      </a-pagination>
    </div>

    <!--      空数据-->
    <div v-if="templateList.length === 0"
         style="display: flex; align-items: center; justify-content: center; height: 700px;">
      <a-empty></a-empty>
    </div>
    <a-modal

    >

    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";
import {Empty} from "ant-design-vue";

export default {
  data() {
    return {
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
      templateList: [],
      page: {},
      name: '',
      currentPage: 1
    }
  },
  methods: {
    gotoAdd() {
      this.$router.push("/template/edit")
    },
    getTemplateList() {
      let query = {
        currentPage: this.currentPage
      };
      if (this.name !== '') {
        query.name = this.name;
      }
      service.getTemplateList(query)
          .then(res => {
            if (res.state === 200) {
              this.templateList = res.data.templates;
              this.page = res.data.page;
            }
          })
    },
    gotoEdit(templateId) {
      this.$router.push("/template/edit?templateId=" + templateId)
    },
    removeTemplate(templateId, index) {
      service.removeTemplate(templateId)
          .then(res => {
            if (res.state === 200) {
              this.templateList.splice(index, 1);
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.message)
            }
          })
    },
    pageChange(page) {
      this.currentPage = page;
      this.getTemplateList();
    },
    gotoImport() {
      this.$router.push("/template/import")
    }
  },
  created() {
    this.getTemplateList();
  },
  name: "TemplateList"
}
</script>

<style scoped>
.top-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 78px;
}

.card-panel {
  margin-top: 10px;
  display: grid;
  gap: 20px;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 12px;
}

.card-img {
  width: 100%;
  height: 188px;
  object-fit: cover;
}
</style>