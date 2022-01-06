<template>
  <div class="page">
    <heading
      class="page__heading"
      text="Самоподготовка к тестированию"
      size="middle"
    />
    <div class="page__container">
      <div class="page__listcontainer">
        <div class="page__managecontainer">
          <btn
            v-if="!is_test_active"
            caption="Начать тест"
            type="success"
            @click="handle_start_test()"
          />
          <btn
            v-else
            caption="Завершить тест"
            type="danger"
            @click="handle_stop_test()"
          />
          <input
            v-if="!is_test_active"
            type="range"
            list="test_counts"
            :value="count_of_questions_in_test"
            min="1"
            :max="total_count_of_questions"
            @change="
              handle_count_of_questions_changed($event.target.valueAsNumber)
            "
          />
          <datalist id="test_counts">
            <option value="1" label="1" />
            <option value="20" label="20" />
            <option
              :value="total_count_of_questions"
              :label="total_count_of_questions"
            />
          </datalist>
          <text-field
            :value="
              'Тест из ' +
                count_of_questions_in_test +
                ' вопросов. Всего загружено вопросов: ' +
                total_count_of_questions +
                '. Прогресс (' +
                active_question_id.toString() +
                '/' +
                count_of_questions_in_test.toString() +
                '). Допущено ошибок ' + count_of_errors
            "
            align="left"
          />
        </div>
        <div class="page__questioncontainer">
          <question-block
            v-if="is_test_active && active_question !== null"
            :id="active_question.value.id"
            :question="active_question.value.question"
            :answers="active_question.value.answers"
            @user:replied="handle_user_replied($event)"
          />
        </div>
      </div>

      <div class="page__servicecontainer" v-if="!is_test_active">
        <json-file-drop-zone
          class="page__docdropzone"
          :class="{ page__docdropzone_dragging: is_drag_above_drop_zone }"
          @update:dragging="is_drag_above_drop_zone = $event"
          @update:json="handle_new_questions_drop($event)"
          :default="[]"
        >
          <span class="page__dropzonetitle">Вопросы (json)</span>
        </json-file-drop-zone>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import { MessageBus } from "../logic/service_layer/message_bus";
import Heading from "../components/Heading.vue";
import JsonFileDropZone from "../components/JsonFileDropZone.vue";
import Btn from "../components/Btn.vue";
import TextField from "../components/TextField.vue";
import QuestionBlock from "../components/QuestionBlock.vue";

import { DropQuestions, AddQuestion } from "../logic/domain/command";
import { UserRepliedSuccess, UserRepliedFail } from "../logic/domain/event";

export default {
  components: {
    Heading,
    JsonFileDropZone,
    Btn,
    TextField,
    QuestionBlock,
  },
  name: "TestPage",
  setup() {
    function shuffle(array) {
      var m = array.length,
        t,
        i;

      while (m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }

    const uow = new VueUnitOfWork();
    const questions = uow.question_repository;

    // TEST
    const is_test_active = ref(false);
    const total_count_of_questions = ref(0);
    const count_of_questions_in_test = ref(0);
    const active_question_id = ref(0);
    const chosen_questions = ref([]);
    const count_of_errors = ref(0);

    watch(
      () => active_question_id.value,
      () => {
        if (active_question_id.value >= count_of_questions_in_test.value) {
          handle_stop_test();
        }
      }
    );

    const active_question = computed(() =>
      chosen_questions.value.length === 0 ||
      active_question_id.value >= count_of_questions_in_test.value
        ? null
        : questions.get(chosen_questions.value[active_question_id.value])
    );

    const handle_start_test = () => {
      if (count_of_questions_in_test.value <= total_count_of_questions.value) {
        const init_array = Array.from(
          { length: total_count_of_questions.value },
          (_, i) => i + 1
        );

        const shuffled_array = shuffle(init_array);

        chosen_questions.value = shuffled_array.slice(
          0,
          count_of_questions_in_test.value
        );

        // Reset question counter
        active_question_id.value = 0;
        count_of_errors.value = 0;
        // Activate test
        is_test_active.value = true;
      }
    };

    const handle_stop_test = () => {
      is_test_active.value = false;
    };

    const handle_user_replied = (success) => {
      if (success === true) {
        MessageBus.handle(new UserRepliedSuccess(), uow);
        active_question_id.value++;
      } else {
        MessageBus.handle(new UserRepliedFail(), uow);
        count_of_errors.value++;
      }
    };

    // DROP

    const handle_new_questions_drop = (obj_array) => {
      // Delete all questions
      MessageBus.handle(new DropQuestions(), uow);

      // Add new questions
      obj_array.forEach((obj) => {
        MessageBus.handle(
          new AddQuestion(obj.question.id, obj.question.text, obj.answers),
          uow
        );
      });

      total_count_of_questions.value = obj_array.length;
    };

    const handle_count_of_questions_changed = (count) => {
      count_of_questions_in_test.value = count;
    };

    // // DRAGGING
    const is_drag_above_drop_zone = ref(false);

    return {
      is_test_active,
      count_of_questions_in_test,
      total_count_of_questions,
      active_question_id,
      active_question,
      chosen_questions,
      count_of_errors,
      handle_start_test,
      handle_stop_test,
      handle_new_questions_drop,
      handle_user_replied,
      handle_count_of_questions_changed,
      is_drag_above_drop_zone,
    };
  },
};
</script>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding-left: 60px;
  padding-right: 60px;
  max-width: 1024px;
}

.page__heading {
  padding-top: 60px;
  padding-bottom: 15px;
}

.page__container {
  display: flex;
}

.page__listcontainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 3px;
}

.page__servicecontainer {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 300px;
  padding: 3px;
}

.page__docdropzone {
  height: 200px;
  border: 2px dashed grey;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.page__docdropzone_dragging {
  border-color: lightcoral;
}

.page__dropzonetitle {
  font-size: 24px;
}

.page__managecontainer {
  display: flex;
  flex-direction: column;
  padding: 3px;
  margin-bottom: 20px;
}
</style>
