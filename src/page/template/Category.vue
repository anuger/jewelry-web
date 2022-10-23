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
          :columns="columns"
          :data-source="categoryList"
          :pagination="false"
      >
        <span slot="createdTime" slot-scope="value">
            {{ value |dateFormat }}
          </span>
        <div slot="action" slot-scope="value, record">
          <a-button type="link" @click="showEdit(record.id, record.categoryName)">编辑</a-button>
          <a-popconfirm
              title="确定要删除吗?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="removeCategory(record.id)"
          >
            <a-button type="link">删除</a-button>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <a-modal
        centered
        title="编辑"
        okText="提交"
        :visible="showModel"
        @cancel="closeModel"
        class="flex-center"
        @ok="submit"
    >
      <a-form-model>
        <a-form-model-item label="类别名称" :labelCol="{span: 4}" :wrapperCol="{span: 10}">
          <a-input v-model="categoryName" auto-focus placeholder="请输入类别名称"></a-input>
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
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 100,
          customRender: (value, record, index) => index + 1
        },
        {
          title: "类别名称",
          dataIndex: "categoryName",
          key: "categoryName",
          width: 150
        },
        {
          title: "版数",
          dataIndex: "templateCount",
          key: "templateCount",
          width: 100
        },
        {
          title: "添加时间",
          dataIndex: "createdTime",
          key: "createdTime",
          width: 150,
          scopedSlots: {customRender: "createdTime"}
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          width: 150,
          scopedSlots: {customRender: "action"}
        }
      ],
      categoryList: [],
      showModel: false,
      editCategoryId: 0,
      categoryName: ''
    }
  },
  methods: {
    showEdit(id, categoryName) {
      this.editCategoryId = id;
      this.categoryName = categoryName;
      this.showModel = true;
    },
    showAdd() {
      this.editCategoryId = 0;
      this.categoryName = '';
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
    },
    getAllCategory() {
      service.getCategoryList()
          .then(res => {
            if (res.state === 200) {
              this.showModel = false;
              this.categoryList = res.data.categories;
            } else {
              this.$message.error(res.message)
            }
          })
    },
    submit() {
      if (this.categoryName === '') {
        return this.$message.error("请输入类别名称");
      }
      if (this.editCategoryId === 0) {
        service.addCategory({categoryName: this.categoryName})
            .then(res => {
              if (res.state === 200) {
                this.getAllCategory();
                this.$message.success("添加成功");
              } else {
                this.$message.error(res.message)
              }
            })
      } else {
        service.modifyCategory(this.editCategoryId, {categoryName: this.categoryName})
            .then(res => {
              if (res.state === 200) {
                this.getAllCategory();
                this.$message.success("修改成功");
              } else {
                this.$message.error(res.message);
              }
            })
      }
    },
    removeCategory(categoryId) {
      service.removeCategory(categoryId)
      .then(res => {
        if (res.state === 200) {
          this.getAllCategory();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.message);
        }
      })
    }
  },
  created() {
    this.getAllCategory();
  },
  name: "category"
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