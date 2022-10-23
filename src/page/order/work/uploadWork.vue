<template>
  <div>
    <design-table :data="designList" :page="page">
      <div slot="action" slot-scope="record">
        <a-button type="link" :disabled="!account.userRoles.includes(2)" @click="openUpload(record.id)">上传CAD</a-button>
      </div>
    </design-table>
    <!--          上传CAD弹出窗-->
    <a-modal
        centered
        title="上传CAD"
        okText="上传"
        @ok="upload"
        @cancel="closeModel"
        :visible="showModel"
        :maskClosable="false"
    >
      <a-form-model>
        <a-form-model-item label="CAD图">
          <a-upload
              list-type="picture-card"
              :customRequest="uploadImage"
              @preview="handlePreview"
              :fileList="fileList"
              @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img :src="previewImage" alt="CAD图"/>
          </a-modal>
        </a-form-model-item>

        <a-form-model-item label="CAD源文件">
          <a-upload
              :customRequest="uploadFile"
              :fileList="cadFiles"
              @change="cadFileChange"
          >
            <a-button v-if="cadFiles.length < 1">
              <a-icon type="upload"/>
              上传文件
            </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

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
      uploadDesignId: 0,
      uploadLoading: false,
      fileList: [],
      cadFiles: [],
      previewVisible: false,
      previewImage: '',
      account: JSON.parse(localStorage.getItem("user"))
    }
  },
  watch: {
    $route: function () {
      this.account = JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.imageUrl) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.imageUrl || file.preview;
      this.previewVisible = true;
    },
    openUpload(id) {
      this.uploadDesignId = id;
      this.fileList = [];
      this.cadFiles = [];
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
    },
    // 提交
    upload() {
      if (this.fileList.length === 0) {
        return this.$message.error("请上传cad图");
      }
      let cadImage = this.fileList[0].response.imageUrl;
      let cadFile = this.cadFiles.length > 0 ? this.cadFiles[0].response.fileUrl : '';
      service.uploadCad(cadImage, cadFile, this.uploadDesignId)
          .then(res => {
            this.showModel = false;
            if (res.state === 200) {
              this.$emit("getData")
              this.$message.success("上传成功");
            } else {
              this.$message.error(res.message);
            }
          })
    },
    uploadImage(data) {
      let formData = new FormData();
      formData.append('file', data.file)
      service.uploadImage(formData)
          .then(res => {
            if (res.state === 200) {
              data.onSuccess(res.data)
            } else {
              data.onError();
            }
          })
    },
    uploadFile(data) {
      let formData = new FormData();
      formData.append('file', data.file)
      service.uploadFile(formData)
          .then(res => {
            if (res.state === 200) {
              data.onSuccess(res.data)
            } else {
              data.onError();
            }
          })
    },
    handleChange({fileList}) {
      this.fileList = fileList;
    },
    cadFileChange({fileList}) {
      this.cadFiles = fileList;
    }
  },
  name: "uploadWork"
}
</script>

<style scoped>

</style>