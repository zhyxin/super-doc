<template>
  <div class="image-wrap">
    <el-upload
      class="upload-demo"
      drag
      action="#"
      accept="image/jpeg,image/png,image/jpg"
      :show-file-list="false"
      :http-request="uploadImage"
      v-if="!imagePath"
      v-loading="loading"
      element-loading-text="图片上传中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 247, 247, 0.8)"
      style="text-align: center"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" ref="uploadEl">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <div v-else>
      <el-image :src="imagePath" :preview-src-list="[imagePath]"></el-image>
    </div>
  </div>
</template>

<script>
/**
 * 组件需要把数据同步回去的方案一：
 *
 * API提供更新json的方法，插件调用该方法去更新指定blockID的数据
 *
 */
import axios from "/Users/yixin/Desktop/自己的项目/supperDoc/axios.min.js";
import { getBlockData } from "@super-doc/api";
export default {
  data() {
    return {
      blockData: getBlockData(this.$attrs["block-id"]),
      blockId: this.$attrs["block-id"],
      menuId: 149,
      imageFile: null,
      loading: false,
    };
  },
  props: ["$superConfig"],
  methods: {
    async uploadImage(event) {
      this.loading = true;
      const fd = new FormData();
      fd.append("menuId", this.menuId);
      fd.append("file", event.file);
      fd.append("img", event.file);
      const result = await axios({
        method: "POST",
        url: "/arm/create/img",
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer rELUYyv2+yrUiuW4Bea2n78GH18=`,
        },
        data: fd,
      });
      const path = result?.data?.content?.path;
      if (!path) return;
      this.loading = false;
      this.imagePath = `/arm${path}`;
    },
  },
  computed: {
    imagePath: {
      get() {
        return this.blockData.data.url;
      },
      set(val) {
        this.blockData.data.url = val;
      },
    },
  },
  mounted() {
    if (!this.imagePath) {
      this.$refs["uploadEl"]?.click();
    }
  },
};
</script>

<style scoped lang="less">
.image-wrap {
  position: relative;
  border: 2px solid transparent;
  transition: border 0.3s;
}
</style>
