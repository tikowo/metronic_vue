<script>
import {inject, onMounted} from "vue";

export default {
  props: ['field'],
  setup() {
    const table = inject('customTable');

    onMounted(() => {
      table.refreshSlots();
    })
  },
  render() {
    return null;
  }
}
</script>