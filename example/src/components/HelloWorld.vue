<template>
  <div>
    <!-- 目录 -->
    <directory :blockData="blockData"/>
  </div>
</template>

<script>
import axios from "../../../axios.min.js";
import superDoc from "../../../packages/core/dist/core.esm-bundler.js";
import { AuaeTool } from "../superDocPlugins/tools/index";
import "../superDocPlugins/block/index";
// import superDoc from "D:/Company/agree_project/super-doc/packages/core/dist/core.esm-bundler.js";
import divideJson from "../libs/divide.json";
import subDomain from "../libs/subDomain.json";
import subDomain2 from "../libs/subDomain2.json";
import uml from "../libs/uml.json";
import storyData from "../libs/storyData.json";
import storyData2 from "../libs/storyData2.json";
import directory from "./directory/index.vue";
import { generateId } from "../../../packages/api/dist/api.esm-bundler.js";

const testData = [
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "故事地图",
      mapData: divideJson,
      mapType: "divide",
    },
  },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "故事地图",
      mapData: subDomain2,
      mapType: "subDomain",
    },
  },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "划分子域",
      mapData: subDomain,
      mapType: "subDomain",
    },
  },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "uml流程图",
      mapData: uml,
      mapType: "uml",
    },
  },
  // {
  //   type: "Auae",
  //   class: "Auae",
  //   data: {
  //     title: "故事地图",
  //     mapData: storyData,
  //     mapType:"userStory",
  //   },
  // },
  // {
  //   type: "Auae",
  //   class: "Auae",
  //   data: {
  //     title: "故事地图",
  //     mapData: storyData,
  //     mapType:"userStory",
  //   },
  // },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "故事地图",
      mapData: storyData,
      mapType: "userStory",
    },
  },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "故事地图",
      mapData: storyData2,
      mapType: "userStory",
    },
  },
  {
    type: "Auae",
    class: "Auae",
    data: {
      title: "故事地图",
      mapData: storyData,
      mapType: "userStory",
    },
  },
];
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {directory},
  data(){
    return {
      blockData:[]
    }
  },
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
      let bcId = this.getParams("bcId") || "d59pi7dr2yw00";
      let projectId = this.getParams("projectId") || "pro-1OYFBwfB";
      const result = await axios({
        method: "GET",
        url: `/dddd/doc/mapping/getData?bcId=${bcId}&projectId=${projectId}`,
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
      let data = blockData.slice(0);
      window.superDoc.setData(data.length !== 0 ? data : testData);
      // 目录数据追加-响应式
      this.blockData = window.superDoc.getBlocks().filter((item)=> item.type  == 'Head')
    },
    formatData(data) {
      return data
        .filter((item) => {
          return (
            item.template.type === "ImageDocFlowChart" ||
            item.template.type === "Head" ||
            item.template.type === "Paragraph" ||
            item.template.type === "TableDoc" ||
            item.template.type === "ImageDoc"
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
          } else if (item.template.type === "ImageDocFlowChart") {
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
          } else if (item.template.type === "ImageDoc") {
            return {
              type: "ImageDoc",
              data: {
                desc: "",
                url: this.replaceTemplateStrings(
                  item.template.data.text,
                  item.datasource
                ),
              },
              class: "ImageDoc",
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
        return replacement !== undefined
          ? typeof replacement == "object"
            ? JSON.stringify(replacement)
            : replacement
          : match;
      });
    },
    initSuperDoc() {
      window.superDoc = new superDoc({
        tools: {
          toolbar: {
            plugins: [AuaeTool],
            layout: [],
          },
        },
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
    getEventList(event, parent) {
      // eventList
      let eventList = {
        id: event.id,
        description: null,
        placeholder: event.name,
        taskId: parent.id,
      };
      if (event.ruleInfo) {
        eventList.rule = {
          id: "rule_" + generateId(),
          description: event.ruleInfo,
          placeholder: event.ruleInfo,
          taskId: parent.id,
        };
      }
      return eventList;
    },
    // 格式化用户故事地图数据
    formatUserMapData(data) {
      let userMap = {
        activitys: [],
        position: '{"x":30,"y":87,"width":100,"height":100}',
      };
      let activitys = [];
      if (Object.prototype.toString.call(data) == "[object Object]") {
        activitys = [data];
      } else {
        activitys = data;
      }
      activitys.forEach((f) => {
        userMap.activitys.push({
          id: "activity" + f.id,
          description: null,
          placeholder: f.name || "未知",
          childActivityList: [],
          taskList: [
            {
              id: f.id,
              placeholder: f.name || "未知",
              eventList:
                f.commandList?.map((c) => {
                  return this.getEventList(c, f);
                }) ?? [],
            },
          ],
        });
      });
      return userMap;
    },
    // 接收窗口刷新信息
    bindPostMessage(){
       window.addEventListener('message',(e)=>{
        if(e.data.isreload){
          window.location.reload(true)
        }
      },false)
    }
  },
   mounted() {
    this.bindPostMessage()
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

<style lang="less">
.super-directory {
  width: 250px;
  z-index: 1000;
  position: fixed;
  background: #fff;
  right: 0;
  top: 0;
  bottom: 0;
  // height: 100px;
  min-height: 100vh;
  height: 100%;
  // max-height: 50vh;
  margin: auto;
  overflow: auto;
  cursor: pointer;
  font-weight: bold;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  // box-shadow: 0px 3px 10px #bbbbbb;
  border-left: 1px solid var(--we_line_light_color, rgba(23, 26, 29, 0.08));
  .super-directory-title {
    margin: 5px;
  }
  .super-directory-item {
    text-align: left;
    margin: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &:hover {
      background: rgb(245, 247, 250);
    }
  }
  .super-directory-h1 {
    padding-left: 3px;
  }
  .super-directory-h2 {
    padding-left: 16px;
  }
  .super-directory-h3 {
    padding-left: 32px;
  }
  .super-directory-h4 {
    padding-left: 48px;
  }
  .super-directory-h5 {
    padding-left: 54px;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa; /* 设置滑块背景色 */
    border-radius: 4px; /* 设置滑块圆角 */
  }
}
</style>
