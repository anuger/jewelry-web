<template>
  <div>
    <div class="top-panel">
      <a-button size="small" class="m-t-6" @click="reBack">返回</a-button>
    </div>
    <div class="main-panel flex-center">
      <div class="content-panel" style="margin-bottom: 180px;">
        <div class="label">下载模板</div>
        <p class="tips">
          * 模板文件只上传版式基本信息。
          <br/>
          * 模板文件中的类别必须已经在系统中存在，否则不会导入到系统中。
        </p>
        <a-button type="primary" @click="downloadExcel">
          <a-icon type="download"></a-icon>
          下载模版
        </a-button>


        <div class="label m-t-10">上传</div>
        <p class="tips">
          * 仅支持xlsx、xls格式文件。
        </p>
        <a-upload-dragger
            :customRequest="uploadFile"
            :show-upload-list="false"
        >
          <div style="height: 80px; display: flex; align-items: center; justify-content: center">
            <div v-if="!uploading">
              <a-icon type="upload"></a-icon>
              <span class="m-l-5">上传</span>
            </div>
            <div v-else>
              <a-spin/>
            </div>
          </div>
        </a-upload-dragger>
      </div>
      <a-modal
          centered
          title="导入版式"
          okText="导入"
          @ok="importData"
          @cancel="closeModel"
          :visible="showModel"
          :maskClosable="false"
          width="800px"
      >
        <a-tabs
            style="height: 500px"
            :default-active-key="templates.length === 0 ? 'false' : 'true'"
            :animated="false"
        >
          <a-tab-pane tab="合法数据" key="true" :disabled="templates.length === 0">
            <a-table
                :columns="columns"
                :data-source="templates"
                rowKey="designNo"
                :pagination="false"
            >
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="错误信息" key="false" :disabled="errors.length === 0">
            <a-list>
              <a-list-item style="color: red" v-for="error in errors" :key="error">
                * {{ error }}
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    return {
      uploading: false,
      showModel: false,
      errors: [],
      templates: [],
      key: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          customRender: (value, record, index) => index + 1
        },
        {
          title: "产品名称",
          dataIndex: "designName",
          key: "designName",
          width: 120
        },
        {
          title: '类别',
          dataIndex: 'categoryName',
          key: 'categoryName',
          width: 120
        },
        {
          title: '款号',
          dataIndex: 'templateNo',
          key: 'templateNo',
          width: 120
        },
        {
          title: '版式规格',
          dataIndex: 'templateSize',
          key: 'templateSize',
          width: 240
        },
        {
          title: '售价',
          dataIndex: 'estimatePrice',
          key: 'estimatePrice',
          width: 120
        },
      ]
    }
  },
  methods: {
    reBack() {
      this.$router.back(1);
    },
    downloadExcel() {
      service.downloadExcel()
          .then(res => {
            let blob = new Blob([res]);
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, "版库导入模板.xlsx");
            } else {
              let link = document.createElement("a");
              let evt = document.createEvent("HTMLEvents");
              evt.initEvent("click", false, false);
              link.href = URL.createObjectURL(blob);
              link.download = "版库导入模板.xlsx";
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          })
    },
    uploadFile(data) {
      let formData = new FormData();
      formData.append('file', data.file)
      this.uploading = true;
      service.uploadExcel(formData)
          .then(res => {
            this.uploading = false;
            if (res.state === 200) {
              this.errors = res.data.errors;
              this.templates = res.data.templates;
              this.key = res.data.key;
              this.showModel = true;
            } else {
              this.$message.error(res.message);
              data.onError();
            }
          })
    },
    importData() {
      if (this.templates.length === 0 || this.key === '') {
        this.$message.error("不存在合法数据，请查看错误信息修改后再次导入！")
      } else {
        service.templateImport(this.key)
            .then(res => {
              if (res.state === 200) {
                this.$message.success("成功导入" + res.data.insertCount + "条款式");
                this.reBack();
              } else {
                this.$message.error(res.message);
              }
            })
      }
    },
    closeModel() {
      this.showModel = false;
    }
  },
  name: "Import"
}
</script>

<style scoped>
.top-panel {
  height: 64px;
  display: flex;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.content-panel {
  margin-top: 40px;
}

.label {
  font-size: 16px;
  font-weight: 700;
  line-height: 50px;
}
</style>