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
  // import Cell from './cell.vue';
  
  

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
        if(rowIndex === 0 && columnIndex === 0) {
          return [2, 2];
        }
        if(rowIndex === 0 && columnIndex === 1 ||
          rowIndex === 1 && columnIndex === 0 ||
          rowIndex === 1 && columnIndex === 1 ||
          rowIndex === 4 && columnIndex === 3 ||
          rowIndex === 5 && columnIndex === 3 ||
          rowIndex === 5 && columnIndex === 2 ||
          rowIndex === 3 && columnIndex === 2
        ) {
          return [0, 0]
        }

        if(rowIndex === 4 && columnIndex === 2) {
          return [2, 2]
        }

        if(rowIndex === 3 && columnIndex === 1) {
          return [1, 2]
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
    },
  };
  </script>
  