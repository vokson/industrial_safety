import { VueBaseRepository } from "./base_repository";

const FlatMixin = {
  reset() {
    this._reset();
  },

  get(name) {
    return this._get(name);
  },

  set(name, value) {
    return this._set(name, value);
  },

  delete(name) {
    return this._delete(name);
  },

  keys() {
    return this._keys();
  },

  pure_keys() {
    return this._pure_keys();
  },

  values() {
    return this._values();
  },
};

class VueFlatRepository extends VueBaseRepository {}
Object.assign(VueBaseRepository.prototype, FlatMixin);

export { VueFlatRepository };
