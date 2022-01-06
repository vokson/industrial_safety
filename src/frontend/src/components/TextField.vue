<template>
  <span
    class="textfield"
    :class="{
      textfield_left: align === 'left',
      textfield_right: align === 'right',
      textfield_center: align === 'center',
    }"
  >
    {{ value }}
  </span>
</template>

<script>
export default {
  name: "TextField",
  props: {
    value: {
      type: String,
      required: true,
    },
    align: {
      type: String,
      required: false,
      default: "center",
    },
  },
};
</script>

<style>
.textfield {
  display: block;
}
.textfield_center {
  text-align: center;
}

.textfield_left {
  text-align: left;
}

.textfield_right {
  text-align: right;
}
</style>