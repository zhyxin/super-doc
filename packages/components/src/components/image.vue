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
import axios from "../../../../axios.min.js";
import { getBlockData,uploadImage } from "@super-doc/api";
import {
  getModules,
} from "@super-doc/share";
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
      // this.loading = true;
      // let manager = this.$superConfig.blockData.BlockManager
      console.log('进入获取让图片')
      // 上传照片不直接走接口
      let url = URL.createObjectURL(event.file);
      this.imagePath = url
      this.blockData.data.file = event.file;
      this.blockData.data.upload = true;
    },
    // 不严谨判断 ,暂时处理
    isBase64(str){
        if(str.indexOf('data:')!=-1 && str.indexOf('base64')!=-1 ){
            return true;
        }else{
            return false;
        }
    }
  },
  computed: {
    imagePath: {
      get() {
        let url = this.blockData.data.url
        if(url){
          if(this.isBase64(url)) return url
          if(url.startsWith('blob')) return url
           return url
        }else {
          return ""
        }
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
  margin-top: 5px;
}
</style>
