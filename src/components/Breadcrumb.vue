<template>
<div class="breadcrumb-panel p-l-5">
  <a-breadcrumb>
    <a-breadcrumb-item>订单</a-breadcrumb-item>
    <a-breadcrumb-item>待处理</a-breadcrumb-item>
  </a-breadcrumb>
</div>
</template>

<script>
export default {
name: "Breadcrumb"
}
</script>

<style scoped>
.breadcrumb-panel {
  height: 48px;
  width: calc(100% + 24px);
  display: flex;
  align-items: center;
  margin-left: -12px;
  background-color: #ffffff;
}
</style>