<template>
  <div></div>
</template>

<script>
import axios from "../../../axios.min.js";
import superDoc from "../../../packages/core/dist/core.esm-bundler.js";
import { AuaeTool } from '../superDocPlugins/tools/index'
import '../superDocPlugins/block/index'
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {},
  methods: {
    getParams(param) {
      var queryString = window.location.href.split('?')[1];
      if (queryString) {
          var params = queryString.split('&');
          for (var i = 0; i < params.length; i++) {
              var pair = params[i].split('=');
              if (decodeURIComponent(pair[0]) === param) {
                  return decodeURIComponent(pair[1]);
              }
          }
      }
      return null;
    },
    async getData() {
      const result = await axios({
        method: "GET",
        url: "/dddd/doc/mapping/getData?bcId=d59pi7dr2yw00&projectId=pro-1OYFBwfB",
        headers: {
          authorization: `Bearer ${this.getParams('token')}=`,
        },
      }).then((res) => {
        try {
          if (res.status === 200) {
            return res.data?.obj?.result ?? [];
          }
        } catch (error) {
          alert("请求数据失败");
        }
      });
      const blockData = this.formatData(result);
      console.log('-=====-', blockData);
      window.superDoc.setData(blockData);
    },
    formatData(data) {
      return data
        .filter((item) => {
          return (
            item.template.type === "Head" || item.template.type === "Paragraph" || item.template.type === "TableDoc"
          );
        })
        .map((item) => {
          if (item.template.type === "Head") {
            return {
              type: "Head",
              class: "Head",
              data: {
                text: item.datasource
                  ? this.replaceTemplateStrings(
                      item.template.data.text,
                      item.datasource
                    )
                  : item.template.data.text,
                level: item.template.data.level,
              },
            };
          } else if (item.template.type === "Paragraph") {
            return {
              type: "Paragraph",
              class: "Paragraph",
              data: {
                text: item.datasource
                  ? this.replaceTemplateStrings(
                      item.template.data.text,
                      item.datasource
                    )
                  : item.template.data.text,
              },
            };
          } else if (item.template.type === "TableDoc") {
            return {
              type: "TableDoc",
              class: "TableDoc",
              data: {
                table: item.datasource.datas,
                title: item.template.data.content
              },
            };
          }
        });
    },
    getPropertyValue(obj, path) {
      return path.split(".").reduce((o, key) => o && o[key], obj);
    },
    replaceTemplateStrings(str, values) {
      return str.replace(/\$\{(.*?)\}/g, (match, path) => {
        const replacement = this.getPropertyValue(values, path);
        return replacement !== undefined ? replacement : match;
      });
    },
    initSuperDoc() {
      window.superDoc = new superDoc({

        tools: {
          toolbar: {
            plugins: [ AuaeTool ],
            layout: []
          },
        }
      });
      // window.superDoc.setData();
      // window.superDoc.on('add', (...agrs) => {
      //   console.log('添加===', agrs);
      // });
      // window.superDoc.on('delete', (...agrs) => {
      //   console.log('删除====', agrs);
      // });
      // window.superDoc.on('update', (...agrs) => {
      // });
      // window.superDoc = doc;
    },
  },
  mounted() {
    // this.getData();
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
