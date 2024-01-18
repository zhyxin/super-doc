<template>
  <div>
    <el-table
      :data="tableData.table"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="item in tableData.title"
        :prop="formatTitleVal(item.value)"
        :label="item.title"
      >
        <template slot-scope="scope">
          <SuperDocInput
            style="width: 100%;"
            ref="superDocInput"
            contenteditable="true"
            :content="scope.row[formatTitleVal(item.value)]"
            @contentChange="contentChange($event)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBlockData } from "@super-doc/api";
import SuperDocInput from '../common/input.vue';
export default {
  data() {
    return {
      tableData: getBlockData(this.$attrs["block-id"]).data,
    };
  },
  components: {
    SuperDocInput
  },
  methods: {
    formatTitleVal(content) {
      return content.split(".")[1].replace("}", "");
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    contentChange({content, id}) {
      console.log('表格内容发送改变：', {content, id});
    }
  },
  mounted() {
    console.log(this.tableData);
  }
};
</script>
