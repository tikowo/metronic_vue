<template>
  <data-table
    v-model:currentPage="page"
    @sortChange="handleSortChange"
    :columns="columns"
    :data="tableData"
    :total="total"
    :per-page="perPage"
    paginated
    backendPagination
    backendSorting
    actions
    selection
  />
</template>

<script>
import DataTable from "../DataTable/index.vue";
import {computed, onMounted, ref, toRef} from "vue";
import { Actions } from "../../store/enums/StoreEnums";
import { useStore } from "vuex";
export default {
  name: "CmsTable",
  props: ["model"],
  components: {
    DataTable
  },
  setup(props) {
    const store = useStore();

    const model = toRef(props, "model");

    const filters = ref({});

    onMounted(() => {
      store.dispatch(Actions.CMS_FETCH_MODEL, {
        model: model.value,
        params: filters.value
      });
    });
    const tableData = computed(() => {
      return store.getters.cmsTableData;
    });
    const page = computed({
      get() {
        return store.getters.cmsPage;
      },
      set(e) {
        filters.value.page = e;
        store.dispatch(Actions.CMS_FETCH_MODEL, {
          model: model.value,
          params: filters.value
        });
      }
    });

    const total = computed(() => {
      return store.getters.cmsTotal;
    });

    const perPage = computed(() => {
      return store.getters.cmsPerPage;
    });

    const handleSortChange = ({ prop, order }) => {
      const ascdescmap = {
        ascending: "asc",
        descending: "desc"
      };
      filters.value.orderBy = [prop, ascdescmap[order]];

      store.dispatch(Actions.CMS_FETCH_MODEL, {
        model: model.value,
        params: filters.value
      });
    };
    return {
      tableData,
      page,
      total,
      perPage,
      handleSortChange
    };
  },
  data() {
    return {
      columns: [
        {
          property: "id",
          label: "Id",
          sortable: true
        },
        {
          property: "username",
          label: "Name",
          sortable: true
        },
        {
          property: "email",
          label: "Address"
        }
      ],
      data: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-08",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-06",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        },
        {
          date: "2016-05-07",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles"
        }
      ]
    };
  }
};
</script>
