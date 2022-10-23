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
          :columns="factoryColumn"
          :data-source="factoryList"
          :pagination="false"
      >
        <span slot="index" slot-scope="value, record, index">
          {{ index + 1 }}
        </span>
        <span slot="createdTime" slot-scope="value">
          {{ value | dateFormat }}
        </span>
        <div slot="action" slot-scope="value,record, index">
          <a-button type="link" @click="showModify(index)">编辑</a-button>
          <a-popconfirm
              title="确定要删除吗?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="removeFactory(record.id)"
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
                    :model="factory"
                    :rules="rules"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 15}"
      >
        <a-form-model-item label="工厂名称" prop="factoryName">
          <a-input v-model="factory.factoryName" placeholder="请输入工厂名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="管理员手机号" prop="adminPhone">
          <a-input v-model="factory.adminPhone" placeholder="请输入管理员手机号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工厂地址" prop="address">
          <a-input v-model="factory.address" placeholder="请输入工厂地址"></a-input>
        </a-form-model-item>
      </a-form-model>

    </a-modal>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写管理员手机号"));
      }
      if (!(/^1[0-9]{10}$/.test(value))) {
        return callback(new Error("手机号有误"));
      }
      callback()
    };
    return {
      showModel: false,
      factory: {},
      rules: {
        factoryName: [{required: true, message: '请填写工厂名', trigger: 'blur'}],
        adminPhone: [
          {required: true, message: '请填写管理员手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      factoryColumn: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          scopedSlots: {customRender: 'index'}
        },
        {
          title: '工厂名',
          dataIndex: 'factoryName',
          key: 'factoryName',
          width: 150
        },
        {
          title: '管理员',
          dataIndex: 'adminPhone',
          key: 'adminPhone',
          width: 160,
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
          width: 350
        },
        {
          title: '添加时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: 250, scopedSlots: {customRender: 'createdTime'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 180,
          scopedSlots: {customRender: 'action'}
        },
      ],
      factoryList: []
    }
  },
  methods: {
    closeModel() {
      this.showModel = false;
    },
    showAdd() {
      this.factory = {};
      this.showModel = true;
    },
    showModify(index) {
      this.factory = {
        id: this.factoryList[index].id,
        factoryName: this.factoryList[index].factoryName,
        adminPhone: this.factoryList[index].adminPhone,
        address: this.factoryList[index].address
      }
      this.showModel = true;
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 有id说明是编辑
          if (this.factory.id) {
            service.modifyFactory(this.factory, this.factory.id)
                .then(res => {
                  if (res.state === 200) {
                    this.getFactoryList();
                    this.$message.success("修改成功", 1);
                  } else {
                    this.$message.error(res.message)
                  }
                })
          } else {
            service.addFactory(this.factory)
                .then(res => {
                  if (res.state === 200) {
                    this.$message.success("添加成功", 1);
                    this.getFactoryList();
                  } else {
                    this.$message.error(res.message)
                  }
                })
          }
        }
      })
    },
    removeFactory(id) {
      service.removeFactory(id)
          .then(res => {
            if (res.state === 200) {
              this.$message.success("删除成功");
              this.getFactoryList();
            } else {
              this.$message.error(res.message)
            }
          })
    },
    getFactoryList() {
      service.getFactoryList()
          .then(res => {
            if (res.state === 200) {
              this.factoryList = res.data.factoryList;
              // 添加和编辑成功后重新拉取数据，然后关闭弹出窗
              this.showModel = false;
            } else {
              this.$message.error(res.message)
            }
          })
    }
  },
  created() {
    this.getFactoryList();
  },
  name: "FactorySetting"
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