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
    // provide("tokens", {});
    // provide("folder_roles", {});
    // provide("user_folder_settings", {});

    // provide("role_permissions", {});
    // provide("permissions", {});
    // provide("folders", {});
    // provide("documents", {});
    // provide("files", {});
    // provide("download_progress", {});
    // provide("folder_settings", {});

    provide("questions", {});

    provide("version", "1.0.0");
  },
};
</script>
