<template>
  <base-page />
</template>

<script>
import { provide } from "vue";
import BasePage from "./views/BasePage.vue";

export default {
  components: { BasePage },
  name: "App",
  setup() {
    provide("questions", {});
    provide("version", "1.0.0");
  },
};
</script>
