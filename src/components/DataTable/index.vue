<template>
  <el-table
    ref="multipleTable"
    :data="viewData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column v-if="selection" type="selection" width="55">
    </el-table-column>

    <slot>
      <template v-for="column in newColumns" :key="column.property">
        <el-table-column
          :sortable="column.sortable"
          :label="column.label"
          :property="column.property"
        >
          <template default #default="scope">
            <slot :name="columns.property" :scope="scope">
              {{ scope.row[column.property] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </slot>

    <el-table-column v-if="actions" label="Actions" align="right">
      <template #default="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
          >Edit</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-row class="mt-6">
    <el-col :span="8" :offset="0" v-if="paginated">
      <el-pagination
        v-model:currentPage="page"
        :page-size="perPage"
        :total="totalItems"
        layout="prev, pager, next"
      >
      </el-pagination>
    </el-col>
    <el-col :span="16"> </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    selection: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Boolean,
      default: false
    },
    paginated: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    },
    backendPagination: {
      type: Boolean,
      default: false
    },
    backendSorting: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 1
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:currentPage", "sort-change"],
  watch: {
    page() {
      this.$emit("update:currentPage", this.page);
    },
    currentPage() {
      if(this.currentPage !== this.page) {
        this.page = this.currentPage;
      }
    }
  },
  data() {
    return {
      page: 1,
      multipleSelection: []
    };
  },
  computed: {
    newColumns() {
      return this.columns.map(column => {
        if (this.backendSorting && column.sortable) {
          return {
            ...column,
            sortable: "custom"
          };
        }
        return column;
      });
    },
    viewData() {
      if (this.backendPagination || !this.paginated) return this.data;
      return this.data.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
    totalItems() {
      if (this.backendPagination) return this.total;
      return this.data.length;
    }
  },
  mounted() {
    this.page = this.currentPage
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSortChange(e) {
      const column = e.column;
      if (column && column.sortable === "custom") {
        this.$emit("sort-change", e);
      }
    }
  }
};
</script>

<style>
.grid-content {
  min-height: 60px;
  background: purple;
  margin: 1rem;
}
</style>
