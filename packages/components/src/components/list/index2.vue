<template>
  <div>
    <template v-for="(item, index) in blockData">
      <ListItem
        :key="item.id"
        :lineData="item"
        :isFocus="focusId"
        @addItem="addItemHandler"
        @contentChange="contentChange(item)"
      />
    </template>
  </div>
</template>
<script>
import {
  showCommand,
  addListener,
  syncDom,
  markdownSyntaxTransform,
  findBlockDataForId,
  generateId,
} from "@super-doc/api";

import ListItem from "./listItem.vue";
export default {
  props: ["$superConfig"],
  data() {
    return {
      blockData: [],
      focusId: ""
    };
  },
  components: {
    ListItem,
  },
  methods: {
    addItemHandler(id) {
      const nId = generateId();
      // this.blockData.some((item, index) => {
      //   if(item.id === id) {
      //     this.blockData.splice(index+1, 0, { text: "新行", nId });
      //     return true
      //   };
      // })
      this.blockData.push({ text: "新行", nId });
      console.log('新的数组：', this.blockData);
      // this.focusId = nId;
    },
    initData() {
      this.blockData = JSON.parse(
        JSON.stringify(
          findBlockDataForId(this.$superConfig.blockId).PROXY_TARGET
        )
      ).map((item) => {
        item.id = generateId();
        item.text = '123123'
        this.focusId = this.focusId ? this.focusId : item.id;
        return item;
      });
    },
    contentChange({id, text}) {
      this.blockData.some(item => {
        if(item.id === id) {
          item.text = text;
          return true;
        }
      })
    }
  },
  mounted() {
    this.initData();
    console.log('zzzzz', this);
    setTimeout(() => {
      this.addItemHandler(this.blockData[0].id);
    }, (5000));
  },
};
</script>
<style scoped></style>
