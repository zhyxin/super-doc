<template>
  <div></div>
</template>

<script>
// import axios from "/Users/yixin/Desktop/自己的项目/supperDoc/axios.min.js";
import axios from "../../../axios.min.js";
import divideJson from "../../libs/divide.json";
import subDomain from "../../libs/subDomain.json";
import uml from "../../libs/uml.json";
import storyData from "../../libs/storyData.json";
// import superDoc from "/Users/yixin/Desktop/自己的项目/super-doc/packages/core/dist/core.esm-bundler.js";
import superDoc from "D:/Company/agree_project/super-doc/packages/core/dist/core.esm-bundler.js";
// import superDoc from "D:/Company/agree_project/super-doc/packages/core/dist/core.cjs.js";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      divideJson: divideJson,
      subDomain: subDomain,
      uml: uml,
    };
  },
  components: {},
  methods: {
    getParams(param) {
      var queryString = window.location.href.split("?")[1];
      if (queryString) {
        var params = queryString.split("&");
        for (var i = 0; i < params.length; i++) {
          var pair = params[i].split("=");
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
          authorization: `Bearer ${this.getParams("token")}=`,
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
      console.log("-=====-", blockData);
      let a = blockData.slice(0, 1);
      window.superDoc.setData(a);
    },
    formatData(data) {
      // return [{
      //         type: "Auae",
      //         class: "Auae",
      //         data: {
      //           title: "故事地图",
      //           mapData: divideJson,
      //         },
      //       },
      //       {
      //         type: "Auae",
      //         class: "Auae",
      //         data: {
      //           title: "划分子域",
      //           mapData: subDomain,
      //         },
      //       },
      //       {
      //         type: "Auae",
      //         class: "Auae",
      //         data: {
      //           title: "uml流程图",
      //           mapData: uml,
      //         },
      //       },
      //       {
      //         type: "Auae",
      //         class: "Auae",
      //         data: {
      //           title: "故事地图",
      //           mapData: storyData,
      //           mapType:"userStory",
      //         },
      //       },
      //       ]
      return data
        .filter((item) => {
          return (
            item.template.type === "ImageDoc"
            // item.template.type === "Head" || item.template.type === "Paragraph" || item.template.type === "TableDoc" || item.template.type === "ImageDoc"
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
                title: item.template.data.content,
              },
            };
          } else if (item.template.type === "ImageDoc") {
            let value = this.replaceTemplateStrings(
              item.template.data.text,
              item.datasource
            );
            value = this.formatUserMapData(JSON.parse(value));
            return {
              type: "Auae",
              class: "Auae",
              data: {
                title: "故事地图",
                mapData: value,
                mapType: "userStory",
              },
            };
          }
        });
    },
    getPropertyValue(obj, path) {
      return path.split(".").reduce((o, key) => o && o[key], obj);
    },
    replaceTemplateStrings(str, values) {
      console.log("str", str);
      console.log("values", values);
      return str.replace(/\$\{(.*?)\}/g, (match, path) => {
        const replacement = this.getPropertyValue(values, path);
        return replacement !== undefined
          ? typeof replacement == "object"
            ? JSON.stringify(replacement)
            : replacement
          : match;
      });
    },
    formatUserMapData(data) {
      let userMap = {
        activitys: [],
      };
      let activitys = [];
      if (Object.prototype.toString.call(data) == "[object Object]") {
        activitys = [data];
      } else {
        activitys = data;
      }
      activitys.forEach((f) => {
        userMap.activitys.push({
          id: f.id,
          description: f.name || "未知",
          placeholder: f.name,
          childActivityList: [],
          taskList:
            f.commandList?.map((c) => {
              return {
                id: c.id,
                description: c.name || "未知",
                placeholder: c.name || "未知",
              };
            }) || [],
        });
      });
      return userMap;
    },
    initSuperDoc() {
      window.superDoc = new superDoc({});
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
  beforeCreate() {},
  mounted() {
    this.getData();
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
