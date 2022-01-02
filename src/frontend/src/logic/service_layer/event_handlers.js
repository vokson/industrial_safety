import { Notify } from "../domain/command";

const handle_upload_file_error = (event, uow) => {
  uow.push_message(
    new Notify("error", `Ошибка загрузки файла ${event.filename}`)
  );
};

const handle_user_replied_success = (event, uow) => {
  uow.push_message(new Notify("success", `Правильно`));
};

const handle_user_replied_fail = (event, uow) => {
  uow.push_message(new Notify("error", `Неверно`));
};

export {
  handle_upload_file_error,
  handle_user_replied_success,
  handle_user_replied_fail,
};
