<template>
  <slot></slot>
  <table class="table table-row-bordered table-row-gray-300 gy-7">
    <thead>
      <tr class="fw-bolder fs-5 text-gray-800">
        <template v-for="column in newColumns" :key="column.id">
          <th>{{ column.label }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <template v-for="column in newColumns" :key="column">
          <!--        <td>{{row[key]}}</td>-->
          <template v-if="column.$vnode">
            <td>
              <Vnodes :vnode="column.$vnode" :data="row" />
            </td>
          </template>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, h, toRef, provide, ref } from "vue";

export default {
  name: "CustomTable",
  props: ["columns", "data"],
  components: {
    Vnodes: {
      functional: true,
      props: ["vnode", "data"],
      render: ctx => {
        const vnode = ctx.vnode;
        const data = ctx.data;
        const children = vnode.children.default({ row: data });
        return h("span", {}, children);
      }
    }
  },
  provide() {
    return {
      customTable: this
    };
  },
  setup(props, { attrs, slots, emit }) {
    const columns = toRef(props, "columns");

    const defaultSlots = ref(slots.default());
    console.log("look here", defaultSlots);
    const refreshSlots = () => {
      defaultSlots.value = slots.default();
    };

    const newColumns = computed(() => {
      if (columns.value && columns.value.length) {
        return columns.value.map(column => column.field);
      } else {
        return defaultSlots.value
          .filter(vnode => vnode.props || vnode.type.description === 'Fragment')
          .map(vnode => {
            if (vnode.type.description === "Fragment") {
              return vnode.children.map(v => {
                return {
                  field: v.props.field,
                  label: v.props.label || v.props.field,
                  $vnode: v
                };
              });
            } else if (vnode.props) {
              return {
                field: vnode.props.field,
                label: vnode.props.label || vnode.props.field,
                $vnode: vnode
              };
            }
            return {};
          })
          .flat();
      }
    });

    return {
      newColumns,
      defaultSlots,
      refreshSlots
    };
    //  TODO
  }
};
</script>
