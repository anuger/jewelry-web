<template>
  <div>
    <div class="top-panel">
      <a-button size="small" class="m-t-6" @click="reback">返回</a-button>
    </div>
    <div class="main-panel">
      <a-tabs
          default-active-key="base"
          :animated="false"
      >
        <a-tab-pane tab="基本信息" key="base">
          <div class="form-panel">
            <a-form-model
                ref="baseForm"
                :model="template"
                :rules="rules"
                class="form-model"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 20}"
            >
              <a-form-model-item label="产品名称" prop="designName">
                <a-input placeholder="请输入产品名称" v-model="template.designName"></a-input>
              </a-form-model-item>
              <a-form-model-item label="类别" prop="templateCategoryId">
                <a-select placeholder="请选择类别" v-model="template.templateCategoryId">
                  <a-select-option v-for="category in categoryOption" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="款号" prop="templateNo">
                <a-input placeholder="请输入款号" v-model="template.templateNo"></a-input>
              </a-form-model-item>
              <a-form-model-item label="版式规格" prop="templateSize">
                <a-input placeholder="请输入板式规格" v-model="template.templateSize"></a-input>
              </a-form-model-item>
              <a-form-model-item label="售价" prop="estimatePrice">
                <a-input-number placeholder="请输入售价" style="width: 160px"
                                v-model="template.estimatePrice"></a-input-number>
                <div style="color: #D7D7D7; font-size: 12px">*只有补充定制信息之后，经销商下单时才可以选择此版式</div>
              </a-form-model-item>
            </a-form-model>
            <a-button type="primary" @click="baseSubmit">保存</a-button>
          </div>
        </a-tab-pane>

        <!--        定制信息-->
        <a-tab-pane tab="定制信息" :disabled="templateId === 0" key="custom">
          <div class="form-panel">
            <a-form-model
                ref="customForm"
                :model="customTemplate"
                :rules="customRules"
                class="form-model"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 20}"
            >
              <a-form-model-item label="款型" prop="designClassify">
                <a-radio-group button-style="solid" v-model="customTemplate.designClassify">
                  <a-radio-button v-for="designClassify in designClassifyList" :key="designClassify.type"
                                  :value="designClassify.type">{{ designClassify.name }}
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="材质" prop="goldClassify">
                <a-radio-group button-style="solid" v-model="customTemplate.goldClassify">
                  <a-radio-button v-for="goldClassify in goldClassifyList" :key="goldClassify.type"
                                  :value="goldClassify.type">{{ goldClassify.name }}
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="主石" prop="stoneClassify">
                <a-radio-group button-style="solid" v-model="customTemplate.stoneClassify">
                  <a-radio-button v-for="stoneClassify in stoneClassifyList" :key="stoneClassify.type"
                                  :value="stoneClassify.type">{{ stoneClassify.name }}
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item v-if="customTemplate.stoneClassify && customTemplate.stoneClassify > 1" label="主石规格">
                <a-input v-model="customTemplate.stoneSize" placeholder="请输入主石规格"></a-input>
              </a-form-model-item>
              <a-form-model-item required label="款式图">
                <a-upload
                    list-type="picture-card"
                    :customRequest="uploadImage"
                    @preview="handlePreview"
                    :fileList="fileList"
                    @change="fileChange"
                >
                  <div v-if="fileList.length < 5">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-form-model>
            <a-button type="primary" @click="customSubmit">保存</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img :src="previewImage"/>
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
  data() {
    let checkGold = (rule, value, callback) => {
      if (!value || value === 0) {
        return callback(new Error("请选择材质"));
      }
      callback()
    }
    let checkDesign = (rule, value, callback) => {
      if (!value || value === 0) {
        return callback(new Error("请选择款式"));
      }
      callback()
    }
    let checkStone = (rule, value, callback) => {
      if (!value || value === 0) {
        return callback(new Error("请选择主石"));
      }
      callback()
    }
    return {
      templateId: 0,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      designClassifyList: [],
      goldClassifyList: [],
      stoneClassifyList: [],
      rules: {
        designName: [{required: true, message: '请填写产品名称', trigger: 'blur'}],
        templateCategoryId: [{required: true, message: '请选择类别', trigger: 'change'}],
        templateNo: [{required: true, message: '请填写款号', trigger: 'blur'}],
        estimatePrice: [{required: true, message: '请填写售价', trigger: 'blur'}]
      },
      customRules: {
        goldClassify: [{validator: checkGold, trigger: 'blur'}],
        designClassify: [{validator: checkDesign, trigger: 'blur'}],
        stoneClassify: [{validator: checkStone, trigger: 'blur'}]
      },
      template: {},
      customTemplate: {},
      categoryOption: []
    }
  },
  methods: {
    reback() {
      this.$router.back(1);
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
    fileChange({fileList}) {
      this.fileList = fileList;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.response.imageUrl) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.response.imageUrl || file.preview;
      this.previewVisible = true;
    },
    getConfig() {
      service.getConfig()
          .then(res => {
            if (res.state === 200) {
              this.designClassifyList = res.data.designClassify;
              this.goldClassifyList = res.data.goldClassify;
              this.stoneClassifyList = res.data.stoneClassify;
            }
          })
    },
    baseSubmit() {
      let that = this;
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          if (this.templateId === 0) {
            service.addTemplate(this.template)
                .then(res => {
                  if (res.state === 200) {
                    that.templateId = res.data.templateId;
                    this.$message.success("添加成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          } else {
            service.modifyTemplate(this.templateId, this.template)
                .then(res => {
                  if (res.state === 200) {
                    this.$message.success("修改成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          }
        }
      })
    },
    customSubmit() {
      const that = this;
      this.$refs['customForm'].validate(valid => {
        if (valid) {
          if (that.fileList.length === 0) {
            return that.$message.error("请上传款式图");
          }
          const designImages = that.fileList.map(it => {
            return it.response.imageUrl;
          })
          if (this.customTemplate.stoneClassify > 1 && !this.customTemplate.stoneSize) {
            return this.$message.error("请填写主石规格");
          }
          that.customTemplate.designImages = designImages;
          service.modifyTemplate(that.templateId, that.customTemplate)
              .then(res => {
                if (res.state === 200) {
                  that.$message.success("修改成功");
                } else {
                  that.$message.error(res.message);
                }
              })
        }
      })
    },
    getCategoryOption() {
      service.getCategoryOption()
          .then(res => {
            if (res.state === 200) {
              this.categoryOption = res.data.option;
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  created() {
    this.getConfig();
    this.getCategoryOption();
    if (this.$route.query.templateId) {
      this.templateId = this.$route.query.templateId;
      service.getTemplateDetail(this.templateId)
          .then(res => {
            if (res.state === 200) {
              this.template = {
                designName: res.data.template.designName,
                templateCategoryId: res.data.template.templateCategoryId,
                templateNo: res.data.template.templateNo,
                templateSize: res.data.template.templateSize,
                estimatePrice: res.data.template.estimatePrice
              }
              this.customTemplate = {
                goldClassify: res.data.template.goldClassify,
                designClassify: res.data.template.designClassify,
                stoneClassify: res.data.template.stoneClassify,
                stoneSize: res.data.template.stoneSize,
              }
              this.fileList = res.data.template.designImages.map(it => {
                return {
                  uid: it,
                  name: it,
                  status: 'done',
                  url: it,
                  response: {
                    imageUrl: it
                  }
                }
              })
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  name: "TemplateEdit"
}
</script>

<style scoped>
.top-panel {
  height: 64px;
  display: flex;
  align-items: center;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.form-model {
  margin-top: 64px;
  width: 500px;
}
</style>