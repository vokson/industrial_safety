/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/

import { Command } from "../domain/command";
import { Event } from "../domain/event";
import {
  notify,
  drop_questions,
  add_question,
} from "./command_handlers";

import {
  handle_upload_file_error,
  handle_user_replied_success,
  handle_user_replied_fail
} from "./event_handlers";

const COMMAND_HANDLERS = {
  Notify: [notify],
  DropQuestions: [drop_questions],
  AddQuestion: [add_question],
};

const EVENT_HANDLERS = {
  UploadFileError: [handle_upload_file_error],
  UserRepliedSuccess: [handle_user_replied_success],
  UserRepliedFail: [handle_user_replied_fail],
};

class NotImplementedError extends Error {}

class MessageBus {
  static async handle(message, uow) {
    let quenue = [message];
    // console.log("Enter message bus for message ", message);

    while (true) {
      // console.log("QUENUE = ", quenue);
      if (quenue.length === 0) break;

      const handle_function = async (current_message) => {
        // console.log(current_message);

        if (current_message instanceof Command) {
          const new_messages = await this.handle_command(current_message, uow);
          // console.log("New command messages ", new_messages);
          quenue = quenue.concat(new_messages);
        }

        if (current_message instanceof Event) {
          const new_messages = await this.handle_event(current_message, uow);
          // console.log("New event messages ", new_messages);
          quenue = quenue.concat(new_messages);
        }
      };

      // делаем "map" массива в промисы
      // ждем когда всё промисы будут выполнены
      const promises = quenue.map(handle_function);
      quenue = [];
      await Promise.all(promises);
    }

    // console.log("Leave message bus for message ", message);
  }

  static async handle_command(message, uow) {
    let new_messages = [];

    if (
      !Object.prototype.hasOwnProperty.call(
        COMMAND_HANDLERS,
        message.constructor.name
      )
    ) {
      throw new NotImplementedError(
        'There is no handler for command "' + message.constructor.name + '"'
      );
    }

    const handlers = COMMAND_HANDLERS[message.constructor.name];

    const handle_function = async (handler) => {
      try {
        await handler(message, uow);
        const events = uow.collect_new_messages();
        new_messages = new_messages.concat(events);
      } catch (e) {
        console.log(
          'Exception "' +
            e.toString() +
            '" handling command "' +
            message.constructor.name +
            '"'
        );
      }
    };

    // делаем "map" массива в промисы
    // ждем когда всё промисы будут выполнены
    const promises = handlers.map(handle_function);
    await Promise.all(promises);

    // console.log("Return command new messages");

    return new_messages;
  }

  static async handle_event(message, uow) {
    let new_messages = [];

    if (
      !Object.prototype.hasOwnProperty.call(
        EVENT_HANDLERS,
        message.constructor.name
      )
    ) {
      throw new NotImplementedError(
        'There is no handler for event "' + message.constructor.name + '"'
      );
    }

    const handlers = EVENT_HANDLERS[message.constructor.name];

    const handle_function = async (handler) => {
      try {
        await handler(message, uow);
        const events = uow.collect_new_messages();
        new_messages = new_messages.concat(events);
      } catch (e) {
        console.log(
          'Exception "' +
            e.toString() +
            '" handling event "' +
            message.constructor.name +
            '"'
        );
      }
    };

    // делаем "map" массива в промисы
    // ждем когда всё промисы будут выполнены
    const promises = handlers.map(handle_function);
    await Promise.all(promises);

    // console.log("Return event new messages");

    return new_messages;
  }
}

export { MessageBus };
