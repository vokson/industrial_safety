class Command {}

class Notify extends Command {
  constructor(level, text) {
    super();
    this.level = level;
    this.text = text;
  }
}


class DropQuestions extends Command {}

class AddQuestion extends Command {
  constructor(id, question_text, answers) {
    super();
    this.id = id;
    this.question = question_text;
    this.answers = answers;
  }
}


export {
  Command,
  Notify,
  DropQuestions,
  AddQuestion,
};
