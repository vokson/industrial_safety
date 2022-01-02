class User {
  constructor() {
    this.reset();
  }

  reset() {
    this._username = "";
    this._first_name = "";
    this._last_name = "";
    this._patronomic = "";
    this._position = "";
    this._department = "";
    this._is_active = "";
    this._role = "";
  }

  get username() {
    return this._username;
  }

  set username(value) {
    this._username = value;
  }

  get first_name() {
    return this._first_name;
  }

  set first_name(value) {
    this._first_name = value;
  }

  get last_name() {
    return this._last_name;
  }

  set last_name(value) {
    this._last_name = value;
  }

  get patronomic() {
    return this._patronomic;
  }

  set patronomic(value) {
    this._patronomic = value;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get department() {
    return this._department;
  }

  set department(value) {
    this._department = value;
  }

  get is_active() {
    return this._is_active;
  }

  set is_active(value) {
    this._is_active = value;
  }

  get role() {
    return this._role;
  }

  set role(value) {
    this._role = value;
  }
}

class Document {
  constructor(id) {
    this._id = id;
    this._raw_attributes = {};
    this._attributes = {};
    this._files = {};
    this._errors = [];
    this._is_saved = true;
    this._is_deleted = false;
  }

  get id() {
    return this._id;
  }

  get raw_attributes() {
    return this._raw_attributes;
  }

  get attributes() {
    return this._attributes;
  }

  get errors() {
    return this._errors;
  }

  set_attribute(name, value) {
    this._raw_attributes[name] = value;
    this._attributes[name] = this._decode_attribute(name, value);
  }

  get_raw_attribute(name) {
    if (Object.prototype.hasOwnProperty.call(this._raw_attributes, name))
      return this._raw_attributes[name];
    return null;
  }

  get_attribute(name) {
    if (Object.prototype.hasOwnProperty.call(this._attributes, name))
      return this._attributes[name];
    return null;
  }

  add_file(id, value) {
    this._files[id] = value;
  }

  remove_file(id) {
    delete this._files[id];
  }

  get_file(id) {
    return Object.prototype.hasOwnProperty.call(this._files, id)
      ? this._files[id]
      : null;
  }

  get files() {
    return Object.values(this._files);
  }

  add_error(value) {
    this._errors.push(value);
  }

  reset_errors() {
    this._errors = [];
  }

  get is_saved() {
    return this._is_saved;
  }

  save() {
    this._is_saved = true;
  }

  modify() {
    this._is_saved = false;
  }

  get is_deleted() {
    return this._is_deleted;
  }

  delete() {
    this._is_deleted = true;
  }

  recover() {
    this._is_deleted = false;
  }

  _decode_attribute = (name, value) => {
    if (name.toLowerCase().includes("date")) {
      // Если дата не назначена
      if (value === "") return value;
      const date = new Date(value * 1000);

      if (isNaN(date.getTime())) return value;

      return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
    }

    return value;
  };
}

class Folder {
  constructor(id) {
    this._id = id;
    this._name = null;
    this._search_schema = null;
    this._max_file_size = null;
    this._validation_schema = null;
    this._user_search_schema = null;
    this._filename_pattern = null;
    this._storage_path = "";

    // Расширяем прототип String

    // Функция заменяет вхождения символов \ | / : * ? < > + % ! @
    String.prototype.replaceBadSymbols = function(replacement = "_") {
      return this.replace(/\\|\||\/|:|\*|\?|<|>|\+|%|!|@/g, replacement);
    };

    // Функция дополняет строку с разделителем до нужной длины,
    // Длина указывается до разделителя
    // 1.12 до длины 3 => 001.12
    // 1 до длины 3 => 001
    String.prototype.padStartBeforeSeparator = function(
      length,
      symbol,
      separator = "."
    ) {
      const pos = this.indexOf(separator);
      const zeroCount = pos === -1 ? length : length + this.length - pos;
      return this.padStart(zeroCount, symbol);
    };
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get search_schema() {
    return this._search_schema;
  }

  set search_schema(value) {
    this._search_schema = value;
  }

  get user_search_schema() {
    return this._user_search_schema === null
      ? this.search_schema
      : this._user_search_schema;
  }

  set user_search_schema(value) {
    this._user_search_schema = value;
  }

  get validation_schema() {
    return this._validation_schema;
  }

  set validation_schema(value) {
    this._validation_schema = value;
  }

  get max_file_size() {
    return this._max_file_size;
  }

  set max_file_size(value) {
    this._max_file_size = value;
  }

  get storage_path() {
    return this._storage_path;
  }

  set storage_path(value) {
    this._storage_path = value;
  }

  get_filename_pattern(attributes) {
    const arr = [
      ...this._filename_pattern.matchAll(new RegExp("{%([^{}%]*)%}", "g")),
    ];
    let result = this._filename_pattern;

    arr.forEach((e) => {
      const part_to_be_replaced = e[0];
      let expression = e[1];

      // Ищем в выражении все имена атрибутов и заменяем их на значения
      Object.keys(attributes).forEach((key) => {
        expression = expression.replace(
          "$$" + key + "$$",
          // Нужно, чтобы не работало экранирование внутри значения
          "String.raw`" + attributes[key] + "`"
        );
      });

      // Пытаемся выполнить выражение
      let evaluated_expression = "";
      try {
        evaluated_expression = eval(expression);
      } catch (e) {
        console.log(
          "Problem with evaluation of filename pattern expression " +
            this._filename_pattern
        );
        console.log(e);
      }

      // Экранируем спецсимволы регулярных выражений
      // Точки
      evaluated_expression = evaluated_expression.replace(
        new RegExp(/\./g),
        "\\."
      );

      while (result.indexOf(part_to_be_replaced) !== -1)
        result = result.replace(part_to_be_replaced, evaluated_expression);
    });

    return result;
  }

  set_filename_pattern(value) {
    this._filename_pattern = value;
  }

  get settings() {
    return JSON.stringify({
      validation_schema: this._validation_schema,
      search_schema: this._search_schema,
      max_file_size: this._max_file_size,
      filename_pattern: this._filename_pattern,
    });
  }
}

class BaseFile {
  constructor(id, name, total_size) {
    this._id = id;
    this._name = name;
    this._uploaded_size = 0;
    this._total_size = total_size;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get size() {
    return this._total_size;
  }

  _formatBytes(bytes, decimals) {
    if (bytes == 0) return "0 Bytes";
    var k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  formatted_size(decimals) {
    return this._formatBytes(this._total_size, decimals);
  }

  get progress() {
    return Math.floor((this._uploaded_size / this._total_size) * 100);
  }

  get uploaded() {
    return this._uploaded_size >= this._total_size;
  }

  set_size_complete() {
    this._uploaded_size = this._total_size;
  }

  set_size(size) {
    // console.log(`Size = ${size} bytes`);
    if (size < 0) {
      this._uploaded_size = 0;
      return;
    }
    if (size > this._total_size) {
      this._uploaded_size = this._total_size;
      return;
    }

    // Always increase size
    if (size > this._uploaded_size) this._uploaded_size = size;
  }
}

class UserFolderSetting {
  constructor(
    folder_id,
    username,
    user_folder_settings_id,
    role = null,
    search_schema = null
  ) {
    this._role = role;
    this._search_schema = search_schema;
    this._username = username;
    this._folder_id = folder_id;
    this._user_folder_settings_id = user_folder_settings_id;
  }

  get id() {
    return this._user_folder_settings_id;
  }

  set id(value) {
    this._user_folder_settings_id = value;
  }

  get role() {
    return this._role;
  }

  set role(value) {
    this._role = value;
  }

  get search_schema() {
    return this._search_schema;
  }

  set search_schema(value) {
    this._search_schema = value;
  }

  get username() {
    return this._username;
  }

  get folder_id() {
    return this._folder_id;
  }
}

export { User, Document, BaseFile, Folder, UserFolderSetting };
