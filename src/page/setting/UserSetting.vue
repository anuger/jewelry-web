<template>
  <div>
    <breadcrumb/>
    <div class="main-panel">
      <div class="edit-panel">
        <a-button type="primary" @click="openAdd">
          <a-icon type="plus"></a-icon>
          添加
        </a-button>
      </div>
      <a-table
          rowKey="id"
          :columns="userColumn"
          :data-source="userList"
          :pagination="false"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
        </span>
        <span slot="username" slot-scope="value, record">
          <a-badge v-if="record.userLevel === 1" status="success"/>
          {{ record.userLevel ===1 ? '管理员' : value }}
        </span>
        <span slot="createdTime" slot-scope="value">
          {{ value |dateFormat }}
        </span>
        <div slot="action" slot-scope="value, record, index">
          <a-button :disabled="record.userLevel === 1" type="link" @click="openModify(index)">编辑</a-button>
          <a-popconfirm
              :disabled="record.userLevel === 1"
              title="确定要删除吗?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="removeUser(record.id)"
          >
            <a-button :disabled="record.id === 1" type="link">删除</a-button>
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
        okText="提交"
    >
      <a-form-model
                    ref="form"
                    :model="user"
                    :rules="rules"
                    :labelCol="{span: 7}"
                    :wrapperCol="{span: 15}"
      >
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="user.username" placeholder="请输入用户名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="登录账号(手机号)" prop="account">
          <a-input v-model="user.account" placeholder="请输入登录账号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="权限" prop="userRoles">
          <a-checkbox-group v-model="user.userRoles">
            <a-row>
              <a-col :span="8">
                <a-checkbox :value="1">审核</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :value="2">上传CAD</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :value="3">出货</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :value="4">付款</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :value="5">设置</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写登录账号"));
      }
      if (!(/^1[0-9]{10}$/.test(value))) {
        return callback(new Error("登录账号有误"));
      }
      callback()
    };
    let checkUserRoles = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择权限"));
      }
      if (value.length === 0) {
        return callback(new Error("最少选择一项权限"));
      }
      callback();
    }
    return {
      showModel: false,
      rules: {
        username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
        account: [
          {required: true, message: '请填写登录账号', trigger: 'blur'},
          {validator: checkAccount, trigger: 'blur'}
        ],
        userRoles: [{validator: checkUserRoles, trigger: 'change'}]
      },
      userColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          scopedSlots: {customRender: "index"}
        },
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          width: 200,
          scopedSlots: {customRender: 'username'}
        },
        {
          title: '登录账号',
          dataIndex: 'account',
          key: 'account',
          width: 200
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: 250,
          scopedSlots: {customRender: "createdTime"}
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 130,
          scopedSlots: {customRender: 'action'}
        },
      ],
      userList: [],
      user: {}
    }
  },
  methods: {
    closeModel() {
      this.showModel = false;
    },
    openAdd() {
      this.user = {};
      this.showModel = true;
    },
    openModify(index) {
      this.user = this.userList[index];
      this.showModel = true;
    },
    removeUser(userId) {
      service.removeUser(userId)
          .then(res => {
            if (res.state === 200) {
              this.getUserList();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.message);
            }
          })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.user.id) {
            service.modifyUser(this.user, this.user.id)
                .then(res => {
                  if (res.state === 200) {
                    this.getUserList();
                    this.$message.success("修改成功");
                  } else {
                    this.$message.error(res.message)
                  }
                })
          } else {
            service.addUser(this.user)
                .then(res => {
                  if (res.state === 200) {
                    this.getUserList();
                    this.$message.success("添加成功");
                  } else {
                    this.$message.error(res.message)
                  }
                })
          }
        }
      })
    },
    getUserList() {
      service.getUserList()
          .then(res => {
            if (res.state === 200) {
              this.userList = res.data.merchantUsers;
              this.showModel = false;
            }
          })
    }
  },
  created() {
    this.getUserList();
  },
  name: "UserSetting"
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