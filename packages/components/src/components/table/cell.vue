<template>
  <!-- <SuperDocInput
    style="width: 100%;"
    ref="superDocInput"
    contenteditable="true"
    :content="scope.row[formatTitleVal(item.value)]"
    @contentChange="contentChange($event)"
  /> -->
  <demo></demo>
</template>
<script>
import SuperDocInput from "../../common/input.vue";

export default {
  props: {
    cell: {
      type: Object,
      require: true
    }
  },
  data() {
    return {};
  },
  components: {
    SuperDocInput,
  },
  methods: {
    formatTitleVal(content) {
      return content.split(".")[1].replace("}", "");
    },
    contentChange({content, id}) {
      console.log('表格内容发送改变：', {content, id});
    }
  },
};
</script>

<style lang="less" scoped></style>
