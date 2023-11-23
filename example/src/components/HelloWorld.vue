<template>
  <div>
  </div>
</template>

<script>
import superDoc from "/Users/yixin/Desktop/自己的项目/super-doc/packages/core/dist/core.esm-bundler.js";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
  },
  methods: {
    initSuperDoc() {
      window.superDoc = new superDoc({
      });
      window.superDoc.on('add', (...agrs) => {
        console.log('添加===', agrs);
      });
      window.superDoc.on('delete', (...agrs) => {
        console.log('删除====', agrs);
      });
      window.superDoc.on('update', (...agrs) => {
        console.log('更新====', agrs);
      });
      // window.superDoc = doc;
    },
  },
  mounted() {
    this.initSuperDoc();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h3
  margin 40px 0 0

ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px

a
  color #42b983
</style>
