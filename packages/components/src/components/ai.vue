<template>
  <div class="ai-border">
    <div class="ai-input">
      <el-input
        type="textarea"
        ref="aiInput"
        v-model="aiInput.default.content"
        :prefix-icon="loading ? 'el-icon-loading' : 'el-icon-magic-stick'"
        style="border: none"
        clearable
        placeholder="请选择或输入指令，如：“帮我写一篇短文小说”"
        :disabled="loading"
        @keydown.native="generateAiContent($event)"
        @change="contentChange"
      />
    </div>
    <div class="ai-content-container">
      <div class="ai-content" v-if="aiOutput" v-html="aiOutputHtml" :disabled="loading"/>
    </div>
    <div class="handler" v-if="aiOutput">
      <div>
        <el-button
          size="mini"
          icon="el-icon-delete"
          type="text"
          @click="handlerAbandon"
          >放弃</el-button
        >
      </div>
      <div>
        <el-button
          size="mini"
          icon="el-icon-refresh-left"
          type="text"
          @click="handlerRegenerate"
          >重新生成</el-button
        >
      </div>
      <div>
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="handlerUseAiContent"
          >使用</el-button
        >
      </div>
    </div>

    <!-- 后续改成superSDK提供 -->
    <div :style="toolsStyle" class="tools">
      <div>
        <span
          style="
            font-size: 12px;
            color: red;
            font-weight: 600;
            user-select: none;
          "
          >AI</span
        >
        <span style="cursor: pointer" @click="requestExpandAiApi">扩写</span>
        <span style="cursor: pointer" @click="requestPerfectAiApi">完善</span>
      </div>
    </div>
  </div>
</template>
<script>

import axios from "/Users/yixin/Desktop/自己的项目/supperDoc/axios.min.js";
import { compileParagraph } from "@super-doc/share";
import { showCommand, addListener } from '@super-doc/api';

