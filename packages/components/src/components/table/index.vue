<template>
    <div>
      <el-table
        :data="tableData.table"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="item in tableData.title"
          :key="item.__id__"
          :prop="formatTitleVal(item.value)"
          :label="item.title"
        >
          <template slot-scope="scope">
            <SuperDocInput
              style="width: 100%;"
              ref="superDocInput"
              contenteditable="true"
              :content="scope.row[formatTitleVal(item.value)]"
              :params="{scope: scope}"
              @contentChange="contentChange"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import { generateId, getBlockData } from "@super-doc/api";
  import SuperDocInput from '../../common/input.vue';
  import Cell from './cell.vue';
  export default {
    data() {
      return {
        tableData: {table: [], title: []},
        uuid: generateId()
      }
    },
    components: {
      SuperDocInput,
    //   Cell
    },
    methods: {
      init() {
        const _data = getBlockData(this.$attrs["block-id"]).data
        _data.table.forEach(d => {
          d.__id__ = generateId();
        });
        this.tableData = _data;
      },
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
      contentChange({content, params}) {
        const propName = params.scope.column.property;
        params.scope.row[propName] = content;
      }
    },
    mounted() {
      this.init();
      console.log(this.tableData);
    },
    watch: {
      'tableData.table': {
        handler(n, o) {
          // this.uuid = generateId();
          console.log(this.uuid);
        },
        deep: true
      }
    }
  };
  </script>
  