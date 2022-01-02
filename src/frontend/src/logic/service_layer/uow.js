import { VueQuestionRepository } from "../adapters/question_repository";
import { NotyNotificator } from "../adapters/notificator";

class AbstractUnitOfWork {
  constructor() {
    this.messages = [];
  }

  collect_new_messages = () => {
    const messages = [...this.messages];
    this.messages = [];

    return messages;
  };

  push_message = (message) => {
    this.messages.push(message);
  };
}

class VueUnitOfWork extends AbstractUnitOfWork {
  constructor() {
    super();
    this.notificator = new NotyNotificator();
    this.question_repository = new VueQuestionRepository("questions");
  }
}

export { VueUnitOfWork };
