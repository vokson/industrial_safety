class Event {}


class UserRepliedSuccess extends Event {}
class UserRepliedFail extends Event {}

class UploadFileError extends Event {
  constructor(filename) {
    super();
    this.filename = filename;
  }
}


export {
  Event,
  UploadFileError,
  UserRepliedSuccess,
  UserRepliedFail
};
