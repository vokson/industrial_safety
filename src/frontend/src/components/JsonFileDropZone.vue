<template>
  <div
    class="jsonfiledropzone"
    @drop.prevent="handleDrop($event)"
    @dragover.prevent
    @dragenter.prevent="is_dragging = true"
    @dragleave.prevent="is_dragging = false"
  >
    <slot></slot>
  </div>
</template>

<script>
import { watch, ref } from "vue";
import { UploadFileError } from "../logic/domain/event";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import { MessageBus } from "../logic/service_layer/message_bus";

export default {
  name: "JsonFileDropZone",
  props: {
    default: {
      required: false,
      default: null,
    },
  },
  emits: ["update:json", "update:dragging"],

  setup(props, { emit }) {
    const is_dragging = ref(false);
    const uow = new VueUnitOfWork();

    const handleDrop = async (e) => {
      is_dragging.value = false;
      e.dataTransfer.files.forEach(async (file) => {
        try {
          const text = await file.text();
          const json = JSON.parse(text);
          emit("update:json", json);
        } catch (e) {
          const message = new UploadFileError(file.name);
          MessageBus.handle(message, uow);
          emit("update:json", props.default);
        }
      });
    };

    watch(is_dragging, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        emit("update:dragging", newValue);
      }
    });

    return { handleDrop, is_dragging };
  },
};
</script>