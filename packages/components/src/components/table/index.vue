<template>
    <div>
      <el-table
        :data="tableData.table"
        border
        style="width: 100%; margin-top: 20px"
        :span-method="arraySpanMethod"
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
        uuid: generateId(),
        coords: [],
        hiddens: [],
        merges: []
      }
    },
    components: {
      SuperDocInput,
    //   Cell
    },
    methods: {
      init() {
        const _data = getBlockData(this.$attrs["block-id"]).data;
        _data.table.forEach(d => {
          d.__id__ = generateId();
        });
        
        this.tableData = {table: _data.table, title: _data.title};
        _data.mergeInfo.forEach(item => {
          this.coords.push(item.coord);
          this.merges.push(item.merge);
          this.hiddens.push(...item.hidden);
        })
      },
      formatTitleVal(content) {
        return content.split(".")[1].replace("}", "");
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        let merge = null;
        this.coords.some((coord, idx) => {
          const [r, c] = coord;
          const [mr, mc] = this.merges[idx]
          if(rowIndex === r && columnIndex === c) {
            merge = [mr, mc];
            return true;
          }
        })
        if(merge) return merge;

        let hidden = null; 
        this.hiddens.some(([ hr, hc ]) => {
          if(rowIndex === hr && columnIndex === hc) {
            hidden = [0, 0];
            return true;
          }
        });
        if(hidden) return [0, 0];
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
  