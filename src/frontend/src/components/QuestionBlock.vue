<template>
  <div class="questionblock">
    <span class="questionblock__text">{{ id }}) {{ question }}</span>
    <div
      class="questionblock__answers"
      v-for="answer in answers"
      :key="answer.id"
    >
      <div
        class="questionblock__rowanswer"
        :class="{
          questionblock__rowanswer_correct:
            show_correct_answer && answer.is_correct,
        }"
      >
        <input
          type="checkbox"
          @change="replies[answer.id] = !replies[answer.id]"
          :checked="replies[answer.id]"
        />{{ answer.text }}
      </div>
    </div>
    <div class="questionblock__buttons">
      <btn
        class="questionblock__button"
        caption="Ответить"
        type="primary"
        @click="handle_check_reply()"
      />
      <btn
        class="questionblock__button"
        :caption="
          show_correct_answer === true ? 'Скрыть ответы' : 'Показать ответы'
        "
        type="warning"
        @click="show_correct_answer = !show_correct_answer"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import Btn from "./Btn.vue";
export default {
  components: {
    Btn,
  },
  name: "QuestionBlock",
  props: {
    id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
  emits: ["user:replied"],

  setup(props, { emit }) {
    const show_correct_answer = ref(false);

    const replies = ref({});

    const reset_replies = () => {
      replies.value = {};
      props.answers.forEach((e) => {
        replies.value[e.id] = false;
      });
    };

    watch(
      () => props.id,
      () => {
        show_correct_answer.value = false;
        reset_replies();
      }
    );

    const is_reply_ok = computed(() => {
      let is_ok = true;
      props.answers.forEach((e) => {
        if (e.is_correct !== replies.value[e.id]) is_ok = false;
      });

      return is_ok;
    });

    const handle_check_reply = () => {
      emit("user:replied", is_reply_ok.value);
    };

    onMounted(() => {
      reset_replies();
    });

    return { show_correct_answer, replies, handle_check_reply };
  },
};
</script>

<style>
.questionblock {
  display: flex;
  flex-direction: column;
}

.questionblock__text {
  padding: 3px;
  font-size: 1.5em;
}

.questionblock__answers {
  padding: 3px;
}

.questionblock__rowanswer_correct {
  color: green;
}

.questionblock__buttons {
  padding: 3px;
}

.questionblock__button{
  margin: 3px;
}
</style>
