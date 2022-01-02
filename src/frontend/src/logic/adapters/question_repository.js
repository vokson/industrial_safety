import { VueFlatRepository } from "./flat_repository";

const VueMixin = {};

class VueQuestionRepository extends VueFlatRepository {}
Object.assign(VueQuestionRepository.prototype, VueMixin);

export { VueQuestionRepository };