export default {
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      aiInput: {
        default: {
          session_id: "20231026",
          content:
            "",
          prompt:
            "你现在扮演一个文档内容生成AI，根据用户需求直接返回用户所需的内容，不需要额外的描述信息。用户需求：${{user_input}}",
        },
        expand: {
          session_id: "20231026111",
          content:
            "",
          prompt: (content) =>
            `你现在扮演一个文本提示词扩写领域的专家，从专业的角度，您认为用户输入的内容是否有需要扩写的地方？把扩写后的内容插入到用户的文本中，最后只需要把全文返回给用户，不需要额外的描述。\n\n用户全文内容是${content}：\n\n 需要扩写的内容是：\${{user_input}}`,
        },
        perfect: {
          session_id: "20231026222",
          content: "",
          prompt: (content) =>
            `你现在扮演一个文本提示词完善领域的专家，从专业的角度，您认为用户输入的内容是否有需要修改的地方？把修改后的内容插入到用户的文本中，最后只需要把全文返回给用户，不需要额外的描述。\n\n用户全文内容是${content}：\n\n 需要完善的内容是：\${{user_input}}`,
        },
      },
      aiOutput: "",
      loading: false,
      showTools: false,
      selectText: null,
      session_id: "20231026",
    };
  },
  props: ["$superConfig"],
  computed: {
    toolsStyle() {
      return `position: fixed;display: ${
        this.showTools ? "unset" : "none"
      };top: ${this.mouseY}px;left: ${this.mouseX}px`;
    },
    aiOutputHtml() {
      return this.aiOutput
        .split("\n")
        .filter((content) => !!content)
        .map(
          (content) =>
            `<div style="margin: 14px auto;" class="__ai_output__">${content}</div>`
        )
        .join("");
    },
    content: {
      get() {
        return this.$superConfig.blockData.text;
      },
      set(val) {
        this.$refs["aiInput"].textContent = val;
      },
    },
  },
  methods: {
    handlerAbandon() {
      this.aiOutput = "";
      this.$refs.aiInput.focus();
    },
    handlerRegenerate() {
      this.requestAiApi();
    },
    handlerUseAiContent() {
      const blocks = compileParagraph(
        this.aiOutput
          .split("\n")
          .filter((content) => !!content)
          .join("\n")
      );
      this.$replaceCurrentBlock(blocks, this.$superConfig.blockId);
    },
    generateAiContent(event) {
      if (event.keyCode === 13) {
        this.requestAiApi();
      }
      event.stopPropagation();
    },
    async requestAiApi() {
      this.loading = true;
      this.aiOutput = "";
      const result = await axios({
        method: "POST",
        url: "http://10.8.6.30:9994/ai_service/exec_instruction/",
        data: {
          user_input: this.aiInput.default.content,
          session_id: this.aiInput.default.session_id,
          instruction: {
            id: "",
            name: "",
            desc: "",
            prompt: this.aiInput.default.prompt,
            result_type: "string",
          },
        },
      }).then((res) => {
        if (res.status === 200) {
          return res?.data?.results?.instruction_result.raw_result;
        }
      });
      this.aiOutput = result;
      this.loading = false;
    },
    async requestExpandAiApi() {
      this.loading = true;
      this.aiOutput = "";
      const result = await axios({
        method: "POST",
        url: "http://10.8.6.30:9994/ai_service/exec_instruction/",
        data: {
          session_id: this.aiInput.expand.session_id,
          user_input: this.selectText,
          instruction: {
            id: "",
            name: "",
            desc: "",
            prompt: this.aiInput.expand.prompt(this.aiOutput),
            result_type: "string",
          },
        },
      }).then((res) => {
        if (res.status === 200) {
          return res?.data?.results?.instruction_result.raw_result;
        }
      });
      this.aiOutput = result;
      this.loading = false;
    },
    async requestPerfectAiApi() {
      this.loading = true;
      const result = await axios({
        method: "POST",
        url: "http://10.8.6.30:9994/ai_service/exec_instruction/",
        data: {
          session_id: this.aiInput.perfect.session_id,
          user_input: this.selectText,
          instruction: {
            id: "",
            name: "",
            desc: "",
            prompt: this.aiInput.perfect.prompt(this.aiOutput),
            result_type: "string",
          },
        },
      }).then((res) => {
        if (res.status === 200) {
          return res?.data?.results?.instruction_result.raw_result;
        }
      });
      this.aiOutput = result;
      this.loading = false;
    },
    contentChange(content) {
      this.$superDocUpdateBlockData(this.$superConfig.blockId, {
        text: content,
      });
    },
  },
  mounted() {
    document.addEventListener("mouseup", (event) => {
      this.mouseX = event.clientX + window.pageXOffset;
      this.mouseY = event.clientY + window.pageYOffset;
      setTimeout(() => {
        this.showTools = !!this.selectText;
      }, 100);
    });
    document.addEventListener("selectionchange", (event) => {
      if (
        document.getSelection().anchorNode?.parentNode.className !==
        "__ai_output__"
      ) {
        setTimeout(() => {
          this.selectText = null;
        }, 20)
      } else {
        if (!document.getSelection().toString()) {
          setTimeout(() => {
            this.selectText = document.getSelection().toString();
            console.log(this.selectText);
          }, 50);
        } else {
          this.selectText = document.getSelection().toString();
          console.log(this.selectText);
        }
      }
    });
    // TODO: 这里要改
    addListener("update", (blocks) => {
      const block = blocks.find(
        (block) => block.id === this.$superConfig.blockId
      );
      block && (this.content = block.data.text);
    });
  },
};
</script>
<style lang="less" scoped>
.ai-border {
  flex-wrap: wrap;
  border-radius: 6px;
  margin: 5px auto;
  padding: 3px 0px;
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(
      to right,
      rgb(255, 255, 255),
      rgb(255, 255, 255)
    ),
    radial-gradient(
      circle at 0px 5%,
      rgba(255, 116, 236, 0.7),
      rgba(133, 112, 255, 0.7) 20%,
      rgba(133, 112, 255, 0.7) 30%,
      rgba(90, 239, 255, 0.7) 60%,
      rgba(90, 239, 255, 0.7) 80%,
      rgb(46, 150, 255) 100%
    );
  align-items: center;

  .ai-input/deep/textarea {
    border: none;
  }

  .el-input/deep/input {
    border: none;
    color: #000;
  }

  .el-input/deep/.el-input-group__append {
    border: none;
    background: transparent;
  }

  .ai-content-container {
    .ai-content {
      border-top: 1px solid rgb(221, 222, 222);
      padding: 5px;
      font-size: 14px;
      line-height: 1.7;
    }
  }

  .handler {
    // position: absolute;
    // top: 100%;
    // left: 0;
    display: flex;
    justify-content: right;

    > div {
      margin-right: 10px;
    }
  }

  .tools > div {
    display: flex;
    font-size: 13px;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    background: #ffffff;
    > span {
      transition: color 0.2s;
      margin: 3px 6px;
    }
    > span:hover {
      color: #ccc;
    }
  }
}
</style>
