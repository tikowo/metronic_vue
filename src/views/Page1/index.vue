<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-4 pb-9">
      <cms-table model="users" />
    </div>
  </div>
</template>

<script>
import CmsTable from "@/components/CmsTable/index.vue";
export default {
  components: {
    CmsTable
  }
};
</script>
