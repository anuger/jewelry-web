<template>
  <div>
    <breadcrumb/>
    <div class="main-panel">
      <div class="edit-panel">
        <a-button type="primary" @click="showAdd">
          <a-icon type="plus"></a-icon>
          添加
        </a-button>
      </div>
      <a-table
          rowKey="id"
          :columns="channelColumn"
          :data-source="channelList"
          :pagination="false"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
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
              @confirm="removeChannel(record.id)"
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
                    :model="channel"
                    :rules="rules"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 15}"
      >
        <a-form-model-item label="渠道名称" prop="channelName">
          <a-input v-model="channel.channelName" placeholder="请输入渠道名称"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    return {
      showModel: false,
      rules: {
        channelName: [{required: true, message: '请填写渠道名称', trigger: 'blur'}]
      },
      channelColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 100,
          scopedSlots: {customRender: 'index'}
        },
        {
          title: '渠道名',
          dataIndex: 'channelName',
          key: 'channelName',
          width: 200
        },
        {
          title: '经销商数',
          dataIndex: 'dealerCount',
          key: 'dealerCount',
          width: 150
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: 350,
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
      channelList: [],
      channel: {}
    }
  },
  methods: {
    closeModel() {
      this.showModel = false;
    },
    showAdd() {
      this.channel = {}
      this.showModel = true;
    },
    showModify(index) {
      this.channel = {
        id: this.channelList[index].id,
        channelName: this.channelList[index].channelName
      }
      this.showModel = true;
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.channel.id) {
            service.modifyChannel({channelName: this.channel.channelName}, this.channel.id)
                .then(res => {
                  if (res.state === 200) {
                    this.getChannelList();
                    this.$message.success("修改成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          } else {
            service.addChannel({channelName: this.channel.channelName})
                .then(res => {
                  if (res.state === 200) {
                    this.getChannelList();
                    this.$message.success("添加成功");
                  } else {
                    this.$message.error(res.message);
                  }
                })
          }
        }
      })
    },
    removeChannel(channelId) {
      service.removeChannel(channelId)
          .then(res => {
            if (res.state === 200) {
              this.getChannelList();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.message);
            }
          })
    },
    getChannelList() {
      service.getChannelList()
          .then(res => {
            if (res.state === 200) {
              this.channelList = res.data.channels;
              // 添加和编辑成功后重新拉取数据，然后关闭弹出窗
              this.showModel = false;
            } else {
              this.$message.error(res.message);
            }
          })
    }
  },
  created() {
    this.getChannelList();
  },
  name: "ChannelSetting"
}
</script>

<style scoped>
.edit-panel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 32px;
}
</style>