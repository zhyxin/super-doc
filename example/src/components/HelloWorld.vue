<template>
  <div v-loading="loading">
    <div id="editorjs"></div>
    <!-- 目录 -->
    <directory :blockData="blockData" />
  </div>
</template>

<script>
import axios from "../../../axios.min.js";
import superDoc from "../../../packages/core/dist/core.esm-bundler.js";
import {
  AuaeTool,
  FullTextTranslationEnglishTool,
  FullTextTranslationHKTool,
  ParagraphTranslationEnglishTool,
  ParagraphTranslationHKTool,
} from "../superDocPlugins/tools/index";
import "../superDocPlugins/block/index";
import divideJson from "../libs/divide.json";
import subDomain from "../libs/subDomain.json";
import subDomain2 from "../libs/subDomain2.json";
import uml from "../libs/uml.json";
import storyData from "../libs/storyData.json";
import storyData2 from "../libs/storyData2.json";
import directory from "./directory/index.vue";
import {
  generateId,
  addListener,
} from "../../../packages/api/dist/api.esm-bundler.js";

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
  components: { directory },
  data() {
    return {
      loading: false,
      blockData: [],
    };
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
      let projectId = this.getParams("projectId") || "pro-7CPYLsqB";
      this.loading = true;
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
        } finally {
          this.loading = false;
        }
      });
      const blockData = this.formatData(result);
      let data = blockData.slice(0);
      window.superDoc.setData(data.length !== 0 ? data : testData);
      // 目录数据追加-响应式
      this.blockData = window.superDoc
        .getBlocks()
        .filter((item) => item.type == "Head");
    },
    formatData(data) {
      return data
        .filter((item) => {
          return (
            (item.template.type === "ImageDocFlowChart" &&
              !this.getParams("hiddenChar")) ||
            (item.template.type === "Head" && !this.getParams("hiddenHead")) ||
            (item.template.type === "Paragraph" &&
              !this.getParams("hiddenParagraph")) ||
            (item.template.type === "TableDoc" &&
              !this.getParams("hiddenTable")) ||
            (item.template.type === "ListDoc" && !this.getParams("ListDoc")) ||
            (item.template.type === "ImageDoc" &&
              !this.getParams("hiddenImage"))
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
            let mergeInfo = [];
            const data = this.generateTableMerge(item);
            for (let key in data) {
              if (!data[key]) continue;
              data[key].forEach((item) => {
                if (!item.hidden.length) return;
                mergeInfo.push(item);
              });
            }
            return {
              type: "TableDoc",
              class: "TableDoc",
              data: {
                table: item.datasource.datas,
                title: item.template.data.content,
                mergeInfo,
              },
            };
          } else if (item.template.type === "ImageDocFlowChart") {
            let value = this.replaceTemplateStringsDemo(
              item.template.data.text,
              item.datasource
            );
            value = this.formatUserMapData(JSON.parse(value));
            // let value = this.formatUserMapData(item.datasource.data.task);

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
          } else if (item.template.type === "ListDoc") {
            return {
              type: "ListDoc",
              data: {
                type: "ul",
                list: item.template.data.list.map((_item) => {
                  return {
                    text: this.replaceTemplateStrings(
                      _item.text,
                      item.datasource
                    ),
                  };
                }),
              },
              class: "ListDoc",
            };
          }
        });
    },
    getPropertyValue(obj, path) {
      return path.split(".").reduce((o, key) => o && o[key], obj);
    },
    replaceTemplateStringsDemo(str, values) {
      return str.replace(/\$\{(.*?)\}/g, (match, path) => {
        const replacement = this.getPropertyValue(values, path);
        return replacement !== undefined
          ? typeof replacement == "object"
            ? JSON.stringify(replacement)
            : replacement
          : match;
      });
    },
    replaceTemplateStrings(templateString, data) {
      console.log(templateString, data);
      return templateString.replace(
        /\$\{([\w.\[\]]+)\}/g,
        function (match, key) {
          let keys = key.replace(/\[([^\]]+)\]/g, ".$1").split(".");
          let value = data;
          for (let i = 0; i < keys.length; i++) {
            value = value[keys[i]];

            // 如果找不到对应的值，则返回原始的匹配字符串
            if (value === undefined) {
              return match;
            }
          }
          // 返回找到的值作为替换结果
          return value;
        }
      );
    },
    initSuperDoc() {
      window.superDoc = new superDoc({
        isReadOnly: false,
        tools: {
          toolbar: {
            plugins: [
              ParagraphTranslationEnglishTool,
              ParagraphTranslationHKTool,
              FullTextTranslationEnglishTool,
              FullTextTranslationHKTool,
              AuaeTool
            ],
            layout: [],
          },
          menu: [],
        },
      });
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
    bindPostMessage() {
      window.addEventListener(
        "message",
        (e) => {
          if (e.data.isreload) {
            window.location.reload(true);
          }
        },
        false
      );
    },
    generateTableMerge(data) {
      const mergeRow = [];
      let mergeInfo = null;
      data.template.data.content.forEach((content, col) => {
        if (content.mergeRuleValue) {
          if (!mergeInfo) mergeInfo = {};
          const key = content.mergeRuleValue
            .replace("${datas[].", "")
            .replace("}", "");
          mergeRow.push([key, col]);
          mergeInfo[key] = mergeInfo[key] ? mergeInfo[key] : [];
          // mergeInfo[key] = [];
        }
      });

      if (!mergeInfo) return null;

      data.datasource.datas.forEach((datasource, rIdx, target) => {
        mergeRow.forEach((colItem, idx, target) => {
          const [key, colIdx] = colItem;
          if (datasource[key]) {
            const mergeItem = mergeInfo[key].find((mergeItem, idx) => {
              return mergeItem.key === `${datasource[key]}+${colIdx}`;
            });
            if (mergeItem) {
              mergeItem.hidden.push([rIdx, colIdx]);
              mergeItem.merge[0] += 1;
            } else {
              mergeInfo[key].push({
                coord: [rIdx, colIdx],
                merge: [1, 1],
                hidden: [],
                key: `${datasource[key]}+${colIdx}`,
              });
            }
          } else {
            if (mergeInfo[key][mergeInfo[key].length - 1]) {
              mergeInfo[key][mergeInfo[key].length - 1].key = null;
            }
          }
        });
      });
      return mergeInfo;
    },
  },
  mounted() {
    if(this.getParams("isDDD")) {
      this.bindPostMessage();
      this.getData();
    }
    this.initSuperDoc();
    // addListener('add', (block) => {
    //   console.log('新增了！');
    // })
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

<style lang="less"></style>
