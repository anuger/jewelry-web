<template>
  <div>
    <breadcrumb/>
    <div class="main-panel">
      <div class="edit-panel">
        <a-button type="second" @click="showBanner">管理小程序banner</a-button>
        <a-button type="primary" @click="showAdd">
          <a-icon type="plus"></a-icon>
          添加
        </a-button>
      </div>
      <a-table
          rowKey="id"
          :columns="clientColumn"
          :data-source="dealerList"
          :pagination="false"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
        </span>
        <span slot="isPayPost" slot-scope="value">
          <a-switch :checked="value">
          </a-switch>
        </span>
        <span slot="createdTime" slot-scope="value">
          {{ value | dateFormat }}
        </span>
        <div slot="action" slot-scope="value, record, index">
          <a-button type="link" @click="showModify(index)">编辑</a-button>

          <a-popconfirm
              title="确定要删除吗?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="removeDealer(record.id)"
          >
            <a-button type="link">删除</a-button>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <a-modal
        centered
        title="编辑"
        :visible="showModel"
        @cancel="closeModel"
        class="flex-center"
        @ok="submit"
    >
      <a-form-model okText="提交"
                    ref="form"
                    :model="dealer"
                    :rules="rules"
                    :labelCol="{span: 7}"
                    :wrapperCol="{span: 15}"
      >
        <a-form-model-item label="经销商名称" prop="username">
          <a-input v-model="dealer.username" placeholder="请输入经销商名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="登录账号(手机号)" prop="account">
          <a-input v-model="dealer.account" placeholder="请输入登录账号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="渠道" prop="channelId">
          <a-select placeholder="请选择渠道" v-model="dealer.channelId">
            <a-select-option v-for="channel in channelList" :key="channel.id" title="channel.Name">
              {{ channel.channelName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="定金比例" prop="depositRatio">
          <a-input v-model="dealer.depositRatio" placeholder="请输入定金比例" type="number"><span slot="suffix">%</span>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="全款寄货" prop="isPayDelivery">
          <a-radio-group v-model="dealer.isPayDelivery">
            <a-radio :value="0">
              否
            </a-radio>
            <a-radio :value="1">
              是
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="订单前缀" prop="orderPrefix">
          <a-input v-model="dealer.orderPrefix" placeholder="请输入订单前缀"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
        centered
        title="编辑小程序banner"
        :visible="showBannerModel"
        @cancel="closeBannerModel"
        class="flex-center"
        @ok="closeBannerModel"
    >
      <a-form-model>
        <a-form-model-item required label="banner">
          <a-upload
              list-type="picture-card"
              :customRequest="uploadImage"
              @preview="handlePreview"
              :fileList="fileList"
              @change="fileChange"
              :remove="removeBanner"
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
    </a-modal>
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
    let checkDepositRatio = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写定金比例"));
      }
      if (value < 0 || value > 100) {
        return callback(new Error("定金比例范围不正确"))
      }
      callback()
    };
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写登录账号"));
      }
      if (!(/^1[0-9]{10}$/.test(value))) {
        return callback(new Error("登录账号有误"));
      }
      callback()
    };
    return {
      showModel: false,
      showBannerModel: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      rules: {
        username: [{required: true, message: '请填写渠道名称', trigger: 'blur'}],
        account: [
          {required: true, message: '请填写登录账号', trigger: 'blur'},
          {validator: checkAccount, trigger: 'blur'}
        ],
        channelId: [{required: true, message: '请选择渠道', trigger: 'change'}],
        depositRatio: [
          {required: true, message: '请填写定金比例', trigger: 'blur'},
          {validator: checkDepositRatio, trigger: 'blur'}
        ],
        isPayDelivery: [{required: true, message: '请选择是否全款寄货', trigger: 'change'}],
        orderPrefix: {required: true, message: '请填写订单前缀', trigger: 'blur'}
      },
      clientColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          scopedSlots: {customRender: 'index'}
        },
        {
          title: '经销商名称',
          dataIndex: 'username',
          key: 'username',
          width: 150
        },
        {
          title: '手机号',
          dataIndex: 'account',
          key: 'clientPhone',
          width: 150
        },
        {
          title: '渠道',
          dataIndex: 'channelName',
          key: 'channelName',
          width: 100
        },
        {
          title: '订单前缀',
          dataIndex: 'orderPrefix',
          key: 'orderPrefix',
          width: 120,
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: 200,
          scopedSlots: {customRender: 'createdTime'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 180,
          scopedSlots: {customRender: 'action'}
        },
      ],
      dealerList: [],
      channelList: [],
      dealer: {}
    }
  },
  methods: {
    closeModel() {
      this.showModel = false;
    },
    closeBannerModel() {
      this.showBannerModel = false;
    },
    showAdd() {
      this.dealer = {}
      this.showModel = true;
    },
    removeBanner(file) {
      service.removeBanner(file.response.imageUrl)
          .then(res => {
            if (res.state !== 200) {
              this.$message.error("删除失败");
            }
          })
    },
    showBanner() {
      service.getBanners()
          .then(res => {
            if (res.state === 200) {
              this.fileList = res.data.banners.map(it => {
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
              this.showBannerModel = true;
            } else {
              this.$message.error('获取banner图失败');
            }
          })
    },
    showModify(index) {
      this.dealer = this.dealerList[index];
      this.showModel = true;
    },
    removeDealer(dealerId) {
      service.removeDealer(dealerId)
          .then(res => {
            if (res.state === 200) {
              this.getDealers();
              this.$message.success("删除成功");
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
              service.addBanner(res.data.imageUrl)
                  .then(addRes => {
                    if (addRes.state !== 200) {
                      this.$message.error("添加banner失败");
                    }
                  })
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
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.dealer.id) {
            service.modifyDealer(this.dealer, this.dealer.id)
                .then(res => {
                  if (res.state === 200) {
                    this.getDealers();
                    this.$message.success("修改成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          } else {
            service.addDealer(this.dealer)
                .then(res => {
                  if (res.state === 200) {
                    this.getDealers();
                    this.$message.success("添加成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          }
        }
      })
    },
    getDealers() {
      service.getDealerList()
          .then(res => {
            if (res.state === 200) {
              this.dealerList = res.data.dealers;
              this.channelList = res.data.channels;
              this.showModel = false;
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  created() {
    this.getDealers();
  },
  name: "DealerSetting"
}
</script>

<style scoped>
.edit-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
</style>