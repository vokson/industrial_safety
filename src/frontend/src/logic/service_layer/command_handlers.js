class WrongErrorType extends Error {}

const notify = (event, uow) => {
  const actions = {
    success: uow.notificator.success,
    warning: uow.notificator.warning,
    info: uow.notificator.info,
    error: uow.notificator.error,
  };

  if (!Object.prototype.hasOwnProperty.call(actions, event.level)) {
    throw new WrongErrorType('Wrong error type "' + event.level + '"');
  }

  actions[event.level](event.text);
};

const drop_questions = (event, uow) => {
  uow.question_repository.reset()
};

const add_question = (event, uow) => {
  uow.question_repository.set(event.id, event);
};

export {
  notify,
  drop_questions,
  add_question
};
