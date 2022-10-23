<template>
  <a-range-picker
      size="small"
      :default-value="vaule"
      :ranges="{
        '今天': [moment(), moment()],
        '昨天': [moment().add(-1, 'days'),moment().add(-1, 'days')],
        '最近7天': [moment().add(-7, 'days'), moment()],
        '最近一个月': [moment().add(-1, 'months'), moment()],
        '最近一年': [moment().add(-1, 'years'), moment()] }"
      :format="dateFormat"
      @change="onChange"
  >
    <a-icon slot="suffixIcon" type="calendar" />
  </a-range-picker>
</template>

<script>

import moment from 'moment';

export default {
  props: {
    vaule: {
      type: Array,
      default: () => ['', '']
    }
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD'
    }
  },
  methods: {
    moment,
    onChange(value) {
      if (value.length === 0) {
        return this.$emit("change", ['', ''])
      }
      let beginTime = moment(value[0]).format(this.dateFormat);
      let endTime = moment(value[1]).format(this.dateFormat)
      this.$emit("change", [beginTime, endTime])
    }
  },
  name: "DateRangePicker"
}
</script>

<style scoped>

</style>